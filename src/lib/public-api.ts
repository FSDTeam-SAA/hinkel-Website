import type { PricingResponse } from "@/features/book-creation/types";
import type {
  ContentResponse,
  CategoryHeader,
  CategoryContent,
} from "@/features/category-page/types";
import type { StyleResponse } from "@/features/dashboard/types/style.types";
import type { AboutResponse } from "@/features/dashboard/types/about.types";
import type { PrivacyResponse } from "@/features/dashboard/types/privacy.types";
import type { ReturnPolicyResponse } from "@/features/dashboard/types/return-policy.types";
import type { TermConditionResponse } from "@/features/dashboard/types/terms-conditions.types";
import type { PublicFaqResponse } from "@/features/website-content/api/website-content.api";
import type { CmsContent } from "@/features/dashboard/api/cms.api";
import type { PublicFaqData } from "@/features/website-content/api/website-content.api";
import { resolveCategorySlug } from "@/lib/category-seo";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const REVALIDATE_SECONDS = 300;

function getApiUrl() {
  if (!API_URL) {
    return null;
  }

  return API_URL.replace(/\/$/, "");
}

async function fetchPublicJson<T>(path: string): Promise<T | null> {
  const baseUrl = getApiUrl();

  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      return null;
    }

    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

export async function getPublicContent(params: {
  type?: string;
  slug?: string;
  limit?: number;
}) {
  const query = new URLSearchParams();

  if (params.type) {
    query.set("type", params.type);
  }

  if (params.slug) {
    query.set("slug", params.slug);
  }

  if (params.limit) {
    query.set("limit", String(params.limit));
  }

  const suffix = query.toString() ? `?${query.toString()}` : "";
  return (
    (await fetchPublicJson<ContentResponse>(`/content${suffix}`)) ?? {
      success: false,
      data: [],
    }
  );
}

export async function getPublicCategoryHeader() {
  const response = await fetchPublicJson<{ data?: { data?: CategoryHeader } }>(
    "/content/get-header",
  );
  return response?.data?.data;
}

export async function getPublicCmsByType(type: string) {
  return (
    (await fetchPublicJson<{
      data?: { data?: { contents?: CmsContent[] } };
    }>(`/content/cms/type/${encodeURIComponent(type)}?page=1&limit=10`)) ?? {
      data: { data: { contents: [] } },
    }
  );
}

export async function getPublicCmsBySlug(slug: string) {
  return (
    (await fetchPublicJson<{
      data?: { data?: { contents?: CmsContent[] } };
    }>(`/content/cms/slug/${encodeURIComponent(slug)}?page=1&limit=10`)) ?? {
      data: { data: { contents: [] } },
    }
  );
}

export function extractCmsContents(
  response: { data?: unknown } | null | undefined,
) {
  const rootData = response?.data;

  if (Array.isArray(rootData)) {
    return rootData;
  }

  if (
    rootData &&
    typeof rootData === "object" &&
    !Array.isArray(rootData) &&
    "_id" in rootData
  ) {
    return [rootData as CmsContent];
  }

  if (
    rootData &&
    typeof rootData === "object" &&
    !Array.isArray(rootData) &&
    Array.isArray((rootData as { contents?: CmsContent[] }).contents)
  ) {
    return (rootData as { contents: CmsContent[] }).contents;
  }

  if (
    rootData &&
    typeof rootData === "object" &&
    !Array.isArray(rootData) &&
    (rootData as { content?: unknown }).content &&
    typeof (rootData as { content?: unknown }).content === "object" &&
    "_id" in ((rootData as { content: CmsContent }).content as CmsContent)
  ) {
    return [(rootData as { content: CmsContent }).content];
  }

  const nestedData =
    rootData && typeof rootData === "object" && !Array.isArray(rootData)
      ? (rootData as { data?: unknown }).data
      : undefined;

  if (Array.isArray(nestedData)) {
    return nestedData;
  }

  if (
    nestedData &&
    typeof nestedData === "object" &&
    !Array.isArray(nestedData) &&
    "_id" in nestedData
  ) {
    return [nestedData as CmsContent];
  }

  if (
    nestedData &&
    typeof nestedData === "object" &&
    !Array.isArray(nestedData) &&
    Array.isArray((nestedData as { contents?: CmsContent[] }).contents)
  ) {
    return (nestedData as { contents: CmsContent[] }).contents;
  }

  if (
    nestedData &&
    typeof nestedData === "object" &&
    !Array.isArray(nestedData) &&
    (nestedData as { content?: unknown }).content &&
    typeof (nestedData as { content?: unknown }).content === "object" &&
    "_id" in ((nestedData as { content: CmsContent }).content as CmsContent)
  ) {
    return [(nestedData as { content: CmsContent }).content];
  }

  return [];
}

export async function getPublicFaq() {
  return (
    (await fetchPublicJson<PublicFaqResponse>("/faqs/pricing")) ?? {
      success: false,
      statusCode: 500,
      message: "Unavailable",
      data: {
        _id: "",
        key: "",
        title: "",
        subtitle: "",
        status: "",
        cta: {
          enabled: false,
          heading: "",
          text: "",
          button: {
            label: "",
            href: "",
            target: "_self",
          },
          avatars: [],
        },
        items: [],
        createdAt: "",
        updatedAt: "",
        publishedAt: "",
      },
    }
  );
}

export function getActiveFaqItems(faqData?: PublicFaqData | null) {
  return (
    faqData?.items
      .filter((item) => item.isActive)
      .sort((a, b) => a.order - b.order) ?? []
  );
}

export function getCategoryLinks(contents: CategoryContent[] | undefined) {
  return (
    contents
      ?.filter((item) => item.type?.toLowerCase() !== "home")
      .map((item) => ({
        ...item,
        slug: resolveCategorySlug(item),
      }))
      .sort((a, b) => (a.type || "").localeCompare(b.type || "")) ?? []
  );
}

export async function getPublicAbout() {
  return (
    (await fetchPublicJson<AboutResponse>("/admin/pages/")) ?? {
      success: false,
      statusCode: 500,
      message: "Unavailable",
      data: {
        title: "",
        content: "",
      },
    }
  );
}

export async function getPublicPrivacy() {
  return (
    (await fetchPublicJson<PrivacyResponse>("/admin/privacy")) ?? {
      success: false,
      statusCode: 500,
      message: "Unavailable",
      data: {
        title: "",
        content: "",
        status: "draft",
      },
    }
  );
}

export async function getPublicReturnPolicy() {
  return (
    (await fetchPublicJson<ReturnPolicyResponse>(
      "/policy/get-return-policy",
    )) ?? {
      success: false,
      statusCode: 500,
      message: "Unavailable",
      data: [],
    }
  );
}

export async function getPublicTerms() {
  return (
    (await fetchPublicJson<TermConditionResponse>(
      "/terms/get-term-condition",
    )) ?? {
      success: false,
      statusCode: 500,
      message: "Unavailable",
      data: [],
    }
  );
}

export async function getPublicStyles() {
  return (
    (await fetchPublicJson<StyleResponse>("/style/")) ?? {
      success: false,
      statusCode: 500,
      message: "Unavailable",
      data: [],
    }
  );
}

export async function getPublicPricing() {
  return (
    (await fetchPublicJson<PricingResponse>("/pricing/admin/get-prices")) ?? {
      success: false,
      data: [],
    }
  );
}

export function getHeroContentByType(
  contents: CategoryContent[] | undefined,
  type?: string,
) {
  return contents?.find((item) => item.type === type) ?? contents?.[0];
}
