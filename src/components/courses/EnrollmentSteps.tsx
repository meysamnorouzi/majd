import { enrollmentSteps } from "@/data/courses";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

export function EnrollmentSteps() {
  return (
    <section className="bg-navy-900 py-20 text-white">
      <Container>
        <SectionTitle
          eyebrow="ثبت‌نام"
          title="چهار گام تا شروع دوره"
          description="فرایند ساده ثبت‌نام در تمامی دوره‌های موسسه حقوقی مجد"
          light
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {enrollmentSteps.map((item, index) => (
            <div
              key={item.step}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
            >
              {index < enrollmentSteps.length - 1 && (
                <span
                  className="absolute -left-3 top-1/2 hidden h-0.5 w-6 bg-gold-500/40 lg:block"
                  aria-hidden
                />
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-xl gold-gradient text-lg font-black text-navy-950">
                {item.step}
              </span>
              <h3 className="mt-4 font-bold text-gold-400">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
