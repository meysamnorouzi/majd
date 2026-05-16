import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
}

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="py-20 lg:py-28">
      <Container>
        <SectionTitle
          eyebrow="مقالات حقوقی"
          title="آخرین مطالب بلاگ"
          description="تحلیل‌های تخصصی و راهنمای حقوقی از وکلای موسسه مجد"
        />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
            >
              <Link href={`/blog/${post.slug}/`}>
                <div className="relative h-48 overflow-hidden">
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-6">
                  <time className="text-xs text-gold-600">
                    {new Date(post.date).toLocaleDateString("fa-IR")}
                  </time>
                  <h3 className="mt-2 text-lg font-bold text-navy-900 group-hover:text-gold-600">
                    {post.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-gold-600">
                    ادامه مطلب ←
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-8 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            همه مقالات
          </Link>
        </div>
      </Container>
    </section>
  );
}
