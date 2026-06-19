import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/account/LoginForm";

export const metadata: Metadata = {
  title: "ورود",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-12">
      <Suspense
        fallback={
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
