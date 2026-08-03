import { notFound } from "next/navigation";

// Temporarily hidden — no payment gateway yet
// import { ShopProductContent } from "@/components/shop/ShopProductContent";

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function ShopProductPage() {
  notFound();
  // return <ShopProductContent />;
}
