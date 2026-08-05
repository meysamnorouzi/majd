import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { PageHero } from "@/components/layout/PageHero";
// import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";

export const metadata: Metadata = createPageMetadata({
  title: "تسویه حساب",
  description: "تسویه حساب امن موسسه حقوقی مجد",
  path: "/checkout/",
  noIndex: true,
});

export default function CheckoutPage() {
  notFound();
  // return (
  //   <>
  //     <PageHero
  //       title="تسویه حساب"
  //       description="اطلاعات خود را وارد کنید و به درگاه پرداخت امن هدایت شوید."
  //       breadcrumb={[
  //         { label: "سبد خرید", href: "/cart/" },
  //         { label: "تسویه حساب" },
  //       ]}
  //     />
  //     <CheckoutPageContent />
  //   </>
  // );
}
