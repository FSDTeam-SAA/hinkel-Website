"use client";

import {
  ArrowRight,
  BookOpenText,
  CheckCircle2,
  MailCheck,
  PackageCheck,
  Printer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookStore } from "@/features/book-creation/store/book-store";
import type { BookStore } from "@/features/book-creation/types";

export default function SuccessPage() {
  const resetBook = useBookStore((state: BookStore) => state.resetBook);
  const state = useBookStore();
  const { bookTitle, pageCount, outputFormat } = state;

  const deliveryMessage = () => {
    switch (outputFormat) {
      case "pdf":
        return "Your PDF coloring book has been created and will be delivered to your email shortly.";
      case "printed":
        return "Your print order has been confirmed. You will receive an email confirmation shortly.";
      case "pdf&printed":
        return "You will receive a confirmation email for your print order with the PDF file attached.";
      default:
        return "You should receive an email confirmation shortly.";
    }
  };

  const formatLabel =
    outputFormat === "pdf"
      ? "Digital PDF"
      : outputFormat === "printed"
        ? "Printed Book"
        : outputFormat === "pdf&printed"
          ? "Print & PDF"
          : "Book Order";

  const nextSteps =
    outputFormat === "pdf"
      ? [
          "Your completed PDF is being prepared for email delivery.",
          "Check your inbox for the download message shortly.",
        ]
      : outputFormat === "printed"
        ? [
            "Your print files are queued for production review.",
            "You will receive delivery updates by email.",
          ]
        : [
            "Your print order is queued for production review.",
            "Your digital copy will be delivered by email.",
          ];

  const handleCreateAnother = () => {
    resetBook();
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fffaf4_0%,#ffffff_38%,#f8fbff_100%)] px-4 py-10 md:py-14">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <div className="overflow-hidden rounded-[32px] border border-stone-200/80 bg-white shadow-[0_24px_70px_-44px_rgba(15,23,42,0.42)]">
          <div className="relative p-6 sm:p-8 md:p-10">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <Badge className="mb-5 border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-700 hover:bg-emerald-50">
                  Order Complete
                </Badge>

                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-black leading-tight text-stone-950 md:text-5xl">
                      Your book is in motion
                    </h1>
                    <p className="mt-2 text-base font-medium text-stone-600 md:text-lg">
                      {deliveryMessage()}
                    </p>
                  </div>
                </div>

                <div className="rounded-[24px] border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-semibold text-orange-800">
                  {bookTitle || "My Coloring Book"} has been submitted
                  successfully.
                </div>
              </div>

              <div className="w-full max-w-sm rounded-[28px] border border-stone-200 bg-[linear-gradient(135deg,#fffdf8_0%,#ffffff_54%,#f7fbff_100%)] p-5 shadow-sm">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-stone-400">
                      Summary
                    </p>
                    <h2 className="mt-1 text-xl font-black text-stone-950">
                      {formatLabel}
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    {outputFormat === "pdf" ? (
                      <MailCheck className="h-6 w-6" />
                    ) : (
                      <Printer className="h-6 w-6" />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                      Pages
                    </p>
                    <p className="mt-2 text-3xl font-black text-stone-950">
                      {pageCount}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-stone-200 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-stone-400">
                      Status
                    </p>
                    <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Confirmed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_0.85fr]">
          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <PackageCheck className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black text-stone-950">
                What happens next
              </h2>
            </div>

            <div className="space-y-3">
              {nextSteps.map((step, index) => (
                <div
                  key={step}
                  className="flex items-start gap-3 rounded-2xl border border-stone-100 bg-stone-50/70 p-4"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-primary shadow-sm">
                    {index + 1}
                  </div>
                  <p className="text-sm font-semibold leading-6 text-stone-700">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-stone-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-black text-stone-950">
                Ready for another?
              </h2>
            </div>

            <p className="mb-6 text-sm font-medium leading-6 text-stone-600">
              Start a fresh coloring book with a new cover, pages, and
              dedication.
            </p>

            <Button
              onClick={handleCreateAnother}
              className="h-14 w-full rounded-2xl bg-primary text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:scale-[1.01] hover:bg-primary/90"
            >
              <BookOpenText className="h-5 w-5" />
              Create Another Book
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
