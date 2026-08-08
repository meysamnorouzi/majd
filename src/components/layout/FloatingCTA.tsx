"use client";

import { usePathname } from "next/navigation";
import { siteConfig } from "@/data/site";

export function FloatingCTA() {
  const pathname = usePathname();
  const normalized = pathname.replace(/\/$/, "");
  const isAccountArea =
    normalized.startsWith("/account") &&
    normalized !== "/account/login" &&
    normalized !== "/account/register";

  if (isAccountArea) return null;

  return (
    <a
      href={`tel:${siteConfig.phonesTel[0]}`}
      aria-label="تماس فوری"
      title="تماس فوری"
      className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-navy-950 shadow-xl shadow-gold-500/40 transition duration-200 hover:scale-105 hover:bg-gold-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
    >
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    </a>
  );
}
