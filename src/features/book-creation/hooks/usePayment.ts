"use client";

import { useMutation } from "@tanstack/react-query";
import { confirmAdjustmentPayment, confirmPayment } from "../api/pricing.api";
import {
  ConfirmAdjustmentPaymentRequest,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
} from "../types";

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

export function useConfirmAdjustmentPayment() {
  const mutation = useMutation<
    ConfirmPaymentResponse,
    Error,
    ConfirmAdjustmentPaymentRequest
  >({
    mutationFn: (data: ConfirmAdjustmentPaymentRequest) =>
      confirmAdjustmentPayment(data),
  });

  return {
    confirmAdjustmentPayment: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}
