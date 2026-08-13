"use client";

import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { BLOG_LIST_PATH, blogPostPath } from "@/lib/blog-paths";

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
          title="آخرین مقالات"
          description="تحلیل‌های تخصصی و راهنمای حقوقی از وکلای موسسه مجد"
        />
        <Stagger className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" stagger={0.1}>
          {posts.slice(0, 3).map((post) => (
            <StaggerItem key={post.id} as="article" variant="up">
              <div className="group h-full overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
                <Link href={blogPostPath(post.slug)}>
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
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <Reveal className="mt-10 text-center" delay={0.1}>
          <Link
            href={BLOG_LIST_PATH}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-8 py-3 font-semibold text-navy-900 transition hover:bg-navy-900 hover:text-white"
          >
            همه مقالات
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}
