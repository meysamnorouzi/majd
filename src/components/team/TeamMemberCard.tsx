import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/types";
import { portraitObjectPosition } from "@/data/site";

export function TeamMemberCard({
  member,
  variant = "default",
}: {
  member: TeamMember;
  variant?: "default" | "compact";
}) {
  const href = `/team/${member.slug}/`;
  const objectPosition = portraitObjectPosition(member.image);

  if (variant === "compact") {
    return (
      <Link
        href={href}
        className="group flex items-center gap-4 rounded-xl border border-slate-100 bg-white p-3 transition hover:border-gold-400/40 hover:shadow-md"
      >
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
          <Image
            src={member.image}
            alt={member.name}
            fill
            className="object-cover"
            style={objectPosition ? { objectPosition } : undefined}
            sizes="64px"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-navy-900 group-hover:text-gold-600">
            {member.name}
          </p>
          <p className="truncate text-xs text-gold-600">{member.specialty}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={href} className="group block">
      <article className="overflow-hidden rounded-2xl bg-white shadow-md transition-[transform,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-xl">
        <div className="relative aspect-[3/4] overflow-hidden">
          <div className="absolute inset-0 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">
            <Image
              src={member.image}
              alt={member.name}
              fill
              className="portrait-filter object-cover"
              style={{
                objectPosition: objectPosition ?? "center 18%",
              }}
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-85 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-95" />
          <div className="absolute bottom-0 p-5 text-white">
            <h3 className="font-bold">{member.name}</h3>
            <p className="mt-1 text-xs text-gold-400">{member.role}</p>
          </div>
        </div>
        <div className="p-5">
          <p className="text-xs font-semibold text-gold-600">{member.specialty}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
            {member.bio}
          </p>
          <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy-900 transition group-hover:text-gold-600">
            مشاهده پروفایل
            <span aria-hidden className="transition group-hover:-translate-x-1">
              ←
            </span>
          </span>
        </div>
      </article>
    </Link>
  );
}
