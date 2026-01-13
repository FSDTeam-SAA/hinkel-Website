"use client";

import { useState } from "react";
import StepIndicator from "@/components/step-indicator";
import { Download, Package, Gift } from "lucide-react";

interface PricingPageProps {
  onContinue: (
    title: string,
    pages: number,
    method: "pdf" | "printed" | "both",
  ) => void;
  onBack: () => void;
}

export default function PricingPage({ onContinue, onBack }: PricingPageProps) {
  const [title, setTitle] = useState("My Amazing Coloring Book");
  const [pageCount, setPageCount] = useState(20);
  const [deliveryMethod, setDeliveryMethod] = useState<
    "pdf" | "printed" | "both"
  >("both");

  const steps = [
    "Book Setup",
    "Cover & Preview",
    "Checkout",
    "Complete Book",
    "Review",
  ];

  const pageCounts = [
    { count: 10, label: "10\nPage" },
    { count: 20, label: "20\nPage", popular: true },
    { count: 30, label: "30\nPage" },
    { count: 40, label: "40\nPage" },
  ];

  const deliveryMethods = [
    {
      id: "pdf",
      title: "Digital PDF",
      subtitle: "Instant download",
      price: "$24.22",
      icon: Download,
    },
    {
      id: "printed",
      title: "Printed Book",
      subtitle: "Physical delivery",
      price: "$24.22",
      icon: Package,
    },
    {
      id: "both",
      title: "Digital PDF & Printed Book",
      subtitle: "Delivered to you",
      price: "$24.22",
      icon: Gift,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StepIndicator steps={steps} currentStep={1} />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl p-8 md:p-12 border border-border">
            {/* Book Title */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Book Title
              </h2>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-border bg-white text-foreground placeholder-muted-foreground"
              />
            </div>

            {/* Page Count */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Choose Your Package
              </h2>

              <h3 className="text-lg font-semibold text-foreground mb-4">
                Number of Pages
              </h3>
              <div className="grid grid-cols-4 gap-4">
                {pageCounts.map((option) => (
                  <button
                    key={option.count}
                    onClick={() => setPageCount(option.count)}
                    className={`relative p-6 rounded-lg border-2 transition-colors ${
                      pageCount === option.count
                        ? "border-primary bg-white"
                        : "border-border bg-white hover:border-primary/50"
                    }`}
                  >
                    <div className="text-3xl font-bold text-foreground mb-2">
                      {option.count}
                    </div>
                    <div className="text-sm font-medium text-foreground whitespace-pre-line">
                      {option.label}
                    </div>
                    {option.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Method */}
            <div className="mb-12">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Delivery Method
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {deliveryMethods.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() =>
                        setDeliveryMethod(
                          method.id as "pdf" | "printed" | "both",
                        )
                      }
                      className={`p-6 rounded-lg border-2 transition-colors text-center ${
                        deliveryMethod === method.id
                          ? "border-primary bg-white"
                          : "border-border bg-white hover:border-primary/50"
                      }`}
                    >
                      <Icon className="w-12 h-12 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold text-foreground text-sm mb-1">
                        {method.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">
                        {method.subtitle}
                      </p>
                      <p className="text-lg font-bold text-primary">
                        {method.price}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground hover:bg-muted transition-colors font-medium"
              >
                ← Back
              </button>
              <button
                onClick={() => onContinue(title, pageCount, deliveryMethod)}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
