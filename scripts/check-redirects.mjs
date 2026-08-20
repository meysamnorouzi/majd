#!/usr/bin/env node
/**
 * Verifies the SEO redirect map in `src/data/legacy-redirects.json`.
 *
 *   node scripts/check-redirects.mjs             # every 301 target exists in WordPress
 *   node scripts/check-redirects.mjs --live      # after deploy: old URLs really 301
 *   node scripts/check-redirects.mjs --insecure  # WP host has an incomplete TLS chain
 *
 * The redirect targets were written from the SEO audit sheet, not read back off
 * the live site — run this before deploying so a typo in a Persian slug does not
 * turn a ranking page into a redirect chain ending in 404.
 *
 * Env: NEXT_PUBLIC_WP_URL (default https://admin.vakilmajd.com)
 *      NEXT_PUBLIC_SITE_URL (default https://vakilmajd.com)
 *      WP_API_KEY (optional, sent as X-Api-Key)
 */

// The WordPress host serves an incomplete certificate chain that browsers
// tolerate and Node does not — the same reason next.config.ts relaxes
// verification in development. Opt in explicitly; never on by default.
if (process.argv.includes("--insecure")) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { redirects, restoredPages } = JSON.parse(
  readFileSync(resolve(root, "src/data/legacy-redirects.json"), "utf8"),
);

const WP = (process.env.NEXT_PUBLIC_WP_URL ?? "https://admin.vakilmajd.com").replace(/\/$/, "");
const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vakilmajd.com").replace(/\/$/, "");
const headers = process.env.WP_API_KEY
  ? { Accept: "application/json", "X-Api-Key": process.env.WP_API_KEY }
  : { Accept: "application/json" };

let failures = 0;
const seenErrorCodes = new Set();

const TLS_CODES = new Set([
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "CERT_HAS_EXPIRED",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
]);

/**
 * Node's fetch reports every failure as "fetch failed" — the code lives on
 * `cause`, or inside `cause.errors` when a host resolves to several addresses.
 */
function describeError(error) {
  const cause = error?.cause;
  const code =
    cause?.code ?? cause?.errors?.find((e) => e?.code)?.code ?? error?.code;
  if (code) seenErrorCodes.add(code);
  const detail = code ?? cause?.message;
  return detail ? `${error.message} (${detail})` : error.message;
}

function connectionHint() {
  const codes = [...seenErrorCodes];
  if (!codes.length) return null;
  if (codes.some((code) => TLS_CODES.has(code))) {
    return [
      "The WordPress host is reachable but its TLS chain is incomplete —",
      "browsers accept it, Node does not (same issue next.config.ts works",
      "around in development).",
      "",
      "  Re-run with:  npm run check:redirects -- --insecure",
      "",
      "The real fix is installing the full certificate chain on the WordPress host.",
    ].join("\n");
  }
  if (codes.some((code) => code === "ENOTFOUND" || code === "EAI_AGAIN")) {
    return "DNS could not resolve the host — check NEXT_PUBLIC_WP_URL.";
  }
  if (
    codes.some((code) =>
      ["ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "UND_ERR_CONNECT_TIMEOUT"].includes(code),
    )
  ) {
    return "The connection was refused or timed out — a firewall, VPN or proxy is blocking this machine.";
  }
  return null;
}

function report(ok, label, detail) {
  if (!ok) failures += 1;
  console.log(`${ok ? "✔" : "✘"} ${label}${detail ? ` — ${detail}` : ""}`);
}

function encodePath(path) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function decodePath(path) {
  try {
    return decodeURIComponent(path);
  } catch {
    return path;
  }
}

/** `/services/x/` → `{ kind: "service", slug: "x" }` */
function classify(path) {
  const clean = decodePath(path).replace(/^\/+/, "").replace(/\/+$/, "");
  if (clean.startsWith("services/")) {
    return { kind: "service", slug: clean.slice("services/".length) };
  }
  if (clean.startsWith("blogs/")) {
    return { kind: "post", slug: clean.slice("blogs/".length) };
  }
  return { kind: "root", slug: clean };
}

async function wpCount(endpoint, slug) {
  const url = `${WP}/wp-json/wp/v2/${endpoint}?slug=${encodeURIComponent(slug)}&_fields=id`;
  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return { error: `HTTP ${res.status}` };
    const body = await res.json();
    return { count: Array.isArray(body) ? body.length : 0 };
  } catch (error) {
    return { error: describeError(error) };
  }
}

/** A target is valid if WordPress has a post (service or article) or a category at that slug. */
async function checkTarget(path) {
  const { kind, slug } = classify(path);
  const post = await wpCount("posts", slug);
  if (post.error) return { ok: false, detail: `WordPress unreachable: ${post.error}` };
  if (post.count > 0) return { ok: true, detail: "post found" };

  if (kind === "post") return { ok: false, detail: "no WordPress post with this slug" };

  const category = await wpCount("categories", slug);
  if (category.count > 0) return { ok: true, detail: "category hub" };
  return { ok: false, detail: "no post and no category with this slug" };
}

async function checkWordPress() {
  console.log(`WordPress: ${WP}\n`);

  const targets = [...new Set(redirects.map((r) => r.to))];
  console.log("Redirect targets:");
  for (const target of targets) {
    const { ok, detail } = await checkTarget(target);
    report(ok, target, detail);
  }

  console.log("\nRestored pages (content source):");
  for (const page of restoredPages) {
    const post = await wpCount("posts", page.wpSlug);
    if (post.error) {
      report(false, page.path, `WordPress unreachable: ${post.error}`);
      continue;
    }
    report(
      post.count > 0,
      page.path,
      post.count > 0
        ? `post «${page.wpSlug}» found`
        : `publish a WordPress post with slug «${page.wpSlug}»`,
    );
  }

  console.log("\nRetired sources (should be gone from WordPress or unlinked):");
  for (const { from } of redirects) {
    const { slug } = classify(from);
    const post = await wpCount("posts", slug);
    if (post.error) continue;
    report(true, from, post.count > 0 ? "still published in WordPress (301 handles it)" : "not in WordPress");
  }
}

async function status(path) {
  try {
    const res = await fetch(`${SITE}${encodePath(path)}`, { redirect: "manual" });
    return { code: res.status, location: res.headers.get("location") };
  } catch (error) {
    return { error: describeError(error) };
  }
}

async function checkLive() {
  console.log(`Site: ${SITE}\n`);

  console.log("Retired URLs:");
  for (const { from, to } of redirects) {
    const res = await status(from);
    if (res.error) {
      report(false, from, res.error);
      continue;
    }
    const landed = res.location ? decodePath(res.location) : "";
    const ok = res.code === 301 && landed.endsWith(decodePath(to));
    report(ok, from, `${res.code}${res.location ? ` → ${landed}` : ""} (expected 301 → ${to})`);
  }

  console.log("\nRedirect targets:");
  for (const to of [...new Set(redirects.map((r) => r.to))]) {
    const res = await status(to);
    report(!res.error && res.code === 200, to, res.error ?? `HTTP ${res.code}`);
  }

  console.log("\nRestored pages:");
  for (const page of restoredPages) {
    const res = await status(page.path);
    report(!res.error && res.code === 200, page.path, res.error ?? `HTTP ${res.code}`);
  }
}

await (process.argv.includes("--live") ? checkLive() : checkWordPress());

if (failures) {
  const hint = connectionHint();
  console.error(`\n${failures} check(s) failed.`);
  if (hint) console.error(`\n${hint}`);
  process.exit(1);
}
console.log("\nAll checks passed.");
