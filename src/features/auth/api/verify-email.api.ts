import { api } from "@/lib/api";
import { ApiResponse, VerificationMeta } from "../types";

export const verifyEmail = async (payload: { email: string; otp: string }) => {
  const response = await api.post<
    ApiResponse<{ email: string; isVerified: boolean }>
  >("/auth/verify-email", payload);

  return response.data;
};

export const resendVerificationEmail = async (payload: { email: string }) => {
  const response = await api.post<ApiResponse<VerificationMeta>>(
    "/auth/resend-verification-email",
    payload,
  );

  return response.data;
};
