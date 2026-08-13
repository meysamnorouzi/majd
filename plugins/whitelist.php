<?php
/*
Plugin Name: Whitelist
Description: Restricts WordPress REST API to whitelisted paths. Build/ops clients authenticate with X-Api-Key; browser access relies on public endpoint allowlist + CORS (Origin is never used as auth).
Version: 3.0
Author: Meysam Norouzi
License: GPL2
Author URI: https://www.linkedin.com/in/mohammad1mehrabi/
*/

// Allowed domains (DNS IP fallback for server-to-server calls without API key)
$allowed_domains = array(
    'majd-alpha.vercel.app',
    'vakilmajd.com',
);

$allowed_ips = array();
foreach ($allowed_domains as $domain) {
    $ip = gethostbyname($domain);
    if ($ip && $ip !== $domain) {
        $allowed_ips[] = $ip;
    }
}

// Public headless API paths (browser + server). Sensitive actions use JWT / WC nonces.
$whitelist_patterns = array(
    '/wp-json/admin-time/v1/get',
    '/wp-json/wp/v2/.*',
    '/wp-json/oembed/.*',
    '/wp-json/majd/v1/.*',
    '/wp-json/wc/store/v1/.*',
);

/**
 * Trusted browser origins for CORS headers only — never used to bypass access control.
 */
function whitelist_allowed_origins() {
    $origins = array(
        'http://localhost:3000',
        'http://localhost:5173',
        'http://localhost:5174',
        'https://vakilmajd.com',
        'https://www.vakilmajd.com',
        'https://majd-alpha.vercel.app',
    );

    if (defined('MAJD_FRONTEND_ORIGIN') && MAJD_FRONTEND_ORIGIN) {
        $origins[] = MAJD_FRONTEND_ORIGIN;
    } else {
        $env_origin = getenv('MAJD_FRONTEND_ORIGIN');
        if ($env_origin) {
            $origins[] = $env_origin;
        }
    }

    return array_values(array_unique(array_filter($origins)));
}

/**
 * Whether Origin/Referer belongs to a trusted frontend (CORS only).
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

/**
 * Server-side API secret — set in wp-config.php, never commit to git.
 *
 * define('MAJD_WP_API_KEY', 'your-long-random-secret');
 */
function whitelist_get_api_secret() {
    if (defined('MAJD_WP_API_KEY') && MAJD_WP_API_KEY) {
        return MAJD_WP_API_KEY;
    }

    $env = getenv('MAJD_WP_API_KEY');
    if ($env !== false && $env !== '') {
        return $env;
    }

    return '';
}

function whitelist_path_is_allowed($path) {
    global $whitelist_patterns;

    foreach ($whitelist_patterns as $pattern) {
        if (preg_match('#^' . $pattern . '$#', $path)) {
            return true;
        }
    }

    return false;
}

function whitelist_request_has_valid_api_key() {
    $secret_key = whitelist_get_api_secret();
    if ($secret_key === '') {
        return false;
    }

    $headers = function_exists('getallheaders') ? getallheaders() : array();
    $api_key = '';
    if (isset($headers['X-Api-Key'])) {
        $api_key = $headers['X-Api-Key'];
    } elseif (isset($headers['x-api-key'])) {
        $api_key = $headers['x-api-key'];
    }

    return $api_key !== '' && hash_equals($secret_key, $api_key);
}

function check_request_origin() {
    global $allowed_ips;

    $request_uri = isset($_SERVER['REQUEST_URI']) ? wp_unslash($_SERVER['REQUEST_URI']) : '';
    $path        = (string) parse_url($request_uri, PHP_URL_PATH);
    $user_ip     = isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '';

    if (is_admin() || strpos($path, '/wp-admin') === 0) {
        return;
    }

    if (in_array($user_ip, array('127.0.0.1', '::1'), true)) {
        return;
    }

    // Build-time / ops: X-Api-Key must match MAJD_WP_API_KEY on the server.
    if (whitelist_request_has_valid_api_key()) {
        return;
    }

    // Headless frontend public REST surface (browser users hit these from any IP).
    if (whitelist_path_is_allowed($path)) {
        return;
    }

    // Non-public REST paths: allow only from resolved frontend host IPs.
    if (in_array($user_ip, $allowed_ips, true)) {
        return;
    }

    wp_send_json(array(
        'success' => false,
        'message' => 'Access denied: Endpoint not allowed.',
    ), 403);
}
add_action('rest_api_init', 'check_request_origin');

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

add_action('init', function () {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        whitelist_add_cors_headers();
        status_header(200);
        exit;
    }
});

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        whitelist_add_cors_headers();
        return $value;
    });
});

function whitelist_plugin_admin_bar_item($admin_bar) {
    if (!current_user_can('manage_options')) {
        return;
    }

    $secret_configured = whitelist_get_api_secret() !== '';
    $status_color = $secret_configured ? '#28a745' : '#dc3545';
    $status_label = $secret_configured ? 'Whitelist API Active' : 'Whitelist: set MAJD_WP_API_KEY';

    $admin_bar->add_menu(array(
        'id'    => 'whitelist-api-status',
        'title' => '
            <span style="
                background-color: ' . esc_attr($status_color) . ';
                color: white;
                padding: 4px 10px;
                border-radius: 20px;
                font-weight: 600;
                font-size: 13px;
            ">
                ' . esc_html($status_label) . '
            </span>',
        'href'  => false,
        'meta'  => array(
            'title' => $secret_configured
                ? 'Whitelist API plugin is active'
                : 'Define MAJD_WP_API_KEY in wp-config.php for build-time API access',
        ),
    ));
}
add_action('admin_bar_menu', 'whitelist_plugin_admin_bar_item', 100);
