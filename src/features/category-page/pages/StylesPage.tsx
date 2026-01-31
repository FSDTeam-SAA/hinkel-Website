"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { ArrowRight, Paintbrush, Stars, MousePointer2 } from "lucide-react";
import { useContent } from "@/features/category-page/hooks/use-content";
import { useStyles } from "@/features/dashboard/hooks/useStyle";
import { CategoryContent } from "@/features/category-page/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
    },
  },
};

export default function StylesPage() {
  const { data: contentData, isLoading: isContentLoading } = useContent({
    limit: 24,
  });
  const { data: styleData, isLoading: isStyleLoading } = useStyles();

  const categories = contentData?.data || [];
  const style = styleData?.data?.[0] || {
    title: "Unlock Your Creative Vision",
    subtitle:
      "Explore our curated collection of sketch styles. Each one is designed to transform your photos into a unique, printable coloring book experience.",
    badgeText: "Curated Collection 2026",
  };

  if (isContentLoading || isStyleLoading) {
    return <StylesSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary/20">
      {/* Premium Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[60%] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 text-primary font-bold text-xs uppercase tracking-widest mb-8"
            >
              <Stars className="w-3.5 h-3.5 fill-current" />
              <span>{style.badgeText}</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tight leading-[1.1]">
              {style.title.split(" ").slice(0, -2).join(" ")} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff8c42] relative">
                {style.title.split(" ").slice(-2).join(" ")}
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
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

            <p className="text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto font-medium">
              {style.subtitle}
            </p>

            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center justify-center gap-4 text-sm font-bold text-gray-400"
            >
              <span className="flex items-center gap-1.5">
                <Paintbrush className="w-4 h-4" /> Professional AI Styles
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1.5">
                <MousePointer2 className="w-4 h-4" /> Instant Preview
              </span>
            </motion.div> */}
          </motion.div>
        </div>
      </section>

      {/* Asymmetric Gallery Grid */}
      <section className="container mx-auto px-4 pb-32">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 lg:gap-16"
        >
          {categories
            .filter((c: CategoryContent) => c.type?.toLowerCase() !== "home")
            .map((category: CategoryContent, index: number) => (
              <motion.div
                key={category._id}
                variants={itemVariants}
                className={cn(
                  "group relative flex flex-col",
                  index % 3 === 1 ? "md:mt-12" : "", // Offset every middle column for asymmetric feel
                  index % 3 === 2 ? "md:mt-24" : "", // Offset last column more
                )}
              >
                {/* Card Container */}
                <div className="relative bg-white rounded-[3rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] group-hover:shadow-[0_20px_50px_rgba(244,107,49,0.12)] transition-all duration-700 border border-gray-100/50 flex flex-col h-full">
                  {/* Image Section */}
                  <div className="relative aspect-[3/4] overflow-hidden p-4">
                    <div className="relative w-full h-full rounded-[2rem] overflow-hidden shadow-inner bg-gray-50">
                      <Image
                        src={category.image || "/no-image.jpg"}
                        alt={category.title}
                        fill
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    {/* Category Type Badge */}
                    <div className="absolute top-8 left-8">
                      <span className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-sm text-[10px] font-black uppercase tracking-widest text-primary border border-primary/10">
                        {category.type}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 pt-2 flex flex-col flex-1">
                    <div className="mb-8">
                      <h3 className="text-3xl font-black text-gray-900 mb-3 tracking-tight group-hover:text-primary transition-colors">
                        {category.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed font-medium">
                        {category.subtitle ||
                          "Bring your imagination to life with this beautiful, hand-crafted sketch style designed for perfect coloring results."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-auto grid grid-cols-1 gap-4">
                      <Link
                        href={`/create-book?type=${category.type}`}
                        className="block"
                      >
                        <Button className="w-full bg-gray-900 hover:bg-primary text-white rounded-2xl py-7 font-black shadow-xl hover:shadow-primary/30 transition-all duration-500 uppercase tracking-wider text-sm">
                          Start Creating
                          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                      <Link
                        href={`/category/${category.type}`}
                        className="block"
                      >
                        <Button
                          variant="ghost"
                          className="w-full text-gray-900 hover:text-primary hover:bg-primary/5 rounded-2xl font-bold transition-all text-sm"
                        >
                          View Sample Pages
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Decorative Number for Gallery Feel */}
                <div className="absolute -top-6 -right-4 text-8xl font-black text-gray-100 -z-10 select-none opacity-50 group-hover:text-primary/10 transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </div>
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="bg-gray-900 rounded-[4rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-50%] left-[-20%] w-[100%] h-[100%] bg-primary rounded-full blur-[150px]" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              Ready to create your masterpiece?
            </h2>
            <p className="text-gray-400 text-lg mb-10 font-medium">
              Join thousands of creators who&apos;ve turned their favorite
              moments into timeless coloring books.
            </p>
            <Link href="/create-book">
              <Button className="bg-primary hover:bg-[#e66a33] text-white px-12 py-8 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-primary/40 uppercase tracking-widest">
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StylesSkeleton() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <section className="pt-24 pb-32">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-10 w-48 mx-auto mb-8 rounded-full" />
          <Skeleton className="h-20 w-3/4 mx-auto mb-8 rounded-2xl" />
          <Skeleton className="h-8 w-1/2 mx-auto rounded-xl" />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm",
                i === 1 ? "md:mt-12" : "",
                i === 2 ? "md:mt-24" : "",
              )}
            >
              <div className="p-4">
                <Skeleton className="aspect-[3/4] w-full rounded-[2rem]" />
              </div>
              <div className="p-8 pt-2 space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4 rounded-xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
                <div className="space-y-3 pt-4">
                  <Skeleton className="h-16 w-full rounded-2xl" />
                  <Skeleton className="h-10 w-full rounded-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
