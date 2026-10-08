<?php
/**
 * Plugin Name: Majd Pillar Landings
 * Description: Service landing hubs and their sub-landings (separate from blog posts), with a dedicated REST API for the Next.js frontend.
 * Install: copy to wp-content/mu-plugins/wordpress-majd-landing-api.php
 */

if (!defined('ABSPATH')) {
    exit;
}

define('MAJD_LANDING_POST_TYPE', 'majd_landing');
define('MAJD_LANDING_META_KEYWORDS', '_majd_landing_keywords');
define('MAJD_LANDING_META_HERO', '_majd_landing_hero');
define('MAJD_LANDING_META_MENU_LABEL', '_majd_landing_menu_label');
define('MAJD_LANDING_META_ICON', '_majd_landing_icon');
define('MAJD_LANDING_META_CTA_PHONE', '_majd_landing_cta_phone');
define('MAJD_SUBLANDING_POST_TYPE', 'majd_sublanding');
define('MAJD_SUBLANDING_META_HUB', '_majd_sublanding_hub_id');
define('MAJD_SUBLANDING_META_ICON', '_majd_sublanding_icon');
define('MAJD_SUBLANDING_META_DESCRIPTION', '_majd_sublanding_description');
define('MAJD_SUBLANDING_META_CTA_PHONE', '_majd_sublanding_cta_phone');
define('MAJD_SUBLANDING_META_HEADLINE', '_majd_sublanding_headline');
define('MAJD_SUBLANDING_META_KEYWORDS', '_majd_sublanding_keywords');

class Majd_Landing_API {
    public static function init() {
        add_action('init', [__CLASS__, 'register_post_type']);
        add_action('init', [__CLASS__, 'register_meta']);
        add_action('init', [__CLASS__, 'maybe_seed'], 30);
        add_action('rest_api_init', [__CLASS__, 'register_rest_fields']);
        add_action('add_meta_boxes', [__CLASS__, 'add_meta_boxes']);
        add_action('save_post_' . MAJD_LANDING_POST_TYPE, [__CLASS__, 'save_meta'], 10, 2);
        add_filter('manage_' . MAJD_LANDING_POST_TYPE . '_posts_columns', [__CLASS__, 'list_columns']);
        add_action('manage_' . MAJD_LANDING_POST_TYPE . '_posts_custom_column', [__CLASS__, 'render_list_column'], 10, 2);
    }

    public static function register_post_type() {
        register_post_type(MAJD_LANDING_POST_TYPE, [
            'labels' => [
                'name' => 'لندینگ‌های اصلی',
                'singular_name' => 'لندینگ اصلی',
                'menu_name' => 'لندینگ خدمات',
                'add_new' => 'افزودن لندینگ',
                'add_new_item' => 'افزودن لندینگ اصلی',
                'edit_item' => 'ویرایش لندینگ',
                'new_item' => 'لندینگ جدید',
                'view_item' => 'مشاهده',
                'search_items' => 'جستجوی لندینگ',
                'not_found' => 'لندینگی یافت نشد',
                'not_found_in_trash' => 'لندینگی در زباله‌دان نیست',
                'featured_image' => 'تصویر هیرو',
                'set_featured_image' => 'انتخاب تصویر هیرو',
                'remove_featured_image' => 'حذف تصویر هیرو',
            ],
            'public' => true,
            'publicly_queryable' => false,
            'exclude_from_search' => true,
            'show_ui' => true,
            'show_in_menu' => true,
            'show_in_nav_menus' => false,
            'menu_position' => 20,
            'menu_icon' => 'dashicons-welcome-write-blog',
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'has_archive' => false,
            'rewrite' => false,
            'query_var' => false,
            'show_in_rest' => true,
            'rest_base' => 'landings',
            'supports' => [
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'page-attributes',
                'revisions',
            ],
        ]);
    }

