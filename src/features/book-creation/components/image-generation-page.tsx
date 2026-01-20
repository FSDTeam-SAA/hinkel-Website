"use client";

import { useState, useEffect } from "react";
import StepIndicator from "@/components/step-indicator";
import { CheckCircle2 } from "lucide-react";
import Image from "next/image";

interface ImageGenerationPageProps {
  onSketchGenerated: (sketches: string[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function ImageGenerationPage({
  onSketchGenerated,
  onContinue,
  onBack,
}: ImageGenerationPageProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sketches] = useState<string[]>([
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
  ]);

  useEffect(() => {
    // Simulate image generation
    const timer = setTimeout(() => {
      setIsGenerating(false);
      onSketchGenerated(sketches);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onSketchGenerated, sketches]);

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
            <div className="flex gap-2 mb-8 overflow-auto pb-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <button
                  key={i}
                  className={`min-w-12 h-12 rounded-lg font-semibold flex items-center justify-center border-2 transition-colors flex-shrink-0 ${
                    i === 0
                      ? "border-primary bg-white text-foreground"
                      : "border-border bg-white text-foreground hover:border-primary"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {isGenerating ? (
              <div className="text-center py-12">
                <div className="inline-block">
                  <div className="w-12 h-12 border-4 border-primary border-t-primary/30 rounded-full animate-spin mb-4"></div>
                </div>
                <p className="text-lg font-medium text-foreground">
                  Generating sketches...
                </p>
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  {sketches.map((sketch, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedIndex(index)}
                      className={`relative rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                        index === selectedIndex
                          ? "border-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Image
                        src={sketch || "/placeholder.svg"}
                        alt={`Sketch ${index + 1}`}
                        height={320}
                        width={320}
                        className="w-full h-80 object-cover"
                      />
                      {index === selectedIndex && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground rounded-full p-1.5">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mb-8">
                  <p className="text-sm text-muted-foreground font-medium">
                    Attempts Remaining{" "}
                    <span className="text-primary font-semibold">0</span>
                  </p>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium text-sm">
                    Save
                  </button>
                </div>
              </>
            )}

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
                disabled={isGenerating}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
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
