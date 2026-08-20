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
| Restored root URLs (`/وکیل-خلع-ید/` …) | `src/app/[legacySlug]/page.tsx` |
| Category hub pages (`/services/ملکی/`) | `resolveCategoryHub` in `src/lib/wordpress/services.ts` |

Retired slugs are filtered out of the mega menu, the `/services/` index, the
related-services rails and `sitemap.xml`, so nothing on the site links into a
301 any more.

```bash
npm run generate:redirects   # rewrite the generated blocks from the JSON
npm run check:redirects      # verify every target exists in WordPress
node scripts/check-redirects.mjs --live   # after deploy: confirm the 301s
```

The checker reads `WP_API_KEY` from `.env` / `.env.local` and sends it as
`X-Api-Key`, which is what gets past `plugins/whitelist.php`. Without it the
plugin answers 403 from any IP that is not on its allowlist.

If the checker reports `fetch failed (UNABLE_TO_VERIFY_LEAF_SIGNATURE)`, the
WordPress host is serving an incomplete certificate chain — browsers accept it,
Node does not. Re-run as `npm run check:redirects -- --insecure` to skip
verification for that run; the real fix is installing the full chain on the
WordPress host, which also removes the `NODE_TLS_REJECT_UNAUTHORIZED` shim in
`next.config.ts`.

---

## The audit rows

### ۳۰۱ ریدایرکت — handled by the host rules

| از | به | یادداشت ممیزی |
|---|---|---|
| `/services/وکیل-ملک-ورثه-ای/` | `/services/بهترین-وکیل-تقسیم-ترکه/` | ریدایرکت روی صفحه تقسیم ترکه و حذف از زیرمنو ملکی |
| `/services/وکیل-تصرف-عدوانی/` | `/وکیل-خلع-ید/` | ریدایرکت روی صفحه وکیل خلع ید و تخلیه |
| `/services/وکیل-تخلیه-ملک-در-تهران/` | `/وکیل-خلع-ید/` | ریدایرکت روی صفحه وکیل خلع ید و تخلیه |
| `/services/وکیل-متخصص-املاک/` | `/services/ملکی/` | ریدایرکت ۳۰۱ روی صفحه هاب ملکی |
| `/services/وکیل-ملکی-در-تهرانپارس/` | `/services/ملکی/` | ریدایرکت ۳۰۱ روی صفحه هاب ملکی |
| `/services/وکیل-زمین-در-شرق-تهران/` | `/services/ملکی/` | ریدایرکت ۳۰۱ روی صفحه هاب ملکی |
| `/services/وکیل-ملکی-شرق-تهران/` | `/services/ملکی/` | ریدایرکت ۳۰۱ روی صفحه هاب ملکی |
| `/services/وکیل-سرقفلی/` | `/وکیل-متخصص-سرقفلی/` | ریدایرکت روی وکیل سرقفلی |
| `/services/بهترین-وکیل/` | `/services/moshavere-hoghooghi/` | ریدایرکت روی مشاوره حقوقی |
| `/services/سگی-که-خانه-میلیاردی-به-نام-وی-شد/` | `/blogs/…/` | تبدیل به بلاگ پست |
| `/services/احکام-صادره-برای-املاک-خاص/` | `/blogs/…/` | تبدیل به بلاگ پست |
| `/services/اصل-۴۹-قانون-اساسی/` | `/blogs/…/` | تبدیل به بلاگ پست |

### بازگردانی صفحه — restored at their original root URLs

| مسیر | اسلاگ وردپرس | یادداشت |
|---|---|---|
| `/وکیل-خلع-ید/` | `وکیل-خلع-ید` | روی کلمه کلیدی «وکیل خلع ید» رنک دارد |
| `/وکیل-متخصص-سرقفلی/` | `وکیل-متخصص-سرقفلی` | بازگردانی صفحه |
| `/وکیل-حقوقی/` | `وکیل-حقوقی` | بازگردانی صفحه |

Each renders at its original path with a self-referencing canonical, pulling its
body from the WordPress post named in the table. `dynamicParams = false` keeps
every other root path a 404.

---

## What must be done in WordPress

The frontend is headless — content, categories and slugs all come from
`admin.vakilmajd.com`. These four items cannot be done from this repo.

### 1. Republish one deleted post *(required — otherwise that restored page renders empty)*

Verified against the live service list (Aug 2026): posts already exist for
`وکیل-خلع-ید` and `وکیل-متخصص-سرقفلی`, so those two restored pages fill
themselves in with no WordPress work. Only one is missing:

- `وکیل-حقوقی` — no post with this slug. Restore it from the backup, with the
  permalink slug matching **exactly**.

Use the old content from the WordPress backup. Keep them **out of** the
`ملکی` / `خانواده` / `کیفری` service categories — the mega menu and the
`/services/` index are built from those categories, and adding them there would
publish a second URL for the same content.

Verify with `npm run check:redirects` — it reports each slug as found or missing.

### 2. Re-categorise the three articles *(تبدیل به بلاگ پست)*

- `سگی-که-خانه-میلیاردی-به-نام-وی-شد`
- `احکام-صادره-برای-املاک-خاص`
- `اصل-۴۹-قانون-اساسی`

Remove the service categories (`ملکی` and its children) and assign a blog
category. The slug must not change — the 301s point at `/blogs/<same-slug>/`.
Once the service category is gone the post drops out of the mega menu and the
`/services/` index on its own.

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

All targets were verified against the live service list in August 2026:
`بهترین-وکیل-تقسیم-ترکه`, `ملکی`, `moshavere-hoghooghi`, and the two restored
root paths. Re-run the checker after any slug change in WordPress.

If a target comes back missing, fix the slug in
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
