import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ProductAddToCart } from "@/components/shop/ProductAddToCart";
import { CTASection } from "@/components/home/CTASection";
import { ProductDetailBottom } from "@/components/shop/ProductDetailBottom";
import { getProductDetailMeta } from "@/data/shop";
import { getAllProductSlugs, getProductBySlug, getProducts } from "@/lib/wordpress";
import type { Metadata } from "next";

function formatPrice(price: string) {
  const num = parseInt(price, 10);
  if (isNaN(num)) return price;
  return num.toLocaleString("fa-IR");
}

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "محصول یافت نشد" };
  return {
    title: product.name,
    description: product.short_description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const detailMeta = getProductDetailMeta(slug, product.name);
  const allProducts = await getProducts(12);
  const relatedProducts = allProducts
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      short_description: p.short_description,
      price: p.price,
      currency: p.currency,
      image: p.image,
    }));

  return (
    <>
      <PageHero
        title={product.name}
        breadcrumb={[
          { label: "فروشگاه", href: "/shop/" },
          { label: product.name },
        ]}
      />
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/60">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-navy-900">
                  <span className="text-6xl font-black text-gold-400">م</span>
                </div>
              )}
            </div>

            <div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-navy-900/5 px-3 py-1 font-medium text-navy-800">
                  {detailMeta.category}
                </span>
                <span className="rounded-full bg-gold-500/15 px-3 py-1 font-medium text-gold-600">
                  {detailMeta.format}
                </span>
              </div>

              <p className="mt-6 text-3xl font-bold text-gold-600">
                {formatPrice(product.price)} {product.currency}
              </p>
              <p className="mt-6 leading-relaxed text-slate-600">
                {product.short_description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <div className="min-w-[200px] flex-1">
                  <ProductAddToCart
                    productSlug={product.slug}
                    productId={product.id}
                  />
                </div>
                <Button href="/contact/" variant="outline">
                  سوال دارید؟ تماس بگیرید
                </Button>
              </div>

              <a
                href="#product-details"
                className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-navy-900 transition hover:text-gold-600"
              >
                مشاهده جزئیات و مشخصات
                <span aria-hidden>↓</span>
              </a>
            </div>
          </div>
        </Container>
      </section>

      <ProductDetailBottom
        slug={slug}
        name={product.name}
        description={product.description}
        category={detailMeta.category}
        format={detailMeta.format}
        relatedProducts={relatedProducts}
      />
      <CTASection />
    </>
  );
}
