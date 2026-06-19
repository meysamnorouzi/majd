import type { Metadata } from "next";
import { OrdersPageContent } from "@/components/account/OrdersPageContent";

export const metadata: Metadata = {
  title: "سفارش‌ها",
};

export default function OrdersPage() {
  return <OrdersPageContent />;
}
