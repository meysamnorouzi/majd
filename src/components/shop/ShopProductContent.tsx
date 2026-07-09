"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ConsultationSection } from "@/components/contact/ConsultationSection";
import { ProductAddToCart } from "@/components/shop/ProductAddToCart";
import { ProductDetailBottom } from "@/components/shop/ProductDetailBottom";
import { getProductDetailMeta } from "@/data/shop";
import {
  fetchShopProductBySlugClient,
  fetchShopProductsClient,
} from "@/lib/wordpress/client";

function formatPrice(price: string) {
  const num = parseInt(price, 10);
  if (isNaN(num)) return price;
  return num.toLocaleString("fa-IR");
}

function slugFromPathname(pathname: string): string {
  const base = "/shop/product";
  const normalized = pathname.replace(/\/$/, "");
  if (!normalized.startsWith(base)) return "";
  return decodeURIComponent(normalized.slice(base.length).replace(/^\//, ""));
}

export function ShopProductContent() {
  const pathname = usePathname();
  const slug = slugFromPathname(pathname);
  const [product, setProduct] = useState<Awaited<
    ReturnType<typeof fetchShopProductBySlugClient>
  > | null>(null);
  const [related, setRelated] = useState<
    {
      slug: string;
      name: string;
      short_description: string;
      price: string;
      currency: string;
      image?: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const [item, all] = await Promise.all([
        fetchShopProductBySlugClient(slug),
        fetchShopProductsClient(12),
      ]);
      if (cancelled) return;

      if (!item) {
        setNotFound(true);
        setProduct(null);
      } else {
        setProduct(item);
        document.title = `${item.name} | موسسه حقوقی مجد`;
        setRelated(
          all
            .filter((p) => p.slug !== slug)
            .slice(0, 3)
            .map((p) => ({
              slug: p.slug,
              name: p.name,
              short_description: p.short_description,
              price: p.price,
              currency: p.currency,
              image: p.image,
            })),
        );
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-navy-900">محصول یافت نشد</h1>
          <Link href="/shop/" className="mt-6 inline-block text-gold-600">
            بازگشت به فروشگاه
          </Link>
        </div>
      </Container>
    );
  }

  const detailMeta = getProductDetailMeta(slug, product.name);

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
            <div className="relative order-2 aspect-square overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-slate-200/60 lg:order-none">
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

            <div className="order-first lg:order-none">
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-navy-900/5 px-3 py-1 font-medium text-navy-800">
                  {detailMeta.category}
                </span>
                <span className="rounded-full bg-gold-500/15 px-3 py-1 font-medium text-gold-600">
                  {detailMeta.format}
                </span>
              </div>

              <p className="mt-6 text-2xl font-bold text-gold-600 sm:text-3xl">
                {formatPrice(product.price)} {product.currency}
              </p>
              <p className="mt-6 leading-relaxed text-slate-600">
                {product.short_description}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
                <div className="w-full sm:min-w-0 sm:flex-1">
                  <ProductAddToCart
                    productSlug={product.slug}
                    productId={product.id}
                  />
                </div>
                <a
                  href="#consultation"
                  className="inline-flex items-center justify-center rounded-lg border-2 border-navy-900 px-6 py-3 text-sm font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
                >
                  سوال دارید؟ درخواست مشاوره
                </a>
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
        relatedProducts={related}
      />
      <ConsultationSection
        defaultSubject="سایر"
        defaultMessage={`سوال درباره محصول: ${product.name}`}
        title="سوال درباره این محصول دارید؟"
      />
    </>
  );
}
