"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LoginVerificationRequiredData } from "../types";

type LoginActionResult =
  | { success: true }
  | {
      success: false;
      message: string;
      verification?: LoginVerificationRequiredData;
    };

const parseAuthError = (error: string) => {
  try {
    return JSON.parse(error) as {
      status?: number;
      message?: string;
      data?: LoginVerificationRequiredData | null;
    };
  } catch {
    return null;
  }
};

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const parsed = parseAuthError(result.error);
        const message = parsed?.message || result.error;

        setError(message);

        if (parsed?.data?.verificationRequired) {
          return {
            success: false,
            message,
            verification: parsed.data,
          } satisfies LoginActionResult;
        }

        return {
          success: false,
          message,
        } satisfies LoginActionResult;
      }

      return { success: true } satisfies LoginActionResult;
    } catch {
      setError("Something went wrong");
      return {
        success: false,
        message: "Something went wrong",
      } satisfies LoginActionResult;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleLogin };
}
