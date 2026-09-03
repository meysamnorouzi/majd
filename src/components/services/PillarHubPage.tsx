import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PostCard } from "@/components/blog/PostCard";
import { ConsultationSection } from "@/components/contact/ConsultationSection";
import { ServiceCallCta } from "@/components/services/ServiceCallCta";
import { ServiceSubpillarCards } from "@/components/services/ServiceSubpillarCards";
import { JsonLd } from "@/components/seo/JsonLd";
import { portraitObjectPosition } from "@/data/site";
import { getPillar } from "@/data/pillars";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  createPageMetadata,
} from "@/lib/seo";
import {
  getPillarLeavesFromTree,
  hubPath,
  servicePath,
  type ServiceCategoryPrefix,
} from "@/lib/service-paths";
import {
  getAllServiceSlugs,
  getCategoryBySlug,
  getPosts,
  getServiceMegaTrees,
} from "@/lib/wordpress";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generatePillarHubMetadata(
  prefix: ServiceCategoryPrefix,
): Promise<Metadata> {
  const pillar = getPillar(prefix);
  if (!pillar) return { title: "صفحه یافت نشد" };
  return createPageMetadata({
    title: pillar.title,
    description: pillar.excerpt,
    path: hubPath(prefix),
    image: pillar.image,
    keywords: pillar.keywords,
  });
}

async function relatedPostsForPillar(prefix: ServiceCategoryPrefix) {
  const pillar = getPillar(prefix);
  if (!pillar) return [];

  const serviceSlugs = new Set(await getAllServiceSlugs());
  const asArticles = <T extends { slug: string }>(posts: T[]) =>
    posts.filter((post) => !serviceSlugs.has(post.slug)).slice(0, 6);

  for (const slug of pillar.blogCategorySlugs) {
    const category = await getCategoryBySlug(slug);
    if (!category) continue;
    const posts = asArticles(await getPosts(12, { categoryId: category.id }));
    if (posts.length) return posts;
  }

  return asArticles(await getPosts(12));
}

export async function PillarHubPage({
  prefix,
}: {
  prefix: ServiceCategoryPrefix;
}) {
  const pillar = getPillar(prefix);
  if (!pillar) notFound();

  const path = hubPath(prefix);
  const [trees, posts] = await Promise.all([
    getServiceMegaTrees(),
    relatedPostsForPillar(prefix),
  ]);
  const cards = getPillarLeavesFromTree(
    trees.find((tree) => tree.categoryPrefix === prefix),
  );

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "خانه", path: "/" },
            { name: pillar.title, path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pillar.title,
            description: pillar.excerpt,
            url: absoluteUrl(path),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: cards.length,
              itemListElement: cards.map((service, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: service.title,
                url: absoluteUrl(servicePath(service)),
              })),
            },
          },
        ]}
      />

      <PageHero
        title={pillar.title}
        description={pillar.excerpt}
        breadcrumb={[{ label: pillar.title }]}
        image={pillar.image}
        imagePosition={portraitObjectPosition(pillar.image) ?? "center 28%"}
      />

      <section className="py-12 lg:py-16">
        <Container>
          <p className="max-w-3xl text-start text-lg leading-relaxed text-slate-700">
            {pillar.intro}
          </p>

          <div className="mt-14">
            <ServiceSubpillarCards
              services={cards}
              heading={`خدمات ${pillar.title}`}
              description={`هر کارت به صفحه تخصصی همان خدمت در ${pillar.title} لینک می‌شود.`}
            />
          </div>

          <ServiceCallCta
            title={
              prefix === "legal-consultation"
                ? "درخواست مشاوره حقوقی"
                : `مشاوره ${pillar.title}`
            }
            description="برای بررسی پرونده با وکیل متخصص این حوزه تماس بگیرید."
          />

          <div className="mt-4 max-w-3xl text-start text-base leading-relaxed text-slate-700">
            <p>{pillar.body}</p>
          </div>
        </Container>
      </section>

      <ConsultationSection
        title="فرم مشاوره"
        description={`موضوع پرونده ${pillar.title} را بنویسید؛ کارشناسان موسسه با شما تماس می‌گیرند.`}
        defaultSubject={pillar.title}
        defaultMessage={`درخواست مشاوره برای ${pillar.title}`}
      />

      {posts.length > 0 ? (
        <section className="border-t border-slate-100 bg-white py-16 lg:py-20">
          <Container>
            <SectionTitle
              eyebrow="مقالات حقوقی"
              title={`مقالات ${pillar.title}`}
              description="تحلیل‌ها و راهنماهای مرتبط با این دسته"
            />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
