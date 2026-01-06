import { Hero } from "@/features/category-page/components/hero";

export default function page({ params }: { params: { slug: string } }) {
  console.log(params.slug);
  return (
    <div>
      <Hero type={params.slug} />
    </div>
  );
}
