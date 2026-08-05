import type { NextConfig } from "next";

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

const nextConfig: NextConfig = {
  // Static export only for production builds. In `next dev`, export mode
  // rejects any dynamic URL missing from generateStaticParams — which then
  // crashes Turbopack while rendering the error page (`next/document.js`).
  ...(process.env.NODE_ENV === "production" ? { output: "export" as const } : {}),
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: wpHostname,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
