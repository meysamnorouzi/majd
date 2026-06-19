"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  fetchMe,
  getAuthToken,
  getDisplayName,
  login as apiLogin,
  logout as apiLogout,
  register as apiRegister,
} from "@/lib/woocommerce/account-client";
import type { CustomerProfile } from "@/types";

interface AuthContextValue {
  user: CustomerProfile | null;
  loading: boolean;
  displayName: string;
  login: (email: string, password: string) => Promise<void>;
  register: (params: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const PUBLIC_ACCOUNT_PATHS = ["/account/login", "/account/register"];

function isPublicAccountPath(pathname: string) {
  const normalized = pathname.replace(/\/$/, "");
  return PUBLIC_ACCOUNT_PATHS.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const refresh = useCallback(async () => {
    const token = getAuthToken();
    if (!token) {
      setUser(null);
      return;
    }
    try {
      const profile = await fetchMe();
      setUser(profile);
    } catch {
      apiLogout();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refresh();
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  useEffect(() => {
    if (loading) return;
    if (!pathname.startsWith("/account")) return;

    const isPublic = isPublicAccountPath(pathname);
    if (!user && !isPublic) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/account/login/?redirect=${redirect}`);
    } else if (user && isPublic) {
      router.replace("/account/");
    }
  }, [loading, user, pathname, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await apiLogin(email, password);
      setUser(result.user);
    },
    [],
  );

  const register = useCallback(
    async (params: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
    }) => {
      const result = await apiRegister(params);
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    router.push("/account/login/");
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      loading,
      displayName: user ? getDisplayName(user) : "",
      login,
      register,
      logout,
      refresh,
    }),
    [user, loading, login, register, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
