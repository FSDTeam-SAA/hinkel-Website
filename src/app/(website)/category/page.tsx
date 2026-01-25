import Review from "@/components/ReusableSection/Review";
import Howitworks from "@/components/website/Common/Howitworks";
import ProductsPage from "@/components/website/PageSections/ProductsPage/ProductsPage";


export default function page() {
  return (
    <div>
      <ProductsPage />
      <Review />
      <Howitworks />
    </div>
  );
}
