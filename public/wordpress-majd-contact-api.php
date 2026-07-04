<?php
/**
 * Plugin Name: Majd Contact API
 * Description: Contact form submissions for headless Next.js — REST endpoint + WordPress admin inbox.
 * Install: copy to wp-content/mu-plugins/wordpress-majd-contact-api.php
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MAJD_CONTACT_POST_TYPE', 'majd_contact');
define('MAJD_CONTACT_META_NAME', '_majd_contact_name');
define('MAJD_CONTACT_META_PHONE', '_majd_contact_phone');
define('MAJD_CONTACT_META_SUBJECT', '_majd_contact_subject');
define('MAJD_CONTACT_META_MESSAGE', '_majd_contact_message');
define('MAJD_CONTACT_META_STATUS', '_majd_contact_status');
define('MAJD_CONTACT_META_IP', '_majd_contact_ip');

class Majd_Contact_API {
    public static function init() {
        add_action('init', [__CLASS__, 'register_post_type']);
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_filter('manage_' . MAJD_CONTACT_POST_TYPE . '_posts_columns', [__CLASS__, 'list_columns']);
        add_action('manage_' . MAJD_CONTACT_POST_TYPE . '_posts_custom_column', [__CLASS__, 'render_list_column'], 10, 2);
        add_action('add_meta_boxes', [__CLASS__, 'add_detail_meta_box']);
        add_action('save_post_' . MAJD_CONTACT_POST_TYPE, [__CLASS__, 'save_status_meta'], 10, 2);
    }

    public static function register_post_type() {
        register_post_type(MAJD_CONTACT_POST_TYPE, [
            'labels' => [
                'name' => 'پیام‌های تماس',
                'singular_name' => 'پیام تماس',
                'menu_name' => 'پیام‌های تماس',
                'all_items' => 'همه پیام‌ها',
                'view_item' => 'مشاهده پیام',
                'search_items' => 'جستجوی پیام',
                'not_found' => 'پیامی یافت نشد',
                'not_found_in_trash' => 'پیامی در زباله‌دان نیست',
            ],
            'public' => false,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_position' => 26,
            'menu_icon' => 'dashicons-email-alt',
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'supports' => ['title'],
            'has_archive' => false,
            'rewrite' => false,
            'query_var' => false,
        ]);
    }

    public static function register_routes() {
        register_rest_route('majd/v1', '/contact', [
            'methods' => 'POST',
            'callback' => [__CLASS__, 'submit_contact'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function submit_contact(WP_REST_Request $request) {
        $honeypot = sanitize_text_field($request->get_param('company') ?? '');
        if (!empty($honeypot)) {
            return rest_ensure_response([
                'success' => true,
                'message' => 'پیام شما با موفقیت ثبت شد.',
                'id' => 0,
            ]);
        }

        $name = sanitize_text_field($request->get_param('name') ?? '');
        $phone = sanitize_text_field($request->get_param('phone') ?? '');
        $subject = sanitize_text_field($request->get_param('subject') ?? '');
        $message = sanitize_textarea_field($request->get_param('message') ?? '');

        if (empty($name)) {
            return new WP_Error('missing_name', 'نام را وارد کنید.', ['status' => 400]);
        }

        if (empty($phone)) {
            return new WP_Error('missing_phone', 'شماره تماس را وارد کنید.', ['status' => 400]);
        }

        if (empty($subject)) {
            return new WP_Error('missing_subject', 'موضوع را انتخاب کنید.', ['status' => 400]);
        }

        if (empty($message)) {
            return new WP_Error('missing_message', 'متن پیام را وارد کنید.', ['status' => 400]);
        }

        if (mb_strlen($message) > 5000) {
            return new WP_Error('message_too_long', 'پیام بیش از حد طولانی است.', ['status' => 400]);
        }

        $title = sprintf('%s — %s', $name, $subject);
        $post_id = wp_insert_post([
            'post_type' => MAJD_CONTACT_POST_TYPE,
            'post_status' => 'publish',
            'post_title' => $title,
        ], true);

        if (is_wp_error($post_id)) {
            return new WP_Error('save_failed', 'ثبت پیام انجام نشد. لطفاً دوباره تلاش کنید.', ['status' => 500]);
        }

        update_post_meta($post_id, MAJD_CONTACT_META_NAME, $name);
        update_post_meta($post_id, MAJD_CONTACT_META_PHONE, $phone);
        update_post_meta($post_id, MAJD_CONTACT_META_SUBJECT, $subject);
        update_post_meta($post_id, MAJD_CONTACT_META_MESSAGE, $message);
        update_post_meta($post_id, MAJD_CONTACT_META_STATUS, 'new');
        update_post_meta($post_id, MAJD_CONTACT_META_IP, self::get_client_ip());

        $admin_email = get_option('admin_email');
        if ($admin_email && is_email($admin_email)) {
            wp_mail(
                $admin_email,
                sprintf('[موسسه مجد] پیام تماس جدید: %s', $subject),
                sprintf(
                    "نام: %s\nتلفن: %s\nموضوع: %s\n\n%s\n\n---\nمشاهده در پنل: %s",
                    $name,
                    $phone,
                    $subject,
                    $message,
                    admin_url('edit.php?post_type=' . MAJD_CONTACT_POST_TYPE)
                )
            );
        }

        return rest_ensure_response([
            'success' => true,
            'message' => 'پیام شما با موفقیت ثبت شد. به زودی با شما تماس می‌گیریم.',
            'id' => (int) $post_id,
        ]);
    }

    public static function list_columns($columns) {
        $new = [];
        $new['cb'] = $columns['cb'] ?? '';
        $new['title'] = 'عنوان';
        $new['majd_name'] = 'نام';
        $new['majd_phone'] = 'تلفن';
        $new['majd_subject'] = 'موضوع';
        $new['majd_status'] = 'وضعیت';
        $new['date'] = $columns['date'] ?? 'تاریخ';
        return $new;
    }

    public static function render_list_column($column, $post_id) {
        switch ($column) {
            case 'majd_name':
                echo esc_html(get_post_meta($post_id, MAJD_CONTACT_META_NAME, true));
                break;
            case 'majd_phone':
                echo esc_html(get_post_meta($post_id, MAJD_CONTACT_META_PHONE, true));
                break;
            case 'majd_subject':
                echo esc_html(get_post_meta($post_id, MAJD_CONTACT_META_SUBJECT, true));
                break;
            case 'majd_status':
                $status = get_post_meta($post_id, MAJD_CONTACT_META_STATUS, true) ?: 'new';
                $label = $status === 'read' ? 'بررسی شده' : 'جدید';
                $color = $status === 'read' ? '#64748b' : '#c9a227';
                printf(
                    '<span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;font-weight:600;background:%s20;color:%s">%s</span>',
                    esc_attr($color),
                    esc_attr($color),
                    esc_html($label)
                );
                break;
        }
    }

    public static function add_detail_meta_box() {
        add_meta_box(
            'majd_contact_details',
            'جزئیات پیام تماس',
            [__CLASS__, 'render_detail_meta_box'],
            MAJD_CONTACT_POST_TYPE,
            'normal',
            'high'
        );
    }

    public static function render_detail_meta_box($post) {
        $name = get_post_meta($post->ID, MAJD_CONTACT_META_NAME, true);
        $phone = get_post_meta($post->ID, MAJD_CONTACT_META_PHONE, true);
        $subject = get_post_meta($post->ID, MAJD_CONTACT_META_SUBJECT, true);
        $message = get_post_meta($post->ID, MAJD_CONTACT_META_MESSAGE, true);
        $status = get_post_meta($post->ID, MAJD_CONTACT_META_STATUS, true) ?: 'new';
        $ip = get_post_meta($post->ID, MAJD_CONTACT_META_IP, true);

        wp_nonce_field('majd_contact_status_save', 'majd_contact_status_nonce');
        ?>
        <table class="form-table" role="presentation">
            <tr>
                <th scope="row">نام</th>
                <td><strong><?php echo esc_html($name); ?></strong></td>
            </tr>
            <tr>
                <th scope="row">تلفن</th>
                <td dir="ltr"><?php echo esc_html($phone); ?></td>
            </tr>
            <tr>
                <th scope="row">موضوع</th>
                <td><?php echo esc_html($subject); ?></td>
            </tr>
            <tr>
                <th scope="row">وضعیت</th>
                <td>
                    <select name="majd_contact_status">
                        <option value="new" <?php selected($status, 'new'); ?>>جدید</option>
                        <option value="read" <?php selected($status, 'read'); ?>>بررسی شده</option>
                    </select>
                </td>
            </tr>
            <?php if ($ip) : ?>
            <tr>
                <th scope="row">IP</th>
                <td dir="ltr"><code><?php echo esc_html($ip); ?></code></td>
            </tr>
            <?php endif; ?>
            <tr>
                <th scope="row">پیام</th>
                <td>
                    <div style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;line-height:1.8"><?php echo esc_html($message); ?></div>
                </td>
            </tr>
        </table>
        <?php
    }

    public static function save_status_meta($post_id, $post) {
        if (!isset($_POST['majd_contact_status_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['majd_contact_status_nonce'])), 'majd_contact_status_save')) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        if (isset($_POST['majd_contact_status'])) {
            $status = sanitize_text_field(wp_unslash($_POST['majd_contact_status']));
            if (in_array($status, ['new', 'read'], true)) {
                update_post_meta($post_id, MAJD_CONTACT_META_STATUS, $status);
            }
        }
    }

    private static function get_client_ip() {
        $keys = ['HTTP_CF_CONNECTING_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
        foreach ($keys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = sanitize_text_field(wp_unslash($_SERVER[$key]));
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                return $ip;
            }
        }
        return '';
    }
}

Majd_Contact_API::init();
