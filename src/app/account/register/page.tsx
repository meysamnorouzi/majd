import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { RegisterForm } from "@/components/account/RegisterForm";

export const metadata: Metadata = createPageMetadata({
  title: "ثبت‌نام",
  description: "ثبت‌نام در پنل کاربری موسسه حقوقی مجد",
  path: "/account/register/",
  noIndex: true,
});

export default function RegisterPage() {
  notFound();
  // return (
  //   <div className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-12">
  //     <RegisterForm />
  //   </div>
  // );
}
