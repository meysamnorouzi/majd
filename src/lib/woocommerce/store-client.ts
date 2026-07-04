import type {
  BillingAddress,
  CheckoutPayload,
  CheckoutResponse,
  StoreCart,
} from "@/types";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL ?? "https://vakilmajd.com";
const CART_TOKEN_KEY = "wc_cart_token";
const NONCE_KEY = "wc_store_nonce";

function apiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}${path}`;
}

export class StoreApiError extends Error {
  code: string;
  constructor(message: string, code = "unknown") {
    super(message);
    this.code = code;
    this.name = "StoreApiError";
  }
}

function getCartToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_TOKEN_KEY);
}

function setCartToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(CART_TOKEN_KEY, token);
  else localStorage.removeItem(CART_TOKEN_KEY);
}

function getNonce(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NONCE_KEY);
}

function setNonce(nonce: string | null) {
  if (typeof window === "undefined") return;
  if (nonce) localStorage.setItem(NONCE_KEY, nonce);
  else localStorage.removeItem(NONCE_KEY);
}

function parseErrorMessage(data: unknown): string {
  if (!data || typeof data !== "object") {
    return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
  }
  const err = data as {
    message?: string;
    code?: string;
    data?: { message?: string; status?: number };
  };
  if (err.message) return err.message;
  if (err.data?.message) return err.data.message;
  return "خطایی رخ داد. لطفاً دوباره تلاش کنید.";
}

async function storeFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  const cartToken = getCartToken();
  if (cartToken) headers.set("Cart-Token", cartToken);

  const nonce = getNonce();
  if (nonce) headers.set("Nonce", nonce);

  const res = await fetch(apiUrl(path), {
    ...options,
    headers,
    credentials: "include",
  });

  const newCartToken = res.headers.get("Cart-Token");
  if (newCartToken) setCartToken(newCartToken);

  const newNonce = res.headers.get("Nonce");
  if (newNonce) setNonce(newNonce);

  let data: unknown = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    throw new StoreApiError(parseErrorMessage(data), String(res.status));
  }

  return data as T;
}

export async function getCart(): Promise<StoreCart> {
  return storeFetch<StoreCart>("/wp-json/wc/store/v1/cart");
}

export async function addCartItem(
  productId: number,
  quantity = 1,
): Promise<StoreCart> {
  return storeFetch<StoreCart>("/wp-json/wc/store/v1/cart/add-item", {
    method: "POST",
    body: JSON.stringify({ id: productId, quantity }),
  });
}

export async function updateCartItem(
  key: string,
  quantity: number,
): Promise<StoreCart> {
  return storeFetch<StoreCart>("/wp-json/wc/store/v1/cart/update-item", {
    method: "POST",
    body: JSON.stringify({ key, quantity }),
  });
}

export async function removeCartItem(key: string): Promise<StoreCart> {
  return storeFetch<StoreCart>("/wp-json/wc/store/v1/cart/remove-item", {
    method: "POST",
    body: JSON.stringify({ key }),
  });
}

export async function applyCoupon(code: string): Promise<StoreCart> {
  return storeFetch<StoreCart>("/wp-json/wc/store/v1/cart/apply-coupon", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

export async function checkout(
  payload: CheckoutPayload,
): Promise<CheckoutResponse> {
  return storeFetch<CheckoutResponse>("/wp-json/wc/store/v1/checkout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function clearCartSession() {
  setCartToken(null);
  setNonce(null);
}

export function getDefaultPaymentMethod(): string {
  return process.env.NEXT_PUBLIC_WC_PAYMENT_METHOD ?? "zarinpal";
}

export function buildCheckoutPayload(
  billing: BillingAddress,
  customerNote?: string,
): CheckoutPayload {
  const paymentMethod = getDefaultPaymentMethod();
  return {
    billing_address: billing,
    shipping_address: billing,
    payment_method: paymentMethod,
    customer_note: customerNote,
  };
}
