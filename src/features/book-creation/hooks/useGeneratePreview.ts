"use client";
import { useState } from "react";
import { generatePreview as generatePreviewApi } from "../api/generate-preview.api";

/**
 * Hook for generating sketch previews from images
 * Manages loading state, errors, and the generated preview
 */
export function useGeneratePreview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const generatePreview = async (imageBase64: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await generatePreviewApi({ image: imageBase64 });
      setPreviewImage(response.previewUrl);
      return response.previewUrl;
    } catch (err) {
      const error = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate preview",
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setPreviewImage(null);
    setError(null);
  };

  return { generatePreview, loading, error, previewImage, reset };
}
