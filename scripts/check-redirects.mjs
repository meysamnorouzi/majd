#!/usr/bin/env node
/**
 * Verifies the SEO redirect map in `src/data/legacy-redirects.json`.
 *
 *   node scripts/check-redirects.mjs          # every 301 target exists in WordPress
 *   node scripts/check-redirects.mjs --live   # after deploy: old URLs really 301
 *
 * The redirect targets were written from the SEO audit sheet, not read back off
 * the live site — run this before deploying so a typo in a Persian slug does not
 * turn a ranking page into a redirect chain ending in 404.
 *
 * Env: NEXT_PUBLIC_WP_URL (default https://admin.vakilmajd.com)
 *      NEXT_PUBLIC_SITE_URL (default https://vakilmajd.com)
 *      WP_API_KEY (optional, sent as X-Api-Key)
 */

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
  if (!clean || clean === "services") {
    return { kind: "static", slug: "" };
  }
  const categoryPrefixes = [
    "family-lawyer",
    "property-lawyer",
    "criminal-defense-lawyer",
    "legal-consultation",
    "administrative-lawyer",
  ];
  if (categoryPrefixes.includes(clean)) {
    return { kind: "static", slug: "" };
  }
  for (const prefix of categoryPrefixes) {
    if (clean.startsWith(`${prefix}/`)) {
      return { kind: "service", slug: clean.slice(prefix.length + 1) };
    }
  }
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
    return { error: error.message };
  }
}

/** A target is valid if WordPress has a post (service or article) or a category at that slug. */
async function checkTarget(path) {
  const { kind, slug } = classify(path);
  if (kind === "static") return { ok: true, detail: "site index page" };

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
    return { error: error.message };
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
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}
console.log("\nAll checks passed.");
