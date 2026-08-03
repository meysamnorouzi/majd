import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Temporarily hidden — no payment gateway yet
// import { DashboardOverview } from "@/components/account/DashboardOverview";

export const metadata: Metadata = {
  title: "پنل کاربری",
};

export default function AccountDashboardPage() {
  notFound();
  // return <DashboardOverview />;
}
