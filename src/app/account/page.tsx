import type { Metadata } from "next";
import { DashboardOverview } from "@/components/account/DashboardOverview";

export const metadata: Metadata = {
  title: "پنل کاربری",
};

export default function AccountDashboardPage() {
  return <DashboardOverview />;
}
