"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { parseVideoSource } from "@/lib/media/video";
import type { TeamMember, TeamMemberVideoItem } from "@/types";

const EASE = [0.22, 1, 0.36, 1] as const;

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14Z" />
    </svg>
  );
}

function VideoLightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: TeamMemberVideoItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const item = items[index];
  if (!item) return null;

  const parsed = parseVideoSource(item.src);
  if (!parsed) return null;

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
      aria-label="پخش ویدیو"
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-5 left-5 z-10 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
      >
        بستن
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white transition hover:bg-white/20 sm:right-8"
            aria-label="ویدیو قبلی"
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
            aria-label="ویدیو بعدی"
          >
            ←
          </button>
        </>
      )}

      <motion.div
        key={item.src}
        className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-navy-950 shadow-2xl"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: EASE }}
        onClick={(e) => e.stopPropagation()}
      >
        {parsed.provider === "file" ? (
          <video
            src={parsed.embedUrl}
            controls
            autoPlay
            playsInline
            poster={item.poster || parsed.poster}
            className="h-full w-full object-contain"
          />
        ) : (
          <iframe
            src={`${parsed.embedUrl}${parsed.embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
            title={item.title || "ویدیو"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </motion.div>

      <p className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/70">
        {item.title || "ویدیو"}
        {items.length > 1 ? ` · ${index + 1} / ${items.length}` : ""}
      </p>
    </motion.div>
  );
}

export function TeamMemberVideoGallery({ member }: { member: TeamMember }) {
  const videos = member.videoGallery ?? [];
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") {
        setActive((i) => (i === null ? 0 : (i - 1 + videos.length) % videos.length));
      }
      if (e.key === "ArrowLeft") {
        setActive((i) => (i === null ? 0 : (i + 1) % videos.length));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, videos.length]);

  if (videos.length === 0) return null;

  return (
    <section className="bg-white py-16 lg:py-20">
      <Container>
        <Reveal>
          <h3 className="text-xl font-bold text-navy-900 sm:text-2xl">
            گالری ویدیو
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            ویدیوهایی از فعالیت حرفه‌ای {member.name}
          </p>
        </Reveal>

        <Stagger
          className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          stagger={0.06}
        >
          {videos.map((item, i) => {
            const parsed = parseVideoSource(item.src);
            const poster = item.poster || parsed?.poster;
            return (
              <StaggerItem key={`${item.src}-${i}`} variant="up">
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className="group relative block w-full overflow-hidden rounded-2xl text-right shadow-md ring-1 ring-navy-900/5"
                >
                  <div className="relative aspect-video bg-navy-900">
                    {poster ? (
                      <Image
                        src={poster}
                        alt={item.title || "ویدیو"}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : null}
                    <div className="absolute inset-0 bg-navy-950/35 transition duration-500 group-hover:bg-navy-950/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-500 text-navy-950 shadow-lg transition group-hover:scale-110">
                        <PlayIcon className="h-6 w-6 translate-x-px" />
                      </span>
                    </div>
                    {item.title ? (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-950/80 to-transparent p-4">
                        <span className="line-clamp-1 text-sm font-medium text-white">
                          {item.title}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </button>
              </StaggerItem>
            );
          })}
        </Stagger>
      </Container>

      <AnimatePresence>
        {active !== null && (
          <VideoLightbox
            items={videos}
            index={active}
            onClose={() => setActive(null)}
            onPrev={() =>
              setActive((i) =>
                i === null ? 0 : (i - 1 + videos.length) % videos.length,
              )
            }
            onNext={() =>
              setActive((i) => (i === null ? 0 : (i + 1) % videos.length))
            }
          />
        )}
      </AnimatePresence>
    </section>
  );
}
