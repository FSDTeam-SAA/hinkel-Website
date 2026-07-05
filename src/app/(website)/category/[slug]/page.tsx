import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import CategoryPageClient from "./CategoryPageClient";
import {
  extractCmsContents,
  getPublicCmsBySlug,
  getPublicCmsByType,
  getPublicContent,
} from "@/lib/public-api";
import {
  DEFAULT_CATEGORY_SEO,
  getCategorySeoBySlugOrType,
  resolveCanonicalCategorySlug,
} from "@/lib/category-seo";

async function loadCategoryPage(slugParam: string) {
  const requestedSlug = decodeURIComponent(slugParam).toLowerCase();
  const canonicalSlug = resolveCanonicalCategorySlug(requestedSlug);
  const seoContent = getCategorySeoBySlugOrType(canonicalSlug);

  const [
    canonicalContentData,
    requestedContentData,
    typedContentData,
    canonicalCmsData,
    requestedCmsData,
    typedCmsData,
  ] = await Promise.all([
    getPublicContent({ slug: canonicalSlug, limit: 20 }),
    requestedSlug !== canonicalSlug
      ? getPublicContent({ slug: requestedSlug, limit: 20 })
      : Promise.resolve(null),
    seoContent?.type
      ? getPublicContent({ type: seoContent.type, limit: 20 })
      : Promise.resolve(null),
    getPublicCmsBySlug(canonicalSlug),
    requestedSlug !== canonicalSlug
      ? getPublicCmsBySlug(requestedSlug)
      : Promise.resolve(null),
    seoContent?.type
      ? getPublicCmsByType(seoContent.type)
      : Promise.resolve(null),
  ]);

  const contents = canonicalContentData.data?.length
    ? canonicalContentData.data
    : requestedContentData?.data?.length
      ? requestedContentData.data
      : typedContentData?.data?.length
        ? typedContentData.data
        : [];
  const heroContent = contents[0];
  const resolvedSeoContent =
    seoContent || getCategorySeoBySlugOrType(undefined, heroContent?.type);
  const heroType = heroContent?.type;
  const canonicalCmsContents = extractCmsContents(canonicalCmsData);
  const requestedCmsContents = extractCmsContents(requestedCmsData);
  const typedCmsContents = extractCmsContents(typedCmsData);
  const heroTypeCmsData =
    canonicalCmsContents.length === 0 &&
    requestedCmsContents.length === 0 &&
    typedCmsContents.length === 0 &&
    heroType &&
    heroType !== resolvedSeoContent?.type
      ? await getPublicCmsByType(heroType)
      : null;
  const heroTypeCmsContents = extractCmsContents(heroTypeCmsData);
  const cmsContent =
    canonicalCmsContents[0] ||
    requestedCmsContents[0] ||
    typedCmsContents[0] ||
    heroTypeCmsContents[0];
  const finalSeoContent = getCategorySeoBySlugOrType(
    heroContent?.slug || cmsContent?.slug || requestedSlug || canonicalSlug,
    heroContent?.type ?? cmsContent?.type,
  );
  const resolvedSlug =
    heroContent?.slug || cmsContent?.slug || finalSeoContent?.slug;

  return {
    requestedSlug,
    canonicalSlug,
    resolvedSlug,
    contents,
    cmsContent,
    seoContent: finalSeoContent,
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
