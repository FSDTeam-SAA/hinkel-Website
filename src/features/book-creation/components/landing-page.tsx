"use client";

import { ArrowUpFromLine } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";

export default function LandingPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setCoverImage = useBookStore((state: BookStore) => state.setCoverImage);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setCoverImage(imageData);
        setStep("cover");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">✦</span>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          Picture to Sketch Book Creator
        </h1>

        <p className="text-lg text-muted-foreground mb-12">
          Transform your images into beautiful sketch coloring books. Upload an
          image, preview the sketch, and create your print-ready book.
        </p>

        <div className="bg-white rounded-2xl p-12 shadow-sm border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Get Started
          </h2>
          <p className="text-muted-foreground mb-8">
            Upload an image to convert it into a sketch
          </p>

          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/jpeg, image/png, image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors">
              <ArrowUpFromLine className="w-5 h-5" />
              Upload Your Image
            </div>
          </label>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
            <div className="text-center">
              <div className="text-2xl mb-2">📷</div>
              <p className="text-sm font-medium text-foreground">
                Upload Image
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG up to 10MB
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">✨</div>
              <p className="text-sm font-medium text-foreground">
                Preview Sketch
              </p>
              <p className="text-xs text-muted-foreground">
                See AI generated sketches
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📕</div>
              <p className="text-sm font-medium text-foreground">Create Book</p>
              <p className="text-xs text-muted-foreground">
                Configure & order your book
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
