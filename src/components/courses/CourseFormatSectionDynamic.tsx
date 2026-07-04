"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { CourseFormat } from "@/types";
import { Container } from "@/components/ui/Container";
import { WpCourseCard } from "@/components/courses/WpCourseCard";
import { hasSpotPlayerLicense } from "@/lib/courses/format-utils";
import {
  fetchCourseProductsClient,
  type StoreProductView,
} from "@/lib/woocommerce/store-products-client";

export function CourseFormatSectionDynamic({
  format,
  reversed = false,
}: {
  format: CourseFormat;
  reversed?: boolean;
}) {
  const [courses, setCourses] = useState<StoreProductView[]>([]);
  const isDark = hasSpotPlayerLicense(format.slug);

  useEffect(() => {
    let cancelled = false;
    fetchCourseProductsClient(format.slug).then((data) => {
      if (!cancelled) setCourses(data);
    });
    return () => {
      cancelled = true;
    };
  }, [format.slug]);

  if (courses.length === 0) return null;

  return (
    <section
      id={format.slug}
      className={`scroll-mt-24 py-20 ${isDark ? "bg-navy-950 text-white" : "bg-white"}`}
    >
      <Container>
        <div
          className={`grid items-center gap-12 lg:grid-cols-2 ${
            reversed ? "lg:[direction:ltr]" : ""
          }`}
        >
          <div className={reversed ? "lg:[direction:rtl]" : ""}>
            <div className="relative overflow-hidden rounded-2xl">
              <div className="relative min-h-[220px] md:min-h-[280px]">
                <Image
                  src={format.image}
                  alt={format.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
          <div className={reversed ? "lg:[direction:rtl]" : ""}>
            <h3 className="text-2xl font-bold">{format.title}</h3>
            <p
              className={`mt-4 leading-relaxed ${isDark ? "text-white/75" : "text-slate-600"}`}
            >
              {format.description}
            </p>
            <div className="mt-8 grid gap-4">
              {courses.slice(0, 2).map((course) => (
                <WpCourseCard key={course.id} product={course} isDark={isDark} />
              ))}
            </div>
          </div>
        </div>
        {courses.length > 2 && (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {courses.slice(2).map((course) => (
              <WpCourseCard key={course.id} product={course} isDark={isDark} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
