// src/features/dashboard/api/style.api.ts
import { api } from "@/lib/api";
import {
  StyleConfig,
  StyleResponse,
  SingleStyleResponse,
} from "../types/style.types";

export const getStylesApi = async (): Promise<StyleResponse> => {
  const res = await api.get("/style/");
  return res.data;
};

export const createStyleApi = async (
  data: Partial<StyleConfig>,
): Promise<SingleStyleResponse> => {
  const res = await api.post("/style/", data);
  return res.data;
};

export const updateStyleApi = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<StyleConfig>;
}): Promise<SingleStyleResponse> => {
  const res = await api.patch(`/style/${id}`, data);
  return res.data;
};
