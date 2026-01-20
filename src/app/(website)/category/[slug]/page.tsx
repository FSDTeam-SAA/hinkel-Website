import { Hero } from "@/features/category-page/components/hero";

export default async function page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log(slug);
  return (
    <div>
      <Hero type={slug} />
    </div>
  );
}
