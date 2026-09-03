import type { NextConfig } from "next";
import legacyRedirectMap from "./src/data/legacy-redirects.json";

const wpHostname = process.env.NEXT_PUBLIC_WP_URL
  ? new URL(process.env.NEXT_PUBLIC_WP_URL).hostname
  : "admin.vakilmajd.com";

/**
 * Local `next dev` / SSG must call the WP API for generateStaticParams.
 * Some WP hosts present an incomplete TLS chain that Node rejects —
 * browsers still work. Only relax verification in development.
 */
if (process.env.NODE_ENV === "development") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

/**
 * `output: "export"` cannot emit HTTP redirects. Host 301s live in
 * `public/.htaccess`. `next dev` has no Apache, so load the same map here.
 */
function localDevRedirects() {
  const rules: {
    source: string;
    destination: string;
    permanent: boolean;
  }[] = [];

  for (const { from, to } of legacyRedirectMap.redirects as {
    from: string;
    to: string;
  }[]) {
    const trimmed = from.replace(/\/$/, "") || "/";
    const encoded = trimmed
      .split("/")
      .map((segment) => (segment ? encodeURIComponent(segment) : segment))
      .join("/");
    const sources = encoded === trimmed ? [trimmed] : [trimmed, encoded];
    for (const source of sources) {
      rules.push({ source, destination: to, permanent: true });
    }
  }

  return rules;
}

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Static export only for production builds. In `next dev`, export mode
  // rejects any dynamic URL missing from generateStaticParams — which then
  // crashes Turbopack while rendering the error page (`next/document.js`).
  ...(isProd ? { output: "export" as const } : {}),
  ...(!isProd
    ? { redirects: async () => localDevRedirects() }
    : {}),
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["motion"],
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/media/image-loader.ts",
    remotePatterns: [
      {
        protocol: "https",
        hostname: wpHostname,
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
