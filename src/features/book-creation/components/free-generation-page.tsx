"use client";

import { useCallback, useState, useEffect } from "react";
import {
  ArrowUpFromLine,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { useGeneratePreview } from "@/features/book-creation/hooks/useGeneratePreview";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import ImagePreviewModal from "./image-preview-modal";
import { BookStore } from "../types";
import { toast } from "sonner";
import { useContent } from "@/features/category-page/hooks/use-content";
import { cn } from "@/lib/utils";
import { BookStyleSelector } from "./BookStyleSelector";
import { AuthPromptModal } from "./auth-prompt-modal";
import Image from "next/image";
import { getCategoryPromptForType } from "../utils/prompt";

const MAX_FREE_GENERATIONS = 2;

export default function FreeGenerationPage() {
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
  const setBookType = useBookStore((state: BookStore) => state.setBookType);
  const bookType = useBookStore((state: BookStore) => state.bookType);
  const canGenerateCover = useBookStore(
    (state: BookStore) => state.canGenerateCover,
  );
  const { coverImageVariants, selectedCoverVariantIndex, generationCounts } =
    useBookStore();

  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role?.toLowerCase() === "admin";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { data: contentData } = useContent({ limit: 12 });
  const categories = contentData?.data || [];
  const selectedStylePrompt = getCategoryPromptForType(categories, bookType);

  const freeGenerationsUsed = generationCounts.cover;
  const canGenerate = isAdmin || canGenerateCover();

  const currentTypeFromUrl = searchParams.get("type");

  useEffect(() => {
    const validUrlType =
      currentTypeFromUrl && currentTypeFromUrl.toLowerCase() !== "home"
        ? currentTypeFromUrl
        : null;

    if (validUrlType && validUrlType !== bookType) {
      setBookType(validUrlType);
    } else if (!validUrlType && bookType && bookType.toLowerCase() !== "home") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", bookType);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    } else if (bookType && bookType.toLowerCase() === "home") {
      setBookType("");
    }
  }, [
    currentTypeFromUrl,
    bookType,
    setBookType,
    pathname,
    router,
    searchParams,
  ]);

  const handleStyleSelect = useCallback(
    (type: string) => {
      setBookType(type);
      const params = new URLSearchParams(searchParams.toString());
      params.set("type", type);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [setBookType, pathname, router, searchParams],
  );

  const { generatePreview, loading, error, reset } = useGeneratePreview();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!bookType || bookType.toLowerCase() === "home") {
      toast.error("Please select a book style before uploading.");
      e.target.value = "";
      return;
    }
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
      toast.error(
        `You've used all ${MAX_FREE_GENERATIONS} free previews. Click "Continue to Book Setup" to proceed!`,
      );
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

      // Append the new sketch to existing variants
      const updatedVariants = [...coverImageVariants, previewResult];
      setCoverImage(pendingImage);
      setCoverImageVariants(updatedVariants);
      setSelectedCoverVariant(updatedVariants.length - 1);

      // Reset payment state for new book
      useBookStore.getState().setHasPaid(false);
      useBookStore.getState().setOrderId(null);
      useBookStore.getState().setPendingPageCount(null);

      const used = freeGenerationsUsed + 1;
      toast.success(
        isAdmin
          ? "👑 Admin: Sketch generated!"
          : `Sketch ${used}/${MAX_FREE_GENERATIONS} generated!`,
      );

      setIsModalOpen(false);
      setPendingImage(null);
    }
  };

  const handleSelectVariant = (index: number) => {
    setSelectedCoverVariant(index);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
              <Sparkles className="w-4 h-4" />
              Try Before You Buy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              See Your Photos as Sketches
            </h1>
            <p className="text-lg text-muted-foreground">
              Generate up to {MAX_FREE_GENERATIONS} free sketch previews — no
              payment required.
            </p>
          </div>

          <BookStyleSelector
            selectedType={bookType}
            categories={categories}
            onSelect={handleStyleSelect}
          />

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-border">
            {/* Generation counter header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {isAdmin ? "Generate Sketches (Admin)" : "Free Sketch Previews"}
              </h2>
              {!isAdmin && (
                <div className="flex items-center gap-2">
                  {Array.from({ length: MAX_FREE_GENERATIONS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full transition-all ${
                        i < freeGenerationsUsed
                          ? "bg-orange-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-semibold text-gray-500">
                    {freeGenerationsUsed}/{MAX_FREE_GENERATIONS} used
                  </span>
                </div>
              )}
            </div>

            {/* Upload button */}
            <label
              className={cn(
                "block",
                !canGenerate && !isAdmin
                  ? "opacity-60 pointer-events-none"
                  : "cursor-pointer",
              )}
            >
              <input
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onClick={(e) => {
                  if (status === "unauthenticated") {
                    e.preventDefault();
                    setIsAuthModalOpen(true);
                  }
                }}
                onChange={handleFileUpload}
                className="hidden"
                disabled={!canGenerate && !isAdmin}
              />
              <div
                className={cn(
                  "w-full font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border-2 border-dashed",
                  !bookType || bookType.toLowerCase() === "home"
                    ? "bg-muted text-muted-foreground cursor-not-allowed border-gray-200"
                    : canGenerate || isAdmin
                      ? "bg-primary/5 border-primary text-primary hover:bg-primary hover:text-white"
                      : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed",
                )}
              >
                <ArrowUpFromLine className="w-5 h-5" />
                {canGenerate || isAdmin
                  ? "Upload Photo to Generate Sketch"
                  : `${MAX_FREE_GENERATIONS}/${MAX_FREE_GENERATIONS} Free Sketches Used — Continue Below`}
              </div>
            </label>

            {/* Generated sketches gallery */}
            {coverImageVariants.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                  Your Generated Sketches — Pick Your Favourite
                </p>
                <div
                  className={`grid gap-4 ${
                    coverImageVariants.length === 1
                      ? "grid-cols-1 max-w-xs mx-auto"
                      : "grid-cols-2"
                  }`}
                >
                  {coverImageVariants.map((variant, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectVariant(index)}
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedCoverVariantIndex === index
                          ? "border-primary ring-4 ring-primary/20 scale-[1.02]"
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
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs text-center py-1.5 font-semibold">
                        Sketch {index + 1}
                        {selectedCoverVariantIndex === index &&
                          " — Selected as Cover"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* How-it-works row (only before any generation) */}
            {coverImageVariants.length === 0 && (
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                <div className="text-center">
                  <div className="text-2xl mb-2">📷</div>
                  <p className="text-sm font-medium text-foreground">
                    Upload Photo
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <p className="text-sm font-medium text-foreground">
                    Get Sketch
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI-powered conversion
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📕</div>
                  <p className="text-sm font-medium text-foreground">
                    Build Book
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Then set up &amp; pay
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Continue button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setStep("setup")}
              className={cn(
                "flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all h-14",
                coverImageVariants.length > 0
                  ? "bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200",
              )}
            >
              <span>
                {coverImageVariants.length > 0
                  ? "Continue to Book Setup"
                  : "Skip to Book Setup"}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
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

      <AuthPromptModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
