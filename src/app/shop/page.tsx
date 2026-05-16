import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "فروشگاه",
  description: "محصولات و خدمات حقوقی موسسه حقوقی مجد",
};

export default async function ShopPage() {
  const products = await getProducts(24);

  return (
    <>
      <PageHero
        title="فروشگاه"
        description="کتاب‌ها، فرم‌های قراردادی و خدمات مشاوره آنلاین"
        breadcrumb={[{ label: "فروشگاه" }]}
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
