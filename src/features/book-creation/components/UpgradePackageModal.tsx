"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookStore } from "../store/book-store";
import { useCalculateAdjustment } from "../hooks/usePricing";
import { useConfirmAdjustmentPayment } from "../hooks/usePayment";
import { savePaymentContext } from "../utils/payment-context";
import { deliveryTypeFromOutputFormat } from "../utils/step-flow";
import { AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface UpgradePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradePackageModal({
  isOpen,
  onClose,
}: UpgradePackageModalProps) {
  const {
    orderId,
    outputFormat,
    pageCount,
    setPendingPageCount,
    setPendingCheckoutIntent,
    setPendingResumeStep,
  } = useBookStore();

  const currentDeliveryType = deliveryTypeFromOutputFormat(outputFormat);
  const targetDeliveryType = "print&digital";

  const { response: adjustmentData, isLoading: isCalculating } =
    useCalculateAdjustment(
      orderId &&
        currentDeliveryType &&
        currentDeliveryType !== targetDeliveryType
        ? {
            orderId,
            targetDeliveryType,
            targetPageCount: pageCount,
          }
        : null,
    );

  const { confirmAdjustmentPayment, isLoading: isConfirming } =
    useConfirmAdjustmentPayment();

  const handleUpgrade = async () => {
    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }

    try {
      const response = await confirmAdjustmentPayment({
        orderId,
        targetDeliveryType,
        targetPageCount: pageCount,
        checkoutIntent: "package_upgrade_checkout",
      });

      if (response.success && response.sessionUrl) {
        setPendingPageCount(pageCount);
        setPendingCheckoutIntent("package_upgrade_checkout");
        setPendingResumeStep("review");
        savePaymentContext({
          orderId,
          pageCount,
          outputFormat: "pdf&printed",
          checkoutIntent: "package_upgrade_checkout",
          resumeStep: "review",
        });
        window.location.href = response.sessionUrl;
        return;
      }

      toast.error("Failed to initiate upgrade payment");
    } catch (error) {
      console.error("Upgrade payment error:", error);
      toast.error("An error occurred while starting your package upgrade");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Upgrade Your Package
          </DialogTitle>
          <DialogDescription>
            Add the printed book option to your current order before you
            finalize it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div>
              <p className="text-sm text-gray-500">Current package</p>
              <p className="text-lg font-semibold text-gray-900">
                {outputFormat === "pdf" ? "Digital PDF" : "Printed Book"}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400" />
            <div className="text-right">
              <p className="text-sm text-gray-500">Upgraded package</p>
              <p className="text-lg font-semibold text-gray-900">
                PDF & Printed Book
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">
            <div className="mb-3 flex items-center gap-2 text-orange-800">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">Upgrade summary</span>
            </div>

            {isCalculating ? (
              <div className="flex items-center gap-2 text-orange-700">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Calculating your upgrade...</span>
              </div>
            ) : adjustmentData?.success ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-700">
                  <span>Already paid</span>
                  <span>
                    ${(adjustmentData.data.currentTotalCents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-gray-700">
                  <span>Upgraded total</span>
                  <span>
                    ${(adjustmentData.data.targetTotalCents / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-orange-200 pt-2">
                  <span className="font-semibold text-gray-900">
                    Additional amount due now
                  </span>
                  <Badge className="bg-orange-500 text-white hover:bg-orange-500">
                    ${(adjustmentData.data.deltaCents / 100).toFixed(2)}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="h-4 w-4" />
                <span className="text-xs">
                  This package upgrade is unavailable for the current order.
                </span>
              </div>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Coupons do not apply to late package upgrades. This charge only
            covers the difference between your current order and the upgraded
            package.
          </p>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleUpgrade}
            disabled={isConfirming || !adjustmentData?.success}
            className="rounded-xl bg-orange-500 hover:bg-orange-600"
          >
            {isConfirming ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {isConfirming ? "Processing..." : "Upgrade & Pay"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
