import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { PostCard } from "@/components/blog/PostCard";
import { PillarHubContent } from "@/components/services/PillarHubContent";
import { getPillar } from "@/data/pillars";
import { createPageMetadata } from "@/lib/seo";
import { hubPath, type ServiceCategoryPrefix } from "@/lib/service-paths";
import { getLandingByPrefix } from "@/lib/wordpress/landings";
import {
  getAllServiceSlugs,
  getCategoryBySlug,
  getPosts,
} from "@/lib/wordpress";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generatePillarHubMetadata(
  prefix: ServiceCategoryPrefix,
): Promise<Metadata> {
  const pillar = getPillar(prefix);
  if (!pillar) return { title: "صفحه یافت نشد" };
  const landing = await getLandingByPrefix(prefix);
  return createPageMetadata({
    title: landing.seoTitle,
    description: landing.seoDescription,
    path: hubPath(prefix),
    image: landing.image ?? pillar.image,
    keywords: landing.keywords,
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

  const posts = await relatedPostsForPillar(prefix);

  return (
    <>
      <PillarHubContent prefix={prefix} />

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
