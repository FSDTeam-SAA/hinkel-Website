"use client";

import { useState } from "react";
import {
  resendVerificationEmail as resendVerificationEmailApi,
  verifyEmail as verifyEmailApi,
} from "../api/verify-email.api";
import { VerificationMeta } from "../types";

export function useEmailVerification() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const verifyEmail = async (email: string, otp: string) => {
    setIsVerifying(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await verifyEmailApi({ email, otp });
      setSuccessMessage(response.message);
      return response;
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setError(
        err.response?.data?.message || err.message || "Unable to verify email",
      );
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const resendVerificationEmail = async (
    email: string,
  ): Promise<VerificationMeta | null> => {
    setIsResending(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await resendVerificationEmailApi({ email });
      setSuccessMessage(response.message);
      return response.data;
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };

      setError(
        err.response?.data?.message ||
          err.message ||
          "Unable to resend verification email",
      );
      return null;
    } finally {
      setIsResending(false);
    }
  };

  return {
    verifyEmail,
    resendVerificationEmail,
    isVerifying,
    isResending,
    error,
    successMessage,
  };
}
