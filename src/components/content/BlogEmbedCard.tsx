"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/site";
import {
  fetchPostBySlugClient,
  type BlogPost,
} from "@/lib/wordpress/client";

export function BlogEmbedCard({ slug }: { slug: string }) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "missing">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");

    (async () => {
      const data = await fetchPostBySlugClient(slug);
      if (cancelled) return;
      if (!data) {
        setPost(null);
        setStatus("missing");
        return;
      }
      setPost(data);
      setStatus("ready");
    })();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (status === "missing") return null;

  if (status === "loading" || !post) {
    return (
      <div
        className="my-6 flex animate-pulse overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-sm"
        aria-hidden
      >
        <div className="h-28 w-32 shrink-0 bg-slate-200 sm:w-40" />
        <div className="flex flex-1 flex-col justify-center gap-3 p-4">
          <div className="h-3 w-20 rounded bg-slate-200" />
          <div className="h-5 w-3/4 rounded bg-slate-200" />
          <div className="h-3 w-24 rounded bg-slate-200" />
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/blog/post/${post.slug}/`}
      className="group my-6 flex overflow-hidden rounded-2xl border border-navy-900/10 bg-white shadow-md transition hover:border-gold-500/40 hover:shadow-xl"
    >
      <div className="relative h-28 w-32 shrink-0 overflow-hidden sm:h-32 sm:w-44">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="176px"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-navy-950 p-4">
            <Image
              src={assets.logo}
              alt=""
              width={72}
              height={72}
              className="object-contain opacity-90"
            />
          </div>
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-l from-black/25 to-transparent opacity-0 transition group-hover:opacity-100"
          aria-hidden
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-4 py-3 sm:px-5">
        <span className="text-xs font-semibold tracking-wide text-gold-600">
          مقاله مرتبط
        </span>
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-navy-900 transition group-hover:text-gold-600 sm:text-lg">
          {post.title}
        </h3>
        <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-gold-600">
          مطالعه مقاله
          <span aria-hidden className="transition group-hover:-translate-x-0.5">
            ←
          </span>
        </span>
      </div>
    </Link>
  );
}
