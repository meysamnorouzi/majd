import { Container } from "@/components/ui/Container";
import {
  ContactForm,
  type ContactFormProps,
} from "@/components/contact/ContactForm";

export function ConsultationSection({
  id = "consultation",
  title = "درخواست مشاوره",
  description = "فرم زیر را تکمیل کنید؛ کارشناسان موسسه در اسرع وقت با شما تماس می‌گیرند.",
  defaultSubject,
  defaultMessage,
  variant = "default",
  className,
}: ContactFormProps) {
  return (
    <section id={id} className={`scroll-mt-24 bg-cream py-16 ${className ?? ""}`}>
      <Container>
        <div className="mx-auto max-w-xl">
          <ContactForm
            title={title}
            description={description}
            defaultSubject={defaultSubject}
            defaultMessage={defaultMessage}
            variant={variant}
          />
        </div>
      </Container>
    </section>
  );
}
