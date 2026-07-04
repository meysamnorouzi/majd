import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/wordpress/client";

export function BlogFeaturedPost({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/post/${post.slug}/`}
      className="group relative mb-12 block overflow-hidden rounded-2xl shadow-2xl shadow-navy-900/20"
    >
      <div className="relative aspect-[21/9] min-h-[220px] sm:min-h-[280px]">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 1200px"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-navy-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
          <span className="mb-3 inline-flex w-fit rounded-full bg-gold-500 px-4 py-1 text-xs font-bold text-navy-950">
            مقاله ویژه
          </span>
          <h2 className="max-w-2xl text-2xl font-bold text-white transition group-hover:text-gold-400 sm:text-3xl">
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-2 max-w-xl text-sm text-white/75">
            {post.excerpt.replace(/<[^>]*>/g, "")}
          </p>
          <time className="mt-4 text-sm text-gold-400">
            {new Date(post.date).toLocaleDateString("fa-IR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </div>
    </Link>
  );
}

export function BlogInlineBanner() {
  return (
    <div className="relative my-12 overflow-hidden rounded-2xl bg-navy-900 px-6 py-10 sm:px-10">
      <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-bold text-white sm:text-2xl">
            نیاز به مشاوره تخصصی دارید؟
          </h3>
          <p className="mt-2 max-w-lg text-sm text-white/75">
            وکلای مجرب موسسه حقوقی مجد آماده بررسی پرونده و ارائه راهکار حقوقی
            هستند. اولین مشاوره برای اشخاص نیازمند رایگان است.
          </p>
        </div>
        <Link
          href="/contact/"
          className="shrink-0 rounded-lg bg-gold-500 px-6 py-3 font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          درخواست مشاوره
        </Link>
      </div>
    </div>
  );
}
