export const CONTACT = {
  email: "contact@rightbricks.online",
  emailHref: "mailto:contact@rightbricks.online",
  phoneDisplay: "(+855) 011 389 625",
  phoneHref: "tel:+85511389625",
  whatsappHref: "https://wa.me/85511389625",
  telegramHref: "https://t.me/",
  availabilityLine: "Available on WhatsApp and Telegram for faster responses.",
  standardLine:
    "Contact us at contact@rightbricks.online or call (+855) 011 389 625. We are also available on WhatsApp and Telegram.",
  responseTime: "Typically within a few hours during business days."
} as const;

export type PreferredContactMethod = "EMAIL" | "PHONE" | "WHATSAPP" | "TELEGRAM";
