"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CoverPageTestSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbf4ea]">
      {/* Step Indicator Skeleton */}
      <div className="w-full py-4 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto px-4 flex justify-between gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-2 flex-1 rounded-full" />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4 md:py-9 lg:px-[10%] xl:px-[15%]">
        <div className="flex flex-col gap-9 w-full max-w-7xl">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between w-full">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-10 w-64" />
            <div className="hidden md:block w-20" />
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8">
            {/* Left Column: Preview Skeleton */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center gap-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="w-64 h-80 rounded-2xl" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4 mx-auto" />
                </div>
              </div>
            </div>

            {/* Right Column: Gallery & Controls Skeleton */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="bg-white rounded-3xl shadow-sm p-8 flex flex-col gap-8">
                <div>
                  <Skeleton className="h-4 w-40 mb-6" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="aspect-square rounded-2xl" />
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Skeleton className="h-4 w-48 mb-4" />
                  <Skeleton className="h-16 w-full rounded-2xl" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col md:flex-row gap-4 w-full pt-4">
                  <Skeleton className="h-14 flex-1 rounded-2xl" />
                  <Skeleton className="h-14 flex-1 rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
