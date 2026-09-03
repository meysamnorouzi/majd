<?php
/**
 * Plugin Name: Majd Team API
 * Description: Team members custom post type + REST API for headless Next.js (اعضای تیم).
 * Install: copy to wp-content/mu-plugins/wordpress-majd-team-api.php
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MAJD_TEAM_POST_TYPE', 'majd_team_member');
define('MAJD_TEAM_REST_NAMESPACE', 'majd/v1');

define('MAJD_TEAM_META_ROLE', '_majd_team_role');
define('MAJD_TEAM_META_SPECIALTY', '_majd_team_specialty');
define('MAJD_TEAM_META_FULL_BIO', '_majd_team_full_bio');
define('MAJD_TEAM_META_BANNER_ID', '_majd_team_banner_id');
define('MAJD_TEAM_META_GALLERY', '_majd_team_gallery');
define('MAJD_TEAM_META_VIDEO_GALLERY', '_majd_team_video_gallery');
define('MAJD_TEAM_META_EDUCATION', '_majd_team_education');
define('MAJD_TEAM_META_BIRTH_DATE', '_majd_team_birth_date');
define('MAJD_TEAM_META_EXPERIENCE', '_majd_team_experience_years');
define('MAJD_TEAM_META_AREAS', '_majd_team_areas_of_practice');
define('MAJD_TEAM_META_ACHIEVEMENTS', '_majd_team_achievements');
define('MAJD_TEAM_META_PHONE', '_majd_team_phone');
define('MAJD_TEAM_META_EMAIL', '_majd_team_email');
define('MAJD_TEAM_META_LOCATION', '_majd_team_location');
define('MAJD_TEAM_META_SOCIAL_INSTAGRAM', '_majd_team_social_instagram');
define('MAJD_TEAM_META_SOCIAL_TELEGRAM', '_majd_team_social_telegram');
define('MAJD_TEAM_META_SOCIAL_LINKEDIN', '_majd_team_social_linkedin');

class Majd_Team_API {
    public static function init() {
        add_action('init', [__CLASS__, 'register_post_type']);
        add_action('init', [__CLASS__, 'register_meta']);
        add_action('rest_api_init', [__CLASS__, 'register_rest_fields']);
        add_action('add_meta_boxes', [__CLASS__, 'add_meta_boxes']);
        add_action('save_post_' . MAJD_TEAM_POST_TYPE, [__CLASS__, 'save_meta'], 10, 2);
        add_filter('manage_' . MAJD_TEAM_POST_TYPE . '_posts_columns', [__CLASS__, 'list_columns']);
        add_action('manage_' . MAJD_TEAM_POST_TYPE . '_posts_custom_column', [__CLASS__, 'render_list_column'], 10, 2);
        add_action('admin_enqueue_scripts', [__CLASS__, 'enqueue_admin_assets']);
    }

    public static function register_post_type() {
        register_post_type(MAJD_TEAM_POST_TYPE, [
            'labels' => [
                'name' => 'اعضای تیم',
                'singular_name' => 'عضو تیم',
                'menu_name' => 'اعضای تیم',
                'add_new' => 'افزودن عضو',
                'add_new_item' => 'افزودن عضو جدید',
                'edit_item' => 'ویرایش عضو تیم',
                'new_item' => 'عضو جدید',
                'view_item' => 'مشاهده عضو',
                'search_items' => 'جستجوی اعضا',
                'not_found' => 'عضوی یافت نشد',
                'not_found_in_trash' => 'عضوی در زباله‌دان نیست',
                'featured_image' => 'تصویر پرتره (کارت و پروفایل)',
                'set_featured_image' => 'انتخاب تصویر پرتره',
                'remove_featured_image' => 'حذف تصویر پرتره',
                'use_featured_image' => 'استفاده به عنوان تصویر پرتره',
            ],
            'public' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'menu_position' => 21,
            'menu_icon' => 'dashicons-groups',
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'has_archive' => false,
            'rewrite' => false,
            'query_var' => false,
            'show_in_rest' => true,
            'rest_base' => 'team',
            'supports' => [
                'title',
                'excerpt',
                'thumbnail',
                'page-attributes',
            ],
        ]);
    }

    public static function register_meta() {
        $string_fields = [
            MAJD_TEAM_META_ROLE,
            MAJD_TEAM_META_SPECIALTY,
            MAJD_TEAM_META_EDUCATION,
            MAJD_TEAM_META_BIRTH_DATE,
            MAJD_TEAM_META_EXPERIENCE,
            MAJD_TEAM_META_PHONE,
            MAJD_TEAM_META_EMAIL,
            MAJD_TEAM_META_LOCATION,
            MAJD_TEAM_META_SOCIAL_INSTAGRAM,
            MAJD_TEAM_META_SOCIAL_TELEGRAM,
            MAJD_TEAM_META_SOCIAL_LINKEDIN,
        ];

        foreach ($string_fields as $key) {
            register_post_meta(MAJD_TEAM_POST_TYPE, $key, [
                'type' => 'string',
                'single' => true,
                'show_in_rest' => true,
                'auth_callback' => '__return_true',
            ]);
        }

        register_post_meta(MAJD_TEAM_POST_TYPE, MAJD_TEAM_META_FULL_BIO, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta(MAJD_TEAM_POST_TYPE, MAJD_TEAM_META_BANNER_ID, [
            'type' => 'integer',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta(MAJD_TEAM_POST_TYPE, MAJD_TEAM_META_GALLERY, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta(MAJD_TEAM_POST_TYPE, MAJD_TEAM_META_VIDEO_GALLERY, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta(MAJD_TEAM_POST_TYPE, MAJD_TEAM_META_AREAS, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);

        register_post_meta(MAJD_TEAM_POST_TYPE, MAJD_TEAM_META_ACHIEVEMENTS, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
    }

    public static function register_rest_fields() {
        register_rest_field(MAJD_TEAM_POST_TYPE, 'majd_team', [
            'get_callback' => [__CLASS__, 'rest_team_payload'],
            'schema' => [
                'description' => 'Structured team member fields for Majd frontend',
                'type' => 'object',
                'context' => ['view', 'edit'],
            ],
        ]);
    }

    public static function rest_team_payload($post) {
        $post_id = is_array($post) ? (int) ($post['id'] ?? 0) : (int) $post->ID;
        if (!$post_id) {
            return [];
        }

        $banner_id = (int) get_post_meta($post_id, MAJD_TEAM_META_BANNER_ID, true);
        $social = array_filter([
            'instagram' => (string) get_post_meta($post_id, MAJD_TEAM_META_SOCIAL_INSTAGRAM, true),
            'telegram' => (string) get_post_meta($post_id, MAJD_TEAM_META_SOCIAL_TELEGRAM, true),
            'linkedin' => (string) get_post_meta($post_id, MAJD_TEAM_META_SOCIAL_LINKEDIN, true),
        ]);

        return [
            'role' => (string) get_post_meta($post_id, MAJD_TEAM_META_ROLE, true),
            'specialty' => (string) get_post_meta($post_id, MAJD_TEAM_META_SPECIALTY, true),
            'fullBio' => self::decode_line_list(get_post_meta($post_id, MAJD_TEAM_META_FULL_BIO, true)),
            'bannerImage' => self::attachment_url($banner_id),
            'gallery' => self::decode_gallery(get_post_meta($post_id, MAJD_TEAM_META_GALLERY, true)),
            'videoGallery' => self::decode_video_gallery(get_post_meta($post_id, MAJD_TEAM_META_VIDEO_GALLERY, true)),
            'education' => (string) get_post_meta($post_id, MAJD_TEAM_META_EDUCATION, true),
            'birthDate' => (string) get_post_meta($post_id, MAJD_TEAM_META_BIRTH_DATE, true),
            'experienceYears' => (string) get_post_meta($post_id, MAJD_TEAM_META_EXPERIENCE, true),
            'areasOfPractice' => self::decode_line_list(get_post_meta($post_id, MAJD_TEAM_META_AREAS, true)),
            'achievements' => self::decode_line_list(get_post_meta($post_id, MAJD_TEAM_META_ACHIEVEMENTS, true)),
            'phone' => (string) get_post_meta($post_id, MAJD_TEAM_META_PHONE, true),
            'email' => (string) get_post_meta($post_id, MAJD_TEAM_META_EMAIL, true),
            'location' => (string) get_post_meta($post_id, MAJD_TEAM_META_LOCATION, true),
            'social' => $social ?: new stdClass(),
            'menuOrder' => (int) get_post_field('menu_order', $post_id),
        ];
    }

    public static function add_meta_boxes() {
        add_meta_box(
            'majd_team_profile',
            'اطلاعات حرفه‌ای',
            [__CLASS__, 'render_profile_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'normal',
            'high'
        );

        add_meta_box(
            'majd_team_bio',
            'بیوگرافی کامل',
            [__CLASS__, 'render_bio_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'normal',
            'default'
        );

        add_meta_box(
            'majd_team_media',
            'تصاویر',
            [__CLASS__, 'render_media_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'side',
            'default'
        );

        add_meta_box(
            'majd_team_videos',
            'گالری ویدیو',
            [__CLASS__, 'render_videos_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'normal',
            'default'
        );

        add_meta_box(
            'majd_team_contact',
            'تماس و شبکه‌های اجتماعی',
            [__CLASS__, 'render_contact_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'side',
            'default'
        );

        add_meta_box(
            'majd_team_lists',
            'حوزه‌های تخصصی و سوابق',
            [__CLASS__, 'render_lists_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'normal',
            'default'
        );
    }

    public static function render_profile_meta_box($post) {
        wp_nonce_field('majd_team_save', 'majd_team_nonce');
        $fields = self::get_post_fields($post->ID);
        ?>
        <table class="form-table majd-team-form" role="presentation">
            <tr>
                <th scope="row"><label for="majd_team_role">سمت / نقش</label></th>
                <td>
                    <input type="text" class="large-text" id="majd_team_role" name="majd_team_role"
                        value="<?php echo esc_attr($fields['role']); ?>"
                        placeholder="مثال: مدیرعامل مؤسسه حقوقی مجد وکیل الرعایا" />
                    <p class="description">زیر نام در کارت و صفحه پروفایل نمایش داده می‌شود.</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="majd_team_specialty">حوزه تخصصی</label></th>
                <td>
                    <input type="text" class="large-text" id="majd_team_specialty" name="majd_team_specialty"
                        value="<?php echo esc_attr($fields['specialty']); ?>"
                        placeholder="مثال: حقوق بین‌الملل عمومی" />
                    <p class="description">برچسب طلایی بالای صفحه پروفایل و کارت عضو.</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="majd_team_birth_date">تاریخ تولد</label></th>
                <td>
                    <input type="text" class="regular-text" id="majd_team_birth_date" name="majd_team_birth_date"
                        value="<?php echo esc_attr($fields['birth_date']); ?>"
                        placeholder="مثال: ۲۲ بهمن ۱۳۶۱" />
                    <p class="description">اختیاری. اگر خالی باشد در سایت نشان داده نمی‌شود.</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="majd_team_education">تحصیلات</label></th>
                <td>
                    <textarea name="majd_team_education" id="majd_team_education" rows="4" class="large-text"
                        placeholder="دکتری حقوق بین‌الملل عمومی – دانشجو&#10;کارشناسی ارشد حقوق جزا و جرم‌شناسی – دانشگاه تهران مرکز&#10;کارشناسی حقوق قضایی – دانشگاه تهران جنوب"><?php echo esc_textarea($fields['education']); ?></textarea>
                    <p class="description">هر مقطع تحصیلی در یک خط جداگانه. خط اول در هدر پروفایل هم نمایش داده می‌شود.</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="majd_team_experience">سال‌های تجربه</label></th>
                <td>
                    <input type="text" class="regular-text" id="majd_team_experience" name="majd_team_experience"
                        value="<?php echo esc_attr($fields['experience']); ?>"
                        placeholder="مثال: ۱۵" style="max-width:120px" />
                    <p class="description">اختیاری. فقط وقتی پر شود نمایش داده می‌شود. اگر تاریخ تولد دارید و عدد تجربه مشخص نیست، خالی بگذارید.</p>
                </td>
            </tr>
        </table>
        <p class="description">
            <strong>نام</strong> را در عنوان بالا وارد کنید.
            <strong>خلاصه بیوگرافی</strong> (bio کوتاه کارت‌ها) را در باکس «خلاصه» در سمت راست بنویسید.
            ترتیب نمایش در سایت با فیلد «ترتیب» (Page Attributes) کنترل می‌شود.
        </p>
        <?php
    }

    public static function render_bio_meta_box($post) {
        $full_bio = get_post_meta($post->ID, MAJD_TEAM_META_FULL_BIO, true);
        ?>
        <p class="description">
            هر پاراگراف را در یک خط جداگانه بنویسید. ساختار پیشنهادی برای همه اعضا:
        </p>
        <ul class="ul-disc" style="margin:0 1.5em 12px;list-style:disc">
            <li>پاراگراف‌های معرفی</li>
            <li>عنوان بخش در یک خط کوتاه بدون نقطه (مثل: سوابق تحصیلی)</li>
            <li>موارد فهرست (مقاطع تحصیلی، سوابق، حوزه‌ها) هر کدام در یک خط</li>
        </ul>
        <textarea name="majd_team_full_bio" rows="14" class="large-text code" style="font-family:inherit;line-height:1.8" placeholder="پاراگراف معرفی...&#10;سوابق تحصیلی&#10;دکتری ... – دانشجو"><?php echo esc_textarea($full_bio); ?></textarea>
        <?php
    }

    public static function render_media_meta_box($post) {
        $banner_id = (int) get_post_meta($post->ID, MAJD_TEAM_META_BANNER_ID, true);
        $banner_url = self::attachment_url($banner_id);
        $gallery = get_post_meta($post->ID, MAJD_TEAM_META_GALLERY, true);
        ?>
        <p><strong>تصویر پرتره</strong> — از «تصویر شاخص» (Featured Image) استفاده کنید.</p>
        <hr style="margin:16px 0" />
        <p><strong>بنر صفحه جزئیات</strong> (عریض، سینمایی)</p>
        <div class="majd-team-banner-picker">
            <input type="hidden" id="majd_team_banner_id" name="majd_team_banner_id" value="<?php echo esc_attr($banner_id); ?>" />
            <div id="majd_team_banner_preview" style="margin-bottom:10px">
                <?php if ($banner_url) : ?>
                    <img src="<?php echo esc_url($banner_url); ?>" alt="" style="max-width:100%;height:auto;border-radius:8px" />
                <?php endif; ?>
            </div>
            <button type="button" class="button" id="majd_team_banner_select">انتخاب بنر</button>
            <button type="button" class="button" id="majd_team_banner_remove" <?php echo $banner_id ? '' : 'style="display:none"'; ?>>حذف</button>
        </div>
        <hr style="margin:16px 0" />
        <p><strong>گالری تصاویر</strong></p>
        <p class="description">هر خط: <code>آدرس تصویر | متن alt</code></p>
        <textarea name="majd_team_gallery" rows="6" class="large-text code" style="font-family:inherit"><?php echo esc_textarea($gallery); ?></textarea>
        <?php
    }

    public static function render_videos_meta_box($post) {
        $videos = get_post_meta($post->ID, MAJD_TEAM_META_VIDEO_GALLERY, true);
        ?>
        <p class="description">
            ویدیوها زیر گالری تصاویر در صفحه پروفایل نمایش داده می‌شوند.
            یوتیوب، آپارات، ویمئو یا فایل آپلودشده در رسانه وردپرس پشتیبانی می‌شود.
        </p>
        <p>
            <button type="button" class="button" id="majd_team_videos_select">افزودن ویدیو از رسانه</button>
        </p>
        <p class="description">هر خط: <code>آدرس ویدیو | عنوان | آدرس پوستر (اختیاری)</code></p>
        <textarea name="majd_team_videos" id="majd_team_videos" rows="8" class="large-text code" dir="ltr" style="font-family:inherit;line-height:1.7"
            placeholder="https://www.youtube.com/watch?v=xxxxxxxxxxx | سخنرانی همایش&#10;https://www.aparat.com/v/xxxxx | مصاحبه رسانه‌ای"><?php echo esc_textarea($videos); ?></textarea>
        <?php
    }

    public static function render_contact_meta_box($post) {
        $fields = self::get_post_fields($post->ID);
        ?>
        <p>
            <label for="majd_team_phone"><strong>تلفن</strong></label><br />
            <input type="text" class="widefat" dir="ltr" id="majd_team_phone" name="majd_team_phone"
                value="<?php echo esc_attr($fields['phone']); ?>" />
        </p>
        <p>
            <label for="majd_team_email"><strong>ایمیل</strong></label><br />
            <input type="email" class="widefat" dir="ltr" id="majd_team_email" name="majd_team_email"
                value="<?php echo esc_attr($fields['email']); ?>" />
        </p>
        <p>
            <label for="majd_team_location"><strong>محل فعالیت</strong></label><br />
            <input type="text" class="widefat" id="majd_team_location" name="majd_team_location"
                value="<?php echo esc_attr($fields['location']); ?>" />
        </p>
        <hr />
        <p><strong>شبکه‌های اجتماعی</strong></p>
        <p>
            <label for="majd_team_social_instagram">Instagram</label><br />
            <input type="url" class="widefat" dir="ltr" id="majd_team_social_instagram" name="majd_team_social_instagram"
                value="<?php echo esc_attr($fields['social_instagram']); ?>" />
        </p>
        <p>
            <label for="majd_team_social_telegram">Telegram</label><br />
            <input type="url" class="widefat" dir="ltr" id="majd_team_social_telegram" name="majd_team_social_telegram"
                value="<?php echo esc_attr($fields['social_telegram']); ?>" />
        </p>
        <p>
            <label for="majd_team_social_linkedin">LinkedIn</label><br />
            <input type="url" class="widefat" dir="ltr" id="majd_team_social_linkedin" name="majd_team_social_linkedin"
                value="<?php echo esc_attr($fields['social_linkedin']); ?>" />
        </p>
        <?php
    }

    public static function render_lists_meta_box($post) {
        $areas = get_post_meta($post->ID, MAJD_TEAM_META_AREAS, true);
        $achievements = get_post_meta($post->ID, MAJD_TEAM_META_ACHIEVEMENTS, true);
        ?>
        <table class="form-table majd-team-form" role="presentation">
            <tr>
                <th scope="row"><label for="majd_team_areas">حوزه‌های تخصصی</label></th>
                <td>
                    <textarea name="majd_team_areas" id="majd_team_areas" rows="8" class="large-text" placeholder="حقوق بین‌الملل عمومی&#10;حقوق جزا و جرم‌شناسی"><?php echo esc_textarea($areas); ?></textarea>
                    <p class="description">هر حوزه در یک خط. تب «حوزه‌های تخصصی» و نوار پایین صفحه پروفایل از این لیست ساخته می‌شود.</p>
                </td>
            </tr>
            <tr>
                <th scope="row"><label for="majd_team_achievements">سوابق حرفه‌ای و دستاوردها</label></th>
                <td>
                    <textarea name="majd_team_achievements" id="majd_team_achievements" rows="8" class="large-text" placeholder="نماینده و مشاور حقوقی ..."><?php echo esc_textarea($achievements); ?></textarea>
                    <p class="description">هر سابقه یا دستاورد در یک خط. تب «دستاوردها» از این لیست ساخته می‌شود.</p>
                </td>
            </tr>
        </table>
        <?php
    }

    public static function save_meta($post_id, $post) {
        if (!isset($_POST['majd_team_nonce']) || !wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['majd_team_nonce'])), 'majd_team_save')) {
            return;
        }

        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $map = [
            'majd_team_role' => MAJD_TEAM_META_ROLE,
            'majd_team_specialty' => MAJD_TEAM_META_SPECIALTY,
            'majd_team_birth_date' => MAJD_TEAM_META_BIRTH_DATE,
            'majd_team_experience' => MAJD_TEAM_META_EXPERIENCE,
            'majd_team_phone' => MAJD_TEAM_META_PHONE,
            'majd_team_email' => MAJD_TEAM_META_EMAIL,
            'majd_team_location' => MAJD_TEAM_META_LOCATION,
            'majd_team_social_instagram' => MAJD_TEAM_META_SOCIAL_INSTAGRAM,
            'majd_team_social_telegram' => MAJD_TEAM_META_SOCIAL_TELEGRAM,
            'majd_team_social_linkedin' => MAJD_TEAM_META_SOCIAL_LINKEDIN,
        ];

        foreach ($map as $input => $meta_key) {
            if (isset($_POST[$input])) {
                update_post_meta($post_id, $meta_key, sanitize_text_field(wp_unslash($_POST[$input])));
            }
        }

        if (isset($_POST['majd_team_full_bio'])) {
            update_post_meta($post_id, MAJD_TEAM_META_FULL_BIO, sanitize_textarea_field(wp_unslash($_POST['majd_team_full_bio'])));
        }

        if (isset($_POST['majd_team_education'])) {
            update_post_meta($post_id, MAJD_TEAM_META_EDUCATION, sanitize_textarea_field(wp_unslash($_POST['majd_team_education'])));
        }

        if (isset($_POST['majd_team_areas'])) {
            update_post_meta($post_id, MAJD_TEAM_META_AREAS, sanitize_textarea_field(wp_unslash($_POST['majd_team_areas'])));
        }

        if (isset($_POST['majd_team_achievements'])) {
            update_post_meta($post_id, MAJD_TEAM_META_ACHIEVEMENTS, sanitize_textarea_field(wp_unslash($_POST['majd_team_achievements'])));
        }

        if (isset($_POST['majd_team_gallery'])) {
            update_post_meta($post_id, MAJD_TEAM_META_GALLERY, sanitize_textarea_field(wp_unslash($_POST['majd_team_gallery'])));
        }

        if (isset($_POST['majd_team_videos'])) {
            update_post_meta($post_id, MAJD_TEAM_META_VIDEO_GALLERY, sanitize_textarea_field(wp_unslash($_POST['majd_team_videos'])));
        }

        if (isset($_POST['majd_team_banner_id'])) {
            update_post_meta($post_id, MAJD_TEAM_META_BANNER_ID, absint($_POST['majd_team_banner_id']));
        }
    }

    public static function list_columns($columns) {
        $new = [];
        $new['cb'] = $columns['cb'] ?? '';
        $new['title'] = 'نام';
        $new['majd_team_thumb'] = 'تصویر';
        $new['majd_team_role'] = 'سمت';
        $new['majd_team_specialty'] = 'تخصص';
        $new['menu_order'] = 'ترتیب';
        $new['date'] = $columns['date'] ?? 'تاریخ';
        return $new;
    }

    public static function render_list_column($column, $post_id) {
        switch ($column) {
            case 'majd_team_thumb':
                echo get_the_post_thumbnail($post_id, [48, 48], ['style' => 'border-radius:999px;object-fit:cover']);
                break;
            case 'majd_team_role':
                echo esc_html(get_post_meta($post_id, MAJD_TEAM_META_ROLE, true));
                break;
            case 'majd_team_specialty':
                echo esc_html(get_post_meta($post_id, MAJD_TEAM_META_SPECIALTY, true));
                break;
            case 'menu_order':
                echo esc_html((string) get_post_field('menu_order', $post_id));
                break;
        }
    }

    public static function enqueue_admin_assets($hook) {
        global $post_type;
        if (($hook !== 'post.php' && $hook !== 'post-new.php') || $post_type !== MAJD_TEAM_POST_TYPE) {
            return;
        }

        wp_enqueue_media();
        wp_add_inline_script('jquery', "
            jQuery(function($) {
                var frame;
                $('#majd_team_banner_select').on('click', function(e) {
                    e.preventDefault();
                    if (frame) { frame.open(); return; }
                    frame = wp.media({
                        title: 'انتخاب بنر',
                        button: { text: 'استفاده' },
                        multiple: false
                    });
                    frame.on('select', function() {
                        var attachment = frame.state().get('selection').first().toJSON();
                        $('#majd_team_banner_id').val(attachment.id);
                        $('#majd_team_banner_preview').html('<img src=\"' + attachment.url + '\" style=\"max-width:100%;height:auto;border-radius:8px\" />');
                        $('#majd_team_banner_remove').show();
                    });
                    frame.open();
                });
                $('#majd_team_banner_remove').on('click', function(e) {
                    e.preventDefault();
                    $('#majd_team_banner_id').val('');
                    $('#majd_team_banner_preview').empty();
                    $(this).hide();
                });

                var videoFrame;
                $('#majd_team_videos_select').on('click', function(e) {
                    e.preventDefault();
                    if (videoFrame) { videoFrame.open(); return; }
                    videoFrame = wp.media({
                        title: 'انتخاب ویدیو',
                        library: { type: 'video' },
                        button: { text: 'افزودن به گالری' },
                        multiple: true
                    });
                    videoFrame.on('select', function() {
                        var lines = [];
                        videoFrame.state().get('selection').each(function(att) {
                            var a = att.toJSON();
                            var title = a.title || '';
                            var poster = (a.image && a.image.src) ? a.image.src : '';
                            var parts = [a.url];
                            if (title || poster) { parts.push(title); }
                            if (poster) { parts.push(poster); }
                            lines.push(parts.join(' | '));
                        });
                        var $ta = $('#majd_team_videos');
                        var existing = $.trim($ta.val());
                        $ta.val(existing ? existing + '\\n' + lines.join('\\n') : lines.join('\\n'));
                    });
                    videoFrame.open();
                });
            });
        ");
    }

    private static function get_post_fields($post_id) {
        return [
            'role' => get_post_meta($post_id, MAJD_TEAM_META_ROLE, true),
            'specialty' => get_post_meta($post_id, MAJD_TEAM_META_SPECIALTY, true),
            'education' => get_post_meta($post_id, MAJD_TEAM_META_EDUCATION, true),
            'birth_date' => get_post_meta($post_id, MAJD_TEAM_META_BIRTH_DATE, true),
            'experience' => get_post_meta($post_id, MAJD_TEAM_META_EXPERIENCE, true),
            'phone' => get_post_meta($post_id, MAJD_TEAM_META_PHONE, true),
            'email' => get_post_meta($post_id, MAJD_TEAM_META_EMAIL, true),
            'location' => get_post_meta($post_id, MAJD_TEAM_META_LOCATION, true),
            'social_instagram' => get_post_meta($post_id, MAJD_TEAM_META_SOCIAL_INSTAGRAM, true),
            'social_telegram' => get_post_meta($post_id, MAJD_TEAM_META_SOCIAL_TELEGRAM, true),
            'social_linkedin' => get_post_meta($post_id, MAJD_TEAM_META_SOCIAL_LINKEDIN, true),
        ];
    }

    private static function decode_line_list($raw) {
        if (!is_string($raw) || $raw === '') {
            return [];
        }

        $lines = preg_split('/\r\n|\r|\n/', $raw);
        $out = [];
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line !== '') {
                $out[] = $line;
            }
        }
        return $out;
    }

    private static function decode_gallery($raw) {
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }

        $items = [];
        foreach (preg_split('/\r\n|\r|\n/', $raw) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $parts = array_map('trim', explode('|', $line, 2));
            $src = $parts[0] ?? '';
            if ($src === '') {
                continue;
            }

            $items[] = [
                'src' => $src,
                'alt' => $parts[1] ?? '',
            ];
        }

        return $items;
    }

    private static function decode_video_gallery($raw) {
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }

        $items = [];
        foreach (preg_split('/\r\n|\r|\n/', $raw) as $line) {
            $line = trim($line);
            if ($line === '') {
                continue;
            }

            $parts = array_map('trim', explode('|', $line, 3));
            $src = $parts[0] ?? '';
            if ($src === '') {
                continue;
            }

            $item = [
                'src' => $src,
                'title' => $parts[1] ?? '',
            ];
            if (!empty($parts[2])) {
                $item['poster'] = $parts[2];
            }
            $items[] = $item;
        }

        return $items;
    }

    private static function attachment_url($attachment_id) {
        if (!$attachment_id) {
            return '';
        }
        $url = wp_get_attachment_image_url($attachment_id, 'full');
        return $url ? $url : '';
    }
}

Majd_Team_API::init();
