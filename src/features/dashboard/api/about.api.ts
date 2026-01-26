// src/features/dashboard/api/about.api.ts
import { api } from "@/lib/api";
import { AboutConfig, AboutResponse } from "../types/about.types";

export const getAboutApi = async (token?: string): Promise<AboutResponse> => {
  try {
    const res = await api.get<AboutResponse>("/admin/pages/", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching About Us content:", error);
    throw error;
  }
};

export const updateAboutApi = async (
  data: Partial<AboutConfig>,
  token?: string,
): Promise<AboutResponse> => {
  try {
    const res = await api.post<AboutResponse>("/admin/pages/", data, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Error updating About Us content:", error);
    throw error;
  }
};
