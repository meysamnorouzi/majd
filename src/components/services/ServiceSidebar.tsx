import { ContactForm } from "@/components/contact/ContactForm";
import { teamMembers } from "@/data/site";
import type { Service } from "@/types";

const lawyerOptions = teamMembers.map((m) => ({
  slug: m.slug,
  name: m.name,
}));

export function ServiceSidebar({ service }: { service: Service }) {
  return (
    <aside
      id="consultation"
      className="relative h-fit scroll-mt-24 overflow-hidden rounded-2xl bg-navy-900 p-6 text-white sm:p-8 lg:sticky lg:top-8"
    >
      <div className="absolute left-0 top-0 h-full w-1 gold-gradient" />

      <div className="mb-6">
        <h3 className="text-lg font-bold text-gold-400">درخواست مشاوره سریع</h3>
        <p className="mt-2 text-sm text-white/70">{service.title}</p>
      </div>

      {/* Temporarily hidden — direct contact block
      <div className="mb-6 space-y-2 rounded-xl bg-white/5 p-4 text-sm">
        <p className="text-white/50">تماس مستقیم</p>
        <a
          href={`tel:${siteConfig.phonesTel[0]}`}
          className="block text-lg font-bold text-gold-400 hover:text-gold-300"
          dir="ltr"
        >
          {siteConfig.phones[0]}
        </a>
        <p className="text-xs text-white/50">{siteConfig.workingHours}</p>
      </div>
      */}

      <ContactForm
        variant="dark"
        title=""
        description=""
        defaultSubject="مشاوره حقوقی"
        defaultMessage={`درخواست مشاوره برای خدمت: ${service.title}`}
        lawyerOptions={lawyerOptions}
        showLawyerPicker
      />
    </aside>
  );
}
