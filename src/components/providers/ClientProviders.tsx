"use client";

// Temporarily hidden — no payment gateway yet
// import { CartProvider } from "@/components/cart/CartProvider";
// import { AuthProvider } from "@/components/providers/AuthProvider";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  // return (
  //   <AuthProvider>
  //     <CartProvider>{children}</CartProvider>
  //   </AuthProvider>
  // );
  return children;
}
