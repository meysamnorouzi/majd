"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import type { TeamMember, TeamMemberGalleryItem } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function GalleryLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: TeamMemberGalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  if (!item) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="نمایش بزرگ تصویر"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 left-5 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
      >
        بستن
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-8"
        aria-label="تصویر قبلی"
      >
        →
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20 sm:left-8"
        aria-label="تصویر بعدی"
      >
        ←
      </button>

      <motion.div
        key={item.src}
        className="relative h-[70vh] w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={item.src}
          alt={item.alt}
          fill
          className="object-contain"
          sizes="(max-width: 1024px) 100vw, 896px"
          priority
        />
      </motion.div>

      <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/70">
        {item.alt} · {index + 1} / {items.length}
      </p>
    </motion.div>
  );
}

export function TeamMemberGallery({ member }: { member: TeamMember }) {
  const gallery = member.gallery ?? [];
  const [active, setActive] = useState<number | null>(null);

  if (gallery.length === 0) return null;

  return (
    <section className="bg-cream-dark/40 py-16 lg:py-20">
      <Container>
        <Reveal>
          <h3 className="text-xl font-bold text-navy-900 sm:text-2xl">
            گالری تصاویر
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            لحظاتی از فعالیت حرفه‌ای {member.name}
          </p>
        </Reveal>

        <Stagger
          className="mt-8 columns-2 gap-3 lg:columns-4 lg:gap-4"
          stagger={0.06}
          immediate
        >
          {gallery.map((item, i) => (
            <StaggerItem
              key={item.src}
              variant="up"
              className="mb-3 break-inside-avoid lg:mb-4"
            >
              <button
                type="button"
                onClick={() => setActive(i)}
                className="group relative block w-full overflow-hidden rounded-2xl text-right shadow-md ring-1 ring-navy-900/5"
              >
                <Image
                  src={item.src}
                  alt={item.alt || ""}
                  width={1200}
                  height={1600}
                  sizes="(max-width: 1024px) 50vw, 25vw"
                  className="portrait-warm h-auto w-full"
                  style={{ width: "100%", height: "auto", aspectRatio: "auto" }}
                />
                <div className="absolute inset-0 bg-navy-950/0 transition duration-500 group-hover:bg-navy-950/25" />
                {item.alt ? (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/70 to-transparent p-3 opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="text-xs font-medium text-white/90 sm:text-sm">
                      {item.alt}
                    </span>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-500 group-hover:opacity-100">
                    <span className="rounded-full border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                      بزرگ‌نمایی
                    </span>
                  </div>
                )}
              </button>
            </StaggerItem>
          ))}
        </Stagger>
      </Container>

      <AnimatePresence>
        {active !== null && (
          <GalleryLightbox
            items={gallery}
            index={active}
            onClose={() => setActive(null)}
            onPrev={() =>
              setActive((i) =>
                i === null ? 0 : (i - 1 + gallery.length) % gallery.length,
              )
            }
            onNext={() =>
              setActive((i) => (i === null ? 0 : (i + 1) % gallery.length))
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}
