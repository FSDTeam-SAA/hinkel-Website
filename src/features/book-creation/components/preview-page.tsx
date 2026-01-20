"use client";

import StepIndicator from "@/components/step-indicator";
import { Eye } from "lucide-react";
import Image from "next/image";

interface PreviewPageProps {
  originalImage: string;
  onContinue: () => void;
  onTryAgain: () => void;
}

export default function PreviewPage({
  originalImage,
  onContinue,
  onTryAgain,
}: PreviewPageProps) {
  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];

  return (
    <div className="min-h-screen bg-background">
      <StepIndicator steps={steps} currentStep={1} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-border">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Preview Your Sketch
              </h1>
              <p className="text-muted-foreground">
                Here&apos;s how your image looks as a sketch. If you&apos;re
                happy with the result, proceed to create your book!
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Original */}
              <div>
                <h3 className="text-center font-semibold text-foreground mb-4">
                  Original Image
                </h3>
                <div className="rounded-xl bg-muted h-80 flex items-center justify-center border border-border">
                  {originalImage && (
                    <Image
                      width={500}
                      height={500}
                      src={originalImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>

              {/* Sketch */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground">
                    Sketch Version
                  </h3>
                  <button className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-medium hover:bg-primary/90">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                </div>
                <div className="rounded-xl border-2 border-primary h-80 flex items-center justify-center bg-white">
                  <p className="text-muted-foreground text-lg">
                    Sketch Preview
                  </p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onTryAgain}
                className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
              >
                Try Different Image
              </button>
              <button
                onClick={onContinue}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Continue to Book Creation →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
