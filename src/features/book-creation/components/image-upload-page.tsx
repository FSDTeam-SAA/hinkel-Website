"use client";

import type React from "react";
import { useState } from "react";
import StepIndicator from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";
import Image from "next/image";

export default function ImageUploadPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const updatePageImage = useBookStore(
    (state: BookStore) => state.updatePageImage,
  );
  const {
    pageCount,
    includeDedicationPage,
    pageImages,
    uploadedPageImages,
    addUploadedPageImage,
    removeUploadedPageImage,
  } = useBookStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string>("");

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];
  const currentStep = 3;

  const totalPages = pageCount + (includeDedicationPage ? 1 : 0);

  const validateFile = (file: File): { valid: boolean; error?: string } => {
    const maxSize = 20 * 1024 * 1024;
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!validTypes.includes(file.type)) {
      return { valid: false, error: "Only PNG and JPG files are allowed" };
    }

    if (file.size > maxSize) {
      return { valid: false, error: "File size must be less than 20MB" };
    }

    return { valid: true };
  };

  const handleFileUploadLogic = (file: File, pageNum: number) => {
    // Check if limit reached (max 3 images)
    const currentImages = uploadedPageImages[pageNum] || [];
    if (currentImages.length >= 3) {
      setUploadError(
        "Maximum 3 images allowed per page. Please remove an image to upload a new one.",
      );
      return;
    }

    const validation = validateFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || "Invalid file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target?.result as string;
      setUploadError("");

      // Add to uploaded list
      addUploadedPageImage(pageNum, imageData);

      // If this is the first image or no image is currently selected, select it automatically
      if (!pageImages[pageNum] || currentImages.length === 0) {
        updatePageImage(pageNum, imageData);
      }
    };
    reader.onerror = () => {
      setUploadError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    pageNum: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUploadLogic(file, pageNum);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, pageNum: number) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUploadLogic(file, pageNum);
    }
  };

  const handleRemoveImage = (pageNum: number, index: number, image: string) => {
    removeUploadedPageImage(pageNum, index);

    // If the removed image was the selected one, unselect it or select another
    if (pageImages[pageNum] === image) {
      const remainingImages =
        uploadedPageImages[pageNum]?.filter(
          (_: string, i: number) => i !== index,
        ) || [];
      if (remainingImages.length > 0) {
        // Select the first available image
        updatePageImage(pageNum, remainingImages[0]);
      } else {
        // Nothing left, so update with empty/null (or handle as needed, currently updatePageImage typically expects string)
        // Since we don't have a "clear" method exposed directly in destructuring, we can pass empty string or handle it.
        // But updatePageImage implementation: pageImages: { ...state.pageImages, [pageNum]: image }
        // So passing "" or we might want to just let it hold the old ref until overwritten?
        // Better: Find the new list in state after update. Since state updates are async/batched, we rely on local calculation.
        // Actually, let's select the first one from the current list excluding the removed one.
        // ... logic above does that carefully.
        // If remainingImages is empty, we should probably clear the selection in pageImages.
        // Let's assume updatePageImage accepts empty string to clear or we leave it.
        // Ideally we'd have clearPageImage but updatePageImage(pageNum, "") works to 'uncheck' essentially.
        updatePageImage(pageNum, ""); // Placeholder to clear
      }
    }
  };

  const handleSelectImage = (pageNum: number, image: string) => {
    updatePageImage(pageNum, image);
  };

  const currentUploadedImages = uploadedPageImages[currentPage] || [];
  const hasMaxImages = currentUploadedImages.length >= 3;

  return (
    <div className="min-h-screen flex flex-col">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Upload Page Images</h1>
          <p className="text-gray-600 mb-8">
            Upload up to 3 images per page for AI conversion. Select your
            favorite for each page.
          </p>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`min-w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                  currentPage === index + 1
                    ? "border-orange-500 bg-orange-50"
                    : pageImages[index + 1]
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, currentPage)}
            className={`bg-gray-50 rounded-lg border-2 border-dashed p-8 text-center mb-8 transition-colors ${
              isDragging ? "border-orange-500 bg-orange-50" : "border-gray-300"
            }`}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Page {currentPage}</h3>
            <p className="text-gray-600 mb-6">PNG, JPG up to 20MB</p>

            {!hasMaxImages ? (
              <label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => handleImageUpload(e, currentPage)}
                  className="hidden"
                />
                <Button className="bg-blue-500 hover:bg-blue-600 cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload an image
                </Button>
              </label>
            ) : (
              <div className="text-orange-600 font-medium">
                Maximum of 3 images reached for this page.
              </div>
            )}

            <p className="text-sm text-gray-500 mt-4">
              {!hasMaxImages
                ? "or drag and drop your image here"
                : "Remove an image to upload a new one"}
            </p>
          </div>

          {uploadError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {uploadError}
            </div>
          )}

          {currentUploadedImages.length > 0 && (
            <div className="mb-12">
              <h3 className="font-semibold mb-4">
                Uploaded Images (Select One)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentUploadedImages.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      pageImages[currentPage] === img
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectImage(currentPage, img)}
                  >
                    <Image
                      height={300}
                      width={300}
                      src={img || "/placeholder.svg"}
                      alt={`Page ${currentPage} variant ${idx + 1}`}
                      className="w-full h-48 object-cover"
                    />

                    {pageImages[currentPage] === img && (
                      <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold shadow-sm">
                        Selected
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(currentPage, idx, img);
                      }}
                      className="absolute top-2 left-2 bg-white/80 hover:bg-red-100 text-red-500 p-1.5 rounded-full shadow-sm transition-colors"
                      title="Remove image"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6 6 18" />
                        <path d="m6 6 18 18" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setStep("cover")}
              className="w-32 bg-transparent"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setStep("finalize")}
              disabled={Object.keys(pageImages).length === 0}
              className="w-32 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
