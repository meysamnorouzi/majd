import { stats } from "@/data/site";
import { Container } from "@/components/ui/Container";

export function ServiceTrustBar() {
  return (
    <section className="border-y border-slate-100 bg-white py-12">
      <Container>
        <div className="text-center">
          <h2 className="text-lg font-bold text-navy-900 sm:text-xl">
            چرا موسسه حقوقی مجد؟
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600">
            اعتماد صدها موکل، نشان‌دهنده تخصص و تعهد ما در ارائه خدمات حقوقی است
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-slate-100 bg-cream/50 px-4 py-6 text-center"
            >
              <p className="text-2xl font-bold text-gold-600 sm:text-3xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
