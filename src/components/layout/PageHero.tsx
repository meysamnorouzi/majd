import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { assets } from "@/data/site";

export function PageHero({
  title,
  description,
  breadcrumb,
  image,
  imagePosition = "center",
  compactTitle = false,
}: {
  title: string;
  description?: string;
  breadcrumb?: { label: string; href?: string }[];
  /** Optional background image — defaults to law books */
  image?: string;
  imagePosition?: string;
  /** Smaller type for long SEO titles that wrap to several lines */
  compactTitle?: boolean;
}) {
  const bg = image ?? assets.lawBooks;

  return (
    <section className="relative overflow-hidden bg-navy-900 py-12 text-white sm:py-16 lg:py-20">
      <div className="absolute inset-0">
        <Image
          src={bg}
          alt=""
          fill
          className="object-cover opacity-[0.28] portrait-filter"
          style={{ objectPosition: imagePosition }}
          sizes="100vw"
          priority
          fetchPriority="high"
          aria-hidden
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-l from-navy-950/92 via-navy-950/80 to-navy-800/70" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/50 via-transparent to-navy-950/30" />
      <Container className="relative">
        {breadcrumb && (
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-gold-400">
              خانه
            </Link>
            {breadcrumb.map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <span>/</span>
                {item.href ? (
                  <Link href={item.href} className="hover:text-gold-400">
                    {item.label}
                  </Link>
                ) : (
                  <span className="line-clamp-1 text-gold-400">{item.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1
          className={
            compactTitle
              ? "max-w-5xl text-2xl font-bold leading-snug sm:text-3xl lg:text-4xl"
              : "text-3xl font-bold sm:text-4xl lg:text-5xl"
          }
        >
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-3xl text-base text-white/75 sm:text-lg">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
