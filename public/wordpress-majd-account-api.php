<?php
/**
 * Plugin Name: Majd Account API
 * Description: Customer auth (JWT) and order/license endpoints for headless Next.js frontend.
 * Install: copy to wp-content/mu-plugins/wordpress-majd-account-api.php
 * Requires: WooCommerce
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MAJD_LICENSE_META_KEY', '_majd_spotplayer_license');
define('MAJD_LICENSE_NOTES_META_KEY', '_majd_spotplayer_notes');
define('MAJD_JWT_EXPIRY', 7 * DAY_IN_SECONDS);

class Majd_Account_API {
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_action('add_meta_boxes', [__CLASS__, 'add_order_meta_box']);
        add_action('woocommerce_process_shop_order_meta', [__CLASS__, 'save_order_meta_box'], 10, 2);
    }

    public static function register_routes() {
        register_rest_route('majd/v1', '/auth/login', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'login'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('majd/v1', '/auth/register', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'register'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('majd/v1', '/auth/me', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'me'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('majd/v1', '/me/orders', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'get_orders'],
            'permission_callback' => '__return_true',
        ]);

        register_rest_route('majd/v1', '/me/orders/(?P<id>\d+)', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'get_order'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function login(WP_REST_Request $request) {
        $email = sanitize_email($request->get_param('email'));
        $password = $request->get_param('password');

        if (empty($email) || empty($password)) {
            return new WP_Error('missing_fields', 'ایمیل و رمز عبور الزامی است.', ['status' => 400]);
        }

        $user = wp_authenticate($email, $password);
        if (is_wp_error($user)) {
            return new WP_Error('invalid_credentials', 'ایمیل یا رمز عبور نادرست است.', ['status' => 401]);
        }

        if (!self::user_can_access_account($user->ID)) {
            return new WP_Error('forbidden', 'دسترسی به حساب کاربری مجاز نیست.', ['status' => 403]);
        }

        $token = self::create_jwt($user->ID);
        return rest_ensure_response([
            'token' => $token,
            'user' => self::format_user($user),
        ]);
    }

    public static function register(WP_REST_Request $request) {
        $email = sanitize_email($request->get_param('email'));
        $password = $request->get_param('password');
        $first_name = sanitize_text_field($request->get_param('first_name') ?? '');
        $last_name = sanitize_text_field($request->get_param('last_name') ?? '');
        $phone = sanitize_text_field($request->get_param('phone') ?? '');

        if (empty($email) || empty($password)) {
            return new WP_Error('missing_fields', 'ایمیل و رمز عبور الزامی است.', ['status' => 400]);
        }

        if (!is_email($email)) {
            return new WP_Error('invalid_email', 'ایمیل وارد شده معتبر نیست.', ['status' => 400]);
        }

        if (strlen($password) < 8) {
            return new WP_Error('weak_password', 'رمز عبور باید حداقل ۸ کاراکتر باشد.', ['status' => 400]);
        }

        if (email_exists($email)) {
            return new WP_Error('email_exists', 'این ایمیل قبلاً ثبت شده است.', ['status' => 409]);
        }

        $username = self::generate_username($email);
        $user_id = wp_create_user($username, $password, $email);

        if (is_wp_error($user_id)) {
            return new WP_Error('registration_failed', 'ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.', ['status' => 500]);
        }

        $user = new WP_User($user_id);
        $user->set_role('customer');

        wp_update_user([
            'ID' => $user_id,
            'first_name' => $first_name,
            'last_name' => $last_name,
            'display_name' => trim($first_name . ' ' . $last_name) ?: $email,
        ]);

        if ($phone) {
            update_user_meta($user_id, 'billing_phone', $phone);
        }

        $token = self::create_jwt($user_id);
        $user = get_user_by('id', $user_id);

        return rest_ensure_response([
            'token' => $token,
            'user' => self::format_user($user),
        ]);
    }

    public static function me(WP_REST_Request $request) {
        $user_id = self::get_user_id_from_request($request);
        if (is_wp_error($user_id)) {
            return $user_id;
        }

        $user = get_user_by('id', $user_id);
        if (!$user) {
            return new WP_Error('not_found', 'کاربر یافت نشد.', ['status' => 404]);
        }

        return rest_ensure_response(self::format_user($user));
    }

    public static function get_orders(WP_REST_Request $request) {
        if (!class_exists('WooCommerce')) {
            return new WP_Error('woocommerce_missing', 'ووکامرس فعال نیست.', ['status' => 500]);
        }

        $user_id = self::get_user_id_from_request($request);
        if (is_wp_error($user_id)) {
            return $user_id;
        }

        $orders = wc_get_orders([
            'customer_id' => $user_id,
            'limit' => 50,
            'orderby' => 'date',
            'order' => 'DESC',
            'status' => ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'],
        ]);

        $formatted = array_map([__CLASS__, 'format_order'], $orders);

        return rest_ensure_response(['orders' => $formatted]);
    }

    public static function get_order(WP_REST_Request $request) {
        if (!class_exists('WooCommerce')) {
            return new WP_Error('woocommerce_missing', 'ووکامرس فعال نیست.', ['status' => 500]);
        }

        $user_id = self::get_user_id_from_request($request);
        if (is_wp_error($user_id)) {
            return $user_id;
        }

        $order_id = absint($request->get_param('id'));
        $order = wc_get_order($order_id);

        if (!$order || (int) $order->get_customer_id() !== (int) $user_id) {
            return new WP_Error('not_found', 'سفارش یافت نشد.', ['status' => 404]);
        }

        return rest_ensure_response(self::format_order($order));
    }

    public static function add_order_meta_box() {
        add_meta_box(
            'majd_spotplayer_license',
            'لایسنس اسپات پلیر (موسسه مجد)',
            [__CLASS__, 'render_order_meta_box'],
            'shop_order',
            'side',
            'high'
        );

        if (function_exists('wc_get_page_screen_id')) {
            add_meta_box(
                'majd_spotplayer_license',
                'لایسنس اسپات پلیر (موسسه مجد)',
                [__CLASS__, 'render_order_meta_box'],
                wc_get_page_screen_id('shop-order'),
                'side',
                'high'
            );
        }
    }

    public static function render_order_meta_box($post_or_order) {
        $order = ($post_or_order instanceof WC_Order) ? $post_or_order : wc_get_order($post_or_order->ID);
        if (!$order) {
            echo '<p>سفارش یافت نشد.</p>';
            return;
        }

        $license = $order->get_meta(MAJD_LICENSE_META_KEY, true);
        $notes = $order->get_meta(MAJD_LICENSE_NOTES_META_KEY, true);
        wp_nonce_field('majd_save_order_meta', 'majd_order_meta_nonce');
        ?>
        <p>
            <label for="majd_spotplayer_license"><strong>کد لایسنس اسپات پلیر</strong></label>
            <input
                type="text"
                id="majd_spotplayer_license"
                name="majd_spotplayer_license"
                value="<?php echo esc_attr($license); ?>"
                class="widefat"
                dir="ltr"
                style="font-family: monospace;"
                placeholder="XXXX-XXXX-XXXX"
            />
        </p>
        <p>
            <label for="majd_spotplayer_notes">یادداشت فعال‌سازی (اختیاری)</label>
            <textarea
                id="majd_spotplayer_notes"
                name="majd_spotplayer_notes"
                class="widefat"
                rows="3"
                placeholder="راهنمای اضافی برای مشتری..."
            ><?php echo esc_textarea($notes); ?></textarea>
        </p>
        <p class="description">پس از ذخیره، کد در پنل کاربری مشتری نمایش داده می‌شود.</p>
        <?php
    }

    public static function save_order_meta_box($order_id, $order = null) {
        if (!isset($_POST['majd_order_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['majd_order_meta_nonce'])), 'majd_save_order_meta')) {
            return;
        }

        if (!current_user_can('edit_shop_orders')) {
            return;
        }

        $order = $order ?: wc_get_order($order_id);
        if (!$order) {
            return;
        }

        if (isset($_POST['majd_spotplayer_license'])) {
            $license = sanitize_text_field(wp_unslash($_POST['majd_spotplayer_license']));
            $order->update_meta_data(MAJD_LICENSE_META_KEY, $license);
        }

        if (isset($_POST['majd_spotplayer_notes'])) {
            $notes = sanitize_textarea_field(wp_unslash($_POST['majd_spotplayer_notes']));
            $order->update_meta_data(MAJD_LICENSE_NOTES_META_KEY, $notes);
        }

        $order->save();
    }

    private static function user_can_access_account($user_id) {
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return false;
        }
        $roles = (array) $user->roles;
        return in_array('customer', $roles, true) || in_array('administrator', $roles, true);
    }

    private static function generate_username($email) {
        $base = sanitize_user(current(explode('@', $email)), true);
        $username = $base;
        $i = 1;
        while (username_exists($username)) {
            $username = $base . $i;
            $i++;
        }
        return $username;
    }

    private static function format_user(WP_User $user) {
        return [
            'id' => $user->ID,
            'email' => $user->user_email,
            'first_name' => get_user_meta($user->ID, 'first_name', true) ?: '',
            'last_name' => get_user_meta($user->ID, 'last_name', true) ?: '',
            'phone' => get_user_meta($user->ID, 'billing_phone', true) ?: '',
        ];
    }

    private static function format_order($order) {
        if (!$order instanceof WC_Order) {
            return null;
        }

        $license = $order->get_meta(MAJD_LICENSE_META_KEY, true);
        $notes = $order->get_meta(MAJD_LICENSE_NOTES_META_KEY, true);
        $status = $order->get_status();
        $has_license = !empty($license);
        $license_ready = $has_license && in_array($status, ['processing', 'completed'], true);

        $items = [];
        foreach ($order->get_items() as $item) {
            $product = $item->get_product();
            $product_slug = $product ? $product->get_slug() : '';
            $items[] = [
                'name' => $item->get_name(),
                'product_slug' => $product_slug,
                'quantity' => $item->get_quantity(),
                'spotplayer_license' => $license_ready ? $license : null,
                'license_status' => self::get_license_status($status, $has_license),
            ];
        }

        return [
            'id' => $order->get_id(),
            'status' => $status,
            'date' => $order->get_date_created() ? $order->get_date_created()->date('c') : '',
            'total' => $order->get_total(),
            'currency' => $order->get_currency(),
            'spotplayer_license' => $license_ready ? $license : null,
            'spotplayer_notes' => $license_ready ? $notes : null,
            'license_status' => self::get_license_status($status, $has_license),
            'items' => $items,
        ];
    }

    private static function get_license_status($order_status, $has_license) {
        if (!in_array($order_status, ['processing', 'completed'], true)) {
            return 'payment_pending';
        }
        if ($has_license) {
            return 'ready';
        }
        return 'license_pending';
    }

    private static function get_user_id_from_request(WP_REST_Request $request) {
        $auth = $request->get_header('authorization');
        if (!$auth || !preg_match('/Bearer\s+(.+)/i', $auth, $matches)) {
            return new WP_Error('unauthorized', 'لطفاً وارد حساب کاربری شوید.', ['status' => 401]);
        }

        $payload = self::verify_jwt($matches[1]);
        if (is_wp_error($payload)) {
            return $payload;
        }

        return (int) $payload['sub'];
    }

    private static function create_jwt($user_id) {
        $header = self::base64url_encode(wp_json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $now = time();
        $payload = self::base64url_encode(wp_json_encode([
            'sub' => (int) $user_id,
            'iat' => $now,
            'exp' => $now + MAJD_JWT_EXPIRY,
        ]));
        $signature = self::base64url_encode(hash_hmac('sha256', "$header.$payload", self::get_secret(), true));
        return "$header.$payload.$signature";
    }

    private static function verify_jwt($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return new WP_Error('invalid_token', 'توکن نامعتبر است.', ['status' => 401]);
        }

        [$header, $payload, $signature] = $parts;
        $expected = self::base64url_encode(hash_hmac('sha256', "$header.$payload", self::get_secret(), true));

        if (!hash_equals($expected, $signature)) {
            return new WP_Error('invalid_token', 'توکن نامعتبر است.', ['status' => 401]);
        }

        $data = json_decode(self::base64url_decode($payload), true);
        if (!$data || empty($data['sub']) || empty($data['exp'])) {
            return new WP_Error('invalid_token', 'توکن نامعتبر است.', ['status' => 401]);
        }

        if (time() > (int) $data['exp']) {
            return new WP_Error('token_expired', 'نشست شما منقضی شده است. لطفاً دوباره وارد شوید.', ['status' => 401]);
        }

        return $data;
    }

    private static function get_secret() {
        if (defined('AUTH_KEY') && AUTH_KEY) {
            return AUTH_KEY;
        }
        return wp_salt('auth');
    }

    private static function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64url_decode($data) {
        $remainder = strlen($data) % 4;
        if ($remainder) {
            $data .= str_repeat('=', 4 - $remainder);
        }
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

Majd_Account_API::init();
