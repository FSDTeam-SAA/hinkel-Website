"use client";

import StepIndicator from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { BookStore } from "../types";
import { generateBookPdf } from "../utils/pdf-generator";
import { useState } from "react";
import { useUploadBook } from "@/features/book-creation/hooks/useUploadBook";
import { Eye, Loader2, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function FinalizeBookPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setBookTitle = useBookStore((state: BookStore) => state.setBookTitle);
  const setDedicationText = useBookStore(
    (state: BookStore) => state.setDedicationText,
  );
  const setReturnStep = useBookStore((state: BookStore) => state.setReturnStep);
  const returnStep = useBookStore((state: BookStore) => state.returnStep);
  const state = useBookStore();
  const {
    bookTitle,
    pageCount,
    pageImages,
    pageTexts,
    dedicationText,
    outputFormat,
  } = state;
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle returning to the step user was at before previewing
  const handleReturnToCreation = () => {
    if (returnStep) {
      const stepToReturn = returnStep;
      setReturnStep(null); // Clear the return step
      setStep(stepToReturn);
    } else {
      setStep("images");
    }
  };

  const { uploadBook, isLoading: isUploading } = useUploadBook();

  const handlePreview = async () => {
    try {
      setIsGenerating(true);
      toast.success("Generating preview...");
      const pdfBlob = await generateBookPdf(state);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
      // Note: We don't revoke here because it's opened in a new tab
    } catch (error) {
      console.error("Preview failed:", error);
      toast.error("Failed to generate preview.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = async () => {
    if (!state.orderId) {
      toast.error("Order ID not found. Please complete payment first.");
      return;
    }

    try {
      setIsGenerating(true);
      toast.info("Preparing your book for upload...");

      const pdfBlob = await generateBookPdf(state);

      const response = await uploadBook({
        title: bookTitle || "My Coloring Book",
        image: pdfBlob,
        orderId: state.orderId,
        approvalStatus: "pending",
      });

      if (response.success) {
        setStep("success");
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];
  const currentStep = 4;

  const handleTitleChange = (newTitle: string) => {
    setBookTitle(newTitle);
  };

  const handleDedicationChange = (newText: string) => {
    setDedicationText(newText);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Review Your Book</h1>
          <p className="text-gray-600 mb-8">
            Review all details before finalizing your book
          </p>

          <div className="flex justify-end mb-6">
            <Button
              onClick={handlePreview}
              disabled={isGenerating}
              variant="outline"
              className="group border-primary/20 text-primary hover:bg-primary/5 rounded-xl h-12 px-6 gap-2"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
              )}
              {isGenerating ? "GENERATING..." : "PREVIEW PDF"}
            </Button>
          </div>

          <div className="space-y-8 mb-12">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Book Title
              </label>
              <input
                type="text"
                value={bookTitle}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Dedication Text (Optional)
              </label>
              <textarea
                value={dedicationText}
                onChange={(e) => handleDedicationChange(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500"
                placeholder="Add a dedication message..."
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Page Details</h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {Array.from({ length: Object.keys(pageImages).length }).map(
                  (_, i) => {
                    const pageNum = i + 1;
                    const text = pageTexts[pageNum];
                    if (!text?.topLine && !text?.bottomLine) return null;

                    return (
                      <div
                        key={pageNum}
                        className="pb-3 border-b border-gray-200 last:border-0"
                      >
                        <p className="text-xs font-bold text-gray-500 mb-1">
                          PAGE {pageNum}
                        </p>
                        {text.topLine && (
                          <p className="text-sm">
                            <span className="text-gray-400">Top:</span>{" "}
                            {text.topLine}
                          </p>
                        )}
                        {text.bottomLine && (
                          <p className="text-sm">
                            <span className="text-gray-400">Bottom:</span>{" "}
                            {text.bottomLine}
                          </p>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Book Summary</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Total Pages:</span>{" "}
                  <span className="font-semibold">{pageCount}</span>
                </p>
                <p>
                  <span className="text-gray-600">Format:</span>{" "}
                  <span className="font-semibold capitalize">
                    {outputFormat}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">Pages Uploaded:</span>{" "}
                  <span className="font-semibold">
                    {Object.keys(pageImages).length}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={handleReturnToCreation}
              className="bg-transparent flex items-center gap-2 px-6"
            >
              <ArrowLeft className="w-4 h-4" />
              {returnStep ? "Return to Creation" : "Back"}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={isGenerating || isUploading}
              className="w-48 bg-orange-500 hover:bg-orange-600 transition-all rounded-xl h-14 font-semibold text-lg gap-2"
            >
              {isGenerating || isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>FINALIZE BOOK</span>
                  <CheckCircle className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
