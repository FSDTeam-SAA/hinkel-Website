"use client";

import { useState, useMemo } from "react";
import StepIndicator from "@/components/step-indicator";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Lock,
  Check,
  X,
  AlertCircle,
  CheckCircle,
  FileText,
  Package,
  Gift,
} from "lucide-react";
import { useBookStore } from "@/features/book-creation/store/book-store";
import { usePricing } from "@/features/book-creation/hooks/usePricing";
import { useConfirmPayment } from "@/features/book-creation/hooks/usePayment";
import { DeliveryMethodCard } from "./delivery-mothod-card";
import { BookStore, OutputFormat, DeliveryType } from "../types";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { AuthModal } from "@/components/shared/AuthModal";
import { cn } from "@/lib/utils";
import { validateCoupon } from "@/features/dashboard/api/coupon.api";
import { Coupon } from "@/features/dashboard/types/coupon.types";
import { savePaymentContext } from "../utils/payment-context";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PageOption {
  count: number;
  price: number;
  popular?: boolean;
}

interface DeliveryMethod {
  id: OutputFormat;
  apiType: DeliveryType;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  popular?: boolean;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function BookSpineIcon({
  pages,
  selected,
}: {
  pages: number;
  selected: boolean;
}) {
  const lineCount = Math.min(4, Math.floor(pages / 10));
  const lineWidths = [16, 12, 14, 10];
  return (
    <div className="relative w-9 h-10">
      {/* Spine */}
      <div
        className={cn(
          "absolute left-0 top-0.5 w-[7px] h-9 rounded-l-sm transition-colors",
          selected ? "bg-[#e07b2a]" : "bg-[#c8c5bb]",
        )}
      />
      {/* Cover */}
      <div
        className={cn(
          "absolute left-[7px] top-0 w-7 h-[38px] rounded-r-sm border-[1.5px] transition-colors",
          selected
            ? "bg-[#fdf4eb] border-[#e07b2a]"
            : "bg-[#f1efe8] border-[#c8c5bb]",
        )}
      />
      {/* Lines */}
      <div className="absolute left-[11px] top-2 flex flex-col gap-1">
        {Array.from({ length: lineCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-[1.5px] rounded transition-colors",
              selected ? "bg-[#e07b2a]" : "bg-[#c8c5bb]",
            )}
            style={{ width: lineWidths[i] }}
          />
        ))}
      </div>
    </div>
  );
}

function PageTile({
  option,
  selected,
  disabled,
  onSelect,
}: {
  option: PageOption;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "relative flex flex-col items-center gap-1.5 rounded-xl pt-5 pb-3.5 px-2 border transition-all",
        selected
          ? "border-2 border-[#e07b2a] bg-[#fdf4eb]"
          : "border border-[#e5e3dc] bg-white hover:border-[#b8b5ac] hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {option.popular && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#e07b2a] text-white text-[10px] font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
          Most popular
        </span>
      )}
      <BookSpineIcon pages={option.count} selected={selected} />
      <span
        className={cn(
          "text-lg font-medium leading-none transition-colors",
          selected ? "text-[#e07b2a]" : "text-gray-800",
        )}
      >
        {option.count}
      </span>
      <span className="text-[11px] text-gray-400">pages</span>
    </button>
  );
}

