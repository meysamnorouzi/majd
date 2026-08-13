# Majd App — Improvement Backlog

Prioritized security, reliability, and quality items. **P0 items are fixed** (see git history / `plugins/whitelist.php` v3.0).

Last reviewed: 2026-08-09

---

## P1 — High (fix before re-enabling e-commerce / scaling)

### 1. Stored XSS via unsanitized WordPress HTML

**Files:** `src/components/content/WpRichContent.tsx` (and consumers: blog, services, product pages)

WordPress `content.rendered` is injected via `dangerouslySetInnerHTML` without sanitization. A compromised WP admin or malicious post can run scripts and steal JWT/cart tokens from `sessionStorage` / `localStorage`.

**Fix:** Sanitize with DOMPurify (or isomorphic-dompurify) before render; tighten WP content permissions.

---

### 2. Static login credentials exposed to client bundle

**Files:** `src/lib/auth/static-login.ts`, `src/components/account/LoginForm.tsx`

Uses `NEXT_PUBLIC_STATIC_LOGIN_*` (embedded in client JS), hardcoded dev defaults (`demo@vakilmajd.com` / `demo1234`), and a magic token `__MAJD_STATIC_AUTH__` settable in `sessionStorage`.

**Fix:** Remove `NEXT_PUBLIC_` prefix; gate static login behind `NODE_ENV === "development"` only; never ship in production builds.

---

### 3. Open redirect after login

**File:** `src/components/account/LoginForm.tsx`

`/account/login/?redirect=https://evil.com` redirects users off-site after login.

**Fix:** Allow only same-origin relative paths (start with `/`, reject `//` and absolute URLs).

---

### 4. Unvalidated payment redirect URL

**File:** `src/components/checkout/CheckoutForm.tsx`

`redirect_url` from WooCommerce Store API is used for `window.location.href` without an allowlist.

**Fix:** Allowlist payment hostnames (e.g. Zarinpal domains) before redirect.

---

### 5. No rate limiting on public write endpoints

**Files:** `plugins/wordpress-majd-contact-api.php`, `plugins/wordpress-majd-account-api.php`

| Endpoint | Risk |
|----------|------|
| `POST /majd/v1/contact` | Spam / DoS (honeypot only) |
| `POST /majd/v1/auth/login` | Brute-force |
| `POST /majd/v1/auth/register` | Mass account creation |

**Fix:** Add rate limiting (WP transients, Cloudflare, fail2ban, or a security plugin).

---

### 6. Missing security headers

**File:** `next.config.ts` — no `headers()` config; no hosting-level CSP.

Missing: CSP, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, HSTS.

**Fix:** Configure at CDN/host (Cloudflare, Netlify `_headers`, Apache `.htaccess`).

---

### 7. E-commerce stack disabled but fully implemented

**Routes returning 404:** `/shop/`, `/courses/`, `/cart/`, `/checkout/`, `/account/*`

**Providers disabled:** `AuthProvider`, `CartProvider` in `ClientProviders.tsx`

**Fix:** Finish Zarinpal setup and re-enable, or remove dead code. Document a single re-enable checklist.

---

### 8. Zero automated tests and no CI/CD

No test files, no `.github/workflows/`, no `typecheck` script.

**Fix:** Add CI with `lint` + `tsc --noEmit` + `next build`; start unit tests for `lib/` modules.

---

## P2 — Medium (quality, reliability, UX)

### 9. Silent API failures

**File:** `src/lib/wordpress/fetch.ts` — `wpFetch()` never throws; client helpers return `[]`/`null` with no error distinction.

**Affected:** `BlogSectionLive`, `CoursesCatalog`, `ShopPageContent`, `LatestBlogSection`, nav dropdowns, `useTeamMembers`.

**Fix:** Propagate errors; add error UI; consider Sentry for production.

---

### 10. Duplicate client-side API calls

Categories, services, team, and posts are fetched independently from multiple components on the same page. All use `cache: "no-store"`.

**Fix:** Shared data layer (React Query/SWR) or context providers.

---

### 11. No React error boundaries

No `error.tsx`, `global-error.tsx`, or `loading.tsx` anywhere.

**Fix:** Add route-group error and loading UI.

---

### 12. Static export limits SEO for dynamic content

`output: "export"` + `images.unoptimized: true` — dynamic content loads client-side after shell.

**Fix:** Accept tradeoff or move to ISR/SSR if SEO becomes critical.

---

### 13. CORS configuration risks

**Files:** `plugins/whitelist.php`, `plugins/wordpress-cors-mu-plugin.php`

Substring match for `localhost` in the CORS mu-plugin is overly broad.

**Fix:** Explicit origin allowlist; avoid substring matching.

---

### 14. JWT and cart tokens in browser storage

**Files:** `src/lib/woocommerce/account-client.ts`, `store-client.ts`

XSS can exfiltrate tokens. Mitigate with HTML sanitization (P1 #1) and CSP (P1 #6).

**Fix (long-term):** HttpOnly cookies for auth (requires WP changes).

---

### 15. `out.zip` committed to git

Build artifact tracked in repo.

**Fix:** Add to `.gitignore` and remove from git history.

---

### 16. Duplicate utility code

`stripHtml()`, `formatPrice()`, `slugFromPathname()`, `categoryLabel()` duplicated across files.

**Fix:** Consolidate into shared `lib/` utilities.

---

### 17. Documentation gaps

`README.md` is stale create-next-app boilerplate. No architecture diagram or e-commerce re-enable checklist.

**Fix:** Update README; link to `docs/wordpress-setup.md` and this file.

---

## P3 — Low (polish)

### 18. Accessibility gaps

Mobile menu missing `aria-expanded` / `aria-controls`; no skip-to-content link; loading spinners lack `role="status"`; honeypot label in English on Persian site.

**File:** `src/components/layout/Header.tsx`, `ContactForm.tsx`

---

### 19. Weak client-side form validation

Contact, checkout, and register forms rely on minimal HTML validation.

**Fix:** Mirror server rules on the client; use a schema library if forms grow.

---

### 20. Third-party script risk (Goftino chat)

**File:** `src/app/layout.tsx` — inline widget on every page.

**Fix:** CSP with nonce; load only on contact/support pages if possible.

---

### 21. Bundle / asset hygiene

Broad `motion` imports; image filenames with spaces in `public/images/`.

**Fix:** Lazy-load motion below fold; rename assets for clean URLs.

---

### 22. Checkout success page shows unverified order ID

**File:** `src/components/checkout/CheckoutSuccessContent.tsx` — order ID from query string without server verification.

---

## Recommended action order

1. P1 #1 — Sanitize WP HTML + security headers
2. P1 #2 — Remove/guard static login for production
3. P1 #5 — Rate limit login/contact
4. P1 #3–4 — Redirect allowlists (login + payment)
5. Decide: re-enable e-commerce (P1 #7) or remove dead code
6. P1 #8 — CI + tests
7. P2 — Error handling, API dedup, docs
8. P3 — A11y and polish

---

## What’s working well

- TypeScript strict mode, no `any` abuse
- JWT auth uses `AUTH_KEY` from wp-config (account API)
- Server-only `WP_API_KEY` for build-time fetches (not in client bundle)
- Persian RTL, SEO (sitemap, robots, JsonLd)
- Contact API: honeypot + server sanitization
- Order ownership checks in account API
