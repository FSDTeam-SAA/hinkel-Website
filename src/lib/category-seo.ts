export type CollectionSeoContent = {
  slug: string;
  type: string;
  shortLabel: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  ogDescription: string;
  heroTitle: string;
  intro: string[];
  benefits: string[];
  faq: Array<{ question: string; answer: string }>;
  ctaLabel: string;
  legacySlugs: string[];
};

const CATEGORY_SEO_CONTENT: CollectionSeoContent[] = [
  {
    slug: "kids-coloring-books",
    type: "kids",
    shortLabel: "Kids",
    title: "Personalized Kids Coloring Books from Your Photos",
    metaTitle: "Personalized Kids Coloring Books from Your Photos",
    metaDescription:
      "Turn family photos into personalized kids coloring books with playful, clean line art. Create a printed book or digital PDF gift in minutes.",
    ogDescription:
      "Create custom kids coloring books from your own photos with playful line art, flexible formats, and a simple online workflow.",
    heroTitle:
      "Personalized Kids Coloring Books Built From Your Favorite Photos",
    intro: [
      "Our kids collection turns your favorite family photos into bold, easy-to-color pages that feel personal from the very first page. Whether you are making a birthday gift, a rainy-day activity, or a keepsake for grandparents, the finished book starts with pictures your child already loves.",
      "Because the source images come from your own camera roll, every page feels more meaningful than a generic coloring book. You can mix family moments, favorite toys, vacations, and milestone memories into one book that is playful, memorable, and made specifically for your child.",
    ],
    benefits: [
      "Transforms real family photos into kid-friendly coloring pages with bold, printable outlines.",
      "Works well for birthday gifts, holiday keepsakes, travel memories, and personalized activity books.",
      "Available as a digital PDF, a printed book, or a bundle depending on how you want to use it.",
    ],
    faq: [
      {
        question: "What photos work best for a kids coloring book?",
        answer:
          "Bright, well-lit photos with one clear subject tend to convert best. Family portraits, outdoor play shots, and favorite toy photos usually create the cleanest line art.",
      },
      {
        question: "Can I mix different memories in one book?",
        answer:
          "Yes. You can combine birthdays, vacations, pets, and everyday moments in the same book so the final collection feels personal and varied.",
      },
      {
        question: "Is this a good gift for young children?",
        answer:
          "Yes. Personalized coloring books are a strong fit for birthdays, holiday gifts, classroom keepsakes, and family activities because the child already recognizes the people and places on each page.",
      },
    ],
    ctaLabel: "Create a kids coloring book",
    legacySlugs: ["kids"],
  },
  {
    slug: "pet-coloring-books",
    type: "pets",
    shortLabel: "Pets",
    title: "Personalized Pet Coloring Books and Memorial Sketches",
    metaTitle: "Personalized Pet Coloring Books and Memorial Sketches",
    metaDescription:
      "Turn dog, cat, and pet photos into personalized coloring books or sketch-style keepsakes. Great for gifts, memorial books, and custom pet art.",
    ogDescription:
      "Create a custom pet coloring book or sketch keepsake from your own photos, with printed and digital delivery options.",
    heroTitle:
      "Turn Pet Photos Into Personalized Coloring Books and Sketch Keepsakes",
    intro: [
      "The pet collection is designed for the people who never have enough photos of their dog, cat, or favorite companion. We turn those everyday snapshots into custom coloring pages and sketch-style layouts that feel warm, personal, and gift-ready.",
      "Some customers create a playful activity book from their pet photos, while others build a quieter memorial keepsake that preserves familiar poses and expressions. The result is still personal art, but in a format that feels interactive and easy to share.",
    ],
    benefits: [
      "Works well for dogs, cats, and other pets with expressive close-up or portrait-style photos.",
      "Useful for birthdays, memorial gifts, pet-lover surprises, and custom coffee-table keepsakes.",
      "Lets you preserve favorite poses, habits, and everyday moments in a format that feels more personal than stock pet art.",
    ],
    faq: [
      {
        question: "Can I use close-up photos of my pet?",
        answer:
          "Yes. Clear portraits and close-up shots usually work especially well because the facial features and fur patterns remain recognizable in the final line art.",
      },
      {
        question:
          "Is this only for playful coloring books, or can it be memorial-focused?",
        answer:
          "It works for both. Some books are lighthearted and fun, while others are created as thoughtful remembrance gifts built from cherished pet photos.",
      },
      {
        question: "What if my pet photos are taken indoors?",
        answer:
          "Indoor photos can still work well as long as they are sharp and reasonably lit. Higher contrast generally produces cleaner outlines.",
      },
    ],
    ctaLabel: "Create a pet coloring book",
    legacySlugs: ["pets"],
  },
  {
    slug: "anime-portrait-coloring-books",
    type: "anime",
    shortLabel: "Anime",
    title: "Anime Portrait Coloring Books From Your Photos",
    metaTitle: "Anime Portrait Coloring Books From Your Photos",
    metaDescription:
      "Convert your photos into anime-inspired portrait coloring books with expressive line work and a personalized layout. Available as print or PDF.",
    ogDescription:
      "Create anime-inspired portrait coloring books from your own photos, with expressive line art and personalized layouts.",
    heroTitle: "Create Anime Portrait Coloring Books From Your Own Photos",
    intro: [
      "Our anime collection takes your portraits and transforms them into expressive, stylized line art inspired by anime aesthetics. It is a strong choice for gifts, fan projects, creative keepsakes, and anyone who wants their photos to feel more illustrated than literal.",
      "Because the finished book starts with your own images, the final pages still feel recognizable and personal. The result is a custom collection that blends familiar faces with an anime-style visual language that feels energetic, graphic, and unique.",
    ],
    benefits: [
      "Creates stylized portrait pages that feel more expressive and illustrative than standard line conversion.",
      "Great for anime fans, convention gifts, personalized fan art, and one-of-a-kind keepsakes.",
      "Lets you build a themed collection from selfies, couple photos, friend groups, or milestone portraits.",
    ],
    faq: [
      {
        question: "Do anime portrait books work best with face photos?",
        answer:
          "Yes. Portraits, selfies, and waist-up photos usually produce the most recognizable and expressive results for this collection.",
      },
      {
        question: "Can I make this as a gift for an anime fan?",
        answer:
          "Absolutely. This collection is especially popular for birthdays, fan gifts, and creative surprises because it blends a familiar photo with a stylized anime look.",
      },
      {
        question: "Will the final pages still look like the original person?",
        answer:
          "Yes. The output is stylized, but it is still grounded in the structure of the original photo so the subject remains recognizable.",
      },
    ],
    ctaLabel: "Create an anime portrait book",
    legacySlugs: ["anime"],
  },
  {
    slug: "dementia-friendly-coloring-books",
    type: "dementia",
    shortLabel: "Dementia-Friendly",
    title: "Personalized Coloring Books for Dementia and Alzheimer's",
    metaTitle: "Personalized Coloring Books for Dementia and Alzheimer's",
    metaDescription:
      "Create dementia-friendly coloring books from real family photos for memory care, reminiscence support, and meaningful quiet engagement.",
    ogDescription:
      "Build personalized memory-care coloring books from family photos to support familiar, soothing engagement for dementia and Alzheimer's care.",
    heroTitle:
      "Dementia-Friendly Coloring Books Made From Familiar Family Photos",
    intro: [
      "This collection is built for families, caregivers, and care teams who want a more meaningful activity than a generic adult coloring book. By starting with familiar family photos, the finished pages can feel comforting, recognizable, and easier to connect with during quiet moments.",
      "These books are often used alongside reminiscence care routines, thoughtful visits, or one-on-one family time. The goal is not perfection. It is to create something calm, personal, and familiar enough to support gentle engagement for people living with dementia or Alzheimer's.",
    ],
    benefits: [
      "Uses familiar family photos to create a more personal alternative to generic adult coloring pages.",
      "Supports memory-care routines, quiet visits, and meaningful one-on-one engagement with loved ones.",
      "Can be created as a printed book for easy gifting or as a digital file for flexible use in care settings.",
    ],
    faq: [
      {
        question:
          "Why use family photos for a dementia-friendly coloring book?",
        answer:
          "Familiar faces, places, and routines can feel more grounding than generic imagery. Starting from family photos makes the activity more personal and can support reminiscence-focused engagement.",
      },
      {
        question: "Is this only for seniors with dementia?",
        answer:
          "No. While it is especially useful for dementia and Alzheimer's care, it can also be meaningful for older adults who enjoy personalized memory-based activities.",
      },
      {
        question: "What kinds of photos are best for memory-care books?",
        answer:
          "Clear photos of close family, pets, homes, holidays, and recognizable life moments usually work best because they create the strongest emotional connection.",
      },
    ],
    ctaLabel: "Create a memory-care coloring book",
    legacySlugs: [
      "dementia",
      "dementia-friendly",
      "dementia friendly",
      "seniors",
    ],
  },
];

