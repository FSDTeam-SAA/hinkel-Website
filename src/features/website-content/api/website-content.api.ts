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
