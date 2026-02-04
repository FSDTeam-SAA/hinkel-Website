"use client";

import React, { useState, useEffect } from "react";
import { Hero } from "@/features/category-page/components/hero";
import { GallerySection } from "@/features/category-page/components/gallery-section";
import { useContent } from "@/features/category-page/hooks/use-content";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const [slug, setSlug] = useState<string>("");

  useEffect(() => {
    params.then((p) => setSlug(decodeURIComponent(p.slug)));
  }, [params]);

  const { data } = useContent({ type: slug });
  const category = data?.data?.[0];
  const galleryImages = category?.gallery || [];

  return (
    <div>
      <Hero type={slug} />
      {galleryImages.length > 0 && (
        <GallerySection images={galleryImages} title={category?.title} />
      )}
    </div>
  );
}
