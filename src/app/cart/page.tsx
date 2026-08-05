import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { PageHero } from "@/components/layout/PageHero";
// import { CartPageContent } from "@/components/cart/CartPageContent";

export const metadata: Metadata = createPageMetadata({
  title: "سبد خرید",
  description: "سبد خرید موسسه حقوقی مجد",
  path: "/cart/",
  noIndex: true,
});

export default function CartPage() {
  notFound();
  // return (
  //   <>
  //     <PageHero
  //       title="سبد خرید"
  //       description="دوره‌های انتخاب‌شده خود را بررسی و به تسویه حساب بروید."
  //       breadcrumb={[{ label: "سبد خرید" }]}
  //     />
  //     <CartPageContent />
  //   </>
  // );
}
