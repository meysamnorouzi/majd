import Link from "next/link";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig, services, stats } from "@/data/site";
import type { LawyerOption } from "@/components/contact/ContactForm";

export function BlogSidebar({ lawyerOptions }: { lawyerOptions?: LawyerOption[] }) {
  return (
    <aside className="space-y-6 lg:sticky lg:top-8">
      <div className="relative overflow-hidden rounded-2xl bg-navy-900 p-6 text-white shadow-xl">
        <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />
        <h3 className="text-lg font-bold text-gold-400">مشاوره حقوقی رایگان</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/75">
          سوال حقوقی دارید؟ وکلای متخصص موسسه مجد آماده پاسخگویی هستند.
        </p>
        <a
          href={`tel:${siteConfig.phonesTel[0]}`}
          className="mt-4 inline-block text-lg font-bold text-gold-400 hover:text-gold-300"
          dir="ltr"
        >
          {siteConfig.phones[0]}
        </a>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gold-400/20 bg-white shadow-lg">
        <ContactForm
          variant="compact"
          title="درخواست مشاوره"
          description="فرم را تکمیل کنید؛ در اسرع وقت با شما تماس می‌گیریم."
          defaultSubject="مشاوره حقوقی"
          lawyerOptions={lawyerOptions}
          showLawyerPicker={!!lawyerOptions?.length}
        />
      </div>

      <div className="rounded-2xl bg-gradient-to-br from-navy-900 to-navy-800 p-6 text-white">
        <h3 className="font-bold text-gold-400">چرا موسسه مجد؟</h3>
        <ul className="mt-4 space-y-3">
          {stats.map((stat) => (
            <li key={stat.label} className="flex items-center gap-3">
              <span className="text-xl font-bold text-gold-400">{stat.value}</span>
              <span className="text-sm text-white/80">{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="font-bold text-navy-900">خدمات حقوقی</h3>
        <ul className="mt-4 space-y-2">
          {services.slice(0, 5).map((service) => (
            <li key={service.slug}>
              <Link
                href={`/services/${service.slug}/`}
                className="flex items-center gap-2 text-sm text-slate-600 transition hover:text-gold-600"
              >
                <span className="text-gold-500">←</span>
                {service.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/services/"
          className="mt-4 inline-block text-sm font-semibold text-navy-900 hover:text-gold-600"
        >
          همه خدمات →
        </Link>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl p-6 text-white"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(12,31,61,0.95) 0%, rgba(19,45,82,0.9) 100%), url(https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&q=80)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h3 className="text-lg font-bold">دوره‌های آموزشی حقوقی</h3>
        <p className="mt-2 text-sm text-white/80">
          با دوره‌های تخصصی موسسه مجد، دانش حقوقی خود را ارتقا دهید.
        </p>
        <Link
          href="/courses/"
          className="mt-4 inline-flex rounded-lg bg-gold-500 px-5 py-2.5 text-sm font-semibold text-navy-950 transition hover:bg-gold-400"
        >
          مشاهده دوره‌ها
        </Link>
      </div>
    </aside>
  );
}
