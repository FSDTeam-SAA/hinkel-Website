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
  if (coverImage) {
    try {
      const props = doc.getImageProperties(coverImage);
      const imgRatio = props.width / props.height;
      const pageRatio = pageWidth / pageHeight;

      let finalW, finalH, finalX, finalY;
      if (imgRatio > pageRatio) {
        // Image is wider than page
        finalW = pageWidth;
        finalH = pageWidth / imgRatio;
        finalX = 0;
        finalY = (pageHeight - finalH) / 2;
      } else {
        // Image is taller than page
        finalH = pageHeight;
        finalW = pageHeight * imgRatio;
        finalX = (pageWidth - finalW) / 2;
        finalY = 0;
      }

      doc.addImage(coverImage, "JPEG", finalX, finalY, finalW, finalH);

      // Title Overlay (Optional - usually on the image)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(36);
      doc.setTextColor(0, 0, 0);
      // You could add text here if wanted: doc.text(bookTitle, pageWidth / 2, 100, { align: "center" });

      doc.addPage();
    } catch (e) {
      console.error("Error adding cover image:", e);
    }
  } else {
    // Basic Title Page if no cover
    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.text(bookTitle || "My Coloring Book", pageWidth / 2, pageHeight / 2, {
      align: "center",
    });
    doc.addPage();
  }

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
