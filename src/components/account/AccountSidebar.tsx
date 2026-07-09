"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";

const navItems = [
  {
    href: "/account/",
    label: "داشبورد",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: "/account/orders/",
    label: "سفارش‌ها",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { user, displayName, logout } = useAuth();

  const isActive = (href: string) => {
    if (href === "/account/") return pathname === "/account" || pathname === "/account/";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <aside className="flex h-full flex-col rounded-2xl bg-navy-950 p-5 text-white shadow-xl">
      <div className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-medium text-gold-400">حساب کاربری</p>
        <h2 className="mt-1 text-lg font-bold">{displayName}</h2>
        {user?.email && (
          <p className="mt-1 truncate text-sm text-white/60" dir="ltr">
            {user.email}
          </p>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
              isActive(item.href)
                ? "bg-gold-500/15 text-gold-400"
                : "text-white/75 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="mt-6 space-y-2 border-t border-white/10 pt-6">
        <Link
          href="/courses/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/5 hover:text-white"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          مشاهده دوره‌ها
        </Link>
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-300 transition-colors hover:bg-red-500/10"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          خروج
        </button>
      </div>
    </aside>
  );
}

export function AccountMobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/account/") return pathname === "/account" || pathname === "/account/";
    return pathname.startsWith(href.replace(/\/$/, ""));
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-navy-900/10 bg-white px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow-lg lg:hidden">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-xs font-medium ${
            isActive(item.href) ? "text-gold-600" : "text-slate-500"
          }`}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
