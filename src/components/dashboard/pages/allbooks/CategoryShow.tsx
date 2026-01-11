"use client";

import Image from "next/image";
import Link from "next/link";
import { useContent } from "@/features/category-page/hooks/use-content";
import { CategoryContent } from "@/features/category-page/types";
import HeaderTitle from "@/components/website/Common/head-title";

export function CategoryShow() {
  const { data: contentData, isLoading, error } = useContent({ limit: 50 });

  const categories = contentData?.data || [];

  if (isLoading) {
    
  }

  if (error) {
    return (
      <section className="py-24 px-6 bg-secondary flex justify-center items-center">
        <div className="text-red-500">
          Failed to load categories. Please try again later.
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-secondary/90 rounded-2xl" >
      <div className="container mx-auto space-y-8">
        {/* <HeaderTitle title="Explore Categories" /> */}

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {categories.map((category: CategoryContent) => (
            <Link
              key={category._id}
              href={`/${category.type}`}
              className="group relative rounded-4xl overflow-hidden bg-white shadow-lg transition-all duration-300 border border-transparent hover:border-primary"
            >
              {/* Image */}
              <div className="aspect-4/5 relative bg-accent">
                <Image
                  src={category.image || "/no-image.jpg"}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black/5 to-transparent pointer-events-none" />
              </div>

              {/* Footer */}
              <div className="bg-primary py-5 text-center transition-colors duration-300 group-hover:bg-[#e66a33]">
                <span className="text-white font-medium text-2xl tracking-tight uppercase">
                  {category.type}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
