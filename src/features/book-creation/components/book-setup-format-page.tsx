"use client";

import { useState, useMemo } from "react";
import StepIndicator from "@/components/step-indicator";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { usePricing } from "@/features/book-creation/hooks/usePricing";
import { useConfirmPayment } from "@/features/book-creation/hooks/usePayment";
import { DeliveryMethodCard } from "./delivery-mothod-card";
import { BookStore, OutputFormat, DeliveryType } from "../types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BookSetupFormatPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setPendingPageCount = useBookStore(
    (state: BookStore) => state.setPendingPageCount,
  );
  const setOutputFormat = useBookStore(
    (state: BookStore) => state.setOutputFormat,
  );
  const setBookTitle = useBookStore((state: BookStore) => state.setBookTitle);
  const setOrderId = useBookStore((state: BookStore) => state.setOrderId);
  const { bookTitle, pageCount, outputFormat, bookType } = useBookStore();
  const { data: session } = useSession();
  const router = useRouter();

  const { prices, loading: pricingLoading } = usePricing();
  const { confirmPayment, isLoading: isConfirming } = useConfirmPayment();

  const [title, setTitle] = useState(bookTitle || "");
  const [selectedPages, setSelectedPages] = useState(pageCount || 20);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(
    outputFormat || "pdf",
  );
  const [errors, setErrors] = useState<{ title?: string }>({});

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];

  const deliveryTypeMap = useMemo<Record<OutputFormat, DeliveryType>>(
    () => ({
      pdf: "digital",
      printed: "print",
      "pdf&printed": "print&digital",
    }),
    [],
  );

  const pageOptions = useMemo(() => {
    const currentType = deliveryTypeMap[selectedFormat];
    const methodPricing = prices?.find((p) => p.deliveryType === currentType);
    if (!methodPricing) return [];

    return methodPricing.pageTiers
      .sort((a, b) => a.pageLimit - b.pageLimit)
      .map((tier, index, arr) => ({
        count: tier.pageLimit,
        label: tier.pageLimit.toString(),
        popular: index === Math.floor(arr.length / 2), // Make the middle one popular as a heuristic
        price: tier.price,
      }));
  }, [prices, selectedFormat, deliveryTypeMap]);

  const handleFormatSelect = (format: OutputFormat) => {
    setSelectedFormat(format);
    const currentType = deliveryTypeMap[format];
    const methodPricing = prices?.find((p) => p.deliveryType === currentType);
    if (methodPricing && methodPricing.pageTiers.length > 0) {
      const tiers = [...methodPricing.pageTiers].sort(
        (a, b) => a.pageLimit - b.pageLimit,
      );
      const isValid = tiers.some((t) => t.pageLimit === selectedPages);
      if (!isValid) {
        setSelectedPages(tiers[0].pageLimit);
      }
    }
  };

  const deliveryMethods = useMemo(() => {
    return [
      {
        id: "pdf" as OutputFormat,
        apiType: "digital" as const,
        title: "Digital PDF",
        subtitle: "Instant download",
      },
      {
        id: "printed" as OutputFormat,
        apiType: "print" as const,
        title: "Printed Book",
        subtitle: "Shipped to you",
      },
      {
        id: "pdf&printed" as OutputFormat,
        apiType: "print&digital" as const,
        title: "Digital PDF & Printed Book",
        subtitle: "Delivered & Instant",
      },
    ];
  }, []);

  const handleContinue = async () => {
    const newErrors: { title?: string } = {};
    if (!title.trim()) {
      newErrors.title = "Book title is required";
      toast.error(newErrors.title);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!session?.user?.id) {
      toast.error("Please login to continue");
      router.push("/login?callbackUrl=/create-book");
      return;
    }

    // Map output format to API delivery type
    const deliveryTypeMap: Record<OutputFormat, DeliveryType> = {
      pdf: "digital",
      printed: "print",
      "pdf&printed": "print&digital",
    };

    try {
      const response = await confirmPayment({
        userId: session.user.id,
        pageCount: selectedPages,
        deliveryType: deliveryTypeMap[selectedFormat],
        bookType: bookType,
      });

      if (response.success && response.sessionUrl) {
        setBookTitle(title);
        setPendingPageCount(selectedPages);
        setOutputFormat(selectedFormat);
        setOrderId(response.orderId);

        // Redirect to Stripe
        router.push(response.sessionUrl);
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong during payment confirmation";
      toast.error(errorMessage);
    }
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
          <div className="mb-[80px] pb-[40px]">
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
          <div className="mt-[23px] relative">
            <h4 className="text-[32px] font-normal font-inter text-black mb-[23px]">
              Delivery Method
            </h4>

            {pricingLoading ? (
              <div className="flex justify-center items-center h-[424px]">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[22px]">
                {deliveryMethods.map((method) => (
                  <DeliveryMethodCard
                    key={method.id}
                    method={method}
                    selectedPages={selectedPages}
                    selectedFormat={selectedFormat}
                    onSelect={handleFormatSelect}
                    prices={prices}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-6 justify-between mt-[29px]">
          <button
            onClick={handleBack}
            className="flex items-center gap-[14.3px] bg-[#e5e7eb] text-[#364153] px-[32px] py-[17px] rounded-[14.3px] font-inter font-semibold text-[24px] leading-[42px] hover:bg-gray-300 transition-colors h-[78px] min-w-[150px]"
          >
            <ArrowLeft size={32} />
            <span>Back</span>
          </button>

          <button
            onClick={handleContinue}
            disabled={isConfirming}
            className="flex items-center gap-[14.3px] bg-[#ff8b36] text-white px-[32px] py-[17px] rounded-[14.3px] font-inter font-semibold text-[24px] leading-[42px] hover:bg-orange-600 transition-colors h-[78px] min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>Continue</span>
                <ArrowLeft size={32} className="rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
