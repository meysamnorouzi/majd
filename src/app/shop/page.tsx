import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ShopPageContent } from "@/components/shop/ShopPageContent";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "محصولات و خدمات حقوقی موسسه حقوقی مجد",
};

export default function ShopPage() {
  return (
    <>
      <PageHero
        title="فروشگاه"
        description="کتاب‌ها، فرم‌های قراردادی و خدمات مشاوره آنلاین"
        breadcrumb={[{ label: "فروشگاه" }]}
      />
      <ShopPageContent />
    </>
  );
}
