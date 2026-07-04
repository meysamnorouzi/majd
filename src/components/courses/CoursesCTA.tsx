import { siteConfig } from "@/data/site";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";

interface CoursesCTAProps {
  defaultSubject?: string;
  defaultMessage?: string;
}

export function CoursesCTA({
  defaultSubject = "دوره آموزشی",
  defaultMessage = "",
}: CoursesCTAProps = {}) {
  return (
    <section
      id="consultation"
      className="relative scroll-mt-24 overflow-hidden bg-navy-950 py-20"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(212,175,55,0.15),_transparent_50%)]" />
      <Container className="relative">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-right">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              آماده شروع یادگیری هستید؟
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/75 lg:mx-0">
              با واحد آموزش موسسه حقوقی مجد تماس بگیرید یا فرم زیر را تکمیل کنید
              تا در انتخاب بهترین دوره راهنمایی شوید.
            </p>
            <a
              href={`tel:${siteConfig.phonesTel[0]}`}
              className="mt-6 inline-block text-lg font-bold text-gold-400 hover:text-gold-300"
              dir="ltr"
            >
              {siteConfig.phones[0]}
            </a>
          </div>
          <ContactForm
            variant="dark"
            title="مشاوره انتخاب دوره"
            description="سوالات خود را بنویسید؛ همکاران ما راهنمایی‌تان می‌کنند."
            defaultSubject={defaultSubject}
            defaultMessage={defaultMessage}
          />
        </div>
      </Container>
    </section>
  );
}
