"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmPayment } from "../api/pricing.api";
import { ConfirmPaymentRequest, ConfirmPaymentResponse } from "../types";

export function useConfirmPayment() {
  const mutation = useMutation<
    ConfirmPaymentResponse,
    Error,
    ConfirmPaymentRequest
  >({
    mutationFn: (data: ConfirmPaymentRequest) => confirmPayment(data),
  });

  return {
    confirmPayment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
