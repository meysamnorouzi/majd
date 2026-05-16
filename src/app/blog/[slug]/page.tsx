import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { getAllPostSlugs, getPostBySlug } from "@/lib/wordpress";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "مقاله یافت نشد" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <>
      <PageHero
        title={post.title}
        breadcrumb={[
          { label: "بلاگ", href: "/blog/" },
          { label: post.title },
        ]}
      />
      <article className="py-16">
        <Container>
          <div className="mx-auto max-w-3xl">
            <time className="text-sm text-gold-600">
              {new Date(post.date).toLocaleDateString("fa-IR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {post.image && (
              <div className="relative my-8 aspect-video overflow-hidden rounded-2xl">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="768px"
                  priority
                />
              </div>
            )}
            <div
              className="prose-wp"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <div className="mt-12 rounded-2xl border border-gold-400/30 bg-navy-900 p-8 text-center text-white">
              <p className="text-lg font-semibold">نیاز به مشاوره تخصصی دارید؟</p>
              <p className="mt-2 text-sm text-white/75">
                وکلای موسسه مجد آماده پاسخگویی به سوالات حقوقی شما هستند.
              </p>
              <div className="mt-6">
                <Button href="/contact/">تماس با موسسه</Button>
              </div>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
