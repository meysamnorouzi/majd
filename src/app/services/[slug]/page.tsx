import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { CTASection } from "@/components/home/CTASection";
import { getServiceBySlug, getServices } from "@/lib/wordpress";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getServices().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: "خدمت یافت نشد" };
  return {
    title: service.title,
    description: service.excerpt,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  return (
    <>
      <PageHero
        title={service.title}
        description={service.excerpt}
        breadcrumb={[
          { label: "خدمات", href: "/services/" },
          { label: service.title },
        ]}
      />
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {service.image && (
                <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                </div>
              )}
              <div className="prose-wp leading-relaxed text-slate-700">
                <p>{service.description}</p>
              </div>
              <div className="mt-8">
                <Button href="/contact/">درخواست مشاوره برای این خدمت</Button>
              </div>
            </div>
            <aside className="h-fit rounded-2xl bg-navy-900 p-8 text-white">
              <h3 className="text-lg font-bold text-gold-400">مشاوره رایگان</h3>
              <p className="mt-3 text-sm text-white/75">
                برای دریافت مشاوره تخصصی در زمینه {service.title} با موسسه تماس
                بگیرید.
              </p>
              <div className="mt-6">
                <Button href="/contact/" className="w-full">
                  تماس با ما
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>
      <CTASection />
    </>
  );
}
