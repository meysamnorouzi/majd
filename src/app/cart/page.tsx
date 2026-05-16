import { PageHero } from "@/components/layout/PageHero";
import { CartPageContent } from "@/components/cart/CartPageContent";

export default function CartPage() {
  return (
    <>
      <PageHero
        title="سبد خرید"
        description="دوره‌های انتخاب‌شده خود را بررسی و به تسویه حساب بروید."
        breadcrumb={[{ label: "سبد خرید" }]}
      />
      <CartPageContent />
    </>
  );
}
