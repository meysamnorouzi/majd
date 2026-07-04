import Image from "next/image";
import Link from "next/link";
import { assets } from "@/data/site";

function formatPrice(price: string) {
  const num = parseInt(price, 10);
  if (isNaN(num)) return price;
  return num.toLocaleString("fa-IR");
}

export function ProductCard({
  slug,
  name,
  short_description,
  price,
  currency,
  image,
}: {
  slug: string;
  name: string;
  short_description: string;
  price: string;
  currency: string;
  image?: string;
}) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl">
      <Link href={`/shop/product/${slug}/`}>
        <div className="relative aspect-square overflow-hidden bg-cream">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="relative flex h-full items-center justify-center bg-navy-950 p-6">
              <Image
                src={assets.logo}
                alt=""
                width={80}
                height={80}
                className="object-contain opacity-90"
              />
            </div>
          )}
        </div>
        <div className="p-5">
          <h2 className="font-bold text-navy-900 group-hover:text-gold-600">
            {name}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {short_description}
          </p>
          <p className="mt-4 text-lg font-bold text-gold-600">
            {formatPrice(price)} {currency}
          </p>
        </div>
      </Link>
    </article>
  );
}
