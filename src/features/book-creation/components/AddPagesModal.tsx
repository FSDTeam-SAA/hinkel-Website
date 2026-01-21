"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useBookStore } from "../store/book-store";
import { useCalculatePrice } from "../hooks/usePricing";
import { useConfirmPayment } from "../hooks/usePayment";
import { useSession } from "next-auth/react";
import { Loader2, Plus, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DeliveryType, OutputFormat } from "../types";

interface AddPagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPagesModal({ isOpen, onClose }: AddPagesModalProps) {
  const [extraCount, setExtraCount] = useState<number>(1);
  const { orderId, outputFormat, setPendingExtraPages } = useBookStore();
  const { data: session } = useSession();

  // Map output format to API delivery type
  const deliveryTypeMap: Record<OutputFormat, DeliveryType> = {
    pdf: "digital",
    printed: "print",
    "pdf&printed": "print&digital",
  };

  const deliveryType = outputFormat ? deliveryTypeMap[outputFormat] : "digital";

  const { response: pricingData, isLoading: isCalculating } = useCalculatePrice(
    {
      pageCount: extraCount,
      deliveryType,
    },
  );

  const { confirmPayment, isLoading: isConfirming } = useConfirmPayment();

  const handlePay = async () => {
    if (!session?.user?.id) {
      toast.error("Please login to continue");
      return;
    }

    if (!orderId) {
      toast.error("Order ID not found");
      return;
    }

    try {
      const response = await confirmPayment({
        userId: session.user.id,
        pageCount: extraCount,
        deliveryType,
        orderId: orderId,
      });

      if (response.success && response.sessionUrl) {
        setPendingExtraPages(extraCount);
        window.location.href = response.sessionUrl;
      } else {
        toast.error("Failed to initiate payment session");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("An error occurred while initiating payment");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[24px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add Extra Pages
          </DialogTitle>
          <DialogDescription>
            Need more space for your creativity? Add more pages to your coloring
            book.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="extra-pages" className="text-sm font-medium">
              Number of Additional Pages
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="extra-pages"
                type="number"
                min={1}
                value={extraCount}
                onChange={(e) => setExtraCount(parseInt(e.target.value) || 1)}
                className="text-lg h-12 rounded-xl"
              />
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 mt-2">
            <h4 className="text-sm font-semibold text-orange-800 mb-2">
              Cost Calculation
            </h4>
            {isCalculating ? (
              <div className="flex items-center gap-2 text-orange-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Calculating price...</span>
              </div>
            ) : pricingData?.success ? (
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {extraCount} pages @ {pricingData.data.pricePerPage} / page
                </span>
                <span className="text-xl font-bold text-orange-600">
                  ${pricingData.data.totalPrice}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-500">
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">Failed to fetch pricing</span>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-xl h-12 px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePay}
            disabled={isConfirming || !pricingData?.success || extraCount < 1}
            className="bg-orange-500 hover:bg-orange-600 h-12 px-8 rounded-xl font-semibold gap-2 min-w-[140px]"
          >
            {isConfirming ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {isConfirming ? "PROCESSING..." : "ADD & PAY"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
