// src/features/dashboard/types/return-policy.types.ts

export interface ReturnPolicy {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface ReturnPolicyResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ReturnPolicy[];
}

export interface ReturnPolicySingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: ReturnPolicy;
}

export interface ReturnPolicyPayload {
  title: string;
  content: string;
}
