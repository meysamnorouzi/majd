import { notFound } from "next/navigation";

// Temporarily hidden — no payment gateway yet
// import { PageHero } from "@/components/layout/PageHero";
// import { CheckoutPageContent } from "@/components/checkout/CheckoutPageContent";

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
