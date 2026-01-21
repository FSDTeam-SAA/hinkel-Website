"use client";
import { useMutation } from "@tanstack/react-query";
import { generatePreview as generatePreviewApi } from "../api/generate-preview.api";

/**
 * Hook for generating sketch previews from images
 * Uses TanStack Query for efficient state management
 */
export function useGeneratePreview() {
  const mutation = useMutation({
    mutationFn: async ({ image, type }: { image: string; type?: string }) => {
      const response = await generatePreviewApi({
        image,
        type: type || "",
      });

      console.log("Generate Preview Response:", response);

      // Handle potentially different response structures (flat or nested)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const responseData = response as any;
      const url =
        responseData.previewUrl ||
        responseData.data?.previewUrl ||
        responseData.url;

      if (!url) {
        throw new Error("Received empty preview URL from server");
      }

      return url;
    },
  });

  const generatePreview = async (image: string, type?: string) => {
    try {
      return await mutation.mutateAsync({ image, type });
    } catch (error) {
      console.error("Generate preview error:", error);
      return null;
    }
  };

  const reset = () => {
    mutation.reset();
  };

  return {
    generatePreview,
    loading: mutation.isPending,
    error: mutation.error
      ? mutation.error.message || "Failed to generate preview"
      : null,
    previewImage: mutation.data || null,
    reset,
  };
}
