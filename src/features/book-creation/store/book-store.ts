import { create } from "zustand";
import type { BookState, BookStore } from "../book";

export type BookStep =
  | "landing"
  | "setup"
  | "format"
  | "cover"
  | "images"
  | "finalize"
  | "success";

const initialState: BookState = {
  step: "landing",
  bookTitle: "",
  pageCount: 20,
  includeDedicationPage: false,
  outputFormat: null,
  coverImage: null,
  coverImageVariants: [],
  selectedCoverVariantIndex: null,
  pageImages: {},
  uploadedPageImages: {},
  dedicationText: "",
  hasPaid: false,
};

export const useBookStore = create<BookStore>((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),
  setBookTitle: (bookTitle) => set({ bookTitle }),
  setPageCount: (pageCount) => set({ pageCount }),
  setIncludeDedicationPage: (includeDedicationPage) =>
    set({ includeDedicationPage }),
  setOutputFormat: (outputFormat) => set({ outputFormat }),
  setCoverImage: (coverImage) => set({ coverImage }),
  setCoverImageVariants: (coverImageVariants) => set({ coverImageVariants }),
  setSelectedCoverVariant: (selectedCoverVariantIndex) =>
    set({ selectedCoverVariantIndex }),
  setPageImages: (pageImages) => set({ pageImages }),
  updatePageImage: (pageNum, image) =>
    set((state) => ({
      pageImages: {
        ...state.pageImages,
        [pageNum]: image,
      },
    })),
  setUploadedPageImages: (uploadedPageImages) => set({ uploadedPageImages }),
  addUploadedPageImage: (pageNum, image) =>
    set((state) => {
      const currentImages = state.uploadedPageImages[pageNum] || [];
      return {
        uploadedPageImages: {
          ...state.uploadedPageImages,
          [pageNum]: [...currentImages, image],
        },
      };
    }),
  removeUploadedPageImage: (pageNum, index) =>
    set((state) => {
      const currentImages = state.uploadedPageImages[pageNum] || [];
      const newImages = [...currentImages];
      newImages.splice(index, 1);
      return {
        uploadedPageImages: {
          ...state.uploadedPageImages,
          [pageNum]: newImages,
        },
      };
    }),
  setDedicationText: (dedicationText) => set({ dedicationText }),
  setHasPaid: (hasPaid) => set({ hasPaid }),
  resetBook: () => set(initialState),
}));
