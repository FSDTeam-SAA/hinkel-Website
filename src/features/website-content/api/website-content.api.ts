import { api } from "@/lib/api";
import { AboutResponse } from "@/features/dashboard/types/about.types";
import { PrivacyResponse } from "@/features/dashboard/types/privacy.types";

export const getPublicAboutApi = async (): Promise<AboutResponse> => {
  try {
    // Assuming the same endpoint works without a token for public access
    // If it requires a different endpoint, it would be updated here
    const res = await api.get<AboutResponse>("/admin/pages/");
    return res.data;
  } catch (error) {
    console.error("Error fetching public About Us content:", error);
    throw error;
  }
};

export const getPublicPrivacyApi = async (): Promise<PrivacyResponse> => {
  try {
    const res = await api.get("/admin/privacy");
    return res.data;
  } catch (error) {
    console.error("Error fetching public Privacy Policy content:", error);
    throw error;
  }
};

export interface PublicFaqItem {
  _id: string;
  question: string;
  answer: {
    sanitized: string;
    format: "html" | "text";
  };
  order: number;
  isActive: boolean;
  defaultOpen: boolean;
}

export interface PublicFaqCta {
  enabled: boolean;
  heading: string;
  text: string;
  button: {
    label: string;
    href: string;
    target: string;
  };
  avatars: Array<{
    url: string;
    alt: string;
  }>;
}

export interface PublicFaqData {
  _id: string;
  key: string;
  title: string;
  subtitle: string;
  status: string;
  cta: PublicFaqCta;
  items: PublicFaqItem[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface PublicFaqResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PublicFaqData;
}

export const getPublicFaqApi = async (): Promise<PublicFaqResponse> => {
  try {
    const res = await api.get<PublicFaqResponse>("/faqs/pricing");
    return res.data;
  } catch (error) {
    console.error("Error fetching public FAQ content:", error);
    throw error;
  }
};
