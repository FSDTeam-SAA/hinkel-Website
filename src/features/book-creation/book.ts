/**
 * Book Creation Flow Types
 * Defines all interfaces and types for the book creation process
 */

/**
 * Step names in the book creation workflow
 */
export type BookStep =
  | "landing"
  | "cover"
  | "setup"
  | "format"
  | "images"
  | "finalize"
  | "success";

/**
 * Supported output formats for the book
 */
export type OutputFormat = "pdf" | "printed" | "both";

/**
 * Page number to image URL mapping
 */
export type PageImages = Record<number, string>;

/**
 * Complete book configuration and state
 */
export interface BookState {
  // Step tracking
  step: BookStep;

  // Book metadata
  bookTitle: string;
  pageCount: number;
  includeDedicationPage: boolean;
  dedicationText: string;

  // Cover and preview
  coverImage: string | null;
  coverImageVariants: string[];
  selectedCoverVariantIndex: number | null;

  // Page content
  pageImages: PageImages;
  uploadedPageImages: Record<number, string[]>;
  convertedPageImages: Record<number, string[]>;

  // Order details
  outputFormat: OutputFormat | null;
  hasPaid: boolean;
}

/**
 * All actions for updating book state
 */
export interface BookActions {
  // Navigation
  setStep: (step: BookStep) => void;

  // Book setup
  setBookTitle: (title: string) => void;
  setPageCount: (count: number) => void;
  setIncludeDedicationPage: (include: boolean) => void;
  setDedicationText: (text: string) => void;

  // Cover management
  setCoverImage: (image: string | null) => void;
  setCoverImageVariants: (variants: string[]) => void;
  setSelectedCoverVariant: (index: number) => void;

  // Page images
  setPageImages: (images: PageImages) => void;
  updatePageImage: (pageNum: number, image: string) => void;

  // Uploaded images management
  setUploadedPageImages: (uploadedPageImages: Record<number, string[]>) => void;
  addUploadedPageImage: (pageNum: number, image: string) => void;
  removeUploadedPageImage: (pageNum: number, index: number) => void;

  // Converted images management
  addConvertedPageImage: (pageNum: number, image: string) => void;
  removeConvertedPageImage: (pageNum: number, index: number) => void;

  // Order details
  setOutputFormat: (format: OutputFormat) => void;
  setHasPaid: (paid: boolean) => void;

  // Reset state
  resetBook: () => void;
}

/**
 * Combined store type (state + actions)
 */
export type BookStore = BookState & BookActions;

/**
 * File validation constants
 */
export const FILE_VALIDATION = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ["image/jpeg", "image/png", "image/webp"],
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp"],
} as const;

/**
 * Page count options
 */
export const PAGE_COUNT_OPTIONS = [10, 20, 30, 40] as const;

/**
 * Output format pricing
 */
export const PRICING = {
  pdf: 24.22,
  printed: 24.22,
  both: 24.22,
} as const;
