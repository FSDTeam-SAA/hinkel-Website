"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, RefreshCw } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";
import StepIndicator from "@/components/step-indicator";
import Image from "next/image";

export default function CoverPageTestPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setCoverImage = useBookStore((state: BookStore) => state.setCoverImage);
  const setCoverImageVariants = useBookStore(
    (state: BookStore) => state.setCoverImageVariants,
  );
  const setSelectedCoverVariant = useBookStore(
    (state: BookStore) => state.setSelectedCoverVariant,
  );
  const setHasPaid = useBookStore((state: BookStore) => state.setHasPaid);
  const { coverImage, coverImageVariants, selectedCoverVariantIndex } =
    useBookStore();

  const [attemptsRemaining, setAttemptsRemaining] = useState(2);

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];
  const currentStep = 1;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCoverImage(imageData);
        setTimeout(() => {
          setCoverImageVariants([imageData, imageData, imageData]);
        }, 1000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryAgain = () => {
    if (attemptsRemaining > 0) {
      setAttemptsRemaining(attemptsRemaining - 1);
    }
  };

  const handleContinue = () => {
    setHasPaid(true);
    setStep("images");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Preview Your Sketch</h1>
          <p className="text-gray-600 mb-8">
            Upload your cover image and see how it looks as a sketch. If
            you&apos;re happy with the result, proceed to payment.
          </p>

          {!coverImage ? (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center mb-12">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Cover Image</h3>
              <p className="text-gray-600 mb-6">
                Accepted: JPG, PNG (min 1024x1024, max 20MB)
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/jpeg, image/png"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button className="bg-orange-500 hover:bg-orange-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </label>
            </div>
          ) : (
            <div className="space-y-8 mb-12">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold mb-4">Original Image</h3>
                  <div className="bg-gray-100 rounded-lg aspect-square overflow-hidden">
                    <Image
                      height={500}
                      width={500}
                      src={coverImage || "/placeholder.svg"}
                      alt="Original"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {coverImageVariants.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-4">Sketch Variants</h3>
                    <div className="space-y-4">
                      {coverImageVariants.map(
                        (variant: string, index: number) => (
                          <div
                            key={index}
                            onClick={() => setSelectedCoverVariant(index)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedCoverVariantIndex === index
                                ? "border-orange-500 bg-orange-50"
                                : "border-gray-200"
                            }`}
                          >
                            <Image
                              height={500}
                              width={500}
                              src={variant || "/placeholder.svg"}
                              alt={`Variant ${index + 1}`}
                              className="w-full h-32 object-cover rounded"
                            />
                            <p className="text-sm text-gray-600 mt-2 text-center">
                              Variant {index + 1}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-600">
                <p>Attempts Remaining: {attemptsRemaining}</p>
              </div>

              {attemptsRemaining > 0 && (
                <Button
                  onClick={handleTryAgain}
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          )}

          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setStep("format")}
              className="w-32 bg-transparent"
            >
              ← Back
            </Button>
            <Button
              onClick={handleContinue}
              // disabled={!coverImage || selectedCoverVariantIndex === null}
              className="w-60 bg-orange-500 hover:bg-orange-600 disabled:opacity-50"
            >
              Continue to Payment →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
