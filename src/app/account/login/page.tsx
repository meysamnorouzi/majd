import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { Suspense } from "react";
// import { LoginForm } from "@/components/account/LoginForm";

export const metadata: Metadata = createPageMetadata({
  title: "ورود",
  description: "ورود به پنل کاربری موسسه حقوقی مجد",
  path: "/account/login/",
  noIndex: true,
});

export default function LoginPage() {
  notFound();
  // return (
  //   <div className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-12">
  //     <Suspense
  //       fallback={
  //         <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
  //       }
  //     >
  //       <LoginForm />
  //     </Suspense>
  //   </div>
  // );
}
