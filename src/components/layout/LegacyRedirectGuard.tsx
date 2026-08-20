"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { findLegacyRedirect } from "@/data/legacy-redirects";

/**
 * Client-side safety net for retired URLs.
 *
 * The real 301s live in `public/.htaccess` / `public/_redirects` — only the host
 * can send a status code from a static export. This guard covers the two cases
 * the host cannot: in-app `<Link>` navigation (no document request is made, so
 * no rewrite rule runs) and a deploy target whose rewrite config was not copied.
 */
export function LegacyRedirectGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const target = findLegacyRedirect(pathname);
    if (target) router.replace(target);
  }, [pathname, router]);

  return null;
}
