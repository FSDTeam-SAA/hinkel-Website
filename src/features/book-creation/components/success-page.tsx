"use client";

import { CheckCircle, Home } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/types";

export default function SuccessPage() {
  const resetBook = useBookStore((state: BookStore) => state.resetBook);
  const pageCount = useBookStore((state: BookStore) => state.pageCount);

  const handleCreateAnother = () => {
    resetBook();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
          Success!
        </h1>

        <p className="text-xl text-muted-foreground mb-12">
          Your coloring book is ready to download!
        </p>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-border mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {pageCount}
              </div>
              <p className="text-sm font-medium text-foreground">Total Pages</p>
            </div>
            <div className="p-6 bg-pink-50 rounded-lg">
              <div className="text-2xl mb-2">✓</div>
              <p className="text-sm font-medium text-foreground">
                <span className="text-blue-600 font-bold">Ready</span>
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-foreground font-medium mb-2">
              Your book has been created successfully wait for the Confirmation
            </p>
            <p className="text-sm text-muted-foreground">
              You will notify by mail
            </p>
          </div>
        </div>

        <button
          onClick={handleCreateAnother}
          className="w-full bg-muted hover:bg-muted/80 text-foreground font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
        >
          <Home className="w-5 h-5" />
          Create Another Book
        </button>
      </div>
    </div>
  );
}
