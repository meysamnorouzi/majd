<?php
/**
 * Plugin Name: Majd Account API
 * Description: Customer auth (JWT), orders/licenses, course product meta, and Store API extensions for headless Next.js.
 * Install: copy to wp-content/mu-plugins/wordpress-majd-account-api.php
 * Requires: WooCommerce
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MAJD_LICENSE_META_KEY', '_majd_spotplayer_license');
define('MAJD_LICENSE_NOTES_META_KEY', '_majd_spotplayer_notes');
define('MAJD_DURATION_META_KEY', '_majd_duration');
define('MAJD_LEVEL_META_KEY', '_majd_level');
define('MAJD_SYLLABUS_META_KEY', '_majd_syllabus');
define('MAJD_HIGHLIGHTS_META_KEY', '_majd_highlights');
define('MAJD_JWT_EXPIRY', 7 * DAY_IN_SECONDS);
define('MAJD_COURSE_CATEGORY_SLUGS', ['online-webinar', 'online-offline', 'hybrid-full', 'session-hybrid', 'session-inperson']);

class Majd_Account_API {
    public static function init() {
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_action('add_meta_boxes', [__CLASS__, 'add_order_meta_box']);
        add_action('woocommerce_process_shop_order_meta', [__CLASS__, 'save_order_meta_box'], 10, 2);
        add_action('add_meta_boxes', [__CLASS__, 'add_product_meta_box']);
        add_action('woocommerce_process_product_meta', [__CLASS__, 'save_product_meta_box']);
        add_action('woocommerce_init', [__CLASS__, 'register_store_api_extensions']);
        add_filter('woocommerce_get_return_url', [__CLASS__, 'filter_return_url'], 10, 2);
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

    public static function register_store_api_extensions() {
        if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
            return;
        }

        $endpoint = class_exists(\Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::class)
            ? \Automattic\WooCommerce\StoreApi\Schemas\V1\ProductSchema::IDENTIFIER
            : 'product';

        woocommerce_store_api_register_endpoint_data([
            'endpoint' => $endpoint,
            'namespace' => 'majd',
            'schema_callback' => [__CLASS__, 'product_extension_schema'],
            'data_callback' => [__CLASS__, 'product_extension_data'],
            'schema_type' => ARRAY_A,
        ]);
    }

    public static function product_extension_schema() {
        return [
            'duration' => [
                'description' => 'Course duration',
                'type' => 'string',
                'context' => ['view'],
                'readonly' => true,
            ],
            'level' => [
                'description' => 'Course level',
                'type' => 'string',
                'context' => ['view'],
                'readonly' => true,
            ],
            'syllabus' => [
                'description' => 'Course syllabus items',
                'type' => 'array',
                'context' => ['view'],
                'readonly' => true,
            ],
            'highlights' => [
                'description' => 'Course highlights',
                'type' => 'array',
                'context' => ['view'],
                'readonly' => true,
            ],
            'format_slug' => [
                'description' => 'Course format category slug',
                'type' => 'string',
                'context' => ['view'],
                'readonly' => true,
            ],
            'is_course' => [
                'description' => 'Whether product is a course',
                'type' => 'boolean',
                'context' => ['view'],
                'readonly' => true,
            ],
        ];
    }

    public static function product_extension_data($product) {
        if (!$product instanceof WC_Product) {
            return [];
        }

        return [
            'duration' => (string) $product->get_meta(MAJD_DURATION_META_KEY, true),
            'level' => (string) $product->get_meta(MAJD_LEVEL_META_KEY, true),
            'syllabus' => self::decode_json_list($product->get_meta(MAJD_SYLLABUS_META_KEY, true)),
            'highlights' => self::decode_json_list($product->get_meta(MAJD_HIGHLIGHTS_META_KEY, true)),
            'format_slug' => self::get_product_format_slug($product),
            'is_course' => self::is_course_product($product),
        ];
    }

    public static function filter_return_url($return_url, $order) {
        if (!$order instanceof WC_Order) {
            return $return_url;
        }

        $frontend = getenv('MAJD_FRONTEND_ORIGIN') ?: 'https://vakilmajd.com';
        $frontend = rtrim($frontend, '/');
        $status = $order->has_status(['processing', 'completed']) ? 'processing' : $order->get_status();

        return $frontend . '/checkout/success/?order_id=' . $order->get_id() . '&status=' . rawurlencode($status);
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

        self::attach_guest_orders_to_customer($user_id, $email);

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

        $orders = self::get_orders_for_user($user_id);
        $formatted = array_values(array_filter(array_map([__CLASS__, 'format_order'], $orders)));

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

        if (!$order || !self::user_owns_order($user_id, $order)) {
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

    public static function add_product_meta_box() {
        add_meta_box(
            'majd_course_meta',
            'اطلاعات دوره (موسسه مجد)',
            [__CLASS__, 'render_product_meta_box'],
            'product',
            'normal',
            'high'
        );
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

    public static function render_product_meta_box($post) {
        $product = wc_get_product($post->ID);
        if (!$product) {
            echo '<p>محصول یافت نشد.</p>';
            return;
        }

        $duration = $product->get_meta(MAJD_DURATION_META_KEY, true);
        $level = $product->get_meta(MAJD_LEVEL_META_KEY, true);
        $syllabus = $product->get_meta(MAJD_SYLLABUS_META_KEY, true);
        $highlights = $product->get_meta(MAJD_HIGHLIGHTS_META_KEY, true);
        wp_nonce_field('majd_save_product_meta', 'majd_product_meta_nonce');
        ?>
        <p class="description">برای دوره‌ها، یکی از دسته‌های <code>online-webinar</code>، <code>online-offline</code>، <code>hybrid-full</code>، <code>session-hybrid</code> یا <code>session-inperson</code> را در تب «دسته‌ها» انتخاب کنید.</p>
        <p>
            <label for="majd_duration"><strong>مدت دوره</strong></label>
            <input type="text" id="majd_duration" name="majd_duration" value="<?php echo esc_attr($duration); ?>" class="widefat" placeholder="مثال: ۱۲ جلسه × ۲ ساعت" />
        </p>
        <p>
            <label for="majd_level"><strong>سطح</strong></label>
            <input type="text" id="majd_level" name="majd_level" value="<?php echo esc_attr($level); ?>" class="widefat" placeholder="مثال: مقدماتی" />
        </p>
        <p>
            <label for="majd_syllabus"><strong>سرفصل‌ها (هر خط یک مورد)</strong></label>
            <textarea id="majd_syllabus" name="majd_syllabus" class="widefat" rows="6" placeholder="جلسه ۱: ..."><?php echo esc_textarea(self::meta_lines_for_textarea($syllabus)); ?></textarea>
        </p>
        <p>
            <label for="majd_highlights"><strong>نکات برجسته (هر خط یک مورد)</strong></label>
            <textarea id="majd_highlights" name="majd_highlights" class="widefat" rows="4" placeholder="ویژگی ۱"><?php echo esc_textarea(self::meta_lines_for_textarea($highlights)); ?></textarea>
        </p>
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

    public static function save_product_meta_box($post_id) {
        if (!isset($_POST['majd_product_meta_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['majd_product_meta_nonce'])), 'majd_save_product_meta')) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $product = wc_get_product($post_id);
        if (!$product) {
            return;
        }

        if (isset($_POST['majd_duration'])) {
            $product->update_meta_data(MAJD_DURATION_META_KEY, sanitize_text_field(wp_unslash($_POST['majd_duration'])));
        }

        if (isset($_POST['majd_level'])) {
            $product->update_meta_data(MAJD_LEVEL_META_KEY, sanitize_text_field(wp_unslash($_POST['majd_level'])));
        }

        if (isset($_POST['majd_syllabus'])) {
            $product->update_meta_data(MAJD_SYLLABUS_META_KEY, self::encode_lines_to_json(wp_unslash($_POST['majd_syllabus'])));
        }

        if (isset($_POST['majd_highlights'])) {
            $product->update_meta_data(MAJD_HIGHLIGHTS_META_KEY, self::encode_lines_to_json(wp_unslash($_POST['majd_highlights'])));
        }

        $product->save();
    }

    private static function get_orders_for_user($user_id) {
        $user = get_user_by('id', $user_id);
        if (!$user) {
            return [];
        }

        $by_customer = wc_get_orders([
            'customer_id' => $user_id,
            'limit' => 50,
            'orderby' => 'date',
            'order' => 'DESC',
            'status' => self::visible_order_statuses(),
        ]);

        $by_email = wc_get_orders([
            'billing_email' => $user->user_email,
            'limit' => 50,
            'orderby' => 'date',
            'order' => 'DESC',
            'status' => self::visible_order_statuses(),
        ]);

        $merged = [];
        foreach (array_merge($by_customer, $by_email) as $order) {
            if ($order instanceof WC_Order) {
                $merged[$order->get_id()] = $order;
            }
        }

        usort($merged, function ($a, $b) {
            return $b->get_date_created()->getTimestamp() - $a->get_date_created()->getTimestamp();
        });

        return array_slice($merged, 0, 50);
    }

    private static function attach_guest_orders_to_customer($user_id, $email) {
        if (!class_exists('WooCommerce') || !is_email($email)) {
            return;
        }

        $orders = wc_get_orders([
            'billing_email' => $email,
            'customer_id' => 0,
            'limit' => 100,
            'status' => self::visible_order_statuses(),
        ]);

        foreach ($orders as $order) {
            if (!$order instanceof WC_Order) {
                continue;
            }
            $order->set_customer_id($user_id);
            $order->save();
        }
    }

    private static function user_owns_order($user_id, WC_Order $order) {
        if ((int) $order->get_customer_id() === (int) $user_id) {
            return true;
        }

        $user = get_user_by('id', $user_id);
        if (!$user) {
            return false;
        }

        return strtolower($order->get_billing_email()) === strtolower($user->user_email);
    }

    private static function visible_order_statuses() {
        return ['pending', 'processing', 'on-hold', 'completed', 'cancelled', 'refunded', 'failed'];
    }

    private static function is_course_product(WC_Product $product) {
        return self::get_product_format_slug($product) !== '';
    }

    private static function get_product_format_slug(WC_Product $product) {
        $terms = get_the_terms($product->get_id(), 'product_cat');
        if (!$terms || is_wp_error($terms)) {
            return '';
        }

        foreach ($terms as $term) {
            if (in_array($term->slug, MAJD_COURSE_CATEGORY_SLUGS, true)) {
                return $term->slug;
            }
        }

        return '';
    }

    private static function decode_json_list($value) {
        if (empty($value)) {
            return [];
        }

        if (is_array($value)) {
            return array_values(array_filter(array_map('strval', $value)));
        }

        $decoded = json_decode((string) $value, true);
        if (!is_array($decoded)) {
            return array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) $value))));
        }

        return array_values(array_filter(array_map('strval', $decoded)));
    }

    private static function encode_lines_to_json($text) {
        $lines = array_values(array_filter(array_map('trim', preg_split('/\r\n|\r|\n/', (string) $text))));
        return wp_json_encode($lines, JSON_UNESCAPED_UNICODE);
    }

    private static function meta_lines_for_textarea($value) {
        $items = self::decode_json_list($value);
        return implode("\n", $items);
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
