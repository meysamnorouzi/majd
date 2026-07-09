"use client";

import { usePathname } from "next/navigation";
import { AccountMobileNav, AccountSidebar } from "./AccountSidebar";
import { useAuth } from "@/components/providers/AuthProvider";

const PUBLIC_PATHS = ["/account/login", "/account/register"];

function isPublicPath(pathname: string) {
  const normalized = pathname.replace(/\/$/, "");
  return PUBLIC_PATHS.some((p) => normalized === p);
}

export function AccountLayout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();
  const pathname = usePathname();

  if (isPublicPath(pathname)) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          <p className="text-sm text-slate-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-cream pb-20 lg:pb-12">
      <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <AccountSidebar />
            </div>
          </div>
          <div className="min-w-0">{children}</div>
        </div>
      </div>
      <AccountMobileNav />
    </div>
  );
}
