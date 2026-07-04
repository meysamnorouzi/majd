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
| [`public/wordpress-cors-mu-plugin.php`](../public/wordpress-cors-mu-plugin.php) | `majd-headless-cors.php` |
| [`public/wordpress-majd-account-api.php`](../public/wordpress-majd-account-api.php) | `wordpress-majd-account-api.php` |
| [`public/wordpress-majd-contact-api.php`](../public/wordpress-majd-contact-api.php) | `wordpress-majd-contact-api.php` |

### Server environment

```bash
MAJD_FRONTEND_ORIGIN=https://vakilmajd.com
```

Set this to your Next.js production URL (also used for Zarinpal return redirect to `/checkout/success/`).

### Static hosting rewrites

[`public/_redirects`](../public/_redirects) enables client-side detail routes without rebuild:

- `/blog/post/*` → blog post shell
- `/shop/product/*` → shop product shell
- `/courses/view/*` → course detail shell

Configure equivalent rewrites on nginx/Apache if not using Netlify.

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

After installing [`wordpress-majd-contact-api.php`](../public/wordpress-majd-contact-api.php), a new admin menu appears:

**پیام‌های تماس** — lists all form submissions with name, phone, subject, and status (جدید / بررسی شده).

New submissions also trigger an email to the WordPress admin address.

---

## API reference

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
NEXT_PUBLIC_WP_URL=https://vakilmajd.com
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

---

## Local development

Demo account (dev only): `demo@vakilmajd.com` / `demo1234` — see [`src/lib/auth/static-login.ts`](../src/lib/auth/static-login.ts).

Point `NEXT_PUBLIC_WP_URL` at your local or staging WordPress for live API testing.
