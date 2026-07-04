import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/site";

export function PostCard({
  slug,
  title,
  excerpt,
  date,
  image,
}: {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image?: string;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
      <Link href={`/blog/post/${slug}/`}>
        <div className="relative h-52 overflow-hidden">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="relative flex h-full items-center justify-center bg-navy-950 p-8">
              <Image
                src={assets.logo}
                alt=""
                width={120}
                height={120}
                className="object-contain opacity-90"
              />
            </div>
          )}
        </div>
        <div className="p-6">
          <time className="text-xs text-gold-600">
            {new Date(date).toLocaleDateString("fa-IR")}
          </time>
          <h2 className="mt-2 text-lg font-bold text-navy-900 group-hover:text-gold-600">
            {title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">{excerpt}</p>
          <span className="mt-4 inline-block text-sm font-semibold text-gold-600">
            ادامه مطلب ←
          </span>
        </div>
      </Link>
    </article>
  );
}
