// src/features/dashboard/types/terms-conditions.types.ts

export interface TermCondition {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface TermConditionResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TermCondition[];
}

export interface TermConditionSingleResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: TermCondition;
}

export interface TermConditionPayload {
  title: string;
  content: string;
}
