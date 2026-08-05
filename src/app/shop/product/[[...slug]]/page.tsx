import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

// Temporarily hidden — no payment gateway yet
// import { ShopProductContent } from "@/components/shop/ShopProductContent";

export const metadata: Metadata = createPageMetadata({
  title: "محصول",
  description: "جزئیات محصول موسسه حقوقی مجد",
  path: "/shop/product/",
  noIndex: true,
});

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function ShopProductPage() {
  notFound();
  // return <ShopProductContent />;
}
