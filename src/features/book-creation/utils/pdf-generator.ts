import { jsPDF } from "jspdf";
import { BookState } from "../types";

/**
 * Generates a coloring book PDF based on the current store state
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

  // A4 dimensions in points (72 points per inch)
  // A4 = 210mm x 297mm = ~595pt x 842pt
  const doc = new jsPDF({
    orientation: "p",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  // 1. Cover Page
  // Use the sketch version (variant) if available, otherwise fall back to coverImage
  const finalCoverImage =
    coverImageVariants && coverImageVariants.length > 0
      ? coverImageVariants[selectedCoverVariantIndex || 0]
      : coverImage;

  // Render Cover Page
  // Background/Border
  doc.setDrawColor(255, 139, 54); // Brand orange #ff8b36
  doc.setLineWidth(15);
  doc.rect(20, 20, pageWidth - 40, pageHeight - 40);
  doc.setLineWidth(2);
  doc.rect(40, 40, pageWidth - 80, pageHeight - 80);

  // Title Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(48);
  doc.setTextColor(10, 10, 10);
  const displayTitle = bookTitle || "My Coloring Book";
  const titleLines = doc.splitTextToSize(
    displayTitle.toUpperCase(),
    contentWidth - 40,
  );
  doc.text(titleLines, pageWidth / 2, 120, { align: "center" });

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.setTextColor(100, 100, 100);
  doc.text("PERSONALIZED SKETCH BOOK", pageWidth / 2, 160, {
    align: "center",
  });

  if (finalCoverImage) {
    try {
      const props = doc.getImageProperties(finalCoverImage as string);
      const imgWidth = props.width;
      const imgHeight = props.height;
      const imgRatio = imgWidth / imgHeight;

      // Image Area: Between title and footer
      const imgYStart = 200;
      const imgYEnd = pageHeight - 120;
      const maxW = contentWidth - 80;
      const maxH = imgYEnd - imgYStart;
      const boxRatio = maxW / maxH;

      let finalW, finalH;
      if (imgRatio > boxRatio) {
        finalW = maxW;
        finalH = maxW / imgRatio;
      } else {
        finalH = maxH;
        finalW = maxH * imgRatio;
      }

      const finalX = (pageWidth - finalW) / 2;
      const finalY = imgYStart + (maxH - finalH) / 2;

      // Image Frame
      doc.setDrawColor(240, 240, 240);
      doc.setLineWidth(1);
      doc.rect(finalX - 5, finalY - 5, finalW + 10, finalH + 10);

      doc.addImage(
        finalCoverImage as string,
        "JPEG",
        finalX,
        finalY,
        finalW,
        finalH,
        undefined,
        "FAST",
      );
    } catch (e) {
      console.error("Error adding cover image:", e);
    }
  } else {
    // Decorative Placeholder for image if missing
    doc.setDrawColor(240, 240, 240);
    doc.setLineWidth(1);
    doc.rect(pageWidth / 4, pageHeight / 3, pageWidth / 2, pageHeight / 3);
  }

  // Footer / Branding
  doc.setFont("helvetica", "bold italic");
  doc.setFontSize(14);
  doc.setTextColor(255, 139, 54);
  doc.text("https://sktchlabs.com/", pageWidth / 2, pageHeight - 65, {
    align: "center",
  });

  doc.addPage();

  // 2. Dedication Page
  if (includeDedicationPage && dedicationText) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(18);
    const splitText = doc.splitTextToSize(dedicationText, contentWidth);
    doc.text(splitText, pageWidth / 2, pageHeight / 2 - 20, {
      align: "center",
    });
    doc.addPage();
  }

  // 3. Content Pages
  for (let i = 1; i <= pageCount; i++) {
    const image = pageImages[i];
    const text = pageTexts[i];

    if (image || text?.topLine || text?.bottomLine) {
      // Add Page Border? (Gives it a "frame" feel)
      doc.setDrawColor(230, 230, 230);
      doc.setLineWidth(1);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);

      // Add Page Number (Small, at bottom)
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(150, 150, 150);
      doc.text(`Page ${i}`, pageWidth / 2, pageHeight - 15, {
        align: "center",
      });

      // Add Top Line Text
      if (text?.topLine) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        // Use a slightly lower Y position for better visual balance
        doc.text(text.topLine, pageWidth / 2, margin + 45, { align: "center" });
      }

      // Add Image
      if (image) {
        try {
          const props = doc.getImageProperties(image);
          const imgWidth = props.width;
          const imgHeight = props.height;
          const imgRatio = imgWidth / imgHeight;

          // Define the target box
          const imgYStart = text?.topLine ? margin + 80 : margin + 40;
          const imgYEnd = text?.bottomLine
            ? pageHeight - margin - 80
            : pageHeight - margin - 40;
          const maxW = contentWidth;
          const maxH = imgYEnd - imgYStart;
          const boxRatio = maxW / maxH;

          let finalW, finalH;
          if (imgRatio > boxRatio) {
            // Limited by width
            finalW = maxW;
            finalH = maxW / imgRatio;
          } else {
            // Limited by height
            finalH = maxH;
            finalW = maxH * imgRatio;
          }

          // Center both horizontally and vertically within the box
          const finalX = margin + (maxW - finalW) / 2;
          const finalY = imgYStart + (maxH - finalH) / 2;

          doc.addImage(
            image,
            "JPEG",
            finalX,
            finalY,
            finalW,
            finalH,
            undefined,
            "FAST",
          );
        } catch (e) {
          console.error(`Error adding image for page ${i}:`, e);
          doc.setFontSize(14);
          doc.text(
            "[Image Missing or Invalid]",
            pageWidth / 2,
            pageHeight / 2,
            { align: "center" },
          );
        }
      }

      // Add Bottom Line Text
      if (text?.bottomLine) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text(text.bottomLine, pageWidth / 2, pageHeight - margin - 40, {
          align: "center",
        });
      }

      // Add new page for next iteration (unless it's the last page)
      if (i < pageCount) {
        doc.addPage();
      }
    } else {
      // Blank page with number and border
      doc.setDrawColor(240, 240, 240);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text(`Page ${i}`, pageWidth / 2, pageHeight - 15, {
        align: "center",
      });
      if (i < pageCount) doc.addPage();
    }
  }

  return doc.output("blob");
};