    public static function register_meta() {
        register_post_meta(MAJD_LANDING_POST_TYPE, MAJD_LANDING_META_KEYWORDS, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
        register_post_meta(MAJD_LANDING_POST_TYPE, MAJD_LANDING_META_HERO, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
        register_post_meta(MAJD_LANDING_POST_TYPE, MAJD_LANDING_META_MENU_LABEL, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
        register_post_meta(MAJD_LANDING_POST_TYPE, MAJD_LANDING_META_ICON, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
        register_post_meta(MAJD_LANDING_POST_TYPE, MAJD_LANDING_META_CTA_PHONE, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => true,
            'auth_callback' => '__return_true',
        ]);
    }

    public static function register_rest_fields() {
        register_rest_field(MAJD_LANDING_POST_TYPE, 'majd_landing', [
            'get_callback' => function ($post) {
                $keywords = get_post_meta($post['id'], MAJD_LANDING_META_KEYWORDS, true);
                $hero = get_post_meta($post['id'], MAJD_LANDING_META_HERO, true);
                $phone = get_post_meta($post['id'], MAJD_LANDING_META_CTA_PHONE, true);
                $parts = array_values(array_filter(array_map('trim', preg_split('/[,،]+/u', (string) $keywords) ?: [])));
                return [
                    'keywords' => $parts,
                    'heroDescription' => is_string($hero) ? $hero : '',
                    'ctaPhone' => Majd_Service_Landings::sanitize_phone(is_string($phone) ? $phone : ''),
                ];
            },
            'schema' => [
                'description' => 'Majd landing extras',
                'type' => 'object',
            ],
        ]);
    }

    public static function add_meta_boxes() {
        add_meta_box(
            'majd_landing_guide',
            'ساختار محتوا و شناسه صفحه',
            [__CLASS__, 'render_guide_box'],
            MAJD_LANDING_POST_TYPE,
            'side',
            'high'
        );
        add_meta_box(
            'majd_landing_description',
            'توضیحات هیرو',
            [__CLASS__, 'render_description_box'],
            MAJD_LANDING_POST_TYPE,
            'normal',
            'high'
        );
        add_meta_box(
            'majd_landing_cta_phone',
            'تماس با وکیل این پرونده',
            [__CLASS__, 'render_cta_phone_box'],
            MAJD_LANDING_POST_TYPE,
            'normal',
            'high'
        );
        add_meta_box(
            'majd_landing_seo',
            'سئو لندینگ',
            [__CLASS__, 'render_seo_box'],
            MAJD_LANDING_POST_TYPE,
            'normal',
            'default'
        );
    }

    public static function render_guide_box($post) {
        $slug = $post->post_name ?: '(هنوز ذخیره نشده)';
        echo '<p><strong>نامک، آدرس صفحه در سایت است:</strong> <code>/' . esc_html($slug) . '/</code></p>';
        echo '<p>لندینگ جدید با هر نامک لاتین اضافه می‌شود و در منوی خدمات ظاهر می‌شود. نمونه‌های فعلی:</p>';
        echo '<ul style="margin:0 1rem 1rem;list-style:disc">';
        foreach (self::landing_slugs() as $item) {
            echo '<li><code>' . esc_html($item) . '</code></li>';
        }
        echo '<li><code>legal-consultation</code></li>';
        echo '</ul>';
        echo '<p style="color:#555">از این نامک‌ها استفاده نکنید: <code>blogs</code>، <code>team</code>، <code>about</code>، <code>contact</code>، <code>services</code>.</p>';
        echo '<p style="color:#555">عنوان = H1 صفحه<br>چکیده = توضیح هیرو / متا<br>ترتیب (ویژگی‌های برگه) = جای ستون در منو<br>زیرلندینگ‌ها را از منوی «زیرلندینگ‌ها» به این لندینگ وصل کنید، نه از نوشته‌های وبلاگ.</p>';
        echo '<p style="color:#555">محتوا را مثل مقاله با تیتر ۲ و ۳ بنویسید:</p>';
        echo '<ol style="margin:0 1rem;color:#444">';
        echo '<li><strong>H2</strong> خدمات تخصصی… + ۲–۳ پاراگراف معرفی</li>';
        echo '<li>کارت‌های قابل کلیک را اینجا ننویسید؛ از «زیرلندینگ‌ها» اضافه کنید</li>';
        echo '<li><strong>H2</strong> بخش‌های بعدی (چرا وکیل، دادگاه، مراحل، چرا مجد)</li>';
        echo '<li><strong>H3</strong> زیربخش‌های «چرا مجد»</li>';
        echo '<li><strong>H2</strong> سوالات متداول + H3 سؤال و پاراگراف جواب</li>';
        echo '<li><strong>H2</strong> همین حالا… (دعوت به تماس)</li>';
        echo '</ol>';
    }

    public static function render_description_box($post) {
        $hero = (string) get_post_meta($post->ID, MAJD_LANDING_META_HERO, true);
        echo '<p class="description">این متن زیر عنوان، در هیروی صفحه لندینگ نشان داده می‌شود.</p>';
        echo '<textarea name="majd_landing_hero" rows="5" class="large-text">' . esc_textarea($hero) . '</textarea>';
    }

    public static function render_cta_phone_box($post) {
        $phone = (string) get_post_meta($post->ID, MAJD_LANDING_META_CTA_PHONE, true);
        echo '<p class="description">شماره دکمه‌های تماس همین لندینگ. زیرلندینگی که شماره جدا ندارد همین شماره را روی دکمه «تماس با وکیل این پرونده» نشان می‌دهد.</p>';
        echo '<p><label for="majd_landing_cta_phone"><strong>شماره تماس</strong></label></p>';
        echo '<input type="text" name="majd_landing_cta_phone" id="majd_landing_cta_phone" class="widefat" dir="ltr" value="' . esc_attr($phone) . '" placeholder="02177886437" />';
        echo '<p class="description">خالی = شماره پیش‌فرض سایت. مثال: <code>02177886437</code> یا <code>09121234567</code>.</p>';
    }

    public static function render_seo_box($post) {
        wp_nonce_field('majd_landing_save', 'majd_landing_nonce');
        $keywords = get_post_meta($post->ID, MAJD_LANDING_META_KEYWORDS, true);
        $menu_label = get_post_meta($post->ID, MAJD_LANDING_META_MENU_LABEL, true);
        $icon = get_post_meta($post->ID, MAJD_LANDING_META_ICON, true);
        $slug = (string) $post->post_name;
        echo '<p><label for="majd_landing_slug"><strong>نامک (slug)</strong></label></p>';
        echo '<input type="text" name="majd_landing_slug" id="majd_landing_slug" class="large-text" dir="ltr" value="' . esc_attr($slug) . '" placeholder="family-lawyer" />';
        echo '<p class="description">آدرس صفحه: <code>/' . esc_html($slug !== '' ? $slug : 'slug') . '/</code> — فقط حروف انگلیسی، عدد و خط تیره.</p>';
        echo '<p><label>برچسب منوی خدمات (کوتاه)</label></p>';
        echo '<input type="text" name="majd_landing_menu_label" class="large-text" value="' . esc_attr((string) $menu_label) . '" />';
        echo '<p><label>آیکون (<code>scale</code>، <code>gavel</code>، <code>heart</code>، <code>building</code>، <code>coins</code>، <code>chat</code>)</label></p>';
        echo '<input type="text" name="majd_landing_icon" class="large-text" value="' . esc_attr((string) $icon) . '" />';
        echo '<p><label>کلمات کلیدی (با ویرگول جدا کنید)</label></p>';
        echo '<textarea name="majd_landing_keywords" rows="3" class="large-text">' . esc_textarea((string) $keywords) . '</textarea>';
    }

    public static function save_meta($post_id) {
        if (!isset($_POST['majd_landing_nonce']) || !wp_verify_nonce($_POST['majd_landing_nonce'], 'majd_landing_save')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        if (isset($_POST['majd_landing_keywords'])) {
            update_post_meta($post_id, MAJD_LANDING_META_KEYWORDS, sanitize_textarea_field(wp_unslash($_POST['majd_landing_keywords'])));
        }
        if (isset($_POST['majd_landing_hero'])) {
            update_post_meta($post_id, MAJD_LANDING_META_HERO, Majd_Service_Landings::plain_text(wp_unslash($_POST['majd_landing_hero'])));
        }
        if (isset($_POST['majd_landing_menu_label'])) {
            update_post_meta($post_id, MAJD_LANDING_META_MENU_LABEL, sanitize_text_field(wp_unslash($_POST['majd_landing_menu_label'])));
        }
        if (isset($_POST['majd_landing_icon'])) {
            update_post_meta($post_id, MAJD_LANDING_META_ICON, Majd_Service_Landings::sanitize_icon(wp_unslash($_POST['majd_landing_icon'])));
        }
        if (isset($_POST['majd_landing_cta_phone'])) {
            update_post_meta(
                $post_id,
                MAJD_LANDING_META_CTA_PHONE,
                Majd_Service_Landings::sanitize_phone(wp_unslash($_POST['majd_landing_cta_phone']))
            );
        }
        if (isset($_POST['majd_landing_slug'])) {
            Majd_Service_Landings::assign_slug($post_id, wp_unslash($_POST['majd_landing_slug']), [__CLASS__, 'save_meta']);
        }
    }

    public static function list_columns($columns) {
        $columns['majd_slug'] = 'نامک / مسیر سایت';
        return $columns;
    }

    public static function render_list_column($column, $post_id) {
        if ($column !== 'majd_slug') {
            return;
        }
        $slug = get_post_field('post_name', $post_id);
        echo '<code>/' . esc_html($slug) . '/</code>';
    }

    public static function landing_slugs() {
        return [
            'family-lawyer',
            'property-lawyer',
            'criminal-defense-lawyer',
            'administrative-lawyer',
        ];
    }

    public static function maybe_seed() {
        if (get_option('majd_landings_seeded_v1')) {
            return;
        }
        foreach (self::seed_items() as $item) {
            $exists = get_posts([
                'post_type' => MAJD_LANDING_POST_TYPE,
                'name' => $item['slug'],
                'post_status' => 'any',
                'numberposts' => 1,
                'fields' => 'ids',
            ]);
            if ($exists) {
                continue;
            }
            $id = wp_insert_post([
                'post_type' => MAJD_LANDING_POST_TYPE,
                'post_status' => 'publish',
                'post_title' => $item['title'],
                'post_name' => $item['slug'],
                'post_excerpt' => $item['excerpt'],
                'post_content' => $item['content'],
            ], true);
            if (is_wp_error($id) || !$id) {
                continue;
            }
            if (!empty($item['keywords'])) {
                update_post_meta($id, MAJD_LANDING_META_KEYWORDS, $item['keywords']);
            }
            if (!empty($item['hero'])) {
                update_post_meta($id, MAJD_LANDING_META_HERO, $item['hero']);
            }
        }
        update_option('majd_landings_seeded_v1', '1');
    }

    private static function h2($title, $paragraphs = [], $h3s = []) {
        $html = '<h2>' . esc_html($title) . '</h2>';
        foreach ($paragraphs as $p) {
            $html .= '<p>' . esc_html($p) . '</p>';
        }
        foreach ($h3s as $item) {
            $html .= '<h3>' . esc_html($item['title']) . '</h3>';
            $html .= '<p>' . esc_html($item['p']) . '</p>';
        }
        return $html;
    }

    private static function seed_items() {
        return [
            [
                'slug' => 'family-lawyer',
                'title' => 'بهترین وکلای حوزه خانواده، مشاوره و وکالت تخصصی در تمام دعاوی خانواده',
                'excerpt' => 'موسسه حقوقی مجد وکیل الرعایا خدمات تخصصی وکیل خانواده را در طلاق، مهریه، نفقه، حضانت، تمکین و اجرت‌المثل ارائه می‌دهد. مشاوره رایگان اولیه، تلفنی و آنلاین.',
                'hero' => 'مشاوره حقوقی خانواده و پیگیری تخصصی طلاق، مهریه، نفقه، حضانت، تمکین و اجرت‌المثل در دادگاه خانواده.',
                'keywords' => 'وکیل خانواده، بهترین وکیل خانواده تهران، مشاوره حقوقی خانواده، دعاوی خانواده، وکیل دعاوی خانواده، وکیل خانواده آنلاین، وکیل خانواده تهرانپارس، وکیل خانواده غرب تهران، وکیل خانواده شرق تهران، وکیل خانواده در شمال تهران، وکیل خانواده در جنوب تهران، وکیل خانواده با مشاوره رایگان، وکیل خانواده تلفنی و آنلاین',
                'content' =>
                    self::h2('خدمات تخصصی ما در حوزه حقوق خانواده', [
                        'دعاوی خانواده از جمله مهم‌ترین پرونده‌های حقوقی هستند که به دلیل ارتباط مستقیم با زندگی شخصی، حقوق مالی و روابط میان اعضای خانواده، نیازمند بررسی دقیق و تخصصی هستند. موضوعاتی مانند طلاق، مهریه، نفقه، حضانت فرزند، تمکین، اجرت‌المثل و سایر اختلافات خانوادگی، هرکدام قوانین، شرایط و تشریفات خاص خود را دارند. به همین دلیل، پیش از هرگونه اقدام قضایی، شناخت حقوق قانونی و انتخاب مسیر مناسب اهمیت زیادی دارد.',
                        'موسسه حقوقی مجد وکیل الرعایا با ارائه خدمات تخصصی در حوزه حقوق خانواده، امکان دریافت مشاوره حقوقی خانواده و پیگیری انواع دعاوی خانواده را فراهم کرده است. در هر پرونده، شرایط و مستندات موجود بررسی می‌شود تا متناسب با موضوع، راهکار حقوقی مناسب به مراجعه‌کننده ارائه شود.',
                        'در پرونده‌های خانوادگی ممکن است یک تصمیم نادرست یا اقدام بدون آگاهی کافی، روند رسیدگی را پیچیده‌تر کند. استفاده از خدمات وکیل خانواده می‌تواند به افراد کمک کند تا با آگاهی بیشتری نسبت به حقوق و تعهدات خود اقدام کرده و مراحل قانونی پرونده را اصولی‌تر دنبال کنند.',
                    ], [
                        ['title' => 'وکیل طلاق', 'p' => 'در پرونده‌های طلاق، بررسی شرایط قانونی، حقوق مالی زوجین، مهریه، نفقه، حضانت فرزند و سایر مسائل مرتبط اهمیت دارد. وکیل متخصص طلاق می‌تواند متناسب با نوع طلاق، از جمله طلاق توافقی یا طلاق یک‌طرفه، مسیر قانونی مناسب را بررسی و پیگیری کند.'],
                        ['title' => 'وکیل مهریه', 'p' => 'مطالبه و وصول مهریه، نحوه طرح دعوا، پیگیری اجرایی و بررسی اموال زوج از موضوعات مهم در پرونده‌های مهریه است. وکیل مهریه با بررسی شرایط پرونده می‌تواند راهکار مناسب برای پیگیری حقوق مالی زوجه یا دفاع از حقوق زوج را ارائه دهد.'],
                        ['title' => 'وکیل نفقه', 'p' => 'نفقه یکی از حقوق مالی زوجه است و شرایط مطالبه آن تابع مقررات قانونی است. بررسی استحقاق نفقه، میزان آن، نحوه مطالبه و دفاع در دعاوی مرتبط با نفقه از جمله خدمات تخصصی حوزه خانواده محسوب می‌شود.'],
                        ['title' => 'وکیل حضانت و ملاقات فرزند', 'p' => 'دعاوی مربوط به حضانت و ملاقات فرزند از حساس‌ترین پرونده‌های خانوادگی هستند. در این پرونده‌ها شرایط والدین، سن فرزند و مصلحت طفل از اهمیت ویژه‌ای برخوردار است و بررسی دقیق وضعیت پرونده برای انتخاب مسیر قانونی مناسب ضروری است.'],
                        ['title' => 'وکیل تمکین و نشوز', 'p' => 'دعاوی تمکین و نشوز از جمله اختلافات حقوقی میان زوجین هستند که آثار مالی و حقوقی مختلفی به دنبال دارند. بررسی شرایط زندگی مشترک، دلایل مطرح‌شده از سوی طرفین و مستندات موجود، در نحوه دفاع یا طرح دعوا اهمیت دارد.'],
                        ['title' => 'وکیل اجرت‌المثل و نحله', 'p' => 'اجرت‌المثل ایام زوجیت و نحله از موضوعات مالی مرتبط با پایان زندگی مشترک هستند که شرایط و مبنای قانونی متفاوتی دارند. بررسی وضعیت پرونده و شرایط انجام امور در دوران زندگی مشترک می‌تواند در پیگیری حقوق قانونی زوجه مؤثر باشد.'],
                    ])
                    . self::h2('چرا برای دعاوی خانواده به وکیل نیاز داریم؟', [
                        'پرونده‌های خانوادگی معمولاً تنها به یک موضوع محدود نمی‌شوند و ممکن است هم‌زمان مسائل مختلفی مانند طلاق، مهریه، نفقه، حضانت و سایر حقوق مالی و غیرمالی مطرح باشد. آگاهی نداشتن از قوانین و تشریفات دادرسی ممکن است باعث شود فرد در زمان نامناسب اقدام کند یا بخشی از حقوق قانونی خود را نادیده بگیرد.',
                        'وکیل دعاوی خانواده با بررسی اسناد، شرایط طرفین و موضوع پرونده می‌تواند مسیر قانونی مناسب را مشخص کند، در تنظیم دادخواست و لوایح کمک کند و روند پیگیری پرونده را تا حد امکان منظم و هدفمند پیش ببرد.',
                        'البته انتخاب وکیل باید بر اساس موضوع پرونده، تخصص و تجربه او در حوزه خانواده و توانایی ارائه راهکار متناسب با شرایط واقعی پرونده انجام شود.',
                    ])
                    . self::h2('دادگاه خانواده و صلاحیت آن چیست؟', [
                        'دادگاه خانواده مرجع تخصصی رسیدگی به بخش مهمی از اختلافات و دعاوی خانوادگی است. موضوعاتی مانند نکاح، طلاق، مهریه، نفقه، اجرت‌المثل، حضانت و ملاقات فرزند و برخی دیگر از دعاوی مرتبط با روابط خانوادگی، مطابق قانون در صلاحیت دادگاه خانواده قرار می‌گیرند.',
                        'تعیین مرجع صالح، محل طرح دعوا و رعایت تشریفات قانونی از مراحل مهم شروع یک پرونده است. به همین دلیل، پیش از ثبت دادخواست بهتر است شرایط پرونده و مرجع صالح برای رسیدگی بررسی شود.',
                    ])
                    . self::h2('مراحل کلی رسیدگی به یک پرونده خانواده', [
                        'اگرچه روند رسیدگی با توجه به نوع دعوا متفاوت است، اما معمولاً پرونده‌های خانوادگی با بررسی موضوع و مدارک، تعیین مرجع صالح، تنظیم و ثبت دادخواست یا درخواست قانونی، پرداخت هزینه‌های مربوط، ابلاغ به طرف مقابل و تعیین وقت رسیدگی آغاز می‌شوند.',
                        'پس از تشکیل جلسه یا جلسات رسیدگی، دادگاه مدارک و دفاعیات طرفین را بررسی کرده و در صورت نیاز اقدامات قانونی مانند ارجاع به کارشناسی یا انجام تحقیقات لازم را انجام می‌دهد. در نهایت، رأی صادر می‌شود و در صورت وجود شرایط قانونی، امکان اعتراض و پیگیری در مراحل بالاتر نیز وجود خواهد داشت.',
                    ])
                    . self::h2('چرا موسسه حقوقی مجد وکیل الرعایا؟', [
                        'انتخاب یک مجموعه حقوقی برای پیگیری پرونده‌های خانوادگی باید با توجه به تخصص، تجربه، نحوه بررسی پرونده و کیفیت مشاوره حقوقی انجام شود. موسسه حقوقی مجد وکیل الرعایا با تمرکز بر ارائه خدمات حقوقی تخصصی، تلاش می‌کند پیش از هر اقدام، شرایط پرونده و نیازهای مراجعه‌کننده را به‌صورت دقیق بررسی کند.',
                    ], [
                        ['title' => 'تیم تخصصی و سابقه پرونده‌های موفق', 'p' => 'یکی از مهم‌ترین عوامل در پیگیری پرونده‌های خانواده، شناخت دقیق قوانین و تجربه در مواجهه با مسائل مختلف این حوزه است. تیم حقوقی موسسه با بهره‌گیری از ظرفیت وکلای متخصص، پرونده‌های خانوادگی را متناسب با موضوع و شرایط هر مراجعه‌کننده بررسی کرده و برای انتخاب مسیر حقوقی مناسب راهنمایی لازم را ارائه می‌دهد.'],
                        ['title' => 'مشاوره رایگان اولیه', 'p' => 'در بسیاری از پرونده‌های خانوادگی، مراجعه‌کننده پیش از شروع دعوا نیاز دارد بداند چه حقوقی دارد، چه مدارکی لازم است و بهترین مسیر برای پیگیری موضوع چیست. ارائه مشاوره رایگان اولیه می‌تواند به فرد کمک کند تا پیش از تصمیم‌گیری، تصویر روشن‌تری از شرایط پرونده و اقدامات احتمالی داشته باشد. برای افرادی که امکان مراجعه حضوری ندارند نیز امکان استفاده از خدمات وکیل خانواده آنلاین و وکیل خانواده تلفنی و آنلاین، متناسب با شرایط و موضوع پرونده، فراهم است.'],
                    ])
                    . self::h2('سوالات متداول درباره وکیل خانواده', [], [
                        ['title' => 'وکیل خانواده چه پرونده‌هایی را پیگیری می‌کند؟', 'p' => 'وکیل خانواده می‌تواند در موضوعاتی مانند طلاق، طلاق توافقی، مهریه، نفقه، حضانت و ملاقات فرزند، تمکین، نشوز، اجرت‌المثل، نحله و سایر دعاوی مرتبط با حقوق خانواده به موکلان مشاوره و خدمات حقوقی ارائه دهد.'],
                        ['title' => 'چگونه بهترین وکیل خانواده تهران را انتخاب کنیم؟', 'p' => 'برای انتخاب بهترین وکیل خانواده تهران بهتر است تخصص وکیل در حوزه خانواده، تجربه او در پرونده‌های مشابه، نحوه بررسی پرونده و کیفیت مشاوره حقوقی را در نظر بگیرید. انتخاب وکیل صرفاً بر اساس تبلیغات یا عنوان «بهترین وکیل» نمی‌تواند معیار مناسبی باشد.'],
                        ['title' => 'آیا امکان دریافت مشاوره حقوقی خانواده به صورت تلفنی یا آنلاین وجود دارد؟', 'p' => 'بله، در صورت فراهم بودن شرایط، امکان دریافت مشاوره حقوقی خانواده به صورت تلفنی و آنلاین وجود دارد. این روش به‌ویژه برای افرادی که امکان مراجعه حضوری ندارند می‌تواند گزینه مناسبی برای بررسی اولیه پرونده باشد.'],
                        ['title' => 'آیا در مناطق مختلف تهران امکان دریافت خدمات وکیل خانواده وجود دارد؟', 'p' => 'بله، خدمات حقوقی خانواده می‌تواند برای مراجعه‌کنندگان در مناطق مختلف تهران ارائه شود؛ از جمله افرادی که به دنبال وکیل خانواده تهرانپارس، وکیل خانواده شرق تهران، وکیل خانواده غرب تهران، وکیل خانواده در شمال تهران یا وکیل خانواده در جنوب تهران هستند.'],
                        ['title' => 'آیا مشاوره اولیه وکیل خانواده رایگان است؟', 'p' => 'امکان دریافت وکیل خانواده با مشاوره رایگان در مرحله اولیه، مطابق شرایط و سیاست‌های موسسه، قابل بررسی است. در جلسه مشاوره، موضوع پرونده و شرایط مراجعه‌کننده بررسی شده و درباره مسیرهای قانونی احتمالی راهنمایی لازم ارائه می‌شود.'],
                    ])
                    . self::h2('همین حالا با وکیل خانواده مشورت کنید', [
                        'اگر درگیر پرونده‌ای در زمینه طلاق، مهریه، نفقه، حضانت، تمکین، اجرت‌المثل یا سایر دعاوی خانواده هستید، پیش از هرگونه اقدام حقوقی می‌توانید شرایط پرونده خود را با متخصصان این حوزه مطرح کنید.',
                        'موسسه حقوقی مجد وکیل الرعایا آماده ارائه خدمات مشاوره و وکالت تخصصی در حوزه حقوق خانواده است. برای بررسی شرایط پرونده و دریافت راهکار متناسب با وضعیت خود، همین حالا برای دریافت مشاوره با موسسه تماس بگیرید.',
                    ]),
            ],
            [
                'slug' => 'property-lawyer',
                'title' => 'وکیل ملکی؛ مشاوره و وکالت تخصصی در دعاوی املاک',
                'excerpt' => 'خلع ید، سرقفلی، تخلیه، اسناد و قراردادهای ملکی در دادگاه‌های تخصصی املاک.',
                'hero' => 'اختلاف ملکی اگر دیر شروع شود، تصرف و سند را پیچیده می‌کند. وکلای ملکی موسسه مجد از تنظیم قرارداد تا اجرای حکم تخلیه و خلع ید پرونده را پیگیری می‌کنند.',
                'keywords' => 'وکیل ملکی، خلع ید، سرقفلی، تخلیه ملک، وکیل املاک تهران',
                'content' =>
                    self::h2('خدمات تخصصی ما در حوزه حقوق ملکی', [
                        'اختلاف ملکی اگر دیر شروع شود، تصرف و سند را پیچیده می‌کند. وکلای ملکی موسسه مجد از تنظیم قرارداد تا اجرای حکم تخلیه و خلع ید پرونده را با اولویت سرعت و دقت پیگیری می‌کنند.',
                        'دعاوی تصرف، سرقفلی، افراز و اسناد ثبتی قواعد خاص خود را دارند. انتخاب عنوان صحیح دعوا مسیر دادگاه را عوض می‌کند.',
                    ], [
                        ['title' => 'وکیل خلع ید و تصرف عدوانی', 'p' => 'خلع ید، تصرف عدوانی، ممانعت از حق و رفع مزاحمت ملکی نیازمند انتخاب صحیح عنوان دعوا و اقدام به‌موقع است.'],
                        ['title' => 'وکیل تخلیه و سرقفلی', 'p' => 'تخلیه عین مستأجره، سرقفلی و حقوق کسب و پیشه قواعد خاص خود را دارند و باید با توجه به نوع قرارداد پیگیری شوند.'],
                        ['title' => 'وکیل اسناد و قرارداد ملکی', 'p' => 'تنظیم، بررسی و پیگیری اختلافات قراردادهای بیع، اجاره و پیش‌فروش از خدمات تخصصی حوزه ملکی است.'],
                        ['title' => 'وکیل افراز', 'p' => 'افراز، تفکیک و تقسیم اموال مشاع نیازمند آشنایی با قانون ثبت و رویه محاکم است.'],
                        ['title' => 'وکیل ثبت اسناد', 'p' => 'اعتراض به ثبت، صدور سند و پیگیری امور ثبت اسناد و املاک باید با استعلام و لایحه دقیق انجام شود.'],
                        ['title' => 'وکیل پیش فروش و مشارکت در ساخت', 'p' => 'اختلافات پیش‌فروش، مشارکت در ساخت و تعهدات سازنده ریسک حقوقی بالایی دارند و نیاز به بررسی قرارداد دارند.'],
                    ])
                    . self::h2('چرا برای دعاوی ملکی به وکیل نیاز داریم؟', [
                        'قراردادها و معاملات ملکی پر از ریسک‌های پنهان هستند. یک اشتباه در تنظیم سند یا انتخاب عنوان دعوا می‌تواند ماه‌ها زمان را تلف کند.',
                        'وکیل ملکی با تسلط بر قوانین ثبتی و آیین دادرسی، مسیر مناسب را از ابتدا مشخص می‌کند.',
                    ])
                    . self::h2('مراحل کلی رسیدگی به یک پرونده ملکی', [
                        'پرونده معمولاً با بررسی اسناد، استعلام ثبتی، تعیین مرجع صالح و تنظیم دادخواست آغاز می‌شود.',
                        'پس از ابلاغ و جلسات رسیدگی، در صورت نیاز کارشناسی انجام می‌شود و در نهایت رأی صادر و اجرا می‌گردد.',
                    ])
                    . self::h2('چرا موسسه حقوقی مجد وکیل الرعایا؟', [
                        'تیم ملکی موسسه مجد قرارداد، ادله تصرف و اجرای ثبت را یکپارچه جلو می‌برد.',
                    ], [
                        ['title' => 'تیم تخصصی و سابقه پرونده‌های موفق', 'p' => 'وکلای ملکی موسسه تجربه کار در محاکم تخصصی املاک و ادارات ثبت را دارند.'],
                        ['title' => 'مشاوره رایگان اولیه', 'p' => 'در جلسه اول، اسناد و مسیر احتمالی پرونده بررسی می‌شود تا پیش از طرح دعوا تصویر روشنی داشته باشید.'],
                    ])
                    . self::h2('سوالات متداول درباره وکیل ملکی', [], [
                        ['title' => 'وکیل ملکی چه پرونده‌هایی را پیگیری می‌کند؟', 'p' => 'خلع ید، تصرف عدوانی، تخلیه، سرقفلی، افراز، اسناد ثبتی، پیش‌فروش و اختلافات قرارداد ملکی از جمله این پرونده‌هاست.'],
                        ['title' => 'آیا پیش از معامله هم می‌توان مشاوره گرفت؟', 'p' => 'بله. بررسی قرارداد پیش از امضا از بسیاری از اختلافات پرهزینه بعدی جلوگیری می‌کند.'],
                    ])
                    . self::h2('همین حالا با وکیل ملکی مشورت کنید', [
                        'اگر درگیر اختلاف ملک، سند یا قرارداد هستید، پیش از هر اقدام شرایط پرونده را با تیم ملکی موسسه مطرح کنید.',
                    ]),
            ],
            [
                'slug' => 'criminal-defense-lawyer',
                'title' => 'وکیل کیفری؛ دفاع تخصصی در دادسرا و دادگاه',
                'excerpt' => 'دفاع تخصصی در قتل، مواد مخدر، کلاهبرداری، خیانت در امانت و جرایم اقتصادی.',
                'hero' => 'در پرونده کیفری هر سکوت یا اقرار شتاب‌زده در بازجویی می‌تواند سرنوشت را عوض کند. حضور وکیل کیفری از نخستین ساعات حق دفاع قانونی شما را حفظ می‌کند.',
                'keywords' => 'وکیل کیفری، قتل، مواد مخدر، کلاهبرداری، وکیل جنایی تهران',
                'content' =>
                    self::h2('خدمات تخصصی ما در حوزه حقوق کیفری', [
                        'در پرونده کیفری هر سکوت یا اقرار شتاب‌زده در بازجویی می‌تواند سرنوشت را عوض کند. حضور وکیل کیفری از نخستین ساعات، حق دفاع قانونی شما را حفظ می‌کند.',
                        'وکلای کیفری موسسه مجد با تسلط بر قانون مجازات اسلامی و آیین دادرسی کیفری، دفاع مستند ارائه می‌دهند.',
                    ], [
                        ['title' => 'وکیل قتل', 'p' => 'دفاع در پرونده‌های قتل نیازمند تحلیل ادله، نظریه پزشکی قانونی و استراتژی دقیق از دادسرا تا دادگاه کیفری یک است.'],
                        ['title' => 'وکیل مواد مخدر', 'p' => 'پرونده‌های مواد مخدر عناوین اتهامی و مجازات‌های متفاوتی دارند و دفاع باید متناسب با نوع اتهام تنظیم شود.'],
                        ['title' => 'وکیل کلاهبرداری', 'p' => 'تفکیک کلاهبرداری از اختلاف مدنی و جمع‌آوری ادله فریب، مسیر پرونده را مشخص می‌کند.'],
                        ['title' => 'وکیل خیانت در امانت', 'p' => 'در خیانت در امانت، نحوه سپردن مال و سوءاستفاده بعدی باید با دقت اثبات یا رد شود.'],
                        ['title' => 'وکیل جرایم اقتصادی', 'p' => 'اختلاس، پولشویی و جرایم مالی نیازمند دفاع تخصصی و شناخت مقررات اقتصادی است.'],
                        ['title' => 'حقوق متهم', 'p' => 'از قرار تأمین تا تجدیدنظر، وکیل کیفری از حقوق قانونی متهم در تمام مراحل دفاع می‌کند.'],
                    ])
                    . self::h2('چرا برای پرونده کیفری به وکیل نیاز داریم؟', [
                        'در پرونده‌های کیفری هر اقدام یا سکوت در مراحل اولیه می‌تواند پیامد جبران‌ناپذیر داشته باشد.',
                        'وکیل کیفری مجرب می‌داند چه دفاعی ارائه دهد، چه مدارکی جمع‌آوری کند و چگونه از حقوق موکل دفاع کند.',
                    ])
                    . self::h2('مراحل کلی رسیدگی به یک پرونده کیفری', [
                        'پرونده معمولاً از شکایت یا گزارش، تحقیقات دادسرا، صدور قرار و در صورت کیفرخواست به دادگاه کیفری می‌رسد.',
                        'پس از صدور رأی، در صورت وجود شرایط قانونی امکان تجدیدنظر و فرجام وجود دارد.',
                    ])
                    . self::h2('چرا موسسه حقوقی مجد وکیل الرعایا؟', [
                        'تیم کیفری موسسه از قرار تأمین تا دیوان عالی استراتژی پرونده را بر اساس ادله طراحی می‌کند.',
                    ], [
                        ['title' => 'تیم تخصصی و سابقه پرونده‌های موفق', 'p' => 'وکلای کیفری موسسه در دادسرا و دادگاه کیفری یک و دو سابقه دفاع مستند دارند.'],
                        ['title' => 'مشاوره رایگان اولیه', 'p' => 'در مشاوره اولیه وضعیت اتهام، مدارک و اقدامات فوری بررسی می‌شود.'],
                    ])
                    . self::h2('سوالات متداول درباره وکیل کیفری', [], [
                        ['title' => 'آیا از لحظه دستگیری می‌توان وکیل گرفت؟', 'p' => 'بله. متهم حق دارد از ابتدای بازجویی وکیل داشته باشد و هرچه زودتر وکیل وارد شود دفاع مؤثرتر است.'],
                        ['title' => 'تفاوت وکیل کیفری با مشاور حقوقی چیست؟', 'p' => 'مشاور راهنمایی می‌دهد؛ وکیل کیفری در تمام مراحل دادرسی نماینده رسمی شماست.'],
                    ])
                    . self::h2('همین حالا با وکیل کیفری مشورت کنید', [
                        'اگر با اتهام کیفری یا شکایت روبه‌رو هستید، پیش از هر اظهاری با وکیل متخصص این حوزه مشورت کنید.',
                    ]),
            ],
            [
                'slug' => 'administrative-lawyer',
                'title' => 'وکیل اداری؛ دیوان عدالت اداری و دعاوی دولتی',
                'excerpt' => 'اعتراض به تصمیمات دولتی، دیوان عدالت اداری، دعاوی قراردادی و اختلافات شرکت‌ها.',
                'hero' => 'طرح شکایت در دیوان عدالت اداری مهلت و تشریفات ویژه‌ای دارد. وکیل اداری صلاحیت مرجع و نحوه تنظیم دادخواست را از ابتدا درست انتخاب می‌کند.',
                'keywords' => 'وکیل اداری، دیوان عدالت اداری، اعتراض به رأی دولتی، دعاوی شرکتی',
                'content' =>
                    self::h2('خدمات تخصصی ما در حوزه حقوق اداری', [
                        'طرح شکایت در دیوان عدالت اداری و دعاوی اداری مهلت و تشریفات ویژه‌ای دارد. وکیل اداری موسسه مجد صلاحیت مرجع، مهلت اعتراض و نحوه تنظیم دادخواست را از ابتدا درست انتخاب می‌کند.',
                        'علاوه بر دیوان، اختلافات قراردادی و شرکتی نیز اغلب با مقررات اداری گره می‌خورند.',
                    ], [
                        ['title' => 'وکیل دیوان عدالت اداری', 'p' => 'اعتراض به آراء و تصمیمات اداری باید در مهلت قانونی و با لایحه مستدل در دیوان مطرح شود.'],
                        ['title' => 'اعتراض به رأی کمیسیون‌ها', 'p' => 'آراء کمیسیون‌های شهرداری، مالیاتی و هیئت‌های اداری مسیر اعتراض خاص خود را دارند.'],
                        ['title' => 'الزام دستگاه به انجام وظیفه', 'p' => 'در موارد خودداری دستگاه از انجام تکلیف قانونی، می‌توان الزام را از مرجع صالح خواست.'],
                        ['title' => 'دعاوی قراردادی دولتی', 'p' => 'اختلاف پیمان و قرارداد با دستگاه‌های عمومی نیازمند شناخت مقررات اداری و شرایط عمومی پیمان است.'],
                        ['title' => 'دعاوی شرکتی', 'p' => 'اختلافات سهامداران، هیئت‌مدیره و انحلال شرکت در کنار مسائل اداری قابل پیگیری است.'],
                        ['title' => 'مشاوره پیش از اعتراض', 'p' => 'بررسی مهلت، مرجع صالح و مدارک لازم پیش از ثبت دادخواست از رد شکایت جلوگیری می‌کند.'],
                    ])
                    . self::h2('چرا برای دعاوی اداری به وکیل نیاز داریم؟', [
                        'مهلت اعتراض به تصمیمات دولتی محدود است و انتخاب مرجع اشتباه پرونده را از مسیر خارج می‌کند.',
                        'وکیل اداری صلاحیت، مهلت و شکل دادخواست را از ابتدا درست تنظیم می‌کند.',
                    ])
                    . self::h2('مراحل کلی رسیدگی به یک پرونده اداری', [
                        'پس از بررسی تصمیم مورد اعتراض و مهلت قانونی، دادخواست در مرجع صالح ثبت می‌شود.',
                        'دیوان یا مرجع مربوط مدارک را بررسی می‌کند و در صورت نیاز تبادل لوایح و کارشناسی انجام می‌شود تا رأی صادر گردد.',
                    ])
                    . self::h2('چرا موسسه حقوقی مجد وکیل الرعایا؟', [
                        'تیم اداری و حقوقی مجد اعتراض به آراء هیئت‌ها و الزام دستگاه را با لایحه مستدل پیش می‌برد.',
                    ], [
                        ['title' => 'تیم تخصصی و سابقه پرونده‌های موفق', 'p' => 'وکلای اداری موسسه با رویه دیوان عدالت اداری و کمیسیون‌ها آشنا هستند.'],
                        ['title' => 'مشاوره رایگان اولیه', 'p' => 'در مشاوره اولیه مهلت باقی‌مانده، مرجع صالح و مدارک لازم روشن می‌شود.'],
                    ])
                    . self::h2('سوالات متداول درباره وکیل اداری', [], [
                        ['title' => 'مهلت شکایت در دیوان عدالت اداری چقدر است؟', 'p' => 'مهلت بسته به نوع تصمیم متفاوت است؛ بهتر است بلافاصله پس از ابلاغ با وکیل بررسی شود.'],
                        ['title' => 'آیا همه تصمیمات دولتی قابل اعتراض در دیوان است؟', 'p' => 'خیر. برخی موضوعات در صلاحیت مراجع دیگر است و انتخاب مرجع باید دقیق باشد.'],
                    ])
                    . self::h2('همین حالا با وکیل اداری مشورت کنید', [
                        'اگر به تصمیم اداری یا رأی کمیسیون اعتراض دارید، پیش از پایان مهلت با موسسه تماس بگیرید.',
                    ]),
            ],
        ];
    }
}

Majd_Landing_API::init();

/**
 * Sub-landings under a service hub, plus the public services API.
 * Blog posts are not used.
 */
class Majd_Service_Landings {
    public static function init() {
        add_action('init', [__CLASS__, 'register_post_type']);
        add_action('init', [__CLASS__, 'register_meta']);
        add_action('init', [__CLASS__, 'maybe_prepare_content'], 40);
        add_action('init', [__CLASS__, 'maybe_sync_family_copy'], 50);
        add_action('rest_api_init', [__CLASS__, 'register_routes']);
        add_action('add_meta_boxes', [__CLASS__, 'add_meta_boxes']);
        add_action('save_post_' . MAJD_SUBLANDING_POST_TYPE, [__CLASS__, 'save_meta'], 10, 2);
        add_filter('manage_' . MAJD_SUBLANDING_POST_TYPE . '_posts_columns', [__CLASS__, 'list_columns']);
        add_action('manage_' . MAJD_SUBLANDING_POST_TYPE . '_posts_custom_column', [__CLASS__, 'render_list_column'], 10, 2);
    }

    public static function sanitize_icon($value) {
        $icon = sanitize_key((string) $value);
        $allowed = ['scale', 'gavel', 'heart', 'building', 'coins', 'chat'];
        return in_array($icon, $allowed, true) ? $icon : 'scale';
    }

    public static function register_post_type() {
        register_post_type(MAJD_SUBLANDING_POST_TYPE, [
            'labels' => [
                'name' => 'زیرلندینگ‌ها',
                'singular_name' => 'زیرلندینگ',
                'menu_name' => 'زیرلندینگ‌ها',
                'add_new' => 'افزودن زیرلندینگ',
                'add_new_item' => 'افزودن زیرلندینگ',
                'edit_item' => 'ویرایش زیرلندینگ',
                'new_item' => 'زیرلندینگ جدید',
                'view_item' => 'مشاهده',
                'search_items' => 'جستجوی زیرلندینگ',
                'not_found' => 'زیرلندینگی یافت نشد',
                'not_found_in_trash' => 'زیرلندینگی در زباله‌دان نیست',
                'featured_image' => 'تصویر کارت',
                'set_featured_image' => 'انتخاب تصویر کارت',
                'remove_featured_image' => 'حذف تصویر کارت',
            ],
            'public' => true,
            'publicly_queryable' => false,
            'exclude_from_search' => true,
            'show_ui' => true,
            'show_in_menu' => 'edit.php?post_type=' . MAJD_LANDING_POST_TYPE,
            'show_in_nav_menus' => false,
            'capability_type' => 'post',
            'map_meta_cap' => true,
            'has_archive' => false,
            'rewrite' => false,
            'query_var' => false,
            'show_in_rest' => false,
            'supports' => [
                'title',
                'editor',
                'excerpt',
                'thumbnail',
                'page-attributes',
                'revisions',
            ],
        ]);
    }

    public static function register_meta() {
        register_post_meta(MAJD_SUBLANDING_POST_TYPE, MAJD_SUBLANDING_META_HUB, [
            'type' => 'integer',
            'single' => true,
            'show_in_rest' => false,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
        register_post_meta(MAJD_SUBLANDING_POST_TYPE, MAJD_SUBLANDING_META_ICON, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => false,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
        register_post_meta(MAJD_SUBLANDING_POST_TYPE, MAJD_SUBLANDING_META_DESCRIPTION, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => false,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
        register_post_meta(MAJD_SUBLANDING_POST_TYPE, MAJD_SUBLANDING_META_CTA_PHONE, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => false,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
        register_post_meta(MAJD_SUBLANDING_POST_TYPE, MAJD_SUBLANDING_META_HEADLINE, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => false,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
        register_post_meta(MAJD_SUBLANDING_POST_TYPE, MAJD_SUBLANDING_META_KEYWORDS, [
            'type' => 'string',
            'single' => true,
            'show_in_rest' => false,
            'auth_callback' => function () {
                return current_user_can('edit_posts');
            },
        ]);
    }

    public static function sanitize_phone($value) {
        $phone = wp_strip_all_tags((string) $value);
        $phone = preg_replace('/[^\d۰-۹٠-٩+\s().\-–—]/u', '', $phone);
        $phone = trim((string) preg_replace('/\s+/u', ' ', (string) $phone));
        if (function_exists('mb_substr')) {
            return mb_substr($phone, 0, 32);
        }
        return substr($phone, 0, 32);
    }

    public static function register_routes() {
        register_rest_route('majd/v1', '/service-hubs', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'rest_hubs'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('majd/v1', '/service-hubs/(?P<slug>[a-z0-9-]+)', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'rest_hub'],
            'permission_callback' => '__return_true',
        ]);
        register_rest_route('majd/v1', '/service-landings/(?P<hub>[a-z0-9-]+)/(?P<slug>.+)', [
            'methods' => 'GET',
            'callback' => [__CLASS__, 'rest_landing'],
            'permission_callback' => '__return_true',
        ]);
    }

    public static function rest_hubs() {
        $hubs = self::published_hubs();
        return rest_ensure_response(array_map(function ($post) {
            return self::hub_payload($post, false);
        }, $hubs));
    }

    public static function rest_hub(WP_REST_Request $request) {
        $post = self::hub_by_slug((string) $request['slug']);
        if (!$post) {
            return new WP_Error('majd_hub_not_found', 'Landing hub not found', ['status' => 404]);
        }
        return rest_ensure_response(self::hub_payload($post, true));
    }

    public static function rest_landing(WP_REST_Request $request) {
        $hub = self::hub_by_slug((string) $request['hub']);
        if (!$hub) {
            return new WP_Error('majd_hub_not_found', 'Landing hub not found', ['status' => 404]);
        }
        $landing = self::landing_by_slug($hub->ID, rawurldecode((string) $request['slug']));
        if (!$landing) {
            return new WP_Error('majd_landing_not_found', 'Sub-landing not found', ['status' => 404]);
        }
        $card = self::landing_card($landing, self::stored_phone($hub->ID, MAJD_LANDING_META_CTA_PHONE));
        $card['content'] = apply_filters('the_content', $landing->post_content);
        $card['headline'] = self::plain_text(get_post_meta($landing->ID, MAJD_SUBLANDING_META_HEADLINE, true));
        $card['keywords'] = self::keyword_list(get_post_meta($landing->ID, MAJD_SUBLANDING_META_KEYWORDS, true));
        $card['hubSlug'] = $hub->post_name;
        $card['hubTitle'] = self::menu_label($hub);
        return rest_ensure_response($card);
    }

    public static function add_meta_boxes() {
        add_meta_box(
            'majd_sublanding_description',
            'توضیحات هیرو',
            [__CLASS__, 'render_description_box'],
            MAJD_SUBLANDING_POST_TYPE,
            'normal',
            'high'
        );
        add_meta_box(
            'majd_sublanding_headline',
            'عنوان صفحه و کلمات کلیدی',
            [__CLASS__, 'render_headline_box'],
            MAJD_SUBLANDING_POST_TYPE,
            'normal',
            'high'
        );
        add_meta_box(
            'majd_sublanding_hub',
            'لندینگ اصلی',
            [__CLASS__, 'render_hub_box'],
            MAJD_SUBLANDING_POST_TYPE,
            'side',
            'high'
        );
        add_meta_box(
            'majd_sublanding_cta_phone',
            'تماس با وکیل این پرونده',
            [__CLASS__, 'render_cta_phone_box'],
            MAJD_SUBLANDING_POST_TYPE,
            'side',
            'default'
        );
    }

    public static function render_cta_phone_box($post) {
        $phone = (string) get_post_meta($post->ID, MAJD_SUBLANDING_META_CTA_PHONE, true);
        echo '<p class="description">شماره دکمه «تماس با وکیل این پرونده» در صفحه همین زیرلندینگ.</p>';
        echo '<p><label for="majd_sublanding_cta_phone"><strong>شماره تماس</strong></label></p>';
        echo '<input type="text" name="majd_sublanding_cta_phone" id="majd_sublanding_cta_phone" class="widefat" dir="ltr" value="' . esc_attr($phone) . '" placeholder="02177886437" />';
        echo '<p class="description">خالی = شماره لندینگ اصلی، و اگر آن هم خالی بود شماره پیش‌فرض سایت.</p>';
    }

    public static function render_description_box($post) {
        $description = (string) get_post_meta($post->ID, MAJD_SUBLANDING_META_DESCRIPTION, true);
        echo '<p class="description">این متن زیر عنوان، در هیروی صفحه زیرلندینگ نشان داده می‌شود. اگر خالی باشد، چکیده استفاده می‌شود.</p>';
        echo '<textarea name="majd_sublanding_description" rows="5" class="large-text">' . esc_textarea($description) . '</textarea>';
    }

    public static function render_headline_box($post) {
        $headline = (string) get_post_meta($post->ID, MAJD_SUBLANDING_META_HEADLINE, true);
        $keywords = (string) get_post_meta($post->ID, MAJD_SUBLANDING_META_KEYWORDS, true);
        echo '<p class="description">عنوان برگه در وردپرس روی کارت لندینگ می‌ماند. این عنوان، H1 صفحه زیرلندینگ است.</p>';
        echo '<p><label for="majd_sublanding_headline"><strong>عنوان صفحه</strong></label></p>';
        echo '<input type="text" name="majd_sublanding_headline" id="majd_sublanding_headline" class="large-text" value="' . esc_attr($headline) . '" />';
        echo '<p><label for="majd_sublanding_keywords"><strong>کلمات کلیدی</strong></label></p>';
        echo '<textarea name="majd_sublanding_keywords" id="majd_sublanding_keywords" rows="3" class="large-text">' . esc_textarea($keywords) . '</textarea>';
        echo '<p class="description">با ویرگول جدا کنید. متن صفحه را با تیتر ۲ و تیتر ۳ بنویسید تا بخش‌ها، سوالات و دعوت به تماس جدا بمانند.</p>';
    }

    public static function render_hub_box($post) {
        wp_nonce_field('majd_sublanding_save', 'majd_sublanding_nonce');
        $hub_id = (int) get_post_meta($post->ID, MAJD_SUBLANDING_META_HUB, true);
        $icon = (string) get_post_meta($post->ID, MAJD_SUBLANDING_META_ICON, true);
        $hubs = get_posts([
            'post_type' => MAJD_LANDING_POST_TYPE,
            'post_status' => ['publish', 'draft', 'pending', 'private'],
            'numberposts' => 100,
            'orderby' => 'menu_order title',
            'order' => 'ASC',
        ]);
        echo '<p><label for="majd_sublanding_hub"><strong>این کارت زیر کدام لندینگ است؟</strong></label></p>';
        echo '<select name="majd_sublanding_hub" id="majd_sublanding_hub" class="widefat">';
        echo '<option value="0">انتخاب کنید</option>';
        foreach ($hubs as $hub) {
            printf(
                '<option value="%d" %s>%s</option>',
                (int) $hub->ID,
                selected($hub_id, (int) $hub->ID, false),
                esc_html(get_the_title($hub) . ' /' . $hub->post_name . '/')
            );
        }
        echo '</select>';
        $slug = (string) $post->post_name;
        echo '<p><label for="majd_sublanding_slug"><strong>نامک (slug)</strong></label></p>';
        echo '<input type="text" name="majd_sublanding_slug" id="majd_sublanding_slug" class="widefat" dir="ltr" value="' . esc_attr($slug) . '" placeholder="divorce-lawyer" />';
        echo '<p><label>آیکون کارت</label></p>';
        echo '<input type="text" name="majd_sublanding_icon" class="widefat" value="' . esc_attr($icon) . '" />';
        echo '<p style="color:#555">آدرس صفحه: <code>/{نامک لندینگ}/' . esc_html($slug !== '' ? $slug : 'slug') . '/</code></p>';
        echo '<p style="color:#555">این‌ها نوشته وبلاگ نیستند. عنوان و چکیده روی کارت لندینگ اصلی دیده می‌شود.</p>';
    }

    public static function save_meta($post_id) {
        if (!isset($_POST['majd_sublanding_nonce']) || !wp_verify_nonce($_POST['majd_sublanding_nonce'], 'majd_sublanding_save')) {
            return;
        }
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }
        $hub_id = isset($_POST['majd_sublanding_hub']) ? absint($_POST['majd_sublanding_hub']) : 0;
        if ($hub_id && get_post_type($hub_id) !== MAJD_LANDING_POST_TYPE) {
            $hub_id = 0;
        }
        update_post_meta($post_id, MAJD_SUBLANDING_META_HUB, $hub_id);
        if (isset($_POST['majd_sublanding_icon'])) {
            update_post_meta($post_id, MAJD_SUBLANDING_META_ICON, self::sanitize_icon(wp_unslash($_POST['majd_sublanding_icon'])));
        }
        if (isset($_POST['majd_sublanding_description'])) {
            update_post_meta(
                $post_id,
                MAJD_SUBLANDING_META_DESCRIPTION,
                self::plain_text(wp_unslash($_POST['majd_sublanding_description']))
            );
        }
        if (isset($_POST['majd_sublanding_cta_phone'])) {
            update_post_meta(
                $post_id,
                MAJD_SUBLANDING_META_CTA_PHONE,
                self::sanitize_phone(wp_unslash($_POST['majd_sublanding_cta_phone']))
            );
        }
        if (isset($_POST['majd_sublanding_headline'])) {
            update_post_meta(
                $post_id,
                MAJD_SUBLANDING_META_HEADLINE,
                self::plain_text(wp_unslash($_POST['majd_sublanding_headline']))
            );
        }
        if (isset($_POST['majd_sublanding_keywords'])) {
            update_post_meta(
                $post_id,
                MAJD_SUBLANDING_META_KEYWORDS,
                sanitize_textarea_field(wp_unslash($_POST['majd_sublanding_keywords']))
            );
        }
        if (isset($_POST['majd_sublanding_slug'])) {
            self::assign_slug($post_id, wp_unslash($_POST['majd_sublanding_slug']), [__CLASS__, 'save_meta']);
        }
    }

    public static function assign_slug($post_id, $raw, $callback) {
        $slug = sanitize_title((string) $raw);
        if ($slug === '') {
            return;
        }
        $post = get_post($post_id);
        if (!$post || $post->post_name === $slug) {
            return;
        }
        if ($post->post_type === MAJD_LANDING_POST_TYPE) {
            $reserved = ['about', 'account', 'blog', 'blogs', 'cart', 'checkout', 'contact', 'courses', 'services', 'shop', 'team'];
            if (in_array($slug, $reserved, true)) {
                return;
            }
        }
        $unique = wp_unique_post_slug($slug, $post_id, $post->post_status, $post->post_type, (int) $post->post_parent);
        remove_action('save_post_' . $post->post_type, $callback, 10);
        wp_update_post([
            'ID' => $post_id,
            'post_name' => $unique,
        ]);
        add_action('save_post_' . $post->post_type, $callback, 10, 2);
    }

    public static function list_columns($columns) {
        $columns['majd_hub'] = 'لندینگ اصلی';
        $columns['majd_path'] = 'مسیر سایت';
        return $columns;
    }

    public static function render_list_column($column, $post_id) {
        if ($column === 'majd_hub') {
            $hub_id = (int) get_post_meta($post_id, MAJD_SUBLANDING_META_HUB, true);
            echo $hub_id ? esc_html(get_the_title($hub_id)) : '—';
            return;
        }
        if ($column === 'majd_path') {
            $hub_id = (int) get_post_meta($post_id, MAJD_SUBLANDING_META_HUB, true);
            $hub_slug = $hub_id ? get_post_field('post_name', $hub_id) : '…';
            $slug = get_post_field('post_name', $post_id);
            echo '<code>/' . esc_html($hub_slug . '/' . $slug) . '/</code>';
        }
    }

    private static function published_hubs() {
        return get_posts([
            'post_type' => MAJD_LANDING_POST_TYPE,
            'post_status' => 'publish',
            'numberposts' => 100,
            'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
        ]);
    }

    private static function hub_by_slug($slug) {
        $posts = get_posts([
            'post_type' => MAJD_LANDING_POST_TYPE,
            'name' => sanitize_title($slug),
            'post_status' => 'publish',
            'numberposts' => 1,
        ]);
        return $posts[0] ?? null;
    }

    private static function landings_for_hub($hub_id) {
        $posts = get_posts([
            'post_type' => MAJD_SUBLANDING_POST_TYPE,
            'post_status' => 'publish',
            'numberposts' => 100,
            'meta_key' => MAJD_SUBLANDING_META_HUB,
            'meta_value' => (int) $hub_id,
            'orderby' => ['menu_order' => 'ASC', 'title' => 'ASC'],
        ]);
        $seen = [];
        $unique = [];
        foreach ($posts as $post) {
            if (isset($seen[$post->post_name])) {
                continue;
            }
            $seen[$post->post_name] = true;
            $unique[] = $post;
        }
        return $unique;
    }

    private static function landing_by_slug($hub_id, $slug) {
        $posts = get_posts([
            'post_type' => MAJD_SUBLANDING_POST_TYPE,
            'name' => $slug,
            'post_status' => 'publish',
            'numberposts' => 1,
        ]);
        if (!$posts) {
            return null;
        }
        $parent = (int) get_post_meta($posts[0]->ID, MAJD_SUBLANDING_META_HUB, true);
        return $parent === (int) $hub_id ? $posts[0] : null;
    }

    public static function plain_text($value) {
        $text = (string) $value;
        $text = preg_replace('/<\s*br\s*\/?>/i', ' ', $text);
        $text = wp_strip_all_tags($text);
        for ($i = 0; $i < 3; $i++) {
            $decoded = html_entity_decode($text, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $decoded = str_replace(["\xc2\xa0", '&nbsp;', '&#160;', '&#xa0;', '&#xA0;'], ' ', $decoded);
            if ($decoded === $text) {
                break;
            }
            $text = $decoded;
        }
        $text = preg_replace('/\s+/u', ' ', $text);
        return trim((string) $text);
    }

    private static function excerpt($post) {
        $text = trim((string) $post->post_excerpt);
        if ($text === '') {
            $text = wp_trim_words(wp_strip_all_tags($post->post_content), 32, '…');
        }
        return self::plain_text($text);
    }

    private static function landing_description($post) {
        $text = self::plain_text(get_post_meta($post->ID, MAJD_SUBLANDING_META_DESCRIPTION, true));
        if ($text !== '') {
            return $text;
        }
        return self::excerpt($post);
    }

    private static function keywords($post_id) {
        return self::keyword_list(get_post_meta($post_id, MAJD_LANDING_META_KEYWORDS, true));
    }

    private static function keyword_list($raw) {
        $parts = preg_split('/[,،]+/u', (string) $raw) ?: [];
        return array_values(array_filter(array_map('trim', $parts)));
    }

    private static function image_url($post_id) {
        $url = get_the_post_thumbnail_url($post_id, 'large');
        return $url ? $url : '';
    }

    private static function default_presentation() {
        return [
            'family-lawyer' => ['label' => 'وکیل خانواده', 'icon' => 'heart', 'order' => 10],
            'property-lawyer' => ['label' => 'وکیل ملکی', 'icon' => 'building', 'order' => 20],
            'criminal-defense-lawyer' => ['label' => 'وکیل کیفری', 'icon' => 'gavel', 'order' => 30],
            'legal-consultation' => ['label' => 'مشاوره حقوقی', 'icon' => 'chat', 'order' => 40],
            'administrative-lawyer' => ['label' => 'وکیل اداری', 'icon' => 'scale', 'order' => 50],
        ];
    }

    private static function menu_label($post) {
        $label = trim((string) get_post_meta($post->ID, MAJD_LANDING_META_MENU_LABEL, true));
        if ($label !== '') {
            return $label;
        }
        $defaults = self::default_presentation();
        if (isset($defaults[$post->post_name])) {
            return $defaults[$post->post_name]['label'];
        }
        return get_the_title($post);
    }

    private static function hub_icon($post) {
        $icon = trim((string) get_post_meta($post->ID, MAJD_LANDING_META_ICON, true));
        if ($icon !== '') {
            return self::sanitize_icon($icon);
        }
        $defaults = self::default_presentation();
        if (isset($defaults[$post->post_name])) {
            return $defaults[$post->post_name]['icon'];
        }
        return 'scale';
    }

    private static function stored_phone($post_id, $meta_key) {
        return self::sanitize_phone((string) get_post_meta($post_id, $meta_key, true));
    }

    private static function landing_card($post, $fallback_phone = '') {
        $phone = self::stored_phone($post->ID, MAJD_SUBLANDING_META_CTA_PHONE);
        if ($phone === '') {
            $phone = self::sanitize_phone($fallback_phone);
        }
        return [
            'id' => (int) $post->ID,
            'slug' => $post->post_name,
            'title' => get_the_title($post),
            'excerpt' => self::excerpt($post),
            'description' => self::landing_description($post),
            'icon' => self::sanitize_icon(get_post_meta($post->ID, MAJD_SUBLANDING_META_ICON, true)),
            'image' => self::image_url($post->ID),
            'ctaPhone' => $phone,
        ];
    }

    private static function hub_payload($post, $with_content) {
        $hero = self::plain_text(get_post_meta($post->ID, MAJD_LANDING_META_HERO, true));
        if ($hero === '') {
            $hero = self::excerpt($post);
        }
        $hub_phone = self::stored_phone($post->ID, MAJD_LANDING_META_CTA_PHONE);
        $landings = [];
        foreach (self::landings_for_hub($post->ID) as $landing) {
            $landings[] = self::landing_card($landing, $hub_phone);
        }
        $payload = [
            'id' => (int) $post->ID,
            'slug' => $post->post_name,
            'title' => get_the_title($post),
            'menuLabel' => self::menu_label($post),
            'excerpt' => self::excerpt($post),
            'icon' => self::hub_icon($post),
            'image' => self::image_url($post->ID),
            'heroDescription' => $hero,
            'keywords' => self::keywords($post->ID),
            'ctaPhone' => $hub_phone,
            'landings' => $landings,
        ];
        if ($with_content) {
            $payload['content'] = apply_filters('the_content', $post->post_content);
        }
        return $payload;
    }

    public static function maybe_sync_family_copy() {
        if (get_option('majd_family_sublanding_copy_v1')) {
            return;
        }
        if (!class_exists('Majd_Family_Landing_Copy')) {
            return;
        }
        $hubs = get_posts([
            'post_type' => MAJD_LANDING_POST_TYPE,
            'name' => 'family-lawyer',
            'post_status' => 'any',
            'numberposts' => 1,
        ]);
        if (!$hubs) {
            return;
        }
        $hub_id = (int) $hubs[0]->ID;
        $updated = 0;
        foreach (Majd_Family_Landing_Copy::items() as $item) {
            if (empty($item['slug']) || empty($item['html'])) {
                continue;
            }
            $posts = get_posts([
                'post_type' => MAJD_SUBLANDING_POST_TYPE,
                'name' => $item['slug'],
                'post_status' => 'any',
                'numberposts' => 20,
            ]);
            foreach ($posts as $post) {
                $parent = (int) get_post_meta($post->ID, MAJD_SUBLANDING_META_HUB, true);
                if ($parent !== $hub_id) {
                    continue;
                }
                wp_update_post([
                    'ID' => $post->ID,
                    'post_content' => $item['html'],
                    'post_excerpt' => isset($item['cardExcerpt']) ? $item['cardExcerpt'] : '',
                ]);
                update_post_meta($post->ID, MAJD_SUBLANDING_META_DESCRIPTION, self::plain_text($item['hero'] ?? ''));
                update_post_meta($post->ID, MAJD_SUBLANDING_META_HEADLINE, self::plain_text($item['headline'] ?? ''));
                $keywords = isset($item['keywords']) && is_array($item['keywords']) ? $item['keywords'] : [];
                update_post_meta(
                    $post->ID,
                    MAJD_SUBLANDING_META_KEYWORDS,
                    implode('، ', array_map('strval', $keywords))
                );
                $updated++;
            }
        }
        if ($updated) {
            update_option('majd_family_sublanding_copy_v1', '1');
        }
    }

    public static function maybe_prepare_content() {
        if (get_option('majd_service_landings_prepared_v1')) {
            return;
        }
        self::fill_hub_presentation();
        self::ensure_consultation_hub();
        self::seed_sublandings();
        update_option('majd_service_landings_prepared_v1', '1');
    }

    private static function fill_hub_presentation() {
        foreach (self::default_presentation() as $slug => $meta) {
            $posts = get_posts([
                'post_type' => MAJD_LANDING_POST_TYPE,
                'name' => $slug,
                'post_status' => 'any',
                'numberposts' => 1,
            ]);
            if (!$posts) {
                continue;
            }
            $post = $posts[0];
            if (!get_post_meta($post->ID, MAJD_LANDING_META_MENU_LABEL, true)) {
                update_post_meta($post->ID, MAJD_LANDING_META_MENU_LABEL, $meta['label']);
            }
            if (!get_post_meta($post->ID, MAJD_LANDING_META_ICON, true)) {
                update_post_meta($post->ID, MAJD_LANDING_META_ICON, $meta['icon']);
            }
            if ((int) $post->menu_order === 0) {
                wp_update_post([
                    'ID' => $post->ID,
                    'menu_order' => $meta['order'],
                ]);
            }
        }
    }

    private static function ensure_consultation_hub() {
        $exists = get_posts([
            'post_type' => MAJD_LANDING_POST_TYPE,
            'name' => 'legal-consultation',
            'post_status' => 'any',
            'numberposts' => 1,
            'fields' => 'ids',
        ]);
        if ($exists) {
            return;
        }
        $id = wp_insert_post([
            'post_type' => MAJD_LANDING_POST_TYPE,
            'post_status' => 'publish',
            'post_title' => 'مشاوره حقوقی',
            'post_name' => 'legal-consultation',
            'post_excerpt' => 'مشاوره تخصصی حضوری و تلفنی پیش از هر اقدام قضایی؛ مسیر درست را قبل از طرح دعوا مشخص کنید.',
            'menu_order' => 40,
            'post_content' =>
                '<h2>خدمات تخصصی مشاوره حقوقی</h2>'
                . '<p>بسیاری از پرونده‌ها با یک مشاوره دقیق در همان ابتدا مسیر کوتاه‌تری پیدا می‌کنند. موسسه مجد مشاوره حقوقی را با بررسی مدارک، ارزیابی ریسک و پیشنهاد مسیر ارائه می‌دهد.</p>'
                . '<h2>چرا پیش از اقدام قضایی مشاوره بگیریم؟</h2>'
                . '<p>مشاوره حقوقی موسسه برای اشخاص حقیقی و حقوقی، حضوری و تلفنی برگزار می‌شود. در جلسه اول، موضوع، مهلت‌های قانونی و مدارک لازم روشن می‌شود.</p>'
                . '<h2>سوالات متداول درباره مشاوره حقوقی</h2>'
                . '<h3>آیا مشاوره اولیه رایگان است؟</h3>'
                . '<p>برای موارد خاص، امکان مشاوره اولیه رایگان مطابق شرایط موسسه وجود دارد.</p>'
                . '<h2>همین حالا برای مشاوره تماس بگیرید</h2>'
                . '<p>موضوع پرونده را با کارشناسان موسسه حقوقی مجد وکیل الرعایا مطرح کنید.</p>',
        ], true);
        if (is_wp_error($id) || !$id) {
            return;
        }
        update_post_meta($id, MAJD_LANDING_META_MENU_LABEL, 'مشاوره حقوقی');
        update_post_meta($id, MAJD_LANDING_META_ICON, 'chat');
        update_post_meta($id, MAJD_LANDING_META_HERO, 'مسیر درست را قبل از طرح دعوا مشخص کنید. مشاوره حضوری و تلفنی با بررسی مدارک و مهلت‌های قانونی.');
        update_post_meta($id, MAJD_LANDING_META_KEYWORDS, 'مشاوره حقوقی، مشاوره وکیل، مشاوره تلفنی');
    }

    private static function seed_sublandings() {
        foreach (self::sublanding_seeds() as $group) {
            $hubs = get_posts([
                'post_type' => MAJD_LANDING_POST_TYPE,
                'name' => $group['hub'],
                'post_status' => 'publish',
                'numberposts' => 1,
            ]);
            if (!$hubs) {
                continue;
            }
            $hub_id = (int) $hubs[0]->ID;
            if (self::landings_for_hub($hub_id)) {
                continue;
            }
            $order = 10;
            foreach ($group['items'] as $item) {
                $id = wp_insert_post([
                    'post_type' => MAJD_SUBLANDING_POST_TYPE,
                    'post_status' => 'publish',
                    'post_title' => $item['title'],
                    'post_name' => $item['slug'],
                    'post_excerpt' => $item['excerpt'],
                    'post_content' => '<p>' . esc_html($item['excerpt']) . '</p>',
                    'menu_order' => $order,
                ], true);
                $order += 10;
                if (is_wp_error($id) || !$id) {
                    continue;
                }
                update_post_meta($id, MAJD_SUBLANDING_META_HUB, $hub_id);
                update_post_meta($id, MAJD_SUBLANDING_META_ICON, self::sanitize_icon($item['icon']));
            }
        }
    }

    private static function sublanding_seeds() {
        return [
            [
                'hub' => 'family-lawyer',
                'items' => [
                    ['slug' => 'divorce-lawyer', 'icon' => 'heart', 'title' => 'وکیل طلاق', 'excerpt' => 'بررسی طلاق توافقی یا یک‌طرفه، حقوق مالی زوجین، مهریه، نفقه و حضانت فرزند.'],
                    ['slug' => 'mahr-lawyer', 'icon' => 'coins', 'title' => 'وکیل مهریه', 'excerpt' => 'مطالبه و وصول مهریه، نحوه طرح دعوا و بررسی اموال زوج.'],
                    ['slug' => 'nafaqa-lawyer', 'icon' => 'scale', 'title' => 'وکیل نفقه', 'excerpt' => 'بررسی استحقاق نفقه، میزان آن و نحوه مطالبه یا دفاع در دعاوی مرتبط.'],
                    ['slug' => 'custody-lawyer', 'icon' => 'heart', 'title' => 'وکیل حضانت و ملاقات فرزند', 'excerpt' => 'دعاوی حضانت و ملاقات با توجه به سن فرزند و مصلحت طفل.'],
                    ['slug' => 'tamkin-lawyer', 'icon' => 'scale', 'title' => 'وکیل تمکین و نشوز', 'excerpt' => 'بررسی شرایط زندگی مشترک، دلایل طرفین و مستندات دعوای تمکین یا نشوز.'],
                    ['slug' => 'ojrat-lawyer', 'icon' => 'coins', 'title' => 'وکیل اجرت‌المثل و نحله', 'excerpt' => 'پیگیری اجرت‌المثل ایام زوجیت و نحله بر اساس شرایط پرونده.'],
                ],
            ],
            [
                'hub' => 'property-lawyer',
                'items' => [
                    ['slug' => 'eviction-lawyer', 'icon' => 'building', 'title' => 'وکیل خلع ید و تصرف عدوانی', 'excerpt' => 'انتخاب عنوان صحیح دعوا و اقدام به‌موقع در خلع ید، تصرف عدوانی و رفع مزاحمت.'],
                    ['slug' => 'lease-lawyer', 'icon' => 'building', 'title' => 'وکیل تخلیه و سرقفلی', 'excerpt' => 'تخلیه عین مستأجره، سرقفلی و حقوق کسب و پیشه با توجه به نوع قرارداد.'],
                    ['slug' => 'property-contract-lawyer', 'icon' => 'scale', 'title' => 'وکیل اسناد و قرارداد ملکی', 'excerpt' => 'تنظیم و پیگیری اختلاف بیع، اجاره، پیش‌فروش و اسناد ثبتی.'],
                ],
            ],
            [
                'hub' => 'criminal-defense-lawyer',
                'items' => [
                    ['slug' => 'murder-defense', 'icon' => 'gavel', 'title' => 'وکیل قتل', 'excerpt' => 'دفاع در پرونده‌های قتل از دادسرا تا دادگاه کیفری با تکیه بر ادله و نظریه پزشکی قانونی.'],
                    ['slug' => 'fraud-defense', 'icon' => 'gavel', 'title' => 'وکیل کلاهبرداری', 'excerpt' => 'تفکیک کلاهبرداری از اختلاف مدنی و جمع‌آوری ادله فریب.'],
                    ['slug' => 'defendant-rights', 'icon' => 'scale', 'title' => 'حقوق متهم', 'excerpt' => 'دفاع از حقوق قانونی متهم از قرار تأمین تا تجدیدنظر.'],
                ],
            ],
            [
                'hub' => 'administrative-lawyer',
                'items' => [
                    ['slug' => 'admin-court-lawyer', 'icon' => 'scale', 'title' => 'وکیل دیوان عدالت اداری', 'excerpt' => 'اعتراض به آراء و تصمیمات اداری در مهلت قانونی و با لایحه مستدل.'],
                    ['slug' => 'commission-appeal', 'icon' => 'building', 'title' => 'اعتراض به رأی کمیسیون‌ها', 'excerpt' => 'آراء کمیسیون‌های شهرداری، مالیاتی و هیئت‌های اداری.'],
                    ['slug' => 'company-disputes', 'icon' => 'coins', 'title' => 'دعاوی شرکتی', 'excerpt' => 'اختلاف سهامداران، هیئت‌مدیره و انحلال شرکت در کنار مسائل اداری.'],
                ],
            ],
            [
                'hub' => 'legal-consultation',
                'items' => [
                    ['slug' => 'in-person-consult', 'icon' => 'chat', 'title' => 'مشاوره حضوری', 'excerpt' => 'بررسی مدارک و مهلت‌های قانونی در جلسه حضوری پیش از هر اقدام قضایی.'],
                    ['slug' => 'phone-consult', 'icon' => 'chat', 'title' => 'مشاوره تلفنی', 'excerpt' => 'ارزیابی اولیه پرونده برای کسانی که امکان مراجعه حضوری ندارند.'],
                    ['slug' => 'pre-claim-consult', 'icon' => 'scale', 'title' => 'مشاوره پیش از طرح دعوا', 'excerpt' => 'انتخاب مسیر توافق، ثبت یا دادگاه قبل از ثبت دادخواست.'],
                ],
            ],
        ];
    }
}

$majd_family_copy = __DIR__ . '/wordpress-majd-family-copy.php';
if (is_readable($majd_family_copy)) {
    require_once $majd_family_copy;
}

Majd_Service_Landings::init();
