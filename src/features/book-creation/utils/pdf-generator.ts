import { jsPDF } from "jspdf";
import { BookState } from "../types";

// Constants for PDF geometry (Lulu Requirements)
const POINTS_PER_INCH = 72;
const PAGE_WIDTH = 8.5 * POINTS_PER_INCH; // 612pt
const PAGE_HEIGHT = 11 * POINTS_PER_INCH; // 792pt

// Margins
const MARGIN_INNER = 0.75 * POINTS_PER_INCH; // 54pt (Gutter)
const MARGIN_OUTER = 0.5 * POINTS_PER_INCH; // 36pt
const MARGIN_TOP = 0.5 * POINTS_PER_INCH; // 36pt
const MARGIN_BOTTOM = 0.5 * POINTS_PER_INCH; // 36pt

const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN_INNER + MARGIN_OUTER);
const CONTENT_HEIGHT = PAGE_HEIGHT - (MARGIN_TOP + MARGIN_BOTTOM);

// Styling Constants
const FONTS = {
  primary: "helvetica",
  secondary: "times", // For dedication? or just use helvetica italic
};

const FONT_Sizes = {
  title: 32,
  subtitle: 14,
  heading: 22,
  body: 12,
  meta: 10,
  pageNumber: 9,
};

const SPACING = {
  titleTop: 80,
  subtitleTop: 120,
  imagePadding: 20,
  borderWidthThin: 1,
  borderWidthThick: 4,
  textPadding: 20, // Padding between text and image
};

/**
 * Generates a coloring book PDF based on the current store state
 * Strictly enforces Lulu publishing requirements
 */
