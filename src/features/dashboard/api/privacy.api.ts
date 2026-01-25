// src/features/dashboard/api/privacy.api.ts
import { api } from "@/lib/api";
import { PrivacyConfig, PrivacyResponse } from "../types/privacy.types";

export const getPrivacyApi = async (
  token?: string,
): Promise<PrivacyResponse> => {
  try {
    const res = await api.get<PrivacyResponse>("/admin/privacy", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching Privacy Policy:", error);
    throw error;
  }
};

export const updatePrivacyApi = async (
  data: Partial<PrivacyConfig>,
  token?: string,
): Promise<PrivacyResponse> => {
  try {
    const res = await api.put<PrivacyResponse>("/admin/privacy", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error updating Privacy Policy:", error);
    throw error;
  }
};
