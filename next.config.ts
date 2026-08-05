import type { NextConfig } from "next";

const wpHostname = process.env.NEXT_PUBLIC_WP_URL
  ? new URL(process.env.NEXT_PUBLIC_WP_URL).hostname
  : "admin.vakilmajd.com";

const nextConfig: NextConfig = {
  output: "export",
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
