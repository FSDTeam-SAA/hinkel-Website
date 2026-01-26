// src/features/dashboard/types/about.types.ts

export interface AboutConfig {
  _id?: string;
  title: string;
  content: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface AboutResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: AboutConfig;
}
