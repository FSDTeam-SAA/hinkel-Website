"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { checkPaymentStatus } from "@/features/book-creation/api/order.api";
import {
  clearPaymentContext,
  loadPaymentContext,
} from "@/features/book-creation/utils/payment-context";
import { resolvePostPaymentStep } from "@/features/book-creation/utils/step-flow";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const {
    setStep,
    setHasPaid,
    pendingPageCount,
    setPageCount,
    setPendingPageCount,
    orderId,
    isHydrated,
    setOrderId,
    outputFormat,
    setOutputFormat,
    pendingCheckoutIntent,
    setPendingCheckoutIntent,
    pendingResumeStep,
    setPendingResumeStep,
  } = useBookStore();
  const { status } = useSession();
  const [countdown, setCountdown] = useState(3);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      const callbackUrl = encodeURIComponent(
        sessionId
          ? `/payment-success?session_id=${sessionId}`
          : "/payment-success",
      );
      router.replace(`/login?callbackUrl=${callbackUrl}`);
    }
  }, [router, sessionId, status]);

  useEffect(() => {
    const verifyPayment = async () => {
      if (status !== "authenticated" || !isHydrated) {
        return;
      }

      const fallbackContext = loadPaymentContext();
      const resolvedOrderId = orderId ?? fallbackContext?.orderId ?? null;
      const resolvedPageCount =
        pendingPageCount ?? fallbackContext?.pageCount ?? null;
      const resolvedOutputFormat =
        outputFormat ?? fallbackContext?.outputFormat ?? null;
      const resolvedCheckoutIntent =
        pendingCheckoutIntent ?? fallbackContext?.checkoutIntent ?? null;
      const resolvedResumeStep =
        pendingResumeStep ?? fallbackContext?.resumeStep ?? null;

      if (!sessionId || !resolvedOrderId) {
        toast.error("Payment verification data is missing.");
        router.replace("/create-book");
        return;
      }

      try {
        setIsVerifying(true);
        const response = await checkPaymentStatus({
          sessionId,
          orderId: resolvedOrderId,
        });

        if (!response.success || response.paymentStatus !== "paid") {
          throw new Error(response.message || "Payment could not be verified.");
        }

        setOrderId(resolvedOrderId);
        setHasPaid(true);
        setIsVerified(true);

        if (resolvedPageCount) {
          setPageCount(resolvedPageCount);
        }

        if (resolvedOutputFormat) {
          setOutputFormat(resolvedOutputFormat);
        }

        setPendingPageCount(null);
        setPendingCheckoutIntent(null);
        setPendingResumeStep(null);
        clearPaymentContext();

        const nextStep = resolvePostPaymentStep(
          useBookStore.getState(),
          resolvedCheckoutIntent,
          resolvedResumeStep,
        );

        setStep(nextStep);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Payment verification failed.";
        toast.error(message);
        router.replace("/create-book");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [
    orderId,
    isHydrated,
    pendingPageCount,
    outputFormat,
    pendingCheckoutIntent,
    pendingResumeStep,
    router,
    sessionId,
    setHasPaid,
    setOrderId,
    setOutputFormat,
    setPageCount,
    setPendingCheckoutIntent,
    setPendingPageCount,
    setPendingResumeStep,
    setStep,
    status,
  ]);

  useEffect(() => {
    if (!isVerified) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isVerified]);

  useEffect(() => {
    if (!isVerified || countdown > 0) {
      return;
    }

    const targetUrl = sessionId
      ? `/create-book?success=true&session_id=${sessionId}`
      : "/create-book";
    router.push(targetUrl);
  }, [countdown, isVerified, router, sessionId]);

  const targetUrl = sessionId
    ? `/create-book?success=true&session_id=${sessionId}`
    : "/create-book";

  if (status === "loading" || !isHydrated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-[32px] shadow-[0px_20px_50px_rgba(0,0,0,0.05)] p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-2 bg-linear-to-r from-green-400 to-emerald-500" />

          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-25" />
              <div className="relative bg-green-500 rounded-full p-4">
                {isVerifying ? (
                  <Loader2 className="w-12 h-12 text-white animate-spin" />
                ) : (
                  <CheckCircle2 className="w-12 h-12 text-white" />
                )}
              </div>
            </div>
          </div>

          <h1 className="text-[32px] font-bold text-gray-900 mb-3 font-inter tracking-tight">
            {isVerifying ? "Verifying Payment..." : "Payment Successful!"}
          </h1>
          <p className="text-gray-500 text-lg mb-8 font-inter">
            {isVerifying
              ? "We're confirming your Stripe session before unlocking book creation."
              : "Your payment has been processed successfully. We&apos;re getting your book ready."}
          </p>

          <div className="bg-gray-50 rounded-2xl p-6 mb-10 border border-gray-100">
            <div className="flex items-center justify-center gap-3 text-gray-600 mb-2">
              <Loader2 className="w-5 h-5 animate-spin text-green-500" />
              <span className="font-medium">
                {isVerifying
                  ? "Confirming your order..."
                  : "Redirecting to your book..."}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {isVerifying ? (
                "This will only take a moment."
              ) : (
                <>
                  Taking you back in{" "}
                  <span className="text-green-600 font-bold font-mono">
                    {countdown}s
                  </span>
                </>
              )}
            </p>
          </div>

          <button
            onClick={() => router.push(targetUrl)}
            disabled={isVerifying}
            className="group w-full bg-[#ff8b36] hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20"
          >
            <span>{isVerifying ? "Please wait..." : "Continue Now"}</span>
            {!isVerifying && (
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            )}
          </button>

          <p className="mt-6 text-xs text-gray-400 uppercase tracking-widest font-bold">
            Hinkle Creek Studio
          </p>
        </div>
      </div>
    </div>
  );
}
