"use client";

import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function ProductAddToCart({
  productSlug,
  productId,
}: {
  productSlug: string;
  productId: number;
}) {
  return (
    <AddToCartButton
      productSlug={productSlug}
      productId={productId}
      label="افزودن به سبد خرید"
      size="lg"
    />
  );
}
