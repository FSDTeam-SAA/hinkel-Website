/**
 * Generate Preview API Types
 */

export interface GeneratePreviewRequest {
  image: string; // Base64 encoded image
}

export interface GeneratePreviewResponse {
  status: boolean;
  message: string;
  data: {
    previewImage: string; // Base64 or URL of generated preview
  };
}
