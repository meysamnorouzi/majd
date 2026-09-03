# SEO URL cleanup — August 2026 audit (rows assigned to نوروزی)

Source of truth: [`src/data/legacy-redirects.json`](../src/data/legacy-redirects.json).
Everything below — Apache rules, Netlify/Cloudflare rules, the restored root
routes, the menu/sitemap exclusions and the verification script — is derived from
that one file. Change a slug there, run `npm run generate:redirects`, commit.

> **`output: "export"` means `next.config.ts` `redirects` do nothing.** Static
> exports have no server, so every 301 has to be a host rule. See
> `node_modules/next/dist/docs/01-app/02-guides/static-exports.md` → *Unsupported
> Features*.

---

## What ships in this repo

| Piece | File |
|---|---|
| Redirect + restored-page map | `src/data/legacy-redirects.json` |
| Typed accessors / lookup helpers | `src/data/legacy-redirects.ts` |
| Apache / LiteSpeed / cPanel 301s | `public/.htaccess` (generated block) |
| Netlify / Cloudflare Pages 301s | `public/_redirects` (generated block) |
| Generator (`--check` fails a stale build) | `scripts/generate-redirects.mjs` |
| Pre-deploy / post-deploy verifier | `scripts/check-redirects.mjs` |
| Client-side safety net for in-app links | `src/components/layout/LegacyRedirectGuard.tsx` |
| Restored root URLs (`/وکیل-حقوقی/` …) | `src/app/[legacySlug]/page.tsx` |
| Categorized service pages | `/{family-lawyer\|property-lawyer\|criminal-defense-lawyer\|legal-consultation\|administrative-lawyer}/<slug>/` |
| Pillar hub pages | `/family-lawyer/`, `/property-lawyer/`, `/criminal-defense-lawyer/`, `/legal-consultation/`, `/administrative-lawyer/` |

Retired slugs are filtered out of the mega menu, related-service rails and `sitemap.xml`, so nothing on the site links into a 301 any more.

Moved service URLs must **301 to the new path**, not `noindex`. `noindex` on `/services/<slug>/` tells Google to drop a ranking URL instead of transferring it. The empty `/services/detail/` shell stays `noindex` because it is not a public URL.

`/services/` itself 301s to `/`. Civil/administrative posts now live under `/administrative-lawyer/<slug>/`. Consultation lives at `/legal-consultation/`.

```bash
npm run generate:redirects   # rewrite the generated blocks from the JSON
npm run check:redirects      # verify every target exists in WordPress
node scripts/check-redirects.mjs --live   # after deploy: confirm the 301s
```

---

## The audit rows

### ۳۰۱ ریدایرکت — handled by the host rules

| از | به | یادداشت ممیزی |
|---|---|---|
| `/وکیل-خلع-ید/` | `/property-lawyer/وکیل-خلع-ید/` | آدرس ریشه‌ای رنک‌دار به ساختار جدید خدمات ملکی |
| `/وکیل-متخصص-سرقفلی/` | `/property-lawyer/وکیل-متخصص-سرقفلی/` | آدرس ریشه‌ای سرقفلی به ساختار جدید خدمات ملکی |
| `/وکیل-امور-خانواده/` | `/family-lawyer/وکیل-متخصص-دعاوی-خانواده/` | آدرس ریشه‌ای امور خانواده به صفحه وکیل متخصص دعاوی خانواده |
| `/services/وکیل-ملک-ورثه-ای/` | `/property-lawyer/وکیل-تقسیم-ترکه/` | ریدایرکت روی صفحه تقسیم ترکه و حذف از زیرمنو ملکی |
| `/services/وکیل-تصرف-عدوانی/` | `/property-lawyer/وکیل-خلع-ید-و-تخلیه/` | ریدایرکت روی صفحه وکیل خلع ید و تخلیه |
| `/services/وکیل-تخلیه-ملک-در-تهران/` | `/property-lawyer/وکیل-خلع-ید-و-تخلیه/` | ریدایرکت روی صفحه وکیل خلع ید و تخلیه |
| `/services/وکیل-متخصص-املاک/` | `/property-lawyer/` | هاب ملکی به پیلار وکیل ملکی |
| `/services/وکیل-ملکی-در-تهرانپارس/` | `/property-lawyer/` | هاب ملکی به پیلار وکیل ملکی |
| `/services/وکیل-زمین-در-شرق-تهران/` | `/property-lawyer/` | هاب ملکی به پیلار وکیل ملکی |
| `/services/وکیل-ملکی-شرق-تهران/` | `/property-lawyer/` | هاب ملکی به پیلار وکیل ملکی |
| `/services/وکیل-سرقفلی/` | `/property-lawyer/وکیل-متخصص-سرقفلی/` | ریدایرکت روی وکیل متخصص سرقفلی |
| `/services/وکیل-قتل/` | `/criminal-defense-lawyer/وکیل-قتل/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-متخصص-سرقفلی/` | `/property-lawyer/وکیل-متخصص-سرقفلی/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-ملکی/` | `/property-lawyer/` | هاب ملکی به پیلار وکیل ملکی |
| `/services/وکیل-خانواده/` | `/family-lawyer/وکیل-متخصص-دعاوی-خانواده/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-رابطه-نامشروع/` | `/criminal-defense-lawyer/وکیل-رابطه-نامشروع/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-خلع-ید/` | `/property-lawyer/وکیل-خلع-ید/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-جنایی/` | `/criminal-defense-lawyer/وکیل-جنایی/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-خیانت-در-امانت/` | `/criminal-defense-lawyer/وکیل-خیانت-در-امانت/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/وکیل-مواد-مخدر/` | `/criminal-defense-lawyer/وکیل-مواد-مخدر/` | انتقال ساختار؛ ۳۰۱ بدون noindex |
| `/services/کیفری/` | `/criminal-defense-lawyer/` | هاب کیفری به پیلار وکیل کیفری |
| `/services/بهترین-وکیل/` | `/legal-consultation/` | ریدایرکت روی پیلار مشاوره حقوقی |
| `/services/` | `/` | فهرست خدمات حذف شد |
| `/services/moshavere-hoghooghi/` | `/legal-consultation/` | مشاوره حقوقی صفحه پیلار مستقل دارد |
| `/services/سگی-که-خانه-میلیاردی-به-نام-وی-شد/` | `/blogs/…/` | تبدیل به بلاگ پست |
| `/services/احکام-صادره-برای-املاک-خاص/` | `/blogs/…/` | تبدیل به بلاگ پست |
| `/services/اصل-۴۹-قانون-اساسی/` | `/blogs/…/` | تبدیل به بلاگ پست |

