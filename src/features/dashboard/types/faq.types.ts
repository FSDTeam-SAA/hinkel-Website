// src/features/dashboard/types/faq.types.ts

export interface FaqAnswer {
  raw: string;
  format: "html" | "text";
}

export interface FaqItem {
  _id?: string;
  question: string;
  answer: FaqAnswer;
  order: number;
  isActive: boolean;
  defaultOpen: boolean;
}

export interface CtaAvatar {
  url: string;
  alt: string;
}

export interface CtaButton {
  label: string;
  href: string;
  target: string;
}

export interface CtaConfig {
  enabled: boolean;
  heading: string;
  text: string;
  button: CtaButton;
  avatars: CtaAvatar[];
}

export interface FaqConfig {
  title: string;
  subtitle: string;
  status: "published";
  cta: CtaConfig;
  items: FaqItem[];
}

export interface FaqResponse {
  success: boolean;
  message: string;
  data: FaqConfig;
}
