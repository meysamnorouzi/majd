"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ServiceDetailView } from "@/components/services/ServiceDetailView";
import { fetchServiceBySlugClient } from "@/lib/wordpress/client";
import {
  categoryPrefixFromPathname,
  hubPath,
  servicePath,
  servicePathMatchesLocation,
  serviceSlugFromPathname,
} from "@/lib/service-paths";
import type { Service } from "@/types";

export function ServiceDetailContent({ slug: slugProp }: { slug?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const slug = slugProp ?? serviceSlugFromPathname(pathname);
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const lastRedirectRef = useRef<string | null>(null);

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
      const data = await fetchServiceBySlugClient(slug);
      if (cancelled) return;

      if (!data) {
        setNotFound(true);
        setService(null);
      } else {
        const urlPrefix = categoryPrefixFromPathname(pathname);
        const resolved =
          urlPrefix && !data.categoryPrefix
            ? { ...data, categoryPrefix: urlPrefix }
            : data;

        if (!slugProp && !servicePathMatchesLocation(pathname, resolved)) {
          const canonical = servicePath(resolved, urlPrefix);
          if (lastRedirectRef.current !== canonical) {
            lastRedirectRef.current = canonical;
            router.replace(canonical);
            return;
          }
          // Already attempted this target — render here to break redirect loops.
        } else {
          lastRedirectRef.current = null;
        }

        setService(resolved);
        document.title = `${resolved.title} | موسسه حقوقی مجد`;
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, slugProp, pathname, router]);

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
          <Link
            href={hubPath("family-lawyer")}
            className="mt-6 inline-block text-gold-600"
          >
            بازگشت به خدمات
          </Link>
        </div>
      </Container>
    );
  }

  return <ServiceDetailView service={service} />;
}
