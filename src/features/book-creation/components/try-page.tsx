"use client";

import type React from "react";

import { useState } from "react";
import StepIndicator from "@/components/step-indicator";
import { ImageIcon } from "lucide-react";
import Image from "next/image";

interface TryPageProps {
  onUpload: (imageUrl: string) => void;
}

export default function TryPage({ onUpload }: TryPageProps) {
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const url = reader.result as string;
      setImageUrl(url);
      onUpload(url);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

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
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-border">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left side - Upload */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-foreground mb-4">
                  Enter Your Text
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Text"
                  className="px-3 py-2 rounded-lg bg-muted border border-border text-sm mb-4"
                />

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`flex-1 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-8 transition-colors ${
                    dragActive
                      ? "border-primary bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <ImageIcon className="w-12 h-12 text-primary mb-3" />
                  <p className="text-center text-sm font-medium text-foreground mb-1">
                    Upload an image or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PNG, JPG up to 10MB
                  </p>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <span className="text-sm text-primary font-medium hover:underline">
                      Browse files
                    </span>
                  </label>
                </div>

                <label className="text-sm font-semibold text-foreground mt-4 mb-2">
                  Enter Your Text
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Text"
                  className="px-3 py-2 rounded-lg bg-muted border border-border text-sm"
                />
              </div>

              {/* Right side - Preview */}
              <div className="flex flex-col">
                <p className="text-sm font-semibold text-foreground mb-4">
                  Preview
                </p>
                <div className="flex-1 rounded-xl border-2 border-primary bg-white flex items-center justify-center min-h-80">
                  {imageUrl ? (
                    <Image
                      width={500}
                      height={500}
                      src={imageUrl || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <p className="text-muted-foreground text-lg">Preview</p>
                  )}
                </div>
              </div>
            </div>

            {/* Page numbers */}
            <div className="flex justify-between items-center gap-2 mt-8 px-2">
              <div className="flex gap-2 overflow-auto pb-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i}
                    className={`min-w-12 h-12 rounded-lg font-semibold flex items-center justify-center border-2 transition-colors ${
                      i === 0
                        ? "border-primary bg-white text-foreground"
                        : "border-border bg-white text-foreground hover:border-primary"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-8">
              <button className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium">
                ← Back
              </button>
              <button className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
