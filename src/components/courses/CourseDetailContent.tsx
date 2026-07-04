"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { CoursePurchaseCardWp } from "@/components/courses/CoursePurchaseCardWp";
import { formatIcon } from "@/components/courses/FormatIcons";
import { getAccent } from "@/components/courses/accentStyles";
import { getCourseFormat } from "@/data/courses";
import {
  fetchStoreProductBySlugClient,
  type StoreProductView,
} from "@/lib/woocommerce/store-products-client";
import { ConsultationSection } from "@/components/contact/ConsultationSection";
import type { CourseFormatSlug } from "@/types";

function slugFromPathname(pathname: string): string {
  const base = "/courses/view";
  const normalized = pathname.replace(/\/$/, "");
  if (!normalized.startsWith(base)) return "";
  return decodeURIComponent(normalized.slice(base.length).replace(/^\//, ""));
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

export function CourseDetailContent() {
  const pathname = usePathname();
  const slug = slugFromPathname(pathname);
  const [product, setProduct] = useState<StoreProductView | null>(null);
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

    fetchStoreProductBySlugClient(slug).then((data) => {
      if (cancelled) return;
      if (!data || !data.majd.is_course) {
        setNotFound(true);
        setProduct(null);
      } else {
        setProduct(data);
        document.title = `${data.name} | موسسه حقوقی مجد`;
      }
      setLoading(false);
    });

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

  if (notFound || !product) {
    return (
      <Container>
        <div className="py-24 text-center">
          <h1 className="text-2xl font-bold text-navy-900">دوره یافت نشد</h1>
          <Link href="/courses/" className="mt-6 inline-block text-gold-600">
            بازگشت به دوره‌ها
          </Link>
        </div>
      </Container>
    );
  }

  const formatSlug = (product.majd.format_slug || "session-inperson") as CourseFormatSlug;
  const format = getCourseFormat(formatSlug);
  if (!format) {
    return null;
  }

  const Icon = formatIcon(format.slug);
  const accent = getAccent(format);
  const heroImage = product.image ?? format.image;
  const description =
    stripHtml(product.description) || product.short_description;
  const syllabus = product.majd.syllabus;
  const highlights = product.majd.highlights;

  return (
    <>
      <PageHero
        title={product.name}
        description={`${format.badge}${product.majd.duration ? ` · ${product.majd.duration}` : ""}`}
        breadcrumb={[
          { label: "دوره‌های آموزشی", href: "/courses/" },
          { label: format.badge, href: `/courses/${format.slug}/` },
          { label: product.name },
        ]}
      />

      <section className="py-16">
        <Container>
          <div className="relative mb-12 overflow-hidden rounded-2xl">
            <div className="relative aspect-[21/9] min-h-[200px]">
              <Image
                src={heroImage}
                alt={product.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-l from-navy-950/90 to-navy-900/50" />
              <div className="absolute inset-0 flex items-center p-8 md:p-12">
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${accent.icon}`}
                  >
                    <Icon className="h-7 w-7" />
                  </div>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-bold ${accent.badge}`}
                  >
                    {format.badge}
                    {product.majd.level ? ` · سطح ${product.majd.level}` : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <p className="text-lg leading-relaxed text-slate-600">
                {description}
              </p>

              {highlights.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-md bg-navy-900/5 px-3 py-1 text-sm text-slate-600"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}

              {syllabus.length > 0 && (
                <>
                  <h2 className="mt-10 text-xl font-bold text-navy-900">
                    سرفصل دوره
                  </h2>
                  <ol className="mt-4 space-y-3">
                    {syllabus.map((item, i) => (
                      <li
                        key={item}
                        className="flex gap-3 rounded-xl border border-slate-100 bg-cream/50 px-4 py-3 text-sm text-slate-700"
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${accent.icon}`}
                        >
                          {(i + 1).toLocaleString("fa-IR")}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </>
              )}

              <div className="mt-10 rounded-2xl bg-cream p-6">
                <h2 className="font-bold text-navy-900">
                  درباره فرمت {format.badge}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {format.description}
                </p>
              </div>

              <Link
                href={`/courses/${format.slug}/`}
                className="mt-8 inline-flex text-sm font-semibold text-gold-600 hover:text-gold-700"
              >
                ← بازگشت به فهرست دوره‌های {format.badge}
              </Link>
            </div>

            <div>
              <CoursePurchaseCardWp format={format} product={product} />
            </div>
          </div>
        </Container>
      </section>

      <ConsultationSection
        defaultSubject="دوره آموزشی"
        defaultMessage={`درخواست مشاوره درباره دوره: ${product.name}`}
        title="نیاز به راهنمایی در انتخاب دوره دارید؟"
      />
    </>
  );
}
