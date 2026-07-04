import { wpApiUrl } from "@/lib/wordpress/config";

export interface ContactFormPayload {
  name: string;
  phone: string;
  subject: string;
  message: string;
  company?: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  id: number;
}

export class ContactApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code = "unknown", status = 400) {
    super(message);
    this.code = code;
    this.status = status;
    this.name = "ContactApiError";
  }
}

export async function submitContactForm(
  payload: ContactFormPayload,
): Promise<ContactFormResponse> {
  const res = await fetch(wpApiUrl("/wp-json/majd/v1/contact"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const err = data as { message?: string; code?: string };
    throw new ContactApiError(
      err.message ?? "ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید.",
      err.code ?? "unknown",
      res.status,
    );
  }

  return data as ContactFormResponse;
}
