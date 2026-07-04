import StylesPage from "@/features/category-page/pages/StylesPage";
import { Metadata } from "next";
import { getPublicContent, getPublicStyles } from "@/lib/public-api";

export const metadata: Metadata = {
  title:
    "Personalized Coloring Book Collections | Kids, Pets, Anime, Memory Care",
  description:
    "Explore personalized coloring book collections for kids, pets, anime portraits, and dementia-friendly memory-care gifts made from your own photos.",
  alternates: {
    canonical: "/collections",
  },
  openGraph: {
    url: "/collections",
    title:
      "Personalized Coloring Book Collections | Kids, Pets, Anime, Memory Care | sktchLABS",
    description:
      "Explore personalized coloring book collections for kids, pets, anime portraits, and dementia-friendly memory-care gifts made from your own photos.",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Personalized Coloring Book Collections | Kids, Pets, Anime, Memory Care | sktchLABS",
    description:
      "Explore personalized coloring book collections for kids, pets, anime portraits, and dementia-friendly memory-care gifts made from your own photos.",
  },
};

export default async function page() {
  const [contentData, stylesData] = await Promise.all([
    getPublicContent({ limit: 100 }),
    getPublicStyles(),
  ]);

  return (
    <StylesPage categories={contentData.data} style={stylesData.data?.[0]} />
  );
}
