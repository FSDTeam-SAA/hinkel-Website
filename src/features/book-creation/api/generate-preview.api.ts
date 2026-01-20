/**
 * Generate Preview API
 * Converts images to sketch previews using AI
 */
import { api } from "@/lib/api";
import { GeneratePreviewRequest, GeneratePreviewResponse } from "../types";

export const generatePreview = async (
  data: GeneratePreviewRequest,
): Promise<GeneratePreviewResponse> => {
  const response = await api.post("/ai/generate-preview", data);
  return response.data;
};
