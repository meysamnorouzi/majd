"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  addCartItem,
  getCart,
  removeCartItem,
  StoreApiError,
  updateCartItem,
} from "@/lib/woocommerce/store-client";
import type { StoreCart, StoreCartItem } from "@/types";

interface CartContextValue {
  cart: StoreCart | null;
  items: StoreCartItem[];
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  refreshCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<boolean>;
  updateQuantity: (key: string, quantity: number) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<StoreCart | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshCart = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch (e) {
      if (e instanceof StoreApiError) {
        setError(e.message);
      } else {
        setError("اتصال به فروشگاه برقرار نشد.");
      }
      setCart(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = useCallback(
    async (productId: number, quantity = 1) => {
      setError(null);
      try {
        const data = await addCartItem(productId, quantity);
        setCart(data);
        return true;
      } catch (e) {
        setError(
          e instanceof StoreApiError
            ? e.message
            : "افزودن به سبد خرید ناموفق بود.",
        );
        return false;
      }
    },
    [],
  );

  const updateQuantity = useCallback(async (key: string, quantity: number) => {
    setError(null);
    try {
      const data =
        quantity < 1
          ? await removeCartItem(key)
          : await updateCartItem(key, quantity);
      setCart(data);
    } catch (e) {
      setError(
        e instanceof StoreApiError ? e.message : "به‌روزرسانی سبد ناموفق بود.",
      );
    }
  }, []);

  const removeItem = useCallback(async (key: string) => {
    setError(null);
    try {
      const data = await removeCartItem(key);
      setCart(data);
    } catch (e) {
      setError(
        e instanceof StoreApiError ? e.message : "حذف از سبد ناموفق بود.",
      );
    }
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      items: cart?.items ?? [],
      itemCount: cart?.items_count ?? 0,
      isLoading,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
    }),
    [
      cart,
      isLoading,
      error,
      refreshCart,
      addToCart,
      updateQuantity,
      removeItem,
    ],
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
