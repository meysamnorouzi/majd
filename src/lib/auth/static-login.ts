import type { CustomerOrder, CustomerProfile } from "@/types";

export const STATIC_AUTH_TOKEN = "__MAJD_STATIC_AUTH__";

const DEV_EMAIL = "demo@vakilmajd.com";
const DEV_PASSWORD = "demo1234";

export function getStaticLoginCredentials(): {
  email: string;
  password: string;
} | null {
  const email = process.env.NEXT_PUBLIC_STATIC_LOGIN_EMAIL;
  const password = process.env.NEXT_PUBLIC_STATIC_LOGIN_PASSWORD;
  if (email && password) return { email, password };

  if (process.env.NODE_ENV === "development") {
    return { email: DEV_EMAIL, password: DEV_PASSWORD };
  }

  return null;
}

export function isStaticLoginEnabled(): boolean {
  return getStaticLoginCredentials() !== null;
}

export function matchesStaticLogin(email: string, password: string): boolean {
  const creds = getStaticLoginCredentials();
  if (!creds) return false;
  return email === creds.email && password === creds.password;
}

export function isStaticAuthToken(token: string | null): boolean {
  return token === STATIC_AUTH_TOKEN;
}

export function getStaticUser(): CustomerProfile {
  const creds = getStaticLoginCredentials();
  return {
    id: 0,
    email: creds?.email ?? DEV_EMAIL,
    first_name: "کاربر",
    last_name: "آزمایشی",
    phone: "09123456789",
  };
}

export function getStaticOrders(): CustomerOrder[] {
  return [
    {
      id: 1001,
      status: "completed",
      date: new Date().toISOString(),
      total: "2500000",
      currency: "IRT",
      spotplayer_license: "DEMO-XXXX-YYYY-ZZZZ",
      spotplayer_notes: "این یک لایسنس نمایشی است.",
      license_status: "ready",
      items: [
        {
          name: "دوره آفلاین — کتاب اول قانون مدنی",
          product_slug: "course-offline-qm-book1",
          quantity: 1,
          spotplayer_license: "DEMO-XXXX-YYYY-ZZZZ",
          license_status: "ready",
        },
      ],
    },
  ];
}
