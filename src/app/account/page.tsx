import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { DashboardOverview } from "@/components/account/DashboardOverview";

export const metadata: Metadata = createPageMetadata({
  title: "پنل کاربری",
  description: "پنل کاربری موسسه حقوقی مجد",
  path: "/account/",
  noIndex: true,
});

export default function AccountDashboardPage() {
  notFound();
  // return <DashboardOverview />;
}
