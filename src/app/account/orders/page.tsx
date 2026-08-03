import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Temporarily hidden — no payment gateway yet
// import { OrdersPageContent } from "@/components/account/OrdersPageContent";

export const metadata: Metadata = {
  title: "سفارش‌ها",
};

export default function OrdersPage() {
  notFound();
  // return <OrdersPageContent />;
}
