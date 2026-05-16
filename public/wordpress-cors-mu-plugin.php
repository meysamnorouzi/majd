<?php
/**
 * Plugin Name: Majd Headless CORS
 * Description: Allow headless Next.js frontend to use WooCommerce Store API cart/checkout.
 * Install: copy to wp-content/mu-plugins/majd-headless-cors.php
 */

add_action('rest_api_init', function () {
    remove_filter('rest_pre_serve_request', 'rest_send_cors_headers');
    add_filter('rest_pre_serve_request', function ($value) {
        $origin = getenv('MAJD_FRONTEND_ORIGIN') ?: 'https://vakilmajd.com';
        if (isset($_SERVER['HTTP_ORIGIN'])) {
            $request_origin = esc_url_raw(wp_unslash($_SERVER['HTTP_ORIGIN']));
            if ($request_origin === $origin || strpos($request_origin, 'localhost') !== false) {
                header('Access-Control-Allow-Origin: ' . $request_origin);
            }
        } else {
            header('Access-Control-Allow-Origin: ' . $origin);
        }
        header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, Cart-Token, Nonce');
        header('Access-Control-Expose-Headers: Cart-Token, Nonce');
        if ('OPTIONS' === $_SERVER['REQUEST_METHOD']) {
            status_header(200);
            exit;
        }
        return $value;
    });
}, 15);
