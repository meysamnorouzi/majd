import {
  getStaticOrders,
  getStaticUser,
  isStaticAuthToken,
  matchesStaticLogin,
  STATIC_AUTH_TOKEN,
} from "@/lib/auth/static-login";
import type {
  AuthResponse,
  CustomerOrder,
  CustomerProfile,
} from "@/types";

const WP_URL = process.env.NEXT_PUBLIC_WP_URL ?? "https://admin.vakilmajd.com";
const TOKEN_KEY = "majd_auth_token";

export class AccountApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "unknown", status = 400) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "AccountApiError";
  }
}

function apiUrl(path: string): string {
  return `${WP_URL.replace(/\/$/, "")}${path}`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) sessionStorage.setItem(TOKEN_KEY, token);
  else sessionStorage.removeItem(TOKEN_KEY);
}

async function accountFetch<T>(
  path: string,
  options: RequestInit = {},
  auth = false,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (auth) {
    const token = getAuthToken();
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(apiUrl(path), {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as { message?: string; code?: string };
    throw new AccountApiError(
      err.message ?? "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
      err.code ?? "unknown",
      res.status,
    );
  }

  return data as T;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  if (matchesStaticLogin(email, password)) {
    const result: AuthResponse = {
      token: STATIC_AUTH_TOKEN,
      user: getStaticUser(),
    };
    setAuthToken(result.token);
    return result;
  }

  const result = await accountFetch<AuthResponse>("/wp-json/majd/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  setAuthToken(result.token);
  return result;
}

export async function register(params: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<AuthResponse> {
  const result = await accountFetch<AuthResponse>(
    "/wp-json/majd/v1/auth/register",
    {
      method: "POST",
      body: JSON.stringify(params),
    },
  );
  setAuthToken(result.token);
  return result;
}

export async function fetchMe(): Promise<CustomerProfile> {
  if (isStaticAuthToken(getAuthToken())) return getStaticUser();
  return accountFetch<CustomerProfile>("/wp-json/majd/v1/auth/me", {}, true);
}

export async function fetchOrders(): Promise<CustomerOrder[]> {
  if (isStaticAuthToken(getAuthToken())) return getStaticOrders();
  const result = await accountFetch<{ orders: CustomerOrder[] }>(
    "/wp-json/majd/v1/me/orders",
    {},
    true,
  );
  return result.orders;
}

export async function fetchOrder(id: number): Promise<CustomerOrder> {
  if (isStaticAuthToken(getAuthToken())) {
    const order = getStaticOrders().find((item) => item.id === id);
    if (!order) {
      throw new AccountApiError("سفارش یافت نشد.", "not_found", 404);
    }
    return order;
  }
  return accountFetch<CustomerOrder>(`/wp-json/majd/v1/me/orders/${id}`, {}, true);
}

export function logout() {
  setAuthToken(null);
}

export function getDisplayName(user: CustomerProfile): string {
  const name = `${user.first_name} ${user.last_name}`.trim();
  return name || user.email;
}
