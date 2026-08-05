import Image from "next/image";
import Link from "next/link";
import { assets, siteConfig } from "@/data/site";

const sizes = {
  sm: { img: 44, className: "h-11 w-11" },
  md: { img: 52, className: "h-[52px] w-[52px]" },
  lg: { img: 72, className: "h-[72px] w-[72px]" },
} as const;

export function Logo({
  size = "md",
  showText = true,
  variant = "dark",
}: {
  size?: keyof typeof sizes;
  showText?: boolean;
  variant?: "dark" | "light";
}) {
  const { img, className } = sizes[size];
  const textPrimary = variant === "dark" ? "text-white" : "text-navy-900";
  const textAccent = variant === "dark" ? "text-gold-400" : "text-gold-600";

  return (
    <Link href="/" className="group flex items-center gap-3">
      <span
        className={`relative shrink-0 overflow-hidden rounded-full ring-2 ring-gold-500/40 ring-offset-2 ring-offset-transparent transition group-hover:ring-gold-400 ${className}`}
      >
        <Image
          src={assets.logo}
          alt={siteConfig.name}
          width={img}
          height={img}
          className="h-full w-full object-cover"
          priority
        />
      </span>
      {showText && (
        <span className="hidden min-w-0 sm:block">
          <span
            className={`block text-base font-bold leading-tight ${textPrimary}`}
          >
            {siteConfig.shortName}
          </span>
          <span className={`block text-sm ${textAccent}`}>وکیل الرعایا</span>
        </span>
      )}
    </Link>
  );
}
