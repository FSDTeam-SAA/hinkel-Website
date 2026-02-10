"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useContent } from "@/features/category-page/hooks/use-content";
import HeroSkeleton from "@/features/category-page/components/hero.skeleton";
import { MoveRightIcon } from "lucide-react";
import { useDashboardStats } from "@/features/category-page/hooks/use-stats";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryStyles: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  home: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  sketch: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
  },
  "line art": {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
  },
  "oil painting": {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
  },
  watercolor: {
    bg: "bg-cyan-50",
    text: "text-cyan-600",
    border: "border-cyan-200",
  },
  portrait: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
  },
  nature: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
  },
};

function getCategoryStyle(type?: string) {
  const normalizedType = type?.toLowerCase() || "default";
  return (
    categoryStyles[normalizedType] || {
      bg: "bg-gray-50",
      text: "text-blue-600",
      border: "border-blue-200",
    }
  );
}

export function Hero({ type }: { type?: string }) {
  const { data, isLoading: isContentLoading, error } = useContent({ type });
  const { data: statsData, isLoading: isStatsLoading } = useDashboardStats();
  console.log(statsData);
  const heroContent = data?.data?.[0];
  const isLoading = isContentLoading || isStatsLoading;

  if (isLoading) {
    return <HeroSkeleton />;
  }

  if (error) {
    return (
      <div className="h-[600px] flex items-center justify-center text-red-500">
        Error loading content, Please try again later!!
      </div>
    );
  }
  console.log(heroContent);

  return (
    <section className="relative px-6 py-10 md:py-12 lg:px-12 bg-accent">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="space-y-6">
          {type?.toLowerCase() !== "home" && (
            <Badge
              variant="outline"
              className={cn(
                "text-base px-4 py-1.5 font-semibold uppercase tracking-wider rounded-full border-2 transition-all duration-300",
                getCategoryStyle(type || heroContent?.type).bg,
                getCategoryStyle(type || heroContent?.type).text,
                getCategoryStyle(type || heroContent?.type).border,
              )}
            >
              {type || heroContent?.type || "Explore"}
              {/* {type
              ?.split(" ")
              .filter((item: string) =>
                item.toLowerCase() !== "home" ? item : "",
              ) ||
              heroContent?.type ||
              "Explore"} */}
            </Badge>
          )}
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-secondary-foreground leading-tight">
            {heroContent?.title || "Turn Any Artwork Into Coloring Magic"}
          </h1>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
            {heroContent?.subtitle ||
              "Turn any photo or drawing into a clean coloring page with powerful AI technology, designed to capture every detail you love and transform it into creative outlines, ready for coloring, sharing, or printing instantly."}
          </p>
          <Link
            href={
              type
                ? `/create-book?type=${encodeURIComponent(type)}`
                : "/create-book"
            }
          >
            <Button
              size="lg"
              className="bg-primary text-white  px-8 h-12 text-base font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-[0.98]"
            >
              Start creating NOW!
              <MoveRightIcon />
            </Button>
          </Link>

          {/* <div className="flex flex-wrap gap-8 pt-2">
            <div className="flex gap-3 items-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {statsData?.totalUsersCount}+
              </span>
              <span className="text-xs font-semibold text-gray-500 leading-tight">
                Total
                <br />
                Users
              </span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="text-4xl font-bold text-primary-foreground">
                {statsData?.paidOrdersCount}+
              </span>
              <span className="text-xs font-semibold text-gray-500 leading-tight">
                Total
                <br />
                Book Created
              </span>
            </div>
          </div> */}
        </div>

        <div className="relative max-h-full">
          <div className="relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.15)] bg-white aspect-12/11">
            <Image
              src={heroContent?.image || "/images/heroImage.png"}
              alt={heroContent?.title || "Sketch transformation"}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-[radial-gradient(#FF7A3D_1px,transparent_1px)] bg-size-[16px_16px] opacity-20 -z-10" />
        </div>
      </div>
    </section>
  );
}