function DeliveryCard({
  method,
  selected,
  price,
  disabled,
  onSelect,
}: {
  method: DeliveryMethod;
  selected: boolean;
  price: number;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      disabled={disabled}
      className={cn(
        "w-full flex items-center gap-3.5 rounded-xl px-4 py-3.5 border text-left transition-all",
        selected
          ? "border-2 border-[#e07b2a] bg-[#fdf4eb]"
          : "border border-[#e5e3dc] bg-white hover:border-[#b8b5ac] hover:bg-gray-50",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {/* Radio dot */}
      <div
        className={cn(
          "shrink-0 w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center transition-colors",
          selected ? "border-[#e07b2a] bg-[#e07b2a]" : "border-gray-300",
        )}
      >
        {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>

      {/* Icon */}
      <div
        className={cn(
          "shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
          selected
            ? "bg-[#fde8cc] text-[#e07b2a]"
            : "bg-gray-100 text-gray-400",
        )}
      >
        {method.icon}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-gray-900">
            {method.title}
          </span>
          {method.popular && (
            <span className="text-[10px] font-medium bg-[#fde8cc] text-[#9b5210] px-2 py-0.5 rounded-full">
              Most Popular
            </span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">{method.subtitle}</p>
      </div>

      {/* Price */}
      <span className="shrink-0 text-[15px] font-medium text-gray-800">
        ${price.toFixed(2)}
      </span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookSetupFormatPage() {
  const setStep = useBookStore((state: BookStore) => state.setStep);
  const setPendingPageCount = useBookStore(
    (state: BookStore) => state.setPendingPageCount,
  );
  const setOutputFormat = useBookStore(
    (state: BookStore) => state.setOutputFormat,
  );
  const setOrderId = useBookStore((state: BookStore) => state.setOrderId);
  const setPendingCheckoutIntent = useBookStore(
    (state: BookStore) => state.setPendingCheckoutIntent,
  );
  const setPendingResumeStep = useBookStore(
    (state: BookStore) => state.setPendingResumeStep,
  );
  const { pageCount, outputFormat, bookType, hasPaid } = useBookStore();
  const { data: session } = useSession();

  const { prices, loading: pricingLoading } = usePricing();
  const { confirmPayment, isLoading: isConfirming } = useConfirmPayment();

  const [selectedPages, setSelectedPages] = useState(pageCount || 20);
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>(
    outputFormat || "pdf",
  );
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  const steps = ["Setup & Pay", "Cover", "Dedication", "Pages", "Review"];

  const handleStepClick = (index: number) => {
    switch (index) {
      case 0:
        break;
    }
  };

  const deliveryTypeMap = useMemo<Record<OutputFormat, DeliveryType>>(
    () => ({
      pdf: "digital",
      printed: "print",
      "pdf&printed": "print&digital",
    }),
    [],
  );

  const pageOptions = useMemo<PageOption[]>(() => {
    const currentType = deliveryTypeMap[selectedFormat];
    const methodPricing = prices?.find((p) => p.deliveryType === currentType);
    if (!methodPricing) return [];
    return methodPricing.pageTiers
      .sort((a, b) => a.pageLimit - b.pageLimit)
      .map((tier, index, arr) => ({
        count: tier.pageLimit,
        price: tier.price,
        popular: index === Math.floor(arr.length / 2),
      }));
  }, [prices, selectedFormat, deliveryTypeMap]);

  const deliveryMethods = useMemo<DeliveryMethod[]>(
    () => [
      {
        id: "pdf",
        apiType: "digital",
        title: "Digital PDF",
        subtitle: "Emailed to you within minutes",
        icon: <FileText size={18} />,
      },
      {
        id: "printed",
        apiType: "print",
        title: "Printed book",
        subtitle: "Ships to your door in 5–7 days",
        icon: <Package size={18} />,
      },
      {
        id: "pdf&printed",
        apiType: "print&digital",
        title: "PDF + printed book",
        subtitle: "Best of both — email and mail",
        icon: <Gift size={18} />,
        popular: true,
      },
    ],
    [],
  );

  const handleFormatSelect = (format: OutputFormat) => {
    if (hasPaid) return;
    setSelectedFormat(format);
    const currentType = deliveryTypeMap[format];
    const methodPricing = prices?.find((p) => p.deliveryType === currentType);
    if (methodPricing && methodPricing.pageTiers.length > 0) {
      const tiers = [...methodPricing.pageTiers].sort(
        (a, b) => a.pageLimit - b.pageLimit,
      );
      const isValid = tiers.some((t) => t.pageLimit === selectedPages);
      if (!isValid) setSelectedPages(tiers[0].pageLimit);
    }
  };

  // ── Derived pricing ──────────────────────────────────────────────────────────

  const getPriceForMethod = (format: OutputFormat): number => {
    const type = deliveryTypeMap[format];
    const methodPricing = prices?.find((p) => p.deliveryType === type);
    const tier = methodPricing?.pageTiers.find(
      (t) => t.pageLimit === selectedPages,
    );
    return tier?.price ?? 0;
  };

  const basePrice = getPriceForMethod(selectedFormat);

  const discountAmount = appliedCoupon
    ? appliedCoupon.discountType === "flat"
      ? appliedCoupon.discountAmount
      : (basePrice * appliedCoupon.discountAmount) / 100
    : 0;

  const totalPrice = Math.max(0, basePrice - discountAmount);

  // ── Coupon handlers ──────────────────────────────────────────────────────────

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError("");
    try {
      const response = await validateCoupon(couponCode);
      if (response.success && response.data) {
        setAppliedCoupon(response.data);
        toast.success("Coupon applied!");
      } else {
        setCouponError("That code isn't valid. Please try another.");
        setAppliedCoupon(null);
      }
    } catch (err: unknown) {
      const errorMsg =
        err && typeof err === "object" && "response" in err
          ? (err as { response: { data: { message: string } } }).response?.data
              ?.message
          : err instanceof Error
            ? err.message
            : "That code isn't valid.";
      setCouponError(errorMsg || "That code isn't valid.");
      setAppliedCoupon(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // ── Continue / back ──────────────────────────────────────────────────────────

  const handleContinue = async () => {
    if (!session?.user?.id) {
      setIsAuthModalOpen(true);
      return;
    }

    if (hasPaid) {
      setStep("cover");
      return;
    }

    try {
      const response = await confirmPayment({
        pageCount: selectedPages,
        deliveryType: deliveryTypeMap[selectedFormat],
        userId: session.user.id,
        bookType,
        couponCode: appliedCoupon?.codeName,
      });

      if (response.success && response.sessionUrl) {
        setPendingPageCount(selectedPages);
        setOutputFormat(selectedFormat);
        setOrderId(response.orderId);
        setPendingCheckoutIntent("initial_checkout");
        setPendingResumeStep("cover");
        savePaymentContext({
          orderId: response.orderId,
          pageCount: selectedPages,
          outputFormat: selectedFormat,
          checkoutIntent: "initial_checkout",
          resumeStep: "cover",
        });
        window.location.href = response.sessionUrl;
      } else {
        toast.error("Failed to create payment session");
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong during payment";
      toast.error(errorMessage);
    }
  };

  const handleBack = () => setStep("free-generation");

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <StepIndicator
        steps={steps}
        currentStep={1}
        onStepClick={handleStepClick}
      />

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-1">
            Step 1 of 5
          </p>
          <h1 className="text-2xl font-medium text-gray-900">
            Build your package
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Every choice updates your price summary on the right.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          {/* ── Left: configuration ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-5">
            {/* Page count */}
            <div className="bg-white rounded-2xl border border-[#e5e3dc] p-6">
              <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-4">
                How thick should your book be?
              </p>

              {pricingLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="w-8 h-8 animate-spin text-[#e07b2a]" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {pageOptions.map((option) => (
                    <PageTile
                      key={option.count}
                      option={option}
                      selected={selectedPages === option.count}
                      disabled={hasPaid}
                      onSelect={() =>
                        !hasPaid && setSelectedPages(option.count)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Delivery method */}
            <div className="bg-white rounded-2xl border border-[#e5e3dc] p-6">
              <p className="text-[11px] font-medium tracking-widest uppercase text-gray-400 mb-4">
                How would you like it delivered?
              </p>

              {pricingLoading ? (
                <div className="flex justify-center items-center h-24">
                  <Loader2 className="w-8 h-8 animate-spin text-[#e07b2a]" />
                </div>
              ) : (
                <div className="space-y-2.5">
                  {deliveryMethods.map((method) => (
                    <DeliveryCard
                      key={method.id}
                      method={method}
                      selected={selectedFormat === method.id}
                      price={getPriceForMethod(method.id)}
                      disabled={hasPaid}
                      onSelect={() => handleFormatSelect(method.id)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Back button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              <ArrowLeft size={15} />
              Back
            </button>
          </div>

          {/* ── Right: order summary ─────────────────────────────────────── */}
          <div className="w-full xl:w-[300px] shrink-0 xl:sticky xl:top-6">
            <div className="bg-white rounded-2xl border border-[#e5e3dc] p-6">
              <p className="text-sm font-medium text-gray-900 pb-4 border-b border-[#f0ede6]">
                Order summary
              </p>

              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Pages</span>
                  <span className="font-medium text-gray-800">
                    {selectedPages} pages
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Delivery</span>
                  <span className="font-medium text-gray-800 text-right max-w-[160px]">
                    {deliveryMethods.find((m) => m.id === selectedFormat)
                      ?.title ?? "—"}
                  </span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Discount</span>
                    <span className="font-medium text-green-600">
                      −${discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Coupon */}
              <div className="mt-4 pt-4 border-t border-[#f0ede6]">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      placeholder="Coupon code"
                      disabled={!!appliedCoupon || isValidatingCoupon}
                      className={cn(
                        "w-full h-9 px-3 rounded-lg border text-xs font-medium tracking-wider placeholder:tracking-normal placeholder:font-normal transition-all focus:outline-none",
                        appliedCoupon
                          ? "border-green-200 bg-green-50 text-green-700"
                          : couponError
                            ? "border-red-200 bg-red-50 text-red-600"
                            : "border-[#e5e3dc] focus:border-[#e07b2a]",
                      )}
                    />
                    {appliedCoupon && (
                      <CheckCircle
                        size={13}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-green-600"
                      />
                    )}
                  </div>

                  {!appliedCoupon ? (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={!couponCode.trim() || isValidatingCoupon}
                      className="h-9 px-4 rounded-lg bg-gray-900 text-white text-xs font-medium hover:bg-gray-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      {isValidatingCoupon ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleRemoveCoupon}
                      className="h-9 px-2.5 rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {couponError && (
                  <p className="flex items-center gap-1.5 text-red-500 text-[11px] mt-2">
                    <AlertCircle size={11} />
                    {couponError}
                  </p>
                )}
                {appliedCoupon && (
                  <p className="flex items-center gap-1.5 text-green-600 text-[11px] mt-2 font-medium">
                    <Check size={11} />
                    {appliedCoupon.discountType === "flat"
                      ? `$${appliedCoupon.discountAmount} off applied`
                      : `${appliedCoupon.discountAmount}% off applied`}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-[#f0ede6] flex justify-between items-baseline">
                <span className="text-sm font-medium text-gray-700">Total</span>
                <span className="text-2xl font-medium text-[#e07b2a]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              {/* CTA */}
              <button
                onClick={handleContinue}
                disabled={isConfirming || pricingLoading}
                className="mt-5 w-full h-11 rounded-xl bg-[#e07b2a] text-white text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#c96d22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConfirming ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing…
                  </>
                ) : (
                  <>
                    Continue to cover
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 mt-3 text-[11px] text-gray-400">
                <Lock size={11} />
                Secure checkout via Stripe
              </p>
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        redirectUrl="/create-book"
      />
    </div>
  );
}
