<?php
/*
Plugin Name: Whitelist
Description: Allow REST API access only for requests coming from specific domains' IPs, Postman with secret key, or localhost (including localhost:5173) with proper CORS headers.
Version: 2.9
Author: Meysam Norouzi
License: GPL2
Author URI: https://www.linkedin.com/in/mohammad1mehrabi/
*/

// ✅ Allowed domains (DNS IP fallback for server-to-server calls)
$allowed_domains = array(
    'majd-alpha.vercel.app',
    'vakilmajd.com',
);

// ✅ Resolve IPs for allowed domains
$allowed_ips = array();
foreach ($allowed_domains as $domain) {
    $ip = gethostbyname($domain);
    if ($ip && $ip !== $domain) {
        $allowed_ips[] = $ip;
    }
}

// ✅ Whitelisted API endpoints (path only; query string is stripped before match)
$whitelist_patterns = array(
    '/wp-json/admin-time/v1/get',
    '/wp-json/wp/v2/.*',
    '/wp-json/oembed/.*',
    '/wp-json/majd/v1/.*',
    '/wp-json/wc/store/v1/.*',
);

/**
 * Trusted browser origins for CORS + early allow.
 */
function whitelist_allowed_origins() {
    return array(
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://vakilmajd.com',
        'https://www.vakilmajd.com',
        'https://majd-alpha.vercel.app',
    );
}

/**
 * Whether Origin/Referer belongs to a trusted frontend.
 */
function whitelist_is_trusted_url($url) {
    if (empty($url) || !is_string($url)) {
        return false;
    }

    foreach (whitelist_allowed_origins() as $allowed) {
        if (strpos($url, $allowed) === 0) {
            return true;
        }
    }

    return false;
}

// ✅ Main request security check
function check_request_origin() {
    global $whitelist_patterns, $allowed_ips;

    $request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
    $path        = (string) parse_url($request_uri, PHP_URL_PATH);
    $user_ip     = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';

    // ✅ Allow admin area
    if (is_admin() || strpos($path, '/wp-admin') === 0) {
        return;
    }

    // ✅ Allow localhost
    if (in_array($user_ip, array('127.0.0.1', '::1'), true)) {
        return;
    }

    // ✅ Allow trusted frontends (Origin or Referer)
    // NOTE: strpos() only takes (haystack, needle[, offset]). Passing a second
    // domain as the 3rd arg caused TypeError → HTTP 500 on PHP 8+.
    if (!empty($_SERVER['HTTP_ORIGIN']) && whitelist_is_trusted_url($_SERVER['HTTP_ORIGIN'])) {
        return;
    }

    if (!empty($_SERVER['HTTP_REFERER']) && whitelist_is_trusted_url($_SERVER['HTTP_REFERER'])) {
        return;
    }

    // ✅ Secret key access (Postman or other clients)
    $secret_key = 'MySuperSecretKey123';
    $headers = function_exists('getallheaders') ? getallheaders() : array();
    $api_key = '';
    if (isset($headers['X-Api-Key'])) {
        $api_key = $headers['X-Api-Key'];
    } elseif (isset($headers['x-api-key'])) {
        $api_key = $headers['x-api-key'];
    }
    if ($api_key !== '' && hash_equals($secret_key, $api_key)) {
        return;
    }

    // ✅ Check allowed endpoints
    $endpoint_allowed = false;
    foreach ($whitelist_patterns as $pattern) {
        if (preg_match('#^' . $pattern . '$#', $path)) {
            $endpoint_allowed = true;
            break;
        }
    }

    if (!$endpoint_allowed) {
        wp_send_json(array(
            'success' => false,
            'message' => 'Access denied: Endpoint not allowed.',
        ), 403);
    }

    // ✅ Check if IP is in allowed list
    if (!in_array($user_ip, $allowed_ips, true)) {
        wp_send_json(array(
            'success' => false,
            'message' => 'Access denied: Your IP (' . $user_ip . ') is not authorized.',
        ), 403);
    }
}
add_action('rest_api_init', 'check_request_origin');

// ✅ CORS header handler
function whitelist_add_cors_headers() {
    $origin = get_http_origin();
    if (!$origin) {
        return;
    }

    if (!whitelist_is_trusted_url($origin)) {
        return;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-Api-Key, Cart-Token, Nonce');
    header('Access-Control-Expose-Headers: Cart-Token, Nonce');
}

// ✅ Handle OPTIONS preflight requests early
add_action('init', function () {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        whitelist_add_cors_headers();
        status_header(200);
        exit;
    }
});

// ✅ Also add CORS headers in REST responses
add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        whitelist_add_cors_headers();
        return $value;
    });
});

// ✅ Admin bar indicator
function whitelist_plugin_admin_bar_item($admin_bar) {
    if (current_user_can('manage_options')) {
        $admin_bar->add_menu(array(
            'id'    => 'whitelist-api-status',
            'title' => '
                <span style="
                    background-color: #28a745;
                    color: white;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 13px;
                    box-shadow: 0 0 5px rgba(40,167,69,0.5);
                ">
                    ✅ Whitelist API Active
                </span>',
            'href'  => false,
            'meta'  => array(
                'title' => 'Whitelist API plugin is active',
            ),
        ));
    }
}
add_action('admin_bar_menu', 'whitelist_plugin_admin_bar_item', 100);
