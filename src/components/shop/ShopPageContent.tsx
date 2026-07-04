"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/shop/ProductCard";
import { fetchShopProductsClient } from "@/lib/wordpress/client";

export function ShopPageContent() {
  const [products, setProducts] = useState<
    Awaited<ReturnType<typeof fetchShopProductsClient>>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchShopProductsClient(24).then((data) => {
      if (!cancelled) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20">
      <Container>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-600">
            محصولی یافت نشد. محصولات را در ووکامرس اضافه کنید.
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
