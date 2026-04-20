"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Loader2, X, Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  title?: string;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  title = "Book Preview",
}) => {
  const [loading, setLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!pdfUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={`${
          isFullscreen
            ? "max-w-[100vw] w-screen h-screen m-0 rounded-none border-none"
            : "max-w-[95vw] w-[1200px] h-[90vh]"
        } p-0 overflow-hidden bg-gray-900 border-gray-800 transition-all duration-300 shadow-2xl`}
      >
        <div className="flex flex-col h-full relative group/viewer">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gray-900/90 backdrop-blur-md border-b border-gray-800 z-50">
            <DialogTitle className="text-white text-lg font-bold">
              {title}
            </DialogTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                {isFullscreen ? (
                  <Minimize2 size={20} />
                ) : (
                  <Maximize2 size={20} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X size={24} />
              </Button>
            </div>
          </div>

          {/* Viewer Container */}
          <div className="flex-1 relative bg-[#1a1a1a] overflow-hidden">
            {loading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-[60] bg-gray-900/90 backdrop-blur-md">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-white font-bold text-xl">
                  Loading Document...
                </p>
              </div>
            )}

            <iframe
              src={pdfUrl}
              className="w-full h-full border-none"
              onLoad={() => setLoading(false)}
              title="PDF Viewer"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
