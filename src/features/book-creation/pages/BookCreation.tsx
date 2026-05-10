"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
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
  const hydrated = useBookStore((state: BookStore) => state.isHydrated);
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    useBookStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const OLD_STEP_MAP: Record<string, BookStep> = {
      landing: "free-generation",
      format: "setup",
      images: "pages",
      finalize: "review",
    };

    const store = useBookStore.getState();
    const mapped = OLD_STEP_MAP[store.step];

    if (mapped) {
      store.setStep(mapped);
      return;
    }

    store.normalizeStep();
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated || status !== "unauthenticated") {
      return;
    }

    useBookStore.getState().resetBook();

    const query = searchParams.toString();
    const callbackUrl = encodeURIComponent(
      query ? `${pathname}?${query}` : pathname,
    );

    router.replace(`/login?callbackUrl=${callbackUrl}`);
  }, [hydrated, pathname, router, searchParams, status]);

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

        window.history.replaceState({}, "", "/create-book");
      }
    }
  }, [hydrated]);

  if (!hydrated || status === "loading" || status === "unauthenticated") {
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
