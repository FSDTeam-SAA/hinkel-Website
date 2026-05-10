"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
}: StepIndicatorProps) {
  return (
    <div className="sticky top-0 z-20 w-full border-b border-stone-200/70 bg-[linear-gradient(180deg,rgba(255,252,247,0.96),rgba(255,255,255,0.9))] px-3 py-4 backdrop-blur-xl md:px-4 md:py-5">
      <div className="mx-auto max-w-6xl">
        <div className="overflow-x-auto pb-1">
          <div className="relative mx-auto flex min-w-max items-start justify-between gap-3 px-1 sm:gap-4 md:min-w-0">
            <div className="absolute left-10 right-10 top-5 hidden h-px bg-stone-200 md:block" />
            <div
              className="absolute left-10 top-5 hidden h-px bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-300 ease-out md:block"
              style={{
                width: `calc((100% - 5rem) * ${currentStep / (steps.length - 1)})`,
              }}
            />

            {steps.map((step, index) => {
              const isCompleted = index < currentStep;
              const isCurrent = index === currentStep;
              const isActive = isCompleted || isCurrent;
              const isClickable = onStepClick && index <= currentStep;

              return (
                <div
                  key={index}
                  className={cn(
                    "relative flex min-w-[84px] flex-col items-center gap-2 text-center sm:min-w-[104px] md:min-w-[120px]",
                    isClickable && "cursor-pointer",
                  )}
                  onClick={() => {
                    if (isClickable && onStepClick) {
                      onStepClick(index);
                    }
                  }}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl border text-sm font-black shadow-sm transition-all duration-300 md:h-12 md:w-12 md:rounded-full md:text-base",
                      isCompleted
                        ? "border-orange-500 bg-orange-500 text-white shadow-orange-200"
                        : isCurrent
                          ? "border-orange-500 bg-white text-orange-600 ring-4 ring-orange-100 shadow-lg shadow-orange-100"
                          : "border-stone-200 bg-white/95 text-stone-400",
                    )}
                  >
                    {isCompleted ? (
                      <Check
                        className="h-4 w-4 md:h-5 md:w-5"
                        strokeWidth={3}
                      />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>

                  <div
                    className={cn(
                      "rounded-2xl px-2 py-1.5 transition-all duration-300 md:px-0 md:py-0",
                      isCurrent &&
                        "bg-white/90 shadow-sm md:bg-transparent md:shadow-none",
                    )}
                  >
                    <span
                      className={cn(
                        "block text-[9px] font-bold uppercase tracking-[0.22em] md:text-[10px]",
                        isCurrent ? "text-orange-600" : "text-stone-400",
                      )}
                    >
                      Step {index + 1}
                    </span>
                    <span
                      className={cn(
                        "mt-1 block text-[11px] font-semibold leading-tight md:text-sm",
                        isActive ? "text-stone-900" : "text-stone-400",
                      )}
                    >
                      {step}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
