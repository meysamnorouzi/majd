"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import {
  fetchServiceBySlugClient,
  fetchServicesClient,
} from "@/lib/wordpress/client";
import type { Service } from "@/types";

function pickRelatedServices(services: Service[]): Service[] {
  const topLevel = services.filter((s) => !s.parentSlug);
  return topLevel.slice(0, 6);
}

function slugFromPathname(pathname: string): string {
  const base = "/services";
  const normalized = pathname.replace(/\/$/, "");
  if (!normalized.startsWith(base)) return "";
  const rest = normalized.slice(base.length).replace(/^\//, "");
  if (!rest || rest === "detail") return "";
  return decodeURIComponent(rest);
}

/**
 * Client shell for a service post. `slug` is passed explicitly by routes that do
 * not live under `/services/` (restored legacy URLs); everything else reads it
 * back off the pathname the host rewrote to this shell.
 */
export function ServiceDetailContent({ slug: slugProp }: { slug?: string }) {
  const pathname = usePathname();
  const slug = slugProp ?? slugFromPathname(pathname);
  const [service, setService] = useState<Service | null>(null);
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    (async () => {
      const [data, menu] = await Promise.all([
        fetchServiceBySlugClient(slug),
        fetchServicesClient(),
      ]);
      if (cancelled) return;

      if (!data) {
        setNotFound(true);
        setService(null);
        setRelatedServices([]);
      } else {
        setService(data);
        setRelatedServices(pickRelatedServices(menu.posts));
        document.title = `${data.title} | موسسه حقوقی مجد`;
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (notFound || !service) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-navy-900">خدمت یافت نشد</h1>
          <Link href="/services/" className="mt-6 inline-block text-gold-600">
            بازگشت به خدمات
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <ServiceDetailView service={service} relatedServices={relatedServices} />
  );
}