export const generateBookPdf = async (state: BookState): Promise<Blob> => {
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

  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "letter", // 8.5 x 11 inches
  });

  // Helper to check if current page is odd (Right) or even (Left)
  // Lulu: Page 1 is usually Right side (Recto).
  const isOddPage = (pageNumber: number) => pageNumber % 2 !== 0;

  // Helper to get X position respecting margins
  const getX = (pageNumber: number, relativeX = 0) => {
    // If Odd (Right Page): Inner margin is on Left.
    // If Even (Left Page): Inner margin is on Right. Outer margin is on Left.
    const leftMargin = isOddPage(pageNumber) ? MARGIN_INNER : MARGIN_OUTER;
    return leftMargin + relativeX;
  };

  const centerText = (
    text: string,
    y: number,
    fontSize: number,
    font = "helvetica",
    fontStyle = "normal",
  ) => {
    doc.setFont(font, fontStyle);
    doc.setFontSize(fontSize);
    doc.setTextColor(0, 0, 0); // Strict Black
    const pageNum = doc.getNumberOfPages();
    // Center relative to CONTENT area, not entire page, to look visually centered between margins
    // Center X = LeftMargin + (ContentWidth / 2)
    const centerX = getX(pageNum) + CONTENT_WIDTH / 2;
    doc.text(text, centerX, y, { align: "center" });
  };

  // Helper to draw the standard page border
  const drawPageBorder = (pageNum: number) => {
    const leftMargin = getX(pageNum);
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(SPACING.borderWidthThin);
    doc.rect(leftMargin, MARGIN_TOP, CONTENT_WIDTH, CONTENT_HEIGHT);
  };

  // Helper to add image preserving aspect ratio
  const addScaledImage = (
    imgData: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
  ) => {
    try {
      const props = doc.getImageProperties(imgData);
      const imgRatio = props.width / props.height;
      const boxRatio = maxWidth / maxHeight;

      let finalW, finalH;
      if (imgRatio > boxRatio) {
        finalW = maxWidth;
        finalH = maxWidth / imgRatio;
      } else {
        finalH = maxHeight;
        finalW = maxHeight * imgRatio;
      }

      const finalX = x + (maxWidth - finalW) / 2;
      const finalY = y + (maxHeight - finalH) / 2;

      doc.addImage(
        imgData,
        "JPEG",
        finalX,
        finalY,
        finalW,
        finalH,
        undefined,
        "FAST",
      );

      return { finalX, finalY, finalW, finalH };
    } catch (e) {
      console.error("Error adding image:", e);
      return null;
    }
  };

  // --- 1. TITLE PAGE (Interior Page 1) ---
  // Use the sketch version (variant) if available
  const finalCoverImage =
    coverImageVariants && coverImageVariants.length > 0
      ? coverImageVariants[selectedCoverVariantIndex || 0]
      : coverImage;

  // Page 1 is always Odd (Right) -> Left Margin = 54pt, Right Margin = 36pt
  const p1PageNum = 1;
  const p1Left = getX(p1PageNum);

  // Decorative Double Border for Title Page
  doc.setDrawColor(0, 0, 0); // Black for interior
  doc.setLineWidth(SPACING.borderWidthThick);
  doc.rect(p1Left, MARGIN_TOP, CONTENT_WIDTH, CONTENT_HEIGHT);

  doc.setLineWidth(SPACING.borderWidthThin);
  const innerBorderOffset = 6;
  doc.rect(
    p1Left + innerBorderOffset,
    MARGIN_TOP + innerBorderOffset,
    CONTENT_WIDTH - innerBorderOffset * 2,
    CONTENT_HEIGHT - innerBorderOffset * 2,
  );

  // Title
  doc.setFont(FONTS.primary, "bold");
  doc.setFontSize(FONT_Sizes.title);
  doc.setTextColor(0, 0, 0);
  const displayTitle = bookTitle || "My Coloring Book";
  const titleLines = doc.splitTextToSize(
    displayTitle.toUpperCase(),
    CONTENT_WIDTH - SPACING.textPadding * 2,
  );

  const p1CenterX = p1Left + CONTENT_WIDTH / 2;
  doc.text(titleLines, p1CenterX, MARGIN_TOP + SPACING.titleTop, {
    align: "center",
  });

  // Subtitle
  doc.setFont(FONTS.primary, "normal");
  doc.setFontSize(FONT_Sizes.subtitle);
  doc.text("", p1CenterX, MARGIN_TOP + SPACING.subtitleTop, {
    align: "center",
  });

  // Cover Image on Title Page
  if (finalCoverImage) {
    const imgYStart = MARGIN_TOP + 150;
    const imgYEnd = CONTENT_HEIGHT + MARGIN_TOP - 80;
    const maxW = CONTENT_WIDTH - SPACING.imagePadding * 2;
    const maxH = imgYEnd - imgYStart;
    const imgX = p1Left + SPACING.imagePadding;

    const result = addScaledImage(finalCoverImage, imgX, imgYStart, maxW, maxH);

    if (result) {
      // Image Border on Title Page
      doc.setLineWidth(SPACING.borderWidthThin);
      doc.setDrawColor(0, 0, 0);
      doc.rect(
        result.finalX - 2,
        result.finalY - 2,
        result.finalW + 4,
        result.finalH + 4,
      );
    }
  }

  // --- 2. DEDICATION PAGE (Optional) ---
  if (includeDedicationPage && dedicationText) {
    doc.addPage();
    // Page 2 (Left)
    // Vertical center roughly
    const dText = doc.splitTextToSize(
      dedicationText,
      CONTENT_WIDTH - SPACING.textPadding * 2,
    );
    centerText(
      dText,
      PAGE_HEIGHT / 2 - 40,
      FONT_Sizes.subtitle,
      FONTS.primary,
      "italic",
    );
  } else {
    // If no dedication, proceed to content.
    // Note: Standard publishing often requires content to start on Recto (Page 3).
    // If we want to strictly follow that, we would add a blank page here.
    // For now, we follow the existing logic which just moves to the next page.
  }

  // --- 3. CONTENT PAGES ---
  let displayPageNum = 1;
  for (let i = 1; i <= pageCount; i++) {
    const image = pageImages[i];
    const text = pageTexts[i];

    // Skip unused pages (no image and no text)
    if (!image && !text?.topLine && !text?.bottomLine) continue;

    doc.addPage();
    const currentPageNum = doc.getNumberOfPages();

    // Determine margins for this specific page
    const currentLeftMargin = getX(currentPageNum);
    const centerX = currentLeftMargin + CONTENT_WIDTH / 2;

    // Standard Page Border
    drawPageBorder(currentPageNum);

    // Page number
    doc.setFont(FONTS.primary, "normal");
    doc.setFontSize(FONT_Sizes.pageNumber);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Page ${displayPageNum}`,
      centerX,
      PAGE_HEIGHT - MARGIN_BOTTOM + 15,
      {
        align: "center",
      },
    );

    displayPageNum++;

    // Top Text
    if (text?.topLine) {
      doc.setFont(FONTS.primary, "bold");
      doc.setFontSize(FONT_Sizes.heading);
      doc.text(text.topLine, centerX, MARGIN_TOP + 40, { align: "center" });
    }

    // Image
    if (image) {
      // Space available for image
      const imgYStart = text?.topLine ? MARGIN_TOP + 60 : MARGIN_TOP + 20;
      const imgYEnd = text?.bottomLine
        ? PAGE_HEIGHT - MARGIN_BOTTOM - 60
        : PAGE_HEIGHT - MARGIN_BOTTOM - 20;

      const availableW = CONTENT_WIDTH - SPACING.imagePadding * 2;
      const availableH = imgYEnd - imgYStart;
      const imgX = currentLeftMargin + SPACING.imagePadding;

      addScaledImage(image, imgX, imgYStart, availableW, availableH);
    }

    // Bottom Text
    if (text?.bottomLine) {
      doc.setFont(FONTS.primary, "bold");
      doc.setFontSize(FONT_Sizes.heading);
      doc.setTextColor(0, 0, 0);
      doc.text(text.bottomLine, centerX, PAGE_HEIGHT - MARGIN_BOTTOM - 20, {
        align: "center",
      });
    }
  }

  return doc.output("blob");
};
