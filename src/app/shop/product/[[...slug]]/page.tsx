import { ShopProductContent } from "@/components/shop/ShopProductContent";

export function generateStaticParams() {
  return [{ slug: [] as string[] }];
}

export default function ShopProductPage() {
  return <ShopProductContent />;
}
