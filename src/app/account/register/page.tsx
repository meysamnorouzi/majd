import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Temporarily hidden — no payment gateway yet
// import { RegisterForm } from "@/components/account/RegisterForm";

export const metadata: Metadata = {
  title: "ثبت‌نام",
};

export default function RegisterPage() {
  notFound();
  // return (
  //   <div className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-12">
  //     <RegisterForm />
  //   </div>
  // );
}
