"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { getStoreProductBySlug } from "@/lib/woocommerce/products";

export function AddToCartButton({
  productSlug,
  productId,
  label = "افزودن به سبد خرید",
  size = "md",
  className = "",
  redirectToCart = false,
}: {
  productSlug?: string;
  productId?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  redirectToCart?: boolean;
}) {
  const { addToCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [resolvedId, setResolvedId] = useState<number | null>(
    productId ?? null,
  );

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  async function handleClick() {
    setLoading(true);
    setToast(null);
    try {
      let id = resolvedId;
      if (!id && productSlug) {
        const product = await getStoreProductBySlug(productSlug);
        if (!product) {
          setToast("محصول در فروشگاه یافت نشد. لطفاً با پشتیبانی تماس بگیرید.");
          return;
        }
        id = product.id;
        setResolvedId(id);
      }
      if (!id) {
        setToast("شناسه محصول مشخص نیست.");
        return;
      }
      const ok = await addToCart(id, 1);
      if (ok) {
        setToast("به سبد خرید اضافه شد");
        if (redirectToCart) {
          router.push("/cart/");
        }
      }
    } finally {
      setLoading(false);
      setTimeout(() => setToast(null), 3000);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gold-500 font-semibold text-navy-950 shadow-lg shadow-gold-500/25 transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClasses[size]} ${className}`}
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy-950/30 border-t-navy-950" />
            در حال افزودن...
          </>
        ) : (
          <>
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            {label}
          </>
        )}
      </button>
      {toast && (
        <p
          role="status"
          className={`mt-2 text-sm ${toast.includes("اضافه") ? "text-emerald-600" : "text-red-600"}`}
        >
          {toast}
        </p>
      )}
    </div>
  );
}
