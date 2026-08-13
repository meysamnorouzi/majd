"use client";

import { ContactForm } from "@/components/contact/ContactForm";
import { useLawyerOptions } from "@/hooks/useTeamMembers";

export interface ContentContactBoxProps {
  title?: string;
  description?: string;
  defaultSubject?: string;
  defaultMessage?: string;
  showLawyerPicker?: boolean;
}

/** Styled contact form box for inline use in blog/service content. */
export function ContentContactBox({
  title = "نیاز به مشاوره تخصصی دارید؟",
  description = "وکلای موسسه مجد آماده پاسخگویی به سوالات حقوقی شما هستند.",
  defaultSubject = "مشاوره حقوقی",
  defaultMessage = "",
  showLawyerPicker = true,
}: ContentContactBoxProps) {
  const lawyerOptions = useLawyerOptions();

  return (
    <div className="not-prose my-10 rounded-2xl border border-gold-400/30 bg-navy-900 p-6 sm:p-8">
      <ContactForm
        variant="dark"
        title={title}
        description={description}
        defaultSubject={defaultSubject}
        defaultMessage={defaultMessage}
        lawyerOptions={lawyerOptions}
        showLawyerPicker={showLawyerPicker}
      />
    </div>
  );
}
