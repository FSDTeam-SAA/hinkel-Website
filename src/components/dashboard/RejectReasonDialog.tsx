"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Order } from "@/features/dashboard/hooks/useAllOrders";

type RejectReasonDialogProps = {
  isOpen: boolean;
  order: Order | null;
  reason: string;
  isSubmitting?: boolean;
  onReasonChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export default function RejectReasonDialog({
  isOpen,
  order,
  reason,
  isSubmitting = false,
  onReasonChange,
  onClose,
  onConfirm,
}: RejectReasonDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>Reject Book</DialogTitle>
          <DialogDescription>
            Add a short reason for rejecting this book. The user will receive
            this message in their rejection email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {order && (
            <div className="rounded-lg border border-orange-100 bg-orange-50 px-4 py-3 text-sm">
              <p className="font-semibold text-gray-900">
                {order.title || "Untitled Book"}
              </p>
              <p className="text-gray-600">Order ID: {order._id}</p>
              <p className="text-gray-600">
                Customer: {order.userId?.email || "No email provided"}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="rejection-reason"
              className="text-sm font-medium text-gray-900"
            >
              Rejection reason
            </label>
            <Textarea
              id="rejection-reason"
              value={reason}
              onChange={(event) => onReasonChange(event.target.value)}
              placeholder="Explain why the book was rejected..."
              className="min-h-28 resize-none"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => void onConfirm()}
            disabled={isSubmitting || !reason.trim()}
          >
            Confirm Rejection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
