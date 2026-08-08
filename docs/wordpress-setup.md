# WordPress Backend Setup — Majd Next.js

This site is a **static Next.js frontend** (`output: "export"`) backed by **WordPress + WooCommerce**. Blog, shop, and courses load **live from WordPress APIs** in the browser. Cart, checkout, and the user account panel also call WordPress at runtime.

## Required WordPress plugins

| Plugin | Purpose |
|--------|---------|
| **WooCommerce** | Products, orders, Store API, checkout |
| **Zarinpal gateway** | Online payment (Iran) — install a maintained WooCommerce Zarinpal plugin |

## Mu-plugins (copy to `wp-content/mu-plugins/`)

| Repo file | Install as |
|-----------|------------|
| [`plugins/wordpress-cors-mu-plugin.php`](../plugins/wordpress-cors-mu-plugin.php) | `majd-headless-cors.php` |
| [`plugins/wordpress-majd-account-api.php`](../plugins/wordpress-majd-account-api.php) | `wordpress-majd-account-api.php` |
| [`plugins/wordpress-majd-contact-api.php`](../plugins/wordpress-majd-contact-api.php) | `wordpress-majd-contact-api.php` |
| [`plugins/wordpress-majd-team-api.php`](../plugins/wordpress-majd-team-api.php) | `wordpress-majd-team-api.php` |

### Server environment

```bash
MAJD_FRONTEND_ORIGIN=https://vakilmajd.com
```

Set this to your Next.js production URL (also used for Zarinpal return redirect to `/checkout/success/`).

### Static hosting rewrites

Detail routes load content from WordPress in the browser. The static host must rewrite unknown slugs to the shell HTML (otherwise Apache returns “Not Found”).

| Host | Config |
|------|--------|
| Netlify / Cloudflare Pages | [`public/_redirects`](../public/_redirects) |
| Apache / LiteSpeed / cPanel | [`public/.htaccess`](../public/.htaccess) (copied into `out/` on build) |

- `/blog/post/*` → `/blog/post/index.html`
- `/shop/product/*` → `/shop/product/index.html`
- `/courses/view/*` → `/courses/view/index.html`

For nginx, add equivalent `try_files` rules pointing at those `index.html` shells.

---

## WooCommerce configuration

1. **Settings → General** — currency (IRT/IRR).
2. **Settings → Accounts** — enable customer registration.
3. **Settings → Products** — virtual products for digital courses.
4. **Settings → Payments** — enable Zarinpal; note the gateway **ID** (e.g. `zarinpal`) for `NEXT_PUBLIC_WC_PAYMENT_METHOD`.
5. **Permalinks** — “Post name” (required for REST API).

### Product categories (courses)

Create these **product category slugs** exactly:

| Slug | Format |
|------|--------|
| `online-webinar` | وبینار آنلاین (بدون دسترسی آفلاین) |
| `online-offline` | دوره آنلاین + آفلاین (اسکای‌روم + اسپات‌پلیر) |
| `hybrid-full` | دوره حضوری + آنلاین + آفلاین |
| `session-hybrid` | نشست حضوری + آنلاین (بدون لایسنس آفلاین) |
| `session-inperson` | نشست حضوری |

Legacy slugs `hozoori` and `offline-spotplayer` are still recognized by the frontend but should be replaced in WooCommerce.

Assign **one** course category per course product. Shop products should **not** use these categories.

### Course product fields

On each course product edit screen, use the **اطلاعات دوره (موسسه مجد)** meta box:

- **مدت دوره** — e.g. `۱۲ جلسه × ۲ ساعت`
- **سطح** — e.g. `مقدماتی`
- **سرفصل‌ها** — one item per line
- **نکات برجسته** — one item per line

Also set: title, slug, price, image, long/short description, **Virtual** product.

---

## Course catalog (migrate once)

Create WooCommerce products with these slugs (from legacy Next data). Full details are in [`src/data/course-formats-data.ts`](../src/data/course-formats-data.ts).

### وبینار آنلاین (`online-webinar`)

| Slug | Title |
|------|-------|
| `course-webinar-civil-law-updates` | به‌روزرسانی‌های حقوق مدنی |
| `course-webinar-registry-disputes` | اختلافات ثبتی |
| `course-webinar-ecommerce-law` | حقوق تجارت الکترونیک |
| `course-webinar-negotiation-skills` | مذاکره و فن بیان |

