"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ArrowUpFromLine,
  Loader2,
} from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { useGeneratePreview } from "@/features/book-creation/hooks/useGeneratePreview";
import { useSession } from "next-auth/react";
import StepIndicator from "@/components/step-indicator";
import ImagePreviewModal from "./image-preview-modal";
import Image from "next/image";
import { BookStore } from "../types";
import { toast } from "sonner";
import { useContent } from "@/features/category-page/hooks/use-content";
import { getCategoryPromptForType } from "../utils/prompt";

const STEPS = ["Setup & Pay", "Cover", "Dedication", "Pages", "Review"];

export default function CoverPageTestPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setCoverImage = useBookStore((state: BookStore) => state.setCoverImage);
  const setCoverImageVariants = useBookStore(
    (state: BookStore) => state.setCoverImageVariants,
  );
  const setSelectedCoverVariant = useBookStore(
    (state: BookStore) => state.setSelectedCoverVariant,
  );
  const incrementCoverGeneration = useBookStore(
    (state: BookStore) => state.incrementCoverGeneration,
  );
  const canGenerateCover = useBookStore(
    (state: BookStore) => state.canGenerateCover,
  );
  const { coverImageVariants, selectedCoverVariantIndex, bookType, hasPaid } =
    useBookStore();

  const { data: session } = useSession();
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";
  const { data: contentData } = useContent({ limit: 12 });
  const categories = contentData?.data || [];
  const selectedStylePrompt = getCategoryPromptForType(categories, bookType);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const { generatePreview, loading, error, reset } = useGeneratePreview();

  const selectedVariant =
    selectedCoverVariantIndex !== null
      ? coverImageVariants[selectedCoverVariantIndex]
      : (coverImageVariants[0] ?? null);

  const canGenerate = isAdmin || canGenerateCover();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setPendingImage(imageData);
        setIsModalOpen(true);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setPendingImage(null);
    reset();
  };

  const handleConfirmGeneration = async () => {
    if (!pendingImage) return;

    if (!isAdmin && !canGenerateCover()) {
      toast.error("Generation limit reached.");
      setIsModalOpen(false);
      return;
    }

    const previewResult = await generatePreview(
      pendingImage,
      bookType,
      selectedStylePrompt,
    );
    if (previewResult) {
      incrementCoverGeneration();
      const updatedVariants = [...coverImageVariants, previewResult];
      setCoverImage(pendingImage);
      setCoverImageVariants(updatedVariants);
      setSelectedCoverVariant(updatedVariants.length - 1);
      toast.success("New cover sketch generated!");
      setIsModalOpen(false);
      setPendingImage(null);
    }
  };

  const handleStepClick = (index: number) => {
    switch (index) {
      case 0:
        setStep("setup");
        break;
      case 1:
        break; // Already here
      case 2:
        setStep("dedication");
        break;
      case 3:
        setStep("pages");
        break;
      case 4:
        setStep("review");
        break;
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#fbf4ea]">
        <StepIndicator
          steps={STEPS}
          currentStep={1}
          onStepClick={handleStepClick}
        />

        <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 md:py-9 lg:px-[15%] xl:px-[20%]">
          <div className="flex flex-col gap-9 w-full max-w-6xl">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setStep("setup")}
                className="flex items-center gap-2 text-[#4a5565] text-lg hover:opacity-80 transition-opacity"
              >
                <ArrowLeft />
                <span>Back</span>
              </button>
              <h1 className="font-semibold text-[28px] md:text-[34px] text-[#0a0a0a]">
                Choose Your Cover
              </h1>
              <div className="hidden md:block w-[90px]" />
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-9 flex flex-col gap-7">
              {/* Description */}
              <p className="text-center text-[#4a5565] text-base">
                Select the sketch you&apos;d like as your cover. You can also
                generate a new one below.
              </p>

              {/* Selected cover preview */}
              {selectedVariant && (
                <div className="flex flex-col items-center gap-3">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Selected Cover
                  </p>
                  <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden border-4 border-primary shadow-lg shadow-primary/20">
                    <Image
                      src={selectedVariant}
                      alt="Selected cover"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Variants gallery */}
              {coverImageVariants.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 text-center">
                    All Generated Sketches
                  </p>
                  <div
                    className={`grid gap-4 ${
                      coverImageVariants.length === 1
                        ? "grid-cols-1 max-w-[200px] mx-auto"
                        : coverImageVariants.length === 2
                          ? "grid-cols-2 max-w-md mx-auto"
                          : "grid-cols-3"
                    }`}
                  >
                    {coverImageVariants.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedCoverVariant(index)}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all ${
                          selectedCoverVariantIndex === index
                            ? "border-primary ring-4 ring-primary/20 scale-[1.03]"
                            : "border-gray-200 hover:border-primary/50"
                        }`}
                      >
                        <Image
                          src={variant}
                          alt={`Sketch ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        {selectedCoverVariantIndex === index && (
                          <div className="absolute top-2 right-2 bg-primary rounded-full p-1 shadow">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs text-center py-1 font-semibold">
                          Sketch {index + 1}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No sketches state */}
              {coverImageVariants.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="font-semibold">No sketches yet.</p>
                  <p className="text-sm mt-1">
                    Upload an image below to generate your cover.
                  </p>
                </div>
              )}

              {/* Generate new cover (always visible after payment) */}
              {hasPaid && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-600 mb-3">
                    Generate a different cover
                  </p>
                  <label className={canGenerate ? "cursor-pointer" : ""}>
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <div className="w-full font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border-2 border-dashed border-primary/40 text-primary hover:bg-primary/5 bg-primary/[0.02] cursor-pointer">
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <ArrowUpFromLine className="w-5 h-5" />
                      )}
                      {loading ? "Generating..." : "Upload New Photo"}
                    </div>
                  </label>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 w-full pt-2">
                <Button
                  onClick={() => {
                    useBookStore.getState().setHasPaid(false);
                    useBookStore.getState().setOrderId(null);
                    setCoverImage(null);
                    setCoverImageVariants([]);
                    setStep("free-generation");
                  }}
                  className="flex-1 bg-[#e5e7eb] rounded-2xl h-14 text-base text-[#364153] font-normal hover:bg-[#d1d5db] transition-colors"
                >
                  Start Over
                </Button>
                <Button
                  onClick={() => setStep("dedication")}
                  disabled={coverImageVariants.length === 0}
                  className="flex-1 bg-[#ff8b36] rounded-2xl h-14 text-base text-white font-normal hover:bg-[#ff7a1f] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Continue</span>
                  <ArrowRight />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ImagePreviewModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onConfirm={handleConfirmGeneration}
        imagePreview={pendingImage}
        isLoading={loading}
        error={error}
      />
    </>
  );
}
