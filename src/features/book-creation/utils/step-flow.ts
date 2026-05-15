import type {
  BookState,
  BookStep,
  CheckoutIntent,
  DeliveryType,
  OutputFormat,
} from "../types";

export function hasCoverSelection(
  state: Pick<BookState, "coverImageVariants" | "selectedCoverVariantIndex">,
) {
  if (state.selectedCoverVariantIndex !== null) {
    return Boolean(state.coverImageVariants[state.selectedCoverVariantIndex]);
  }

  return state.coverImageVariants.length > 0;
}

export function hasBookTitle(state: Pick<BookState, "bookTitle">) {
  return state.bookTitle.trim().length > 0;
}

export function resolveAccessibleStep(
  state: BookState,
  requestedStep: BookStep,
): BookStep {
  if (
    requestedStep === "free-generation" ||
    requestedStep === "setup" ||
    requestedStep === "success"
  ) {
    return requestedStep;
  }

  if (!state.hasPaid || !state.orderId) {
    return "setup";
  }

  if (requestedStep === "cover") {
    return "cover";
  }

  if (!hasCoverSelection(state)) {
    return "cover";
  }

  if (requestedStep === "dedication") {
    return "dedication";
  }

  if (!hasBookTitle(state)) {
    return "dedication";
  }

  if (requestedStep === "pages") {
    return "pages";
  }

  if (requestedStep === "review") {
    return "review";
  }

  return "setup";
}

export function resolvePostPaymentStep(
  state: BookState,
  checkoutIntent: CheckoutIntent | null,
  resumeStep: BookStep | null,
): BookStep {
  if (checkoutIntent === "package_upgrade_checkout") {
    return resolveAccessibleStep(state, "review");
  }

  if (checkoutIntent === "add_pages_checkout") {
    const requestedStep = resumeStep === "review" ? "review" : "pages";
    return resolveAccessibleStep(state, requestedStep);
  }

  return resolveAccessibleStep(state, "cover");
}

export function outputFormatFromDeliveryType(
  deliveryType?: DeliveryType | string | null,
): OutputFormat | null {
  switch (deliveryType) {
    case "digital":
      return "pdf";
    case "print":
      return "printed";
    case "print&digital":
      return "pdf&printed";
    default:
      return null;
  }
}

export function deliveryTypeFromOutputFormat(
  outputFormat?: OutputFormat | null,
): DeliveryType | null {
  switch (outputFormat) {
    case "pdf":
      return "digital";
    case "printed":
      return "print";
    case "pdf&printed":
      return "print&digital";
    default:
      return null;
  }
}
