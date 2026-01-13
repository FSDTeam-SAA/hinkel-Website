"use client";

import LandingPage from "@/features/book-creation/components/landing-page";
import BookSetupPage from "@/features/book-creation/components/book-setup-page";
import OutputFormatPage from "@/features/book-creation/components/output-format-page";
import CoverPageTestPage from "@/features/book-creation/components/cover-page-test-page";
import ImageUploadPage from "@/features/book-creation/components/image-upload-page";
import FinalizeBookPage from "@/features/book-creation/components/finalize-book-page";
import SuccessPage from "@/features/book-creation/components/success-page";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { BookState } from "../book";

export default function BookCreation() {
  const step = useBookStore((state: BookState) => state.step);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        {step === "landing" && <LandingPage />}
        {step === "setup" && <BookSetupPage />}
        {step === "format" && <OutputFormatPage />}
        {step === "cover" && <CoverPageTestPage />}
        {step === "images" && <ImageUploadPage />}
        {step === "finalize" && <FinalizeBookPage />}
        {step === "success" && <SuccessPage />}
      </main>
    </div>
  );
}
