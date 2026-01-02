import FAQ from "@/components/ReusableSection/FAQ";
import Gallery from "@/components/ReusableSection/Gallery";
import Review from "@/components/ReusableSection/Review";
import Banner from "@/components/website/PageSections/HomePage/Banner";

export default function page() {
  return (
    <div>
      <Banner />
      <FAQ />
      <Review />
      <Gallery />
    </div>
  );
}
