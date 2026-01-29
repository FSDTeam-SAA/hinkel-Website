"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, ArrowRight } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import Image from "next/image";
import { BookStore } from "../types";

export default function CoverPageTestPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setCoverImage = useBookStore((state: BookStore) => state.setCoverImage);
  const setCoverImageVariants = useBookStore(
    (state: BookStore) => state.setCoverImageVariants,
  );
  // const setSelectedCoverVariant = useBookStore(
  //   (state: BookStore) => state.setSelectedCoverVariant,
  // );

  const setHasPaid = useBookStore((state: BookStore) => state.setHasPaid);
  const { coverImage, coverImageVariants, selectedCoverVariantIndex } =
    useBookStore();

  // const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const imageData = event.target?.result as string;
  //       setCoverImage(imageData);
  //       setTimeout(() => {
  //         setCoverImageVariants([imageData, imageData, imageData]);
  //       }, 1000);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const handleContinue = () => {
    // Only proceed to setup. Do NOT set hasPaid here (it should only be set after actual payment).
    setStep("setup");
  };

  return (
    <div className="min-h-screen bg-[#fbf4ea] flex flex-col items-center justify-start py-8 px-4 md:py-[36px] lg:px-[15%] xl:px-[20%]">
      {/* Main Container */}
      <div className="flex flex-col gap-[36.637px] w-full max-w-6xl">
        {/* Header Container */}
        <div className="flex h-[41.216px] items-center justify-between w-full">
          {/* Back Button */}
          <button
            onClick={() => setStep("landing")}
            className="flex items-center gap-2 text-[#4a5565] font-Arial text-[18.318px] leading-[27.478px] hover:opacity-80 transition-opacity"
          >
            <ArrowLeft />
            <span>Back</span>
          </button>

          {/* Heading */}
          <h1 className="font-semibold font-Inter text-[34.347px] leading-[41.216px] text-[#0a0a0a]">
            Preview Your Sketch
          </h1>

          {/* Spacer - Hidden on mobile to allow space-between to work naturally or stack */}
          <div className="hidden md:block w-[90px]" />
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-[27.478px] shadow-[0px_7px_25px_-13.739px_rgba(0,0,0,0.07)] flex flex-col gap-[27px] p-6 md:p-9">
          {/* Description Paragraph */}
          <div className="w-full text-center font-Arial text-[18.318px] leading-[27.478px] text-[#4a5565]">
            Here&apos;s how your image looks as a sketch. If you&apos;re happy
            with the result, proceed to create your book!
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Original Image Column */}
            <div className="flex flex-col gap-[13.739px]">
              {/* Original Image Heading */}
              <h3 className="font-semibold font-Inter text-[20.608px] leading-[30.912px] text-[#0a0a0a] text-center">
                Original Image
              </h3>
              {/* Original Image Container */}
              <div className="bg-[#f3f4f6] rounded-[18.318px] aspect-square w-full overflow-hidden relative">
                {coverImage ? (
                  <Image
                    height={604}
                    width={604}
                    src={coverImage}
                    alt="Original"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f3f4f6]" />
                )}
              </div>
            </div>

            {/* Sketch Version Column */}
            <div className="flex flex-col gap-[13.739px]">
              {/* Sketch Version Heading */}
              <h3 className="font-semibold font-Inter text-[18.318px] leading-[27.478px] text-[#0a0a0a] text-center">
                Sketch Version
              </h3>
              {/* Sketch Version Container with Orange Border */}
              <div className="relative bg-[#f3f4f6] rounded-[18.318px] aspect-square w-full overflow-hidden border-[4.58px] border-[#ff8b36]">
                {coverImageVariants && coverImageVariants.length > 0 ? (
                  <Image
                    height={595}
                    width={595}
                    src={coverImageVariants[selectedCoverVariantIndex || 0]}
                    alt="Sketch"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[#f3f4f6]" />
                )}
                {/* Preview Badge */}
                <div className="absolute top-4 right-4 bg-[#ff8b36] rounded-full px-[10px] py-[2px] flex items-center gap-[5px]">
                  <Eye />
                  <span className="font-Arial text-[16.029px] leading-[22.898px] text-white">
                    Preview
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 w-full pt-6">
            {/* Try Different Image Button */}
            <Button
              onClick={() => {
                setCoverImage(null);
                setCoverImageVariants([]);
                // Ensure payment state is cleared if they go back to start
                useBookStore.getState().setHasPaid(false);
                useBookStore.getState().setOrderId(null);
                setStep("landing");
              }}
              className="flex-1 bg-[#e5e7eb] rounded-[16.029px] h-14 md:h-[64px] text-base md:text-[18px] text-[#364153] font-normal hover:bg-[#d1d5db] transition-colors flex items-center justify-center"
            >
              Try Different Image
            </Button>
            {/* Continue to Book Creation Button */}
            <Button
              onClick={handleContinue}
              className="flex-1 bg-[#ff8b36] rounded-[16.029px] h-[64.114px] font-Arial text-[18.318px] leading-[27.478px] text-white font-normal hover:bg-[#ff7a1f] transition-colors flex items-center justify-center gap-2 relative"
            >
              <span>Continue to Book Creation</span>
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
