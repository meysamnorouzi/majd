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
            'majd_team_gallery',
            'گالری تصاویر',
            [__CLASS__, 'render_gallery_meta_box'],
            MAJD_TEAM_POST_TYPE,
            'normal',
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
        <?php
    }

    public static function render_gallery_meta_box($post) {
        $items = self::gallery_editor_items(get_post_meta($post->ID, MAJD_TEAM_META_GALLERY, true));
        ?>
        <style>
            .majd-team-gallery-list{display:flex;flex-wrap:wrap;gap:12px;margin:12px 0}
            .majd-team-gallery-item{width:160px;background:#fff;border:1px solid #dcdcde;border-radius:8px;padding:8px}
            .majd-team-gallery-item.is-dragging{opacity:.45}
            .majd-team-gallery-thumb{cursor:grab}
            .majd-team-gallery-thumb img{display:block;width:100%;height:110px;object-fit:cover;border-radius:4px;background:#f0f0f1}
            .majd-team-gallery-item input[type="text"]{width:100%;margin-top:8px}
            .majd-team-gallery-remove{margin-top:6px}
        </style>
        <p class="description">
            تصاویر را از کتابخانه رسانه انتخاب کنید. برای تغییر ترتیب، تصویر را بکشید و رها کنید.
            متن جایگزین زیر هر تصویر در سایت نمایش داده می‌شود.
        </p>
        <p>
            <button type="button" class="button button-primary" id="majd_team_gallery_select">انتخاب از رسانه</button>
        </p>
        <input type="hidden" name="majd_team_gallery_present" value="1" />
        <div id="majd_team_gallery_list" class="majd-team-gallery-list">
            <?php foreach ($items as $item) : ?>
                <div class="majd-team-gallery-item"<?php echo $item['id'] ? ' data-id="' . esc_attr((string) $item['id']) . '"' : ''; ?>>
                    <div class="majd-team-gallery-thumb" draggable="true">
                        <img src="<?php echo esc_url($item['preview']); ?>" alt="" />
                    </div>
                    <input type="hidden" name="majd_team_gallery_item_id[]" value="<?php echo esc_attr((string) $item['id']); ?>" />
                    <input type="hidden" name="majd_team_gallery_item_src[]" value="<?php echo esc_attr($item['src']); ?>" />
                    <input type="text" name="majd_team_gallery_item_alt[]" value="<?php echo esc_attr($item['alt']); ?>" placeholder="متن جایگزین" />
                    <button type="button" class="button-link-delete majd-team-gallery-remove">حذف</button>
                </div>
            <?php endforeach; ?>
        </div>
        <p id="majd_team_gallery_empty" class="description"<?php echo $items ? ' style="display:none"' : ''; ?>>هنوز تصویری انتخاب نشده است.</p>
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

        if (isset($_POST['majd_team_gallery_present'])) {
            update_post_meta($post_id, MAJD_TEAM_META_GALLERY, self::sanitize_gallery_from_request());
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
        if ($hook !== 'post.php' && $hook !== 'post-new.php') {
            return;
        }

        $screen = function_exists('get_current_screen') ? get_current_screen() : null;
        $post_type = $screen && !empty($screen->post_type)
            ? $screen->post_type
            : (isset($GLOBALS['post_type']) ? (string) $GLOBALS['post_type'] : '');

        if ($post_type !== MAJD_TEAM_POST_TYPE) {
            return;
        }

        wp_enqueue_media();

        // Gutenberg injects classic meta boxes after document.ready and often
        // never prints a jquery tag, so bind on document and attach after wp.media.
        $js = <<<'JS'
(function () {
    if (typeof wp === 'undefined' || !wp.media) {
        return;
    }

    var bannerFrame;
    var videoFrame;
    var galleryFrame;
    var galleryDragItem;

    document.addEventListener('click', function (event) {
        var target = event.target;
        if (!target || !target.closest) {
            return;
        }

        if (target.closest('#majd_team_banner_select')) {
            event.preventDefault();
            openBannerFrame();
            return;
        }

        if (target.closest('#majd_team_banner_remove')) {
            event.preventDefault();
            var idInput = document.getElementById('majd_team_banner_id');
            var preview = document.getElementById('majd_team_banner_preview');
            var removeBtn = document.getElementById('majd_team_banner_remove');
            if (idInput) {
                idInput.value = '';
            }
            if (preview) {
                preview.innerHTML = '';
            }
            if (removeBtn) {
                removeBtn.style.display = 'none';
            }
            return;
        }

        if (target.closest('#majd_team_videos_select')) {
            event.preventDefault();
            openVideoFrame();
            return;
        }

        if (target.closest('#majd_team_gallery_select')) {
            event.preventDefault();
            openGalleryFrame();
            return;
        }

        var removeGallery = target.closest('.majd-team-gallery-remove');
        if (removeGallery) {
            event.preventDefault();
            var galleryItem = removeGallery.closest('.majd-team-gallery-item');
            if (galleryItem) {
                galleryItem.remove();
            }
            syncGalleryEmpty();
        }
    });

    document.addEventListener('dragstart', function (event) {
        var thumb = event.target && event.target.closest ? event.target.closest('.majd-team-gallery-thumb') : null;
        if (!thumb) {
            return;
        }
        galleryDragItem = thumb.closest('.majd-team-gallery-item');
        if (!galleryDragItem) {
            return;
        }
        galleryDragItem.classList.add('is-dragging');
        if (event.dataTransfer) {
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setData('text/plain', 'gallery');
        }
    });

    document.addEventListener('dragend', function () {
        if (galleryDragItem) {
            galleryDragItem.classList.remove('is-dragging');
        }
        galleryDragItem = null;
    });

    document.addEventListener('dragover', function (event) {
        if (!galleryDragItem) {
            return;
        }
        var list = document.getElementById('majd_team_gallery_list');
        if (!list || !event.target || !list.contains(event.target)) {
            return;
        }
        event.preventDefault();
        var over = event.target.closest ? event.target.closest('.majd-team-gallery-item') : null;
        if (!over || over === galleryDragItem || !list.contains(over)) {
            return;
        }
        var rect = over.getBoundingClientRect();
        var before = event.clientX < rect.left + rect.width / 2;
        var rtl = getComputedStyle(list).direction === 'rtl';
        if (rtl) {
            before = !before;
        }
        list.insertBefore(galleryDragItem, before ? over : over.nextSibling);
    });

    function openBannerFrame() {
        if (bannerFrame) {
            bannerFrame.open();
            return;
        }

        bannerFrame = wp.media({
            title: 'انتخاب بنر',
            button: { text: 'استفاده' },
            library: { type: 'image' },
            multiple: false
        });

        bannerFrame.on('select', function () {
            var attachment = bannerFrame.state().get('selection').first().toJSON();
            var idInput = document.getElementById('majd_team_banner_id');
            var preview = document.getElementById('majd_team_banner_preview');
            var removeBtn = document.getElementById('majd_team_banner_remove');
            if (idInput) {
                idInput.value = String(attachment.id || '');
            }
            if (preview) {
                preview.innerHTML = '<img src="' + String(attachment.url || '').replace(/"/g, '&quot;') + '" alt="" style="max-width:100%;height:auto;border-radius:8px" />';
            }
            if (removeBtn) {
                removeBtn.style.display = '';
            }
        });

        bannerFrame.open();
    }

    function openGalleryFrame() {
        if (galleryFrame) {
            galleryFrame.open();
            return;
        }

        galleryFrame = wp.media({
            title: 'انتخاب تصاویر گالری',
            button: { text: 'افزودن به گالری' },
            library: { type: 'image' },
            multiple: true
        });

        galleryFrame.on('select', function () {
            var selection = galleryFrame.state().get('selection');
            if (!selection) {
                return;
            }

            selection.each(function (att) {
                var image = att.toJSON();
                if (!image.id || !image.url) {
                    return;
                }
                if (document.querySelector('.majd-team-gallery-item[data-id="' + image.id + '"]')) {
                    return;
                }
                var preview = (image.sizes && image.sizes.medium && image.sizes.medium.url)
                    ? image.sizes.medium.url
                    : image.url;
                appendGalleryItem({
                    id: image.id,
                    src: '',
                    preview: preview,
                    alt: image.alt || ''
                });
            });
            syncGalleryEmpty();
        });

        galleryFrame.open();
    }

    function appendGalleryItem(item) {
        var list = document.getElementById('majd_team_gallery_list');
        if (!list) {
            return;
        }

        var card = document.createElement('div');
        card.className = 'majd-team-gallery-item';
        if (item.id) {
            card.setAttribute('data-id', String(item.id));
        }

        var thumb = document.createElement('div');
        thumb.className = 'majd-team-gallery-thumb';
        thumb.draggable = true;

        var img = document.createElement('img');
        img.src = item.preview || item.src || '';
        img.alt = '';
        thumb.appendChild(img);

        var idInput = document.createElement('input');
        idInput.type = 'hidden';
        idInput.name = 'majd_team_gallery_item_id[]';
        idInput.value = item.id ? String(item.id) : '0';

        var srcInput = document.createElement('input');
        srcInput.type = 'hidden';
        srcInput.name = 'majd_team_gallery_item_src[]';
        srcInput.value = item.src || '';

        var altInput = document.createElement('input');
        altInput.type = 'text';
        altInput.name = 'majd_team_gallery_item_alt[]';
        altInput.value = item.alt || '';
        altInput.placeholder = 'متن جایگزین';

        var removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'button-link-delete majd-team-gallery-remove';
        removeBtn.textContent = 'حذف';

        card.appendChild(thumb);
        card.appendChild(idInput);
        card.appendChild(srcInput);
        card.appendChild(altInput);
        card.appendChild(removeBtn);
        list.appendChild(card);
    }

    function syncGalleryEmpty() {
        var list = document.getElementById('majd_team_gallery_list');
        var empty = document.getElementById('majd_team_gallery_empty');
        if (!list || !empty) {
            return;
        }
        empty.style.display = list.querySelector('.majd-team-gallery-item') ? 'none' : '';
    }

    function openVideoFrame() {
        if (videoFrame) {
            videoFrame.open();
            return;
        }

        var frameOptions = {
            title: 'انتخاب ویدیو',
            button: { text: 'افزودن به گالری' },
            multiple: true,
            library: { type: 'video' }
        };

        if (wp.media.controller && wp.media.controller.Library && typeof wp.media.query === 'function') {
            frameOptions = {
                button: { text: 'افزودن به گالری' },
                states: [
                    new wp.media.controller.Library({
                        id: 'majd-team-videos',
                        title: 'انتخاب ویدیو',
                        priority: 20,
                        library: wp.media.query({ type: 'video' }),
                        multiple: true,
                        editable: false
                    })
                ]
            };
        }

        videoFrame = wp.media(frameOptions);

        videoFrame.on('select', function () {
            var selection = videoFrame.state().get('selection');
            if (!selection) {
                return;
            }

            var lines = [];
            selection.each(function (att) {
                var a = att.toJSON();
                if (!a.url) {
                    return;
                }
                var title = a.title || '';
                var poster = (a.image && a.image.src) ? a.image.src : '';
                var parts = [a.url];
                if (title || poster) {
                    parts.push(title);
                }
                if (poster) {
                    parts.push(poster);
                }
                lines.push(parts.join(' | '));
            });

            var textarea = document.getElementById('majd_team_videos');
            if (!textarea || !lines.length) {
                return;
            }

            var existing = String(textarea.value || '').replace(/^\s+|\s+$/g, '');
            textarea.value = existing ? existing + '\n' + lines.join('\n') : lines.join('\n');
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        });

        videoFrame.open();
    }
})();
JS;

        wp_add_inline_script('media-editor', $js);
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

    private static function sanitize_gallery_from_request() {
        $ids = isset($_POST['majd_team_gallery_item_id']) ? (array) wp_unslash($_POST['majd_team_gallery_item_id']) : [];
        $srcs = isset($_POST['majd_team_gallery_item_src']) ? (array) wp_unslash($_POST['majd_team_gallery_item_src']) : [];
        $alts = isset($_POST['majd_team_gallery_item_alt']) ? (array) wp_unslash($_POST['majd_team_gallery_item_alt']) : [];
        $count = max(count($ids), count($srcs), count($alts));
        $stored = [];
        $seen_ids = [];
        $seen_srcs = [];

        for ($i = 0; $i < $count; $i++) {
            $id = absint($ids[$i] ?? 0);
            $src = esc_url_raw((string) ($srcs[$i] ?? ''));
            $alt = sanitize_text_field((string) ($alts[$i] ?? ''));

            if ($id && wp_attachment_is_image($id)) {
                if (isset($seen_ids[$id])) {
                    continue;
                }
                $seen_ids[$id] = true;
                $row = ['id' => $id];
                if ($alt !== '') {
                    $row['alt'] = $alt;
                }
                $stored[] = $row;
                continue;
            }

            if ($src === '' || isset($seen_srcs[$src])) {
                continue;
            }
            $seen_srcs[$src] = true;
            $stored[] = [
                'src' => $src,
                'alt' => $alt,
            ];
        }

        if (!$stored) {
            return '';
        }

        return wp_json_encode($stored, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    private static function gallery_entries($raw) {
        if (!is_string($raw) || trim($raw) === '') {
            return [];
        }

        $decoded = json_decode(trim($raw), true);
        if (is_array($decoded) && self::is_gallery_json($decoded)) {
            return $decoded;
        }

        $entries = [];
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

            $entries[] = [
                'src' => $src,
                'alt' => $parts[1] ?? '',
            ];
        }

        return $entries;
    }

    private static function is_gallery_json($decoded) {
        foreach ($decoded as $key => $entry) {
            if (!is_int($key) || !is_array($entry)) {
                return false;
            }
            if (!array_key_exists('id', $entry) && !array_key_exists('src', $entry)) {
                return false;
            }
        }
        return true;
    }

    private static function gallery_editor_items($raw) {
        $items = [];
        foreach (self::gallery_entries($raw) as $entry) {
            $id = isset($entry['id']) ? (int) $entry['id'] : 0;
            $src = isset($entry['src']) ? trim((string) $entry['src']) : '';
            $alt = isset($entry['alt']) ? (string) $entry['alt'] : '';

            if (!$id && $src !== '') {
                $id = self::attachment_id_from_url($src);
                if ($id) {
                    $src = '';
                }
            }

            if ($id && wp_attachment_is_image($id)) {
                $preview = wp_get_attachment_image_url($id, 'medium');
                if (!$preview) {
                    $preview = self::attachment_url($id);
                }
                if (!$preview) {
                    continue;
                }
                if ($alt === '') {
                    $alt = (string) get_post_meta($id, '_wp_attachment_image_alt', true);
                }
                $items[] = [
                    'id' => $id,
                    'src' => '',
                    'preview' => $preview,
                    'alt' => $alt,
                ];
                continue;
            }

            if ($src === '') {
                continue;
            }

            $items[] = [
                'id' => 0,
                'src' => $src,
                'preview' => $src,
                'alt' => $alt,
            ];
        }

        return $items;
    }

    private static function gallery_public_item($entry) {
        if (!is_array($entry)) {
            return null;
        }

        $alt = isset($entry['alt']) ? trim((string) $entry['alt']) : '';
        $id = isset($entry['id']) ? (int) $entry['id'] : 0;
        if ($id) {
            $src = self::attachment_url($id);
            if ($src === '') {
                return null;
            }
            if ($alt === '') {
                $alt = trim((string) get_post_meta($id, '_wp_attachment_image_alt', true));
            }
            return [
                'src' => $src,
                'alt' => $alt,
            ];
        }

        $src = isset($entry['src']) ? trim((string) $entry['src']) : '';
        if ($src === '') {
            return null;
        }

        return [
            'src' => $src,
            'alt' => $alt,
        ];
    }

    private static function decode_gallery($raw) {
        $items = [];
        foreach (self::gallery_entries($raw) as $entry) {
            $item = self::gallery_public_item($entry);
            if ($item) {
                $items[] = $item;
            }
        }
        return $items;
    }

    private static function attachment_id_from_url($url) {
        if (!function_exists('attachment_url_to_postid') || $url === '') {
            return 0;
        }

        $id = (int) attachment_url_to_postid($url);
        if ($id) {
            return $id;
        }

        $stripped = preg_replace('/-\d+x\d+(?=\.[^.]+$)/', '', $url);
        if (is_string($stripped) && $stripped !== $url) {
            return (int) attachment_url_to_postid($stripped);
        }

        return 0;
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
