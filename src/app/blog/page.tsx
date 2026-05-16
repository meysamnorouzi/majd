import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { PostCard } from "@/components/blog/PostCard";
import { getPosts } from "@/lib/wordpress";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "بلاگ",
  description: "مقالات و تحلیل‌های حقوقی موسسه حقوقی مجد وکیل الرعایا",
};

export default async function BlogPage() {
  const posts = await getPosts(24);

  return (
    <>
      <PageHero
        title="بلاگ حقوقی"
        description="آخرین مقالات، تحلیل‌ها و راهنماهای حقوقی از وکلای متخصص"
        breadcrumb={[{ label: "بلاگ" }]}
      />
      <section className="py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
