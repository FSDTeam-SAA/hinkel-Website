import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import { getPublicCmsBySlug, getPublicContent } from "@/lib/public-api";
import {
  DEFAULT_CATEGORY_SEO,
  getCategorySeoBySlugOrType,
  resolveCanonicalCategorySlug,
} from "@/lib/category-seo";

async function loadCategoryPage(slugParam: string) {
  const requestedSlug = decodeURIComponent(slugParam).toLowerCase();
  const canonicalSlug = resolveCanonicalCategorySlug(requestedSlug);

  const [contentData, cmsData] = await Promise.all([
    getPublicContent({ slug: canonicalSlug, limit: 20 }),
    getPublicCmsBySlug(canonicalSlug),
  ]);

  const contents = contentData.data || [];
  const cmsContent = cmsData.data?.data?.contents?.[0];
  const heroContent = contents[0];
  const seoContent = getCategorySeoBySlugOrType(
    canonicalSlug,
    heroContent?.type ?? cmsContent?.type,
  );
  const resolvedSlug =
    heroContent?.slug || cmsContent?.slug || seoContent?.slug;

  return {
    requestedSlug,
    canonicalSlug,
    resolvedSlug,
    contents,
    cmsContent,
    seoContent,
    heroContent,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await loadCategoryPage(slug);
  const resolvedSlug = category.resolvedSlug || category.canonicalSlug;

  if (!category.heroContent && !category.cmsContent && !category.seoContent) {
    return {
      title: DEFAULT_CATEGORY_SEO.metaTitle,
      description: DEFAULT_CATEGORY_SEO.metaDescription,
    };
  }

  const meta = category.seoContent || {
    metaTitle: DEFAULT_CATEGORY_SEO.metaTitle,
    metaDescription: DEFAULT_CATEGORY_SEO.metaDescription,
    ogDescription: DEFAULT_CATEGORY_SEO.metaDescription,
  };

  const socialImage =
    typeof category.heroContent?.image === "string" &&
    category.heroContent.image
      ? category.heroContent.image
      : "/images/new-logo.png";

  return {
    title: meta.metaTitle,
    description: meta.metaDescription,
    alternates: {
      canonical: `/category/${resolvedSlug}`,
    },
    openGraph: {
      url: `/category/${resolvedSlug}`,
      title: `${meta.metaTitle} | sktchLABS`,
      description: meta.ogDescription,
      images: [{ url: socialImage }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.metaTitle} | sktchLABS`,
      description: meta.ogDescription,
      images: [socialImage],
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await loadCategoryPage(slug);

  if (!category.heroContent && !category.cmsContent && !category.seoContent) {
    notFound();
  }

  if (
    category.resolvedSlug &&
    category.requestedSlug !== category.resolvedSlug
  ) {
    permanentRedirect(`/category/${category.resolvedSlug}`);
  }

  return (
    <CategoryPageClient
      slug={category.resolvedSlug || category.canonicalSlug}
      contents={category.contents}
      cmsContent={category.cmsContent}
      seoContent={category.seoContent}
    />
  );
}
