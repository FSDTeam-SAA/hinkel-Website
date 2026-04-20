"use client";

import { useState, useEffect } from "react";
import FreeGenerationPage from "@/features/book-creation/components/free-generation-page";
import BookSetupFormatPage from "@/features/book-creation/components/book-setup-format-page";
import CoverPageTestPage from "@/features/book-creation/components/cover-page-test-page";
import DedicationPage from "@/features/book-creation/components/dedication-page";
import ImageUploadPage from "@/features/book-creation/components/image-upload-page";
import FinalizeBookPage from "@/features/book-creation/components/finalize-book-page";
import SuccessPage from "@/features/book-creation/components/success-page";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { BookStore, BookStep } from "../types";

export default function BookCreation() {
  const step = useBookStore((state: BookStore) => state.step);
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Ensure store is hydrated from IndexedDB
    useBookStore.persist.rehydrate();

    // Give a bit of time for the async storage to finish rehydrating
    // and then handle migrations
    const timer = setTimeout(() => {
      // Migrate old step names from previous flow stored in IndexedDB
      const OLD_STEP_MAP: Record<string, string> = {
        landing: "free-generation",
        format: "setup",
        images: "pages",
        finalize: "review",
      };

      const currentStep = useBookStore.getState().step;
      const mapped = OLD_STEP_MAP[currentStep];

      if (mapped) {
        useBookStore.getState().setStep(mapped as BookStep);
      }

      setHydrated(true);
    }, 100); // 100ms is usually enough for idb-keyval

    return () => clearTimeout(timer);
  }, []);

  // Handle successful payment return from Stripe
  useEffect(() => {
    if (hydrated) {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get("success") === "true";
      const sessionId = params.get("session_id");

      if (isSuccess) {
        if (sessionId) {
          useBookStore.getState().setStripeSessionId(sessionId);
        }
        useBookStore.getState().setHasPaid(true);
        // After initial payment, go to Cover step.
        // If adding pages (current step is pages/review), stay where we are.
        const currentStep = useBookStore.getState().step;
        if (currentStep === "setup" || currentStep === "free-generation") {
          setStep("cover");
        }

        // Clear params from URL without refreshing
        window.history.replaceState({}, "", "/create-book");
      }
    }
  }, [hydrated, setStep]);

  if (!hydrated) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background md:pb-10">
      <main className="flex-1">
        {step === "free-generation" && <FreeGenerationPage />}
        {step === "setup" && <BookSetupFormatPage />}
        {step === "cover" && <CoverPageTestPage />}
        {step === "dedication" && <DedicationPage />}
        {step === "pages" && <ImageUploadPage />}
        {step === "review" && <FinalizeBookPage />}
        {step === "success" && <SuccessPage />}
      </main>
    </div>
  );
}
