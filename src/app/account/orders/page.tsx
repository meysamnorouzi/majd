import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { OrdersPageContent } from "@/components/account/OrdersPageContent";

export const metadata: Metadata = createPageMetadata({
  title: "سفارش‌ها",
  description: "سفارش‌های کاربر در موسسه حقوقی مجد",
  path: "/account/orders/",
  noIndex: true,
});

export default function OrdersPage() {
  notFound();
  // return <OrdersPageContent />;
}
