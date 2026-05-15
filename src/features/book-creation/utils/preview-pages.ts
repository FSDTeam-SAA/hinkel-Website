import type { BookState, PreviewPage } from "../types";

export function buildBookPreviewPages(state: BookState): PreviewPage[] {
  const {
    bookTitle,
    pageCount,
    pageImages,
    pageTexts,
    includeDedicationPage,
    dedicationText,
    coverImage,
    coverImageVariants,
    selectedCoverVariantIndex,
  } = state;

  const coverPreviewImage =
    coverImageVariants.length > 0
      ? coverImageVariants[selectedCoverVariantIndex || 0] || coverImage
      : coverImage;

  const pages: PreviewPage[] = [
    {
      id: "cover",
      type: "cover",
      pageNumber: 1,
      label: "Cover",
      title: bookTitle || "My Coloring Book",
      imageSrc: coverPreviewImage,
    },
  ];

  if (includeDedicationPage && dedicationText.trim()) {
    pages.push({
      id: "dedication",
      type: "dedication",
      pageNumber: pages.length + 1,
      label: "Dedication",
      dedicationText,
    });
  }

  let contentPageNumber = 1;
  for (let index = 1; index <= pageCount; index += 1) {
    const imageSrc = pageImages[index] || null;
    const text = pageTexts[index];

    if (!imageSrc && !text?.topLine && !text?.bottomLine) {
      continue;
    }

    pages.push({
      id: `content-${index}`,
      type: "content",
      pageNumber: pages.length + 1,
      label: `Page ${contentPageNumber}`,
      imageSrc,
      topLine: text?.topLine || "",
      bottomLine: text?.bottomLine || "",
      contentPageNumber,
    });

    contentPageNumber += 1;
  }

  return pages;
}
