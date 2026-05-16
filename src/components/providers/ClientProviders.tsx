"use client";

import { CartProvider } from "@/components/cart/CartProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
