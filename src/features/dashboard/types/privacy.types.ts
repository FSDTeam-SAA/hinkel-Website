// src/features/dashboard/types/privacy.types.ts

export interface PrivacyConfig {
  _id?: string;
  title: string;
  content: string;
  status: "published" | "draft";
  key?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  publishedAt?: string;
}

export interface PrivacyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: PrivacyConfig;
}
