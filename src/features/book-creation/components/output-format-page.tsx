"use client";

import { useState } from "react";
import StepIndicator from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { Download, Package, Gift } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";

export default function OutputFormatPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setOutputFormat = useBookStore(
    (state: BookStore) => state.setOutputFormat,
  );
  const outputFormat = useBookStore((state: BookStore) => state.outputFormat);

  const [selected, setSelected] = useState(outputFormat || "both");

  const formats = [
    {
      id: "pdf",
      title: "Digital PDF Download",
      description: "Instant download",
      icon: Download,
    },
    {
      id: "printed",
      title: "Printed Book",
      description: "Fulfilled via Amazon KDP",
      icon: Package,
    },
    {
      id: "both",
      title: "Digital PDF & Printed Book",
      description: "Get both versions",
      icon: Gift,
    },
  ];

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];
  const currentStep = 1;

  const handleContinue = () => {
    setOutputFormat(selected as "pdf" | "printed" | "both");
    setStep("cover");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Select Output Format</h1>
          <p className="text-gray-600 mb-8">
            Choose how you&apos;d like to receive your book
          </p>

          <div className="space-y-4 mb-12">
            {formats.map((format) => {
              const Icon = format.icon;
              return (
                <button
                  key={format.id}
                  onClick={() =>
                    setSelected(format.id as "pdf" | "printed" | "both")
                  }
                  className={`w-full p-6 rounded-lg border-2 transition-all text-left ${
                    selected === format.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {format.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {format.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setStep("setup")}
              className="w-32 bg-transparent"
            >
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
