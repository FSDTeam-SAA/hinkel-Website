// src/features/dashboard/types/style.types.ts

export interface StyleConfig {
  _id?: string;
  title: string;
  subtitle: string;
  badgeText: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface StyleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: StyleConfig[];
}

export interface SingleStyleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: StyleConfig;
}