### آنلاین + آفلاین (`online-offline`)

| Slug | Title |
|------|-------|
| `course-offline-qm-book1` | جامع قانون مجازات — کتاب اول |
| `course-offline-criminal-procedure` | آیین دادرسی کیفری |
| `course-offline-contracts-intro` | مقدمه قراردادها |
| `course-offline-debt-collection` | وصول مطالبات |

### حضوری + آنلاین + آفلاین (`hybrid-full`)

| Slug | Title |
|------|-------|
| `course-hozoori-criminal-defense` | اصول دفاع کیفری |
| `course-hozoori-family-law` | حقوق خانواده |

### نشست حضوری + آنلاین (`session-hybrid`)

| Slug | Title |
|------|-------|
| `course-hozoori-commercial-contracts` | تنظیم قرارداد تجاری |

### نشست حضوری (`session-inperson`)

| Slug | Title |
|------|-------|
| `course-hozoori-property-law` | حقوق ملکی |

### Shop (no course category)

| Slug | Title |
|------|-------|
| `ketab-hoghooghi` | مجموعه قوانین مدنی |
| `form-gharardad` | بسته فرم‌های قراردادی |
| `moshavere-online` | جلسه مشاوره آنلاین |

---

## Spot Player license workflow

1. Customer pays via Zarinpal → order status `processing` or `completed`.
2. Admin opens order in WooCommerce → sidebar **لایسنس اسپات پلیر (موسسه مجد)**.
3. Enter license code → save.
4. Customer sees code in **پنل کاربری** (`/account/`).

Guest orders are linked by **billing email** when the customer registers or logs in.

---

## Contact form

The contact page (`/contact/`) submits to WordPress via `POST /wp-json/majd/v1/contact`.

After installing [`plugins/wordpress-majd-contact-api.php`](../plugins/wordpress-majd-contact-api.php), a new admin menu appears:

**پیام‌های تماس** — lists all form submissions with name, phone, subject, and status (جدید / بررسی شده).

New submissions also trigger an email to the WordPress admin address.

---

## Team members (اعضای تیم)

Team profiles are managed in WordPress under **اعضای تیم** (custom post type installed by [`plugins/wordpress-majd-team-api.php`](../plugins/wordpress-majd-team-api.php)).

### Adding a team member

1. **اعضای تیم → افزودن عضو**
2. **Title** — full name (e.g. مسعود جوکار درزی)
3. **Slug** — URL slug (e.g. `masoud-jokar-darzi`)
4. **خلاصه (Excerpt)** — short bio shown on cards
5. **Featured image** — portrait photo
6. **Page attributes → Order** — display order (lower = first)
7. Fill meta boxes:
   - **اطلاعات حرفه‌ای** — role, specialty, education, experience years
   - **بیوگرافی کامل** — one paragraph per line
   - **تصاویر** — wide banner + gallery (`URL | alt text` per line)
   - **تماس و شبکه‌های اجتماعی** — phone, email, location, social links
   - **حوزه‌ها و دستاوردها** — one item per line

Publish to show on `/team/` and the homepage team section. Draft to hide without deleting.

### REST API

- `GET /wp-json/wp/v2/team?per_page=100&_embed&orderby=menu_order&order=asc` — all members
- `GET /wp-json/wp/v2/team?slug={slug}&_embed` — single member

Each response includes a `majd_team` object with structured fields (role, fullBio, gallery, etc.).

Build-time fetch uses `WP_API_KEY`. Homepage team section and contact lawyer picker fetch live in the browser. Offline fallback: founder only in [`src/data/site.ts`](../src/data/site.ts) (`fallbackTeamMembers`).

**New member slugs** need a static rebuild for detail pages (`/team/{slug}/`). The team list page updates live.

---

## Legal services (خدمات حقوقی)

Services use the **same WordPress Posts API as the blog** (`/wp-json/wp/v2/posts`), grouped by **categories**.

### Category structure (mega menu)

| Category slug | Mega menu label | Notes |
|---------------|-----------------|-------|
| `ملکی` | وکیل ملکی | Layer 1 |
| `خانواده` | وکیل خانواده | Layer 1 — merges with `خانواده-fa` / `khanavade-fa` |
| `کیفری` | وکیل کیفری | Layer 1 |

