"use client";

import type React from "react";
import { useState, useRef } from "react";
import StepIndicator from "@/components/step-indicator";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, Wand2 } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";
import Image from "next/image";
import { isValidFile, fileToDataURL } from "../utils/file-validation";
import { toast } from "sonner";

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
    convertedPageImages,
    addConvertedPageImage,
    removeConvertedPageImage,
  } = useBookStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];
  const currentStep = 3;

  const totalPages = pageCount + (includeDedicationPage ? 1 : 0);

  const handleFileUploadLogic = async (file: File, pageNum: number) => {
    // Check if limit reached (max 3 images)
    const currentImages = uploadedPageImages[pageNum] || [];
    if (currentImages.length >= 3) {
      toast.error(
        "Maximum 3 images allowed per page. Please remove an image to upload a new one.",
      );
      return;
    }

    const validation = isValidFile(file);
    if (!validation.valid) {
      toast.error(validation.error || "Invalid file");
      return;
    }

    toast.info("Uploading image...");
    setIsUploading(true);

    try {
      // Simulate a small delay for "uploading" feel
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const imageData = await fileToDataURL(file);

      // Add to uploaded list
      addUploadedPageImage(pageNum, imageData);

      // If this is the first image or no image is currently selected, select it automatically
      if (!pageImages[pageNum] || currentImages.length === 0) {
        updatePageImage(pageNum, imageData);
      }
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.error("Image processing error:", err);
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    pageNum: number,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUploadLogic(file, pageNum);
    }
    // Reset input value so the same file can be selected again
    e.target.value = "";
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

  const handleRemoveUploadedImage = (pageNum: number, index: number) => {
    const image = uploadedPageImages[pageNum]?.[index];
    removeUploadedPageImage(pageNum, index);

    // If the removed image was the selected one, clear or select another
    if (pageImages[pageNum] === image) {
      const remainingImages =
        uploadedPageImages[pageNum]?.filter(
          (_: string, i: number) => i !== index,
        ) || [];
      if (remainingImages.length > 0) {
        updatePageImage(pageNum, remainingImages[0]);
      } else {
        updatePageImage(pageNum, "");
      }
    }
  };

  const handleConvertToLineArt = async (pageNum: number, image: string) => {
    // Check conversion limit (max 3 per page)
    const currentConversions = convertedPageImages[pageNum] || [];
    if (currentConversions.length >= 3) {
      toast.error("Maximum 3 conversions allowed per page.");
      return;
    }

    setIsConverting(true);
    toast.info("Converting to line art...");

    try {
      // Simulate API call delay (placeholder for actual backend integration)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For now, we'll just add the same image as a placeholder
      // In production, this would be the converted line art image from the API
      addConvertedPageImage(pageNum, image);

      // Auto-select the converted image as the page image
      updatePageImage(pageNum, image);

      toast.success("Image converted to line art!");
    } catch (err) {
      console.error("Conversion error:", err);
      toast.error("Failed to convert image. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  const handleRemoveConvertedImage = (pageNum: number, index: number) => {
    const image = convertedPageImages[pageNum]?.[index];
    removeConvertedPageImage(pageNum, index);

    // If the removed image was the selected one, clear or select another
    if (pageImages[pageNum] === image) {
      const remainingConversions =
        convertedPageImages[pageNum]?.filter(
          (_: string, i: number) => i !== index,
        ) || [];
      if (remainingConversions.length > 0) {
        updatePageImage(pageNum, remainingConversions[0]);
      } else {
        // Check if there are uploaded images to fall back to
        const uploaded = uploadedPageImages[pageNum] || [];
        if (uploaded.length > 0) {
          updatePageImage(pageNum, uploaded[0]);
        } else {
          updatePageImage(pageNum, "");
        }
      }
    }
  };

  const handleSelectImage = (pageNum: number, image: string) => {
    updatePageImage(pageNum, image);
  };

  const currentUploadedImages = uploadedPageImages[currentPage] || [];
  const currentConvertedImages = convertedPageImages[currentPage] || [];
  const hasMaxImages = currentUploadedImages.length >= 3;
  const hasUploadedImage = currentUploadedImages.length > 0;
  const selectedUploadedImage = currentUploadedImages[0] || null;
  const conversionsUsed = currentConvertedImages.length;
  const maxConversions = 3;

  const isContinueDisabled = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).some((pageNum) => !pageImages[pageNum]);

  return (
    <div className="min-h-screen flex flex-col">
      <StepIndicator steps={steps} currentStep={currentStep} />

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {/* Page selector */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`min-w-12 h-12 rounded-lg border-2 font-semibold transition-all ${
                  currentPage === index + 1
                    ? "border-primary bg-secondary"
                    : pageImages[index + 1]
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {/* Main content area */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            {/* Header with page title and conversion counter */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="text-xl font-bold">Page {currentPage}</h2>
                <p className="text-gray-500 text-sm">
                  Upload up to 3 images to find the perfect one
                </p>
              </div>
              <div className="text-sm text-gray-600 border border-gray-200 rounded-md px-3 py-1">
                {conversionsUsed}/{maxConversions} conversions used
              </div>
            </div>

            {/* Upload / Preview area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, currentPage)}
              className={`relative rounded-lg border-2 border-dashed overflow-hidden transition-colors mb-4 ${
                isDragging
                  ? "border-primary bg-secondary"
                  : hasUploadedImage
                    ? "border-gray-200"
                    : "border-gray-300 bg-gray-50"
              }`}
              style={{ minHeight: "300px" }}
            >
              {hasUploadedImage && selectedUploadedImage ? (
                // Show uploaded image preview
                <div
                  className="relative w-full h-full"
                  style={{ minHeight: "300px" }}
                >
                  <Image
                    src={selectedUploadedImage}
                    alt={`Page ${currentPage} preview`}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                // Show upload prompt
                <div
                  className="flex flex-col items-center justify-center p-8 text-center"
                  style={{ minHeight: "300px" }}
                >
                  <Upload className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-6">PNG, JPG up to 20MB</p>

                  {!hasMaxImages ? (
                    <div className="flex flex-col items-center">
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png,image/jpeg"
                        onChange={(e) => handleImageUpload(e, currentPage)}
                        className="hidden"
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-primary hover:bg-primary/90 cursor-pointer h-12 px-8 text-lg font-semibold rounded-xl"
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <Upload className="w-5 h-5 mr-2" />
                        )}
                        {isUploading ? "Uploading..." : "Upload image"}
                      </Button>
                    </div>
                  ) : (
                    <div className="text-primary font-medium">
                      Maximum of 3 images reached for this page.
                    </div>
                  )}

                  <p className="text-sm text-gray-500 mt-4">
                    {!hasMaxImages
                      ? "or drag and drop your image here"
                      : "Remove an image to upload a new one"}
                  </p>
                </div>
              )}
            </div>

            {/* Convert button and Remove button row */}
            {hasUploadedImage && selectedUploadedImage && (
              <div className="flex gap-2 mb-6">
                <Button
                  onClick={() =>
                    handleConvertToLineArt(currentPage, selectedUploadedImage)
                  }
                  disabled={isConverting || conversionsUsed >= maxConversions}
                  className="flex-1 h-12 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                >
                  {isConverting ? (
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Wand2 className="w-5 h-5 mr-2" />
                  )}
                  {isConverting
                    ? "Converting..."
                    : "Convert to Line Art (+$0.07)"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleRemoveUploadedImage(currentPage, 0)}
                  className="h-12 px-4 rounded-xl border-gray-300 hover:bg-gray-50"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            )}

            {/* Upload more button if image already uploaded but less than max */}
            {hasUploadedImage && !hasMaxImages && (
              <div className="flex justify-center mb-6">
                <input
                  type="file"
                  id="upload-more"
                  accept="image/png,image/jpeg"
                  onChange={(e) => handleImageUpload(e, currentPage)}
                  className="hidden"
                />
                <label htmlFor="upload-more">
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("upload-more")?.click()
                    }
                    className="cursor-pointer border-primary text-primary hover:bg-secondary"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    Upload another image
                  </Button>
                </label>
              </div>
            )}
          </div>

          {/* Your Conversions section */}
          {currentConvertedImages.length > 0 && (
            <div className="mb-12">
              <h3 className="font-semibold mb-4">Your Conversions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentConvertedImages.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      pageImages[currentPage] === img
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleSelectImage(currentPage, img)}
                  >
                    <div className="absolute top-1 left-1 bg-primary text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                      {idx + 1}
                    </div>
                    <Image
                      height={150}
                      width={150}
                      src={img || "/placeholder.svg"}
                      alt={`Conversion ${idx + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveConvertedImage(currentPage, idx);
                      }}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-red-500 p-1 rounded-full shadow-lg transition-all hover:scale-110"
                      title="Remove conversion"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded images thumbnails (if more than one) */}
          {currentUploadedImages.length > 1 && (
            <div className="mb-12">
              <h3 className="font-semibold mb-4">Uploaded Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {currentUploadedImages.map((img: string, idx: number) => (
                  <div
                    key={idx}
                    className={`relative rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                      selectedUploadedImage === img
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => {
                      // Re-order so this becomes the first/selected
                      // For simplicity, we just update page image selection logic
                    }}
                  >
                    <Image
                      height={150}
                      width={150}
                      src={img || "/placeholder.svg"}
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUploadedImage(currentPage, idx);
                      }}
                      className="absolute top-1 right-1 bg-white/90 hover:bg-red-50 text-red-500 p-1 rounded-full shadow-lg transition-all hover:scale-110"
                      title="Remove image"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-4 justify-between">
            <Button
              variant="outline"
              onClick={() => setStep("setup")}
              className="h-14 px-8 text-xl font-semibold border-2 border-primary text-primary hover:bg-secondary rounded-2xl"
            >
              ← Back
            </Button>
            <Button
              onClick={() => setStep("finalize")}
              disabled={isContinueDisabled}
              className="h-14 px-8 text-xl font-semibold bg-primary hover:bg-primary/90 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
