"use client";

import type { BookStep, CheckoutIntent, OutputFormat } from "../types";

const PAYMENT_CONTEXT_KEY = "hinklecreek-payment-context";

export interface PaymentContext {
  orderId: string;
  pageCount: number;
  outputFormat: OutputFormat | null;
  checkoutIntent: CheckoutIntent;
  resumeStep: BookStep | null;
}

export function savePaymentContext(context: PaymentContext) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(PAYMENT_CONTEXT_KEY, JSON.stringify(context));
}

export function loadPaymentContext(): PaymentContext | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(PAYMENT_CONTEXT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PaymentContext;
  } catch {
    window.localStorage.removeItem(PAYMENT_CONTEXT_KEY);
    return null;
  }
}

export function clearPaymentContext() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(PAYMENT_CONTEXT_KEY);
}
