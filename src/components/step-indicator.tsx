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
    <div className="w-full py-6 md:py-8 px-4 bg-white/50 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex justify-between items-center w-full">
          {/* Progress Bar Background */}
          <div className="absolute top-[14px] md:top-5 left-0 w-full h-1 bg-gray-100 rounded-full -z-10" />

          {/* Active Progress Bar */}
          <div
            className="absolute top-[14px] md:top-5 left-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full -z-10 transition-all duration-300 ease-out"
            style={{
              width: `${(currentStep / (steps.length - 1)) * 100}%`,
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
                  "flex flex-col items-center group relative",
                  isClickable && "cursor-pointer",
                )}
                onClick={() => {
                  if (isClickable && onStepClick) {
                    onStepClick(index);
                  }
                }}
              >
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-8 h-8 md:w-12 md:h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-300 shadow-sm relative bg-white",
                    isCompleted
                      ? "border-orange-500 bg-orange-500 text-white scale-100"
                      : isCurrent
                        ? "border-orange-500 text-orange-600 bg-white scale-110 shadow-orange-200 shadow-lg ring-4 ring-orange-100"
                        : "border-gray-200 text-gray-300 bg-white",
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4 md:w-6 md:h-6" strokeWidth={3} />
                  ) : (
                    <span className="text-sm md:text-lg font-black font-mono">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Label */}
                <div
                  className={cn(
                    "absolute top-10 md:top-14 text-center min-w-[80px] transition-all duration-300",
                    isCurrent
                      ? "translate-y-0 opacity-100 scale-100"
                      : "translate-y-1 opacity-100 scale-95",
                    !isCurrent && "hidden md:block",
                  )}
                >
                  <span
                    className={cn(
                      "text-[9px] md:text-[10px] font-bold uppercase tracking-wider block",
                      isCurrent ? "text-orange-600" : "text-gray-400",
                    )}
                  >
                    Step {index + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] md:text-sm font-bold block mt-0.5 whitespace-nowrap",
                      isActive ? "text-gray-900" : "text-gray-400",
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
  );
}