- **Layer 2** (mega menu middle column): child categories under each root (e.g. sub-topics).
- **Layer 3** (mega menu left column): **posts** assigned to the hovered child category.
- Posts assigned directly to a root category (not in a child) appear in layer 2 as direct links.

Create categories in **Posts → Categories** with the slugs above. Assign each service post to the appropriate child category.

### Service post content

Each service is a normal **Post** with title, slug, excerpt, featured image, and content.

Structured UI blocks (highlights, features, FAQs, process steps, etc.) are stored in a JSON block inside the post content:

```html
<!-- majd:service
{
  "icon": "building",
  "highlights": ["نکته ۱", "نکته ۲"],
  "features": [{ "title": "...", "description": "..." }],
  "processSteps": [{ "step": 1, "title": "...", "description": "..." }],
  "cases": ["..."],
  "faqs": [{ "q": "...", "a": "..." }],
  "whyNeed": { "title": "...", "paragraphs": ["..."] },
  "longDescription": ["پارagraph ۱", "پارagraph ۲"]
}
-->

<p>Additional HTML content rendered below the structured sections.</p>
```

The frontend parses this block and renders the same UI components as before (features grid, FAQ accordion, timeline, etc.). Remaining HTML is shown via `WpRichContent`.

### REST API (same as blog)

- `GET /wp-json/wp/v2/categories?per_page=100` — category tree
- `GET /wp-json/wp/v2/posts?categories={ids}&per_page=100&_embed` — service posts
- `GET /wp-json/wp/v2/posts?slug={slug}&_embed` — single service

Build-time fetch uses `WP_API_KEY`. Mega menu and home section fetch live in the browser. Fallback: [`src/data/site.ts`](../src/data/site.ts).

**New post slugs** need a static rebuild for detail pages. Mega menu and home update live.

---

## API reference

### WordPress — Team

- `GET /wp-json/wp/v2/team?per_page=100&_embed&orderby=menu_order&order=asc`

### WordPress — Blog

- `GET /wp-json/wp/v2/posts?per_page=N&_embed`

### WooCommerce Store API

- `GET /wp-json/wc/store/v1/products`
- `GET /wp-json/wc/store/v1/products?slug={slug}`
- `GET /wp-json/wc/store/v1/products?category={category_slug}`
- Cart/checkout: `/wp-json/wc/store/v1/cart/*`, `/checkout`

Course meta appears under `extensions.majd` on product responses (requires account mu-plugin).

### Majd custom API

- `POST /wp-json/majd/v1/auth/login`
- `POST /wp-json/majd/v1/auth/register`
- `GET /wp-json/majd/v1/auth/me` (Bearer token)
- `GET /wp-json/majd/v1/me/orders`
- `GET /wp-json/majd/v1/me/orders/{id}`
- `POST /wp-json/majd/v1/contact` — `{ name, phone, subject, message }`

---

## Next.js environment

Copy [`.env.example`](../.env.example):

```env
NEXT_PUBLIC_WP_URL=admin.vakilmajd.com
NEXT_PUBLIC_SITE_URL=https://vakilmajd.com
NEXT_PUBLIC_WC_PAYMENT_METHOD=zarinpal
```

---

## Verification checklist

1. `GET {WP_URL}/wp-json/wp/v2/posts?per_page=1` → JSON array.
2. `GET {WP_URL}/wp-json/wc/store/v1/products?slug=course-offline-qm-book1` → product with `extensions.majd`.
3. New blog post in WP → visible on `/blog/` without redeploying Next.
4. New course product in WP → visible on `/courses/` without redeploy.
5. Add to cart from browser → no CORS errors.
6. Checkout → Zarinpal → redirect to `/checkout/success/`.
7. Enter license on order → visible in account panel after login.
8. Submit contact form on `/contact/` → toast success; message appears under **پیام‌های تماس** in WP admin.
9. Add a team member in **اعضای تیم** → visible on `/team/` without redeploying Next.

---

## Local development

Demo account (dev only): `demo@vakilmajd.com` / `demo1234` — see [`src/lib/auth/static-login.ts`](../src/lib/auth/static-login.ts).

Point `NEXT_PUBLIC_WP_URL` at your local or staging WordPress for live API testing.
