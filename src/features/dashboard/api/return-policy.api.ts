// src/features/dashboard/api/return-policy.api.ts
import { api } from "@/lib/api";
import {
  ReturnPolicyResponse,
  ReturnPolicySingleResponse,
  ReturnPolicyPayload,
} from "../types/return-policy.types";

export const getReturnPolicyApi = async (): Promise<ReturnPolicyResponse> => {
  try {
    const res = await api.get<ReturnPolicyResponse>(
      "/policy/get-return-policy",
    );
    return res.data;
  } catch (error) {
    console.error("Error fetching Return Policy:", error);
    throw error;
  }
};

export const createReturnPolicyApi = async (
  data: ReturnPolicyPayload,
  token?: string,
): Promise<ReturnPolicySingleResponse> => {
  try {
    const res = await api.post<ReturnPolicySingleResponse>(
      "/policy/create-return-policy",
      data,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error creating Return Policy:", error);
    throw error;
  }
};

export const updateReturnPolicyApi = async (
  id: string,
  data: Partial<ReturnPolicyPayload>,
  token?: string,
): Promise<ReturnPolicySingleResponse> => {
  try {
    const res = await api.patch<ReturnPolicySingleResponse>(
      `/policy/update-return-policy/${id}`,
      data,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error updating Return Policy:", error);
    throw error;
  }
};

export const deleteReturnPolicyApi = async (
  id: string,
  token?: string,
): Promise<ReturnPolicySingleResponse> => {
  try {
    const res = await api.delete<ReturnPolicySingleResponse>(
      `/policy/delete-return-policy/${id}`,
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    );
    return res.data;
  } catch (error) {
    console.error("Error deleting Return Policy:", error);
    throw error;
  }
};