### بازگردانی صفحه — restored at their original root URLs

| مسیر | اسلاگ وردپرس | یادداشت |
|---|---|---|
| `/وکیل-حقوقی/` | `وکیل-حقوقی` | بازگردانی صفحه |

Each renders at its original path with a self-referencing canonical, pulling its
body from the WordPress post named in the table. `dynamicParams = false` keeps
every other root path a 404.

---

## What must be done in WordPress

The frontend is headless — content, categories and slugs all come from
`admin.vakilmajd.com`. These four items cannot be done from this repo.

### 1. Republish the remaining restored post *(required — otherwise `/وکیل-حقوقی/` renders empty)*

Create/restore a published post for this slug (Settings → Permalink → slug must
match **exactly**, including the hyphens):

- `وکیل-حقوقی`

Use the old content from the WordPress backup. Keep it **out of** the
`ملکی` / `خانواده` / `کیفری` / `مشاوره-حقوقی` / `اداری` service categories — the mega menu and pillar hubs are built from those categories, and adding it there would
publish a second URL for the same content.

`وکیل-خلع-ید` and `وکیل-متخصص-سرقفلی` now live at
`/property-lawyer/<slug>/`. Assign those posts to the `ملکی` category (or a
child of it) so the new URLs have a page.

Verify with `npm run check:redirects` — it reports each slug as found or missing.

### 2. Re-categorise the three articles *(تبدیل به بلاگ پست)*

- `سگی-که-خانه-میلیاردی-به-نام-وی-شد`
- `احکام-صادره-برای-املاک-خاص`
- `اصل-۴۹-قانون-اساسی`

Remove the service categories (`ملکی` and its children) and assign a blog
category. The slug must not change — the 301s point at `/blogs/<same-slug>/`.
Once the service category is gone the post drops out of the mega menu and the
pillar hub cards on its own.

### 3. Fix the category of `وکیل-ملک-ورثه-ای` *(حذف از زیرمنو ملکی)*

The audit lists this post under **خانواده** but it is showing in the **ملکی**
submenu, so it currently carries both categories. Remove the `ملکی` category
(and any `ملکی` child category) from the post.

The frontend already hides it either way — it is in the redirect map, and
retired slugs are filtered out of the menu — but the WordPress fix is what keeps
the data honest.

### 4. Confirm the redirect targets exist

`npm run check:redirects` queries WordPress for every target slug and reports
anything missing. The targets that must resolve:

- `وکیل-تقسیم-ترکه` (post)
- `وکیل-خلع-ید-و-تخلیه` (post)
- `/property-lawyer/` and the other four pillar hubs (static pages)
- `/legal-consultation/` (consultation hub)

If any of them comes back missing, fix the slug in
`src/data/legacy-redirects.json` and re-run `npm run generate:redirects`.

---

## Deploying

1. `npm run build` → `out/`
2. Upload `out/` **including the dotfile `.htaccess`** (many FTP clients hide it).
3. `node scripts/check-redirects.mjs --live`
4. In Google Search Console: re-submit `sitemap.xml`, then request indexing for
   the three restored URLs.

If the host is nginx rather than Apache, translate the generated block in
`public/.htaccess` into `return 301` rules — `_redirects` only covers
Netlify/Cloudflare Pages.

---

## Not included (assigned to عسگریان)

- `/services/بهترین-وکیل-تخلیه-ملک/` → صفحه وکیل خلع ید و تخلیه
- `/services/وکیل-کلاهبرداری-در-قرارداد-ملکی/` → آپدیت بعنوان لندینگ سرویس

Adding the first one is a two-line entry in `src/data/legacy-redirects.json`
plus `npm run generate:redirects`.
