import { api } from "@/lib/api";
import {
  CalculateAdjustmentRequest,
  CalculateAdjustmentResponse,
  PricingResponse,
  calculatePriceResponse,
  calculatePriceRequest,
  ConfirmAdjustmentPaymentRequest,
  ConfirmPaymentRequest,
  ConfirmPaymentResponse,
} from "../types";

export const getPrices = async (): Promise<PricingResponse> => {
  const response = await api.get("/pricing/admin/get-prices");
  return response.data;
};

export const getCalculatePrice = async (
  data: calculatePriceRequest,
): Promise<calculatePriceResponse> => {
  const response = await api.post("/order/calculate-price", data);
  return response.data;
};

export const confirmPayment = async (
  data: ConfirmPaymentRequest,
): Promise<ConfirmPaymentResponse> => {
  const response = await api.post("/order/confirm-payment", data);
  return response.data;
};

export const calculateAdjustment = async (
  data: CalculateAdjustmentRequest,
): Promise<CalculateAdjustmentResponse> => {
  const response = await api.post("/order/calculate-adjustment", data);
  return response.data;
};

export const confirmAdjustmentPayment = async (
  data: ConfirmAdjustmentPaymentRequest,
): Promise<ConfirmPaymentResponse> => {
  const response = await api.post("/order/confirm-adjustment-payment", data);
  return response.data;
};
