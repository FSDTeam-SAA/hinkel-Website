"use client";

import StepIndicator from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";

export default function FinalizeBookPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setBookTitle = useBookStore((state: BookStore) => state.setBookTitle);
  const setDedicationText = useBookStore(
    (state: BookStore) => state.setDedicationText,
  );
  const { bookTitle, pageCount, pageImages, dedicationText, outputFormat } =
    useBookStore();

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
              onClick={() => setStep("images")}
              className="w-32 bg-transparent"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setStep("success")}
              className="w-32 bg-orange-500 hover:bg-orange-600"
            >
              Complete →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
