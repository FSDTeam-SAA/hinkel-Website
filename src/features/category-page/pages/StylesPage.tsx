"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Stars } from "lucide-react";
import { CategoryContent } from "@/features/category-page/types";
import { StyleConfig } from "@/features/dashboard/types/style.types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import PlainTextContent from "@/components/shared/PlainTextContent";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 30,
      stiffness: 120,
      duration: 0.7,
    },
  },
};

interface StylesPageProps {
  categories: CategoryContent[];
  style?: StyleConfig;
}

const DEFAULT_STYLE = {
  title: "Unlock Your Creative Vision",
  subtitle:
    "Explore our curated collection of sketch styles. Each one is designed to transform your photos into a unique, printable coloring book experience.",
  badgeText: "Curated Collection",
};

export default function StylesPage({
  categories,
  style = DEFAULT_STYLE,
}: StylesPageProps) {
  if (categories.length === 0) {
    return <StylesSkeleton />;
  }

  const displayedCategories = categories.filter(
    (c: CategoryContent) => c.type?.toLowerCase() !== "home",
  );

  return (
    <div className="min-h-screen bg-neutral-50 selection:bg-primary/20">
      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[30%] -left-[10%] w-[60%] h-[70%] bg-primary/[0.03] rounded-full blur-[120px]" />
          <div className="absolute -bottom-[20%] -right-[5%] w-[50%] h-[50%] bg-blue-500/[0.03] rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-neutral-200/80 text-primary font-semibold text-[11px] sm:text-xs uppercase tracking-widest mb-6 sm:mb-10"
            >
              <Stars className="w-3.5 h-3.5 fill-current" />
              <span>{style.badgeText}</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-neutral-900 mb-6 sm:mb-10 tracking-tight leading-[1.08] sm:leading-[1.05]">
              {style.title.split(" ").slice(0, -2).join(" ")}{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8c42] relative inline-block">
                {style.title.split(" ").slice(-2).join(" ")}
                <svg
                  className="absolute -bottom-1 sm:-bottom-3 left-0 w-full"
                  height="10"
                  viewBox="0 0 100 8"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 7C20 7 30 1 50 1C70 1 80 7 100 7"
                    stroke="url(#paint0_linear)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear"
                      x1="0"
                      y1="0"
                      x2="100"
                      y2="0"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#f46b31" />
                      <stop offset="1" stopColor="#ff8c42" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-neutral-500 leading-relaxed max-w-2xl mx-auto font-medium mb-8 sm:mb-12 px-2 sm:px-0">
              {style.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="flex flex-col gap-16 sm:gap-24 md:gap-32"
        >
          {displayedCategories.map((category, index) => (
            <StyleCard key={category._id} category={category} index={index} />
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 sm:px-6 pb-16 sm:pb-24">
        <div className="bg-neutral-900 rounded-3xl sm:rounded-[3rem] p-8 sm:p-12 md:p-20 lg:p-32 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-[50%] -left-[20%] w-full h-full bg-primary rounded-full blur-[150px]" />
            <div className="absolute -bottom-[50%] -right-[20%] w-full h-full bg-blue-500 rounded-full blur-[150px]" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              Ready to create your masterpiece?
            </h2>
            <p className="text-neutral-400 text-lg sm:text-xl md:text-2xl font-medium max-w-xl mx-auto">
              Join thousands of creators who&apos;ve turned their favorite
              moments into timeless sketch and coloring books
            </p>
            <div className="pt-4 sm:pt-8">
              <Link href="/create-book">
                <Button className="bg-primary hover:bg-[#ff8c42] text-white h-14 sm:h-16 md:h-20 px-8 sm:px-12 md:px-16 rounded-2xl sm:rounded-3xl font-black text-base sm:text-lg md:text-xl transition-all shadow-[0_12px_40px_rgba(244,107,49,0.3)] hover:shadow-[0_16px_60px_rgba(244,107,49,0.5)] hover:-translate-y-0.5 active:translate-y-0 uppercase tracking-widest border-2 sm:border-4 border-white/10 w-full sm:w-auto">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StyleCard({
  category,
  index,
}: {
  category: CategoryContent;
  index: number;
}) {
  const [activeImage, setActiveImage] = React.useState(
    category.image || "/no-image.jpg",
  );

  const allImages = React.useMemo(() => {
    const primaryImage = category.image ? [category.image] : [];
    const galleryImages = category.gallery ?? [];
    return [...primaryImage, ...galleryImages];
  }, [category.image, category.gallery]);

  const isReversed = index % 2 === 1;

  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        "group relative flex flex-col md:flex-row items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20",
        isReversed && "md:flex-row-reverse",
      )}
    >
      {/* Image Section */}
      <div className="w-full md:w-1/2 relative space-y-4 sm:space-y-6">
        {/* Decorative Number */}
        <div
          className={cn(
            "absolute -top-8 sm:-top-12 md:-top-16 text-[6rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] font-black text-neutral-100 -z-10 select-none leading-none opacity-40 group-hover:text-primary/[0.06] transition-colors duration-700 pointer-events-none",
            isReversed
              ? "left-0 sm:left-4 md:-left-12 lg:-left-16"
              : "right-0 sm:right-4 md:-right-12 lg:-right-16",
          )}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <div className="relative aspect-[4/5] sm:aspect-[3/4] md:aspect-video w-full max-w-lg mx-auto md:mx-0">
          {/* Shadow */}
          <div className="absolute -bottom-6 sm:-bottom-10 left-1/2 -translate-x-1/2 w-[75%] sm:w-[80%] h-[15%] sm:h-[20%] bg-black/15 blur-[40px] sm:blur-[60px] opacity-0 group-hover:opacity-50 transition-opacity duration-700" />

          <div className="relative w-full h-full rounded-2xl sm:rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-xl sm:shadow-2xl border-2 sm:border-4 border-white/60 bg-white">
            <motion.div
              key={activeImage}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full"
            >
              <Image
                src={activeImage}
                alt={category.title}
                fill
                className="object-cover"
                quality={50}
                loading={index < 2 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                placeholder="empty"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/[0.08] group-hover:bg-black/[0.04] transition-colors duration-700 pointer-events-none" />
          </div>

          {/* Floating Badge */}
          <div
            className={cn(
              "absolute top-4 sm:top-6 md:top-8 z-10",
              isReversed ? "right-4 sm:right-6" : "left-4 sm:left-6",
            )}
          >
            <span className="px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md shadow-lg text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary">
              {category.type}
            </span>
          </div>
        </div>

        {/* Gallery Thumbnails */}
        {allImages.length > 1 && (
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 sm:pb-4 scrollbar-hide mask-fade-right px-1">
            {allImages.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative w-20 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/30",
                  activeImage === img
                    ? "border-primary ring-2 ring-primary/20 scale-105 shadow-lg"
                    : "border-transparent opacity-60 hover:opacity-100 hover:scale-105",
                )}
              >
                <Image
                  src={img}
                  alt={`${category.title} gallery ${i + 1}`}
                  fill
                  className="object-cover"
                  quality={30}
                  loading="lazy"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Text Section */}
      <div
        className={cn(
          "w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left space-y-5 sm:space-y-8 md:sticky md:top-24 lg:top-32",
          isReversed ? "md:items-end md:text-right" : "",
        )}
      >
        <div className={cn("max-w-xl", isReversed && "md:ml-auto")}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 mb-3 sm:mb-6 tracking-tight leading-tight">
            {category.title}
          </h2>
          <PlainTextContent
            content={
              category.subtitle ||
              "Transform your photos into this distinctive artistic style. Perfect for creating memorable coloring pages with high-quality lines and details."
            }
            className="text-neutral-500 font-medium leading-relaxed text-sm sm:text-base md:text-lg"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto pt-2 sm:pt-4">
          <Link
            href={`/create-book?type=${category.type}`}
            className="w-full sm:w-auto relative group/link"
          >
            <Button className="w-full sm:w-auto relative overflow-hidden bg-neutral-900 hover:bg-neutral-800 text-white h-12 sm:h-14 px-6 sm:px-10 rounded-xl sm:rounded-2xl font-black shadow-lg hover:shadow-xl hover:shadow-primary/20 active:scale-[0.98] transition-all duration-300 text-sm uppercase tracking-wider group/btn">
              {/* Subtle gradient overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out" />

              {/* Button content */}
              <span className="relative flex items-center justify-center">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1.5 transition-transform duration-300 ease-out" />
              </span>
            </Button>

            {/* Optional: External glow effect on hover */}
            <span className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-primary/40 rounded-2xl blur-xl opacity-0 group-hover/link:opacity-100 transition-opacity duration-500 -z-10" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function StylesSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <section className="pt-20 sm:pt-32 pb-16 sm:pb-24 text-center">
        <div className="container mx-auto px-4 sm:px-6">
          <Skeleton className="h-28 sm:h-40 w-full sm:w-3/4 mx-auto rounded-2xl sm:rounded-3xl mb-6 sm:mb-8 opacity-50" />
          <Skeleton className="h-6 sm:h-8 w-2/3 sm:w-1/2 mx-auto rounded-xl opacity-30" />
        </div>
      </section>

      <section className="container mx-auto px-4 sm:px-6 pb-20 sm:pb-32">
        <div className="space-y-24 sm:space-y-32 md:space-y-40">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col md:flex-row gap-10 sm:gap-16 md:gap-20 items-center",
                i % 2 === 0 ? "md:flex-row-reverse" : "",
              )}
            >
              <div className="w-full md:w-1/2">
                <Skeleton className="aspect-[4/5] sm:aspect-video w-full rounded-2xl sm:rounded-[2.5rem]" />
              </div>
              <div className="w-full md:w-1/2 space-y-4 sm:space-y-8">
                <Skeleton className="h-12 sm:h-16 w-3/4 rounded-xl sm:rounded-2xl" />
                <Skeleton className="h-24 sm:h-32 w-full rounded-xl sm:rounded-2xl" />
                <div className="flex gap-3 sm:gap-4">
                  <Skeleton className="h-12 sm:h-14 w-full sm:w-40 rounded-xl sm:rounded-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
