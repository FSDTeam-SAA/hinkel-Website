"use client";

import { useState } from "react";
import StepIndicator from "@/components/step-indicator";

interface PageCreatePageProps {
  pageCount: number;
  onContinue: () => void;
  onBack: () => void;
}

export default function PageCreatePage({
  pageCount,
  onContinue,
  onBack,
}: PageCreatePageProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];

  return (
    <div className="min-h-screen bg-background">
      <StepIndicator steps={steps} currentStep={3} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-border">
            {/* Page Numbers */}
            <div className="flex gap-2 mb-8 overflow-auto pb-2">
              {Array.from({ length: pageCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`min-w-12 h-12 rounded-lg font-semibold flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                    currentPage === i + 1
                      ? "border-primary bg-white text-foreground"
                      : "border-border bg-white text-foreground hover:border-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Page Editor */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-foreground mb-4">
                  Enter Your Text
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Text"
                  className="px-4 py-2 rounded-lg border border-border bg-white mb-4"
                />

                <div className="flex-1 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center p-8 bg-muted/30">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📷</div>
                    <p className="font-medium text-foreground mb-1">
                      Upload an image
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      or drag and drop
                      <br />
                      PNG, JPG up to 10MB
                    </p>
                    <button className="text-sm text-primary font-medium hover:underline">
                      Browse files
                    </button>
                  </div>
                </div>

                <label className="text-sm font-semibold text-foreground mt-4 mb-2">
                  Enter Your Text
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Text"
                  className="px-4 py-2 rounded-lg border border-border bg-white"
                />
              </div>

              <div className="flex flex-col">
                <p className="text-sm font-semibold text-foreground mb-4">
                  Preview
                </p>
                <div className="flex-1 rounded-xl border-2 border-primary bg-white flex items-center justify-center min-h-96">
                  <p className="text-muted-foreground text-lg">Preview</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
              >
                ← Back
              </button>
              <button
                onClick={onContinue}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
