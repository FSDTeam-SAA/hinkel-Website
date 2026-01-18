"use client";

import { useState } from "react";
import StepIndicator from "@/components/step-indicator";
import { ArrowLeft } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/book";

interface Icon {
  width: number;
  height: number;
}

const DownloadIcon = ({ width = 42, height = 42 }: Icon) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 0.75C10.1875 0.75 1.5 9.4375 1.5 20.25C1.5 31.0625 10.1875 39.75 21 39.75C31.8125 39.75 40.5 31.0625 40.5 20.25C40.5 9.4375 31.8125 0.75 21 0.75ZM21 36.75C12.0625 36.75 4.5 29.1875 4.5 20.25C4.5 11.3125 12.0625 3.75 21 3.75C29.9375 3.75 37.5 11.3125 37.5 20.25C37.5 29.1875 29.9375 36.75 21 36.75Z"
      fill="white"
    />
    <path d="M20.25 11.25H21.75V24.75H20.25V11.25Z" fill="white" />
    <path
      d="M26.4375 19.3125L25.6875 20.0625L21 14.625L16.3125 20.0625L15.5625 19.3125L21 12.5625L26.4375 19.3125Z"
      fill="white"
    />
    <path
      d="M28.5 27.75H13.5C13.0625 27.75 12.75 27.4375 12.75 27C12.75 26.5625 13.0625 26.25 13.5 26.25H28.5C28.9375 26.25 29.25 26.5625 29.25 27C29.25 27.4375 28.9375 27.75 28.5 27.75Z"
      fill="white"
    />
  </svg>
);

export default function BookSetupFormatPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setPageCount = useBookStore((state: BookStore) => state.setPageCount);
  const setOutputFormat = useBookStore(
    (state: BookStore) => state.setOutputFormat,
  );
  const setBookTitle = useBookStore((state: BookStore) => state.setBookTitle);
  const { pageCount, outputFormat } = useBookStore();

  const [title, setTitle] = useState("");
  const [selectedPages, setSelectedPages] = useState(pageCount || 20);
  const [selectedFormat, setSelectedFormat] = useState<
    "pdf" | "printed" | "both"
  >(outputFormat || "pdf");
  const [errors, setErrors] = useState<{ title?: string }>({});

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];

  const pageOptions = [
    { count: 10, label: "10" },
    { count: 20, label: "20", popular: true },
    { count: 30, label: "30" },
    { count: 40, label: "40" },
  ];

  const deliveryMethods = [
    {
      id: "pdf",
      title: "Digital PDF",
      subtitle: "Instant download",
      price: "$24.22",
    },
    {
      id: "printed",
      title: "Printed Book",
      subtitle: "Instant download",
      price: "$24.22",
    },
    {
      id: "both",
      title: "Digital PDF & Printed Book",
      subtitle: "Delivered to you",
      price: "$24.22",
    },
  ];

  const handleContinue = () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Book title is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setBookTitle(title);
    setPageCount(selectedPages);
    setOutputFormat(selectedFormat);
    setStep("images");
  };

  const handleBack = () => {
    setStep("landing");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StepIndicator steps={steps} currentStep={0} />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        <div className="bg-white rounded-[16px] shadow-[0px_7px_25px_-13.739px_rgba(0,0,0,0.07)] p-8 md:p-12">
          {/* Book Title Section */}
          <div className="mb-[73px]">
            <h2 className="text-[36px] font-medium font-poppins text-[#212121] mb-[6px]">
              Book Title
            </h2>
            <div className="border-2 border-[#e1e3e5] rounded-[12px] flex items-center px-[16px] py-[8px] h-[73px]">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({});
                }}
                placeholder="My Amazing Coloring Book"
                className="w-full text-[20px] font-poppins text-[#6c757d] placeholder-[#6c757d] focus:outline-none bg-transparent"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm mt-2">{errors.title}</p>
            )}
          </div>

          {/* Choose Your Package Header */}
          <h3 className="text-[36px] font-medium font-inter text-black mb-[23px]">
            Choose Your Package
          </h3>

          {/* Number of Pages Section */}
          <div className="mb-[23px]">
            <h4 className="text-[32px] font-normal font-inter text-black mb-[16px]">
              Number of Pages
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-[24px]">
              {pageOptions.map((option) => (
                <button
                  key={option.count}
                  onClick={() => setSelectedPages(option.count)}
                  className={`relative h-[208px] rounded-[12px] flex items-center justify-center transition-all ${
                    selectedPages === option.count
                      ? "border-2 border-[#ff8b36] bg-[#fffaf3]"
                      : "border-2 border-[#d5d5d5] bg-white hover:border-[#d5d5d5]"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="text-[48px] font-medium font-inter text-black text-center">
                      {option.count}
                    </div>
                    <div className="text-[40px] font-normal font-inter text-black">
                      Page
                    </div>
                  </div>
                  {option.popular && (
                    <div className="absolute bottom-[-20px] left-1/2 -translate-x-1/2">
                      <div className="bg-[#ff8b36] text-white text-[16px] font-semibold px-[32px] py-[10px] rounded-[12px]">
                        Populer
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Delivery Method Section */}
          <div className="mt-[80px] pt-[40px]">
            <h4 className="text-[32px] font-normal font-inter text-black mb-[23px]">
              Delivery Method
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
              {deliveryMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() =>
                    setSelectedFormat(method.id as "pdf" | "printed" | "both")
                  }
                  className={`relative h-[424px] rounded-[24px] flex flex-col items-center justify-center py-[78px] px-[196px] transition-all ${
                    selectedFormat === method.id
                      ? "border-2 border-[#ff8b36] bg-[#fff6eb]"
                      : "border-2 border-[#ff8b36] bg-[#fff6eb]"
                  }`}
                >
                  <div className="flex flex-col gap-[21px] items-center w-[339px]">
                    {/* Icon Container */}
                    <div className="bg-[#ff8b36] rounded-[50px] p-[8px] flex items-center justify-center">
                      <div className="w-[42px] h-[42px] flex items-center justify-center">
                        <DownloadIcon width={42} height={42} />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-[5.073px] items-center text-center">
                      <h5 className="text-[30px] font-semibold font-inter text-[#ff8b36]">
                        {method.title}
                      </h5>
                      <p className="text-[18px] font-normal font-inter text-[#ff8b36]">
                        {method.subtitle}
                      </p>
                      <p className="text-[30px] font-semibold font-inter text-[#ff8b36]">
                        {method.price}
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedFormat === method.id && (
                    <div className="absolute inset-0 rounded-[24px] border-2 border-[#ff8b36] pointer-events-none" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-6 justify-between mt-[29px]">
          <button
            onClick={handleBack}
            className="flex items-center gap-[14.3px] bg-[#ff8b36] text-white px-[32px] py-[17px] rounded-[14.3px] font-inter font-semibold text-[29px] leading-[42px] hover:bg-orange-600 transition-colors h-[78px] min-w-[182px]"
          >
            <ArrowLeft size={32} />
            <span>Back</span>
          </button>

          <button
            onClick={handleContinue}
            className="flex items-center gap-[14.3px] bg-[#ff8b36] text-white px-[32px] py-[17px] rounded-[14.3px] font-inter font-semibold text-[29px] leading-[42px] hover:bg-orange-600 transition-colors h-[78px] min-w-[242px]"
          >
            <span>Continue</span>
            <ArrowLeft size={32} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
