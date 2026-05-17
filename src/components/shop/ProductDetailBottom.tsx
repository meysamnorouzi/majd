import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProductCard } from "@/components/shop/ProductCard";
import { ProductFAQ } from "@/components/shop/ProductFAQ";
import {
  getProductDetailMeta,
  shopTrustItems,
  type ProductDetailMeta,
} from "@/data/shop";
import { siteConfig } from "@/data/site";

const trustIcons = ["⚖", "🛡", "✓", "🔒"] as const;

function TrustStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {shopTrustItems.map((item, i) => (
        <div
          key={item.title}
          className="group relative overflow-hidden rounded-2xl border border-navy-900/8 bg-white p-6 shadow-sm transition hover:border-gold-500/30 hover:shadow-md"
        >
          <span
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-900 text-xl text-gold-400 transition group-hover:gold-gradient group-hover:text-navy-950"
            aria-hidden
          >
            {trustIcons[i]}
          </span>
          <h3 className="font-bold text-navy-900">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function HighlightsBento({
  highlights,
}: {
  highlights: ProductDetailMeta["highlights"];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-2">
      {highlights.map((item, i) => (
        <div
          key={item.title}
          className={`relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm ${
            i === 0 ? "sm:row-span-2 sm:flex sm:flex-col sm:justify-center" : ""
          }`}
        >
          <span className="absolute -left-4 -top-4 text-7xl font-black text-gold-500/10">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="relative text-lg font-bold text-navy-900">
            {item.title}
          </h3>
          <p className="relative mt-3 text-sm leading-relaxed text-slate-600">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

function SpecsTable({ specs }: { specs: ProductDetailMeta["specs"] }) {
  return (
    <dl className="divide-y divide-slate-200/80 overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
      {specs.map((row) => (
        <div
          key={row.label}
          className="grid gap-2 px-6 py-4 sm:grid-cols-[minmax(8rem,1fr)_2fr] sm:gap-8"
        >
          <dt className="text-sm font-semibold text-gold-600">{row.label}</dt>
          <dd className="text-slate-700">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function PurchaseSteps({
  steps,
  onDark = false,
}: {
  steps: ProductDetailMeta["steps"];
  onDark?: boolean;
}) {
  return (
    <ol className="relative space-y-0">
      {steps.map((step, i) => (
        <li key={step.title} className="relative flex gap-6 pb-10 last:pb-0">
          {i < steps.length - 1 && (
            <span
              className="absolute right-5 top-12 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-gold-500/60 to-transparent"
              aria-hidden
            />
          )}
          <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-gradient text-sm font-black text-navy-950 shadow-lg shadow-gold-500/20">
            {i + 1}
          </span>
          <div className="pt-1">
            <h3
              className={`font-bold ${onDark ? "text-white" : "text-navy-900"}`}
            >
              {step.title}
            </h3>
            <p
              className={`mt-2 text-sm leading-relaxed ${
                onDark ? "text-white/70" : "text-slate-600"
              }`}
            >
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function ProductDetailBottom({
  slug,
  name,
  description,
  category,
  format,
  relatedProducts,
  wpPurchaseUrl,
}: {
  slug: string;
  name: string;
  description?: string;
  category: string;
  format: string;
  relatedProducts: {
    slug: string;
    name: string;
    short_description: string;
    price: string;
    currency: string;
    image?: string;
  }[];
  wpPurchaseUrl?: string;
}) {
  const meta = getProductDetailMeta(slug, name);

  return (
    <>
      <section className="border-t border-slate-200/60 bg-cream-dark/40 py-16">
        <Container>
          <TrustStrip />
        </Container>
      </section>

      <section id="product-details" className="py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              align="right"
              eyebrow="جزئیات محصول"
              title="همه آنچه باید بدانید"
              description="ویژگی‌ها، مشخصات فنی، نحوه دریافت و پاسخ سوالات رایج"
            />
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-navy-900 px-4 py-2 font-medium text-white">
                {category}
              </span>
              <span className="rounded-full border border-gold-500/40 bg-gold-500/10 px-4 py-2 font-medium text-gold-600">
                {format}
              </span>
            </div>
          </div>

          <div className="mt-16 grid gap-16 lg:grid-cols-2">
            <div>
              <h3 className="mb-6 text-xl font-bold text-navy-900">
                چرا این محصول؟
              </h3>
              <HighlightsBento highlights={meta.highlights} />
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="mb-4 text-xl font-bold text-navy-900">
                  مشخصات
                </h3>
                <SpecsTable specs={meta.specs} />
              </div>

              <div className="rounded-2xl bg-navy-900 p-8 text-white">
                <h3 className="text-lg font-bold text-gold-400">
                  این بسته شامل
                </h3>
                <ul className="mt-5 space-y-3">
                  {meta.includes.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-white/85">
                      <span className="mt-0.5 text-gold-400" aria-hidden>
                        ✦
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {description && (
        <section className="bg-white py-20">
          <Container>
            <div className="mx-auto max-w-3xl">
              <SectionTitle
                align="right"
                eyebrow="معرفی کامل"
                title="توضیحات تفصیلی"
              />
              <div
                className="prose-wp rounded-2xl border border-slate-100 bg-cream/50 p-8 sm:p-10"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
          </Container>
        </section>
      )}

      <section className="relative overflow-hidden py-20">
        <div
          className="absolute inset-0 bg-navy-950"
          style={{
            backgroundImage: `radial-gradient(ellipse 80% 60% at 100% 0%, rgba(201, 162, 39, 0.12), transparent),
              radial-gradient(ellipse 60% 50% at 0% 100%, rgba(19, 45, 82, 0.8), transparent)`,
          }}
          aria-hidden
        />
        <Container className="relative">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <SectionTitle
                align="right"
                light
                eyebrow="نحوه دریافت"
                title="از خرید تا تحویل"
              />
              <PurchaseSteps steps={meta.steps} onDark />
              <Link
                href={wpPurchaseUrl ?? "/cart/"}
                className="mt-10 inline-flex items-center justify-center rounded-lg gold-gradient px-8 py-4 font-semibold text-navy-950 shadow-lg shadow-gold-500/20 transition hover:opacity-95"
              >
                رفتن به سبد خرید
              </Link>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gold-400">
                نکات ارسال و تحویل
              </h3>
              <ul className="mt-6 space-y-4">
                {meta.deliveryNotes.map((note) => (
                  <li
                    key={note}
                    className="flex gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-relaxed text-white/80"
                  >
                    <span className="text-gold-400" aria-hidden>
                      →
                    </span>
                    {note}
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-6">
                <p className="text-sm text-white/70">
                  سوالی دارید؟ با موسسه تماس بگیرید:
                </p>
                <a
                  href={`tel:${siteConfig.phonesTel[0]}`}
                  className="mt-2 block text-xl font-bold text-gold-400 hover:text-gold-300"
                  dir="ltr"
                >
                  {siteConfig.phones[0]}
                </a>
                <Link
                  href="/contact/"
                  className="mt-4 inline-block text-sm font-semibold text-white underline decoration-gold-500/50 underline-offset-4 hover:text-gold-400"
                >
                  فرم تماس
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-navy-900 py-20">
        <Container>
          <SectionTitle
            align="right"
            light
            eyebrow="سوالات متداول"
            title="پرسش‌های رایج درباره این محصول"
          />
          <div className="mx-auto max-w-3xl">
            <ProductFAQ items={meta.faq} />
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionTitle
              align="right"
              eyebrow="پیشنهاد ما"
              title="محصولات مرتبط"
              description="سایر منابع و خدمات حقوقی موسسه مجد"
            />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.slug} {...p} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/shop/"
                className="inline-flex items-center gap-2 font-semibold text-navy-900 transition hover:text-gold-600"
              >
                ← بازگشت به فروشگاه
              </Link>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
