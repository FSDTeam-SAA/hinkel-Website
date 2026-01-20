import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BookState, BookStore } from "../types";

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
  pageTexts: {},
  uploadedPageImages: {},
  convertedPageImages: {},
  dedicationText: "",
  hasPaid: false,
  orderId: null,
};

export const useBookStore = create<BookStore>()(
  persist(
    (set) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      setBookTitle: (bookTitle) => set({ bookTitle }),
      setPageCount: (pageCount) => set({ pageCount }),
      setIncludeDedicationPage: (includeDedicationPage) =>
        set({ includeDedicationPage }),
      setOutputFormat: (outputFormat) => set({ outputFormat }),
      setCoverImage: (coverImage) => set({ coverImage }),
      setCoverImageVariants: (coverImageVariants) =>
        set({ coverImageVariants }),
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
      updatePageText: (pageNum, topLine, bottomLine) =>
        set((state) => ({
          pageTexts: {
            ...state.pageTexts,
            [pageNum]: { topLine, bottomLine },
          },
        })),
      setUploadedPageImages: (uploadedPageImages) =>
        set({ uploadedPageImages }),
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
      addConvertedPageImage: (pageNum, image) =>
        set((state) => {
          const currentImages = state.convertedPageImages[pageNum] || [];
          return {
            convertedPageImages: {
              ...state.convertedPageImages,
              [pageNum]: [...currentImages, image],
            },
          };
        }),
      removeConvertedPageImage: (pageNum, index) =>
        set((state) => {
          const currentImages = state.convertedPageImages[pageNum] || [];
          const newImages = [...currentImages];
          newImages.splice(index, 1);
          return {
            convertedPageImages: {
              ...state.convertedPageImages,
              [pageNum]: newImages,
            },
          };
        }),
      setDedicationText: (dedicationText) => set({ dedicationText }),
      setHasPaid: (hasPaid) => set({ hasPaid }),
      setOrderId: (orderId) => set({ orderId }),
      resetBook: () => set(initialState),
    }),
    {
      name: "hinklecreek-book-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
