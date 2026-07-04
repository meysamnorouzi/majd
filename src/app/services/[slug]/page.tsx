import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
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
            </div>
            <aside
              id="consultation"
              className="relative h-fit scroll-mt-24 overflow-hidden rounded-2xl bg-navy-900 p-8 text-white lg:sticky lg:top-8"
            >
              <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
              <ContactForm
                variant="dark"
                title="درخواست مشاوره"
                description={`برای دریافت مشاوره تخصصی در زمینه ${service.title} فرم زیر را تکمیل کنید.`}
                defaultSubject="مشاوره حقوقی"
                defaultMessage={`درخواست مشاوره برای خدمت: ${service.title}`}
              />
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}
