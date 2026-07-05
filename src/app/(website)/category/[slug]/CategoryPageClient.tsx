import PlainTextContent from "@/components/shared/PlainTextContent";
import { Hero } from "@/features/category-page/components/hero";
import type { CategoryContent } from "@/features/category-page/types";
import type { CmsContent } from "@/features/dashboard/api/cms.api";
import type { CollectionSeoContent } from "@/lib/category-seo";
import { getCategorySeoBySlugOrType } from "@/lib/category-seo";

export default function CategoryPageClient({
  slug,
  contents,
  cmsContent,
  seoContent,
}: Readonly<{
  slug: string;
  contents: CategoryContent[];
  cmsContent?: CmsContent;
  seoContent?: CollectionSeoContent | null;
}>) {
  const heroContent = contents[0];
  const pageContent =
    seoContent || getCategorySeoBySlugOrType(slug, heroContent?.type) || null;
  const fallbackSeoContent = pageContent
    ? [...pageContent.intro, ...pageContent.benefits].join("\n\n")
    : "";
  const sectionContent =
    cmsContent?.plainText || cmsContent?.richText || fallbackSeoContent;

  return (
    <div className="min-h-[90vh]">
      <Hero
        type={heroContent?.type || pageContent?.type || slug}
        heroContent={heroContent}
      />

      {sectionContent && (
        <section className="py-12 md:py-20 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <PlainTextContent
                content={sectionContent}
                className="text-base leading-8 text-gray-700"
              />
            </div>
          </div>
        </section>
      )}

      {contents.length === 0 && !cmsContent && (
        <div className="py-20 text-center">
          <p className="text-gray-500">No content found for this category.</p>
        </div>
      )}
    </div>
  );
}
