import React from "react";
import { Hero } from "../../features/category-page/components/hero";
import { CategoryGrid } from "@/features/category-page/components/category-grid";
import { Features } from "@/features/category-page/components/features";
import { FAQ } from "./Common/faq";
import BookCreationFlow from "./PageSections/HomePage/BookCreationFlow";

export default function HomePage() {
  return (
    <>
      <Hero type="home" />
      <CategoryGrid />
      <BookCreationFlow />
      {/* <Features /> */}
      <FAQ />
    </>
  );
}
