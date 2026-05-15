/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useQuery } from "@tanstack/react-query";
import {
  calculateAdjustment,
  getCalculatePrice,
  getPrices,
} from "../api/pricing.api";
import { CalculateAdjustmentRequest, calculatePriceRequest } from "../types";

export function usePricing() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["prices"],
    queryFn: getPrices,
  });

  return {
    prices: data?.data ?? [],
    loading: isLoading,
    error: isError
      ? (error as any)?.message || "An error occurred while fetching prices"
      : null,
  };
}

export function useCalculatePrice(data: calculatePriceRequest) {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["calculate-price", data],
    queryFn: () => getCalculatePrice(data),
    enabled: !!data.pageCount && !!data.deliveryType,
  });

  return {
    response,
    isLoading,
    isError,
    error: isError
      ? (error as any)?.message || "An error occurred while calculating price"
      : null,
  };
}

export function useCalculateAdjustment(
  data: CalculateAdjustmentRequest | null,
) {
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["calculate-adjustment", data],
    queryFn: () => calculateAdjustment(data as CalculateAdjustmentRequest),
    enabled:
      !!data?.orderId &&
      !!data?.targetDeliveryType &&
      Number.isFinite(data?.targetPageCount),
  });

  return {
    response,
    isLoading,
    isError,
    error: isError
      ? (error as any)?.message ||
        "An error occurred while calculating the adjustment"
      : null,
  };
}
