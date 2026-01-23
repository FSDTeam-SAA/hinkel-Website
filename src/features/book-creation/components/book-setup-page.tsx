"use client";

import { useState } from "react";
import { toast } from "sonner";
import StepIndicator from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { useBookStore } from "@/features/book-creation/store/book-store";
import OutputFormatPage from "./output-format-page";
import { BookStore } from "../types";

export default function BookSetupPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setPageCount = useBookStore((state: BookStore) => state.setPageCount);
  const setIncludeDedicationPage = useBookStore(
    (state: BookStore) => state.setIncludeDedicationPage,
  );
  const setBookTitle = useBookStore((state: BookStore) => state.setBookTitle);
  const { pageCount, includeDedicationPage } = useBookStore();

  const [selectedPages, setSelectedPages] = useState(pageCount);
  const [withDedication, setWithDedication] = useState(includeDedicationPage);
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const pageOptions = [10, 20, 30, 40];
  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];
  const currentStep = 0;

  const handleContinue = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Book title is required";
      toast.error(newErrors.title);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBookTitle(title);
    setPageCount(selectedPages);
    setIncludeDedicationPage(withDedication);
    setStep("format");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-8">Book Title</h1>

          <div className="mb-12">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({});
              }}
              placeholder="My Amazing Coloring Book"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors ${errors.title
                  ? "border-red-500 focus:border-red-500"
                  : "border-gray-300 focus:border-orange-500"
                }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          <h2 className="text-2xl font-bold mb-6">Choose Your Package</h2>

          <div className="mb-10">
            <h3 className="text-lg font-semibold mb-4">Number of Pages</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pageOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedPages(option)}
                  className={`py-6 rounded-lg font-semibold transition-all ${selectedPages === option
                      ? "border-2 border-orange-500 bg-orange-50"
                      : "border-2 border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div className="text-2xl">{option}</div>
                  <div className="text-sm text-gray-600">Page</div>
                </button>
              ))}
            </div>
          </div>

          <OutputFormatPage />

          <div className="mb-12">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={withDedication}
                onChange={(e) => setWithDedication(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-gray-700">
                Include Dedication Page (counts toward total)
              </span>
            </label>
          </div>

          <div className="flex gap-4 justify-between">
            <Button variant="outline" className="w-32 bg-transparent">
              ← Back
            </Button>
            <Button
              onClick={handleContinue}
              className="w-32 bg-orange-500 hover:bg-orange-600"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
