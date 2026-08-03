import { notFound } from "next/navigation";

// Temporarily hidden — no payment gateway yet
// import { Suspense } from "react";
// import { PageHero } from "@/components/layout/PageHero";
// import { Container } from "@/components/ui/Container";
// import { CheckoutSuccessContent } from "@/components/checkout/CheckoutSuccessContent";

export default function CheckoutSuccessPage() {
  notFound();
  // return (
  //   <>
  //     <PageHero
  //       title="پرداخت"
  //       breadcrumb={[
  //         { label: "سبد خرید", href: "/cart/" },
  //         { label: "نتیجه پرداخت" },
  //       ]}
  //     />
  //     <section className="py-16">
  //       <Container>
  //         <Suspense
  //           fallback={
  //             <div className="flex justify-center py-12">
  //               <span className="h-8 w-8 animate-spin rounded-full border-4 border-gold-500/30 border-t-gold-500" />
  //             </div>
  //           }
  //         >
  //           <CheckoutSuccessContent />
  //         </Suspense>
  //       </Container>
  //     </section>
  //   </>
  // );
}
