"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks, siteConfig } from "@/data/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { CartLink } from "@/components/cart/CartLink";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/" || pathname === "";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Logo size="sm" variant="dark" />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-white/10 text-gold-400"
                  : "text-white/80 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <CartLink />
          <a
            href={`tel:${siteConfig.phonesTel[0]}`}
            className="text-sm font-semibold text-gold-400 hover:text-gold-300"
            dir="ltr"
          >
            {siteConfig.phones[0]}
          </a>
          <Button href="/contact/" size="sm">
            مشاوره رایگان
          </Button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <CartLink />
          <button
          type="button"
          className="rounded-lg p-2 text-white"
          onClick={() => setOpen(!open)}
          aria-label="منو"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-navy-900 px-4 py-4 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`block rounded-lg px-4 py-3 text-sm font-medium ${
                isActive(link.href) ? "bg-white/10 text-gold-400" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 border-t border-white/10 pt-4">
            <Link
              href="/cart/"
              onClick={() => setOpen(false)}
              className="mb-3 block rounded-lg bg-white/10 px-4 py-3 text-center text-sm font-semibold text-gold-400"
            >
              سبد خرید
            </Link>
            <Button href="/contact/" className="w-full">
              مشاوره رایگان
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
