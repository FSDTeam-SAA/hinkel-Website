"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

interface GallerySectionProps {
  images: string[];
  title?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 20,
      stiffness: 100,
    },
  },
};

export function GallerySection({ images }: GallerySectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = useCallback(() => {
    setIsLightboxOpen(false);
    setSelectedIndex(null);
  }, []);

  // Handle body scroll lock when lightbox is open
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isLightboxOpen]);

  const goToPrevious = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === 0 ? images.length - 1 : (prev ?? 0) - 1,
    );
  }, [selectedIndex, images.length]);

  const goToNext = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((prev) =>
      prev === images.length - 1 ? 0 : (prev ?? 0) + 1,
    );
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, closeLightbox, goToPrevious, goToNext]);

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <>
      <section className="py-16 md:py-24 bg-linear-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4 md:px-6">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
              Gallery
            </span>
            {/* <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
              {title ? `${title} Gallery` : "Explore Our Gallery"}
            </h2>
            <p className="mt-4 text-gray-500 text-lg max-w-2xl mx-auto">
              Click on any image to view it in full size
            </p> */}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className={cn(
              "grid gap-4 md:gap-6",
              images.length === 1 && "grid-cols-1 max-w-2xl mx-auto",
              images.length === 2 && "grid-cols-2",
              images.length === 3 && "grid-cols-2 md:grid-cols-3",
              images.length >= 4 && "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
            )}
          >
            {images.map((image, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className={cn(
                  "group relative cursor-pointer",
                  // Make first image span 2 columns on larger grids
                  images.length >= 5 &&
                    index === 0 &&
                    "md:col-span-2 md:row-span-2",
                )}
                onClick={() => openLightbox(index)}
              >
                <div
                  className={cn(
                    "relative w-full overflow-hidden rounded-2xl bg-gray-100",
                    images.length >= 5 && index === 0
                      ? "aspect-square"
                      : "aspect-4/5",
                  )}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-xl">
                        <ZoomIn className="w-6 h-6 text-gray-900" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subtle shadow on hover */}
                <div className="absolute -inset-2 -z-10 rounded-3xl bg-primary/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors group"
              aria-label="Close lightbox"
            >
              <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>

            {/* Image Counter */}
            <div className="absolute top-4 left-4 md:top-8 md:left-8 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
              <span className="text-white text-sm font-medium">
                {selectedIndex + 1} / {images.length}
              </span>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-2 md:left-8 z-10 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 group"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-2 md:right-8 z-10 p-3 md:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all hover:scale-110 group"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}

            {/* Main Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative w-[90vw] h-[80vh] max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={`Gallery image ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </motion.div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-10 flex gap-2 px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm max-w-[90vw] overflow-x-auto scrollbar-hide">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedIndex(idx);
                    }}
                    className={cn(
                      "relative w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden shrink-0 transition-all duration-200",
                      selectedIndex === idx
                        ? "ring-2 ring-white scale-110"
                        : "opacity-50 hover:opacity-100",
                    )}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