export const DEFAULT_CATEGORY_SEO = {
  metaTitle: "Custom Coloring Book Collection",
  metaDescription:
    "Explore personalized coloring book collections made from your own photos, with printed and digital options for kids, pets, anime portraits, and memory-care gifts.",
};

export const CATEGORY_SEO_BY_SLUG = Object.fromEntries(
  CATEGORY_SEO_CONTENT.map((entry) => [entry.slug, entry]),
) as Record<string, CollectionSeoContent>;

export const CATEGORY_SEO_BY_TYPE = Object.fromEntries(
  CATEGORY_SEO_CONTENT.map((entry) => [entry.type, entry]),
) as Record<string, CollectionSeoContent>;

export const CATEGORY_LEGACY_REDIRECTS = Object.fromEntries(
  CATEGORY_SEO_CONTENT.flatMap((entry) => [
    [entry.slug, entry.slug],
    ...entry.legacySlugs.map((legacy) => [legacy, entry.slug]),
  ]),
) as Record<string, string>;

export function slugifyCategory(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function resolveCanonicalCategorySlug(value?: string | null) {
  if (!value) {
    return "";
  }

  const normalized = slugifyCategory(decodeURIComponent(value));
  return CATEGORY_LEGACY_REDIRECTS[normalized] || normalized;
}

export function getCategorySeoBySlugOrType(
  slug?: string | null,
  type?: string | null,
) {
  const canonicalSlug = resolveCanonicalCategorySlug(slug || undefined);
  const normalizedType = type ? type.trim().toLowerCase() : "";

  return (
    CATEGORY_SEO_BY_SLUG[canonicalSlug] ||
    CATEGORY_SEO_BY_TYPE[normalizedType] ||
    null
  );
}

export function resolveCategorySlug({
  slug,
  type,
  title,
}: {
  slug?: string | null;
  type?: string | null;
  title?: string | null;
}) {
  const fromSeo = getCategorySeoBySlugOrType(slug, type);
  if (fromSeo) {
    return fromSeo.slug;
  }

  const baseValue = slug || type || title || "";
  return resolveCanonicalCategorySlug(baseValue);
}

export function buildCategoryHref({
  slug,
  type,
  title,
}: {
  slug?: string | null;
  type?: string | null;
  title?: string | null;
}) {
  return `/category/${resolveCategorySlug({ slug, type, title })}`;
}

export const CANONICAL_CATEGORY_SLUGS = CATEGORY_SEO_CONTENT.map(
  (entry) => entry.slug,
);
