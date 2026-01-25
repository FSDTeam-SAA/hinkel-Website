// src/features/dashboard/api/faq.api.ts
import { api } from "@/lib/api";
import { FaqConfig, FaqResponse } from "../types/faq.types";

export const getFaqApi = async (token?: string): Promise<FaqResponse> => {
  try {
    const res = await api.get<FaqResponse>("/admin/faqs/pricing", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    throw error;
  }
};

export const updateFaqApi = async (
  data: FaqConfig,
  token?: string,
): Promise<FaqResponse> => {
  try {
    const res = await api.put<FaqResponse>("/admin/faqs/pricing", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error updating FAQs:", error);
    throw error;
  }
};
