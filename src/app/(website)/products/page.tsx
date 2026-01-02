import Review from "@/components/ReusableSection/Review";
import ProductsPage from "@/components/website/PageSections/ProductsPage/ProductsPage";
import React from "react";

export default function page() {
  return (
    <div>
      <ProductsPage />
      <Review />
    </div>
  );
}
