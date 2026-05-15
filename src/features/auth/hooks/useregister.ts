"use client";
import { useState } from "react";
import { registeruser } from "../api/register.api";

const getErrorMessage = (error: unknown) => {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    typeof error.response.data === "object" &&
    error.response.data !== null &&
    "message" in error.response.data &&
    typeof error.response.data.message === "string"
  ) {
    return error.response.data.message;
  }

  return null;
};

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (
    name: string,
    email: string,
    password: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const result = await registeruser({ name, email, password });

      return result;
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "An unexpected error occurred");
      return undefined;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, handleRegister };
}
