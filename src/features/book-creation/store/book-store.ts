import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { indexedDbStorage } from "@/lib/indexed-db-storage";
import type { BookState, BookStore } from "../types";
import { GENERATION_LIMITS } from "../types";

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
  returnStep: null,
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
  generationCounts: {
    cover: 0,
    pages: {},
  },
  dedicationText: "",
  hasPaid: false,
  orderId: null,
  pendingExtraPages: null,
};

export const useBookStore = create<BookStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setStep: (step) => set({ step }),
      setReturnStep: (returnStep) => set({ returnStep }),
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

      // Generation count tracking
      incrementCoverGeneration: () =>
        set((state) => ({
          generationCounts: {
            ...state.generationCounts,
            cover: state.generationCounts.cover + 1,
          },
        })),
      incrementPageGeneration: (pageNum) =>
        set((state) => ({
          generationCounts: {
            ...state.generationCounts,
            pages: {
              ...state.generationCounts.pages,
              [pageNum]: (state.generationCounts.pages[pageNum] || 0) + 1,
            },
          },
        })),
      canGenerateCover: () => {
        const state = get();
        return state.generationCounts.cover < GENERATION_LIMITS.MAX_COVER;
      },
      canGeneratePage: (pageNum) => {
        const state = get();
        const count = state.generationCounts.pages[pageNum] || 0;
        return count < GENERATION_LIMITS.MAX_PER_PAGE;
      },
      getPageGenerationCount: (pageNum) => {
        const state = get();
        return state.generationCounts.pages[pageNum] || 0;
      },

      setDedicationText: (dedicationText) => set({ dedicationText }),
      setHasPaid: (hasPaid) => set({ hasPaid }),
      setOrderId: (orderId) => set({ orderId }),
      setPendingExtraPages: (pendingExtraPages) => set({ pendingExtraPages }),
      resetBook: () => set(initialState),
    }),
    {
      name: "hinklecreek-book-storage",
      storage: createJSONStorage(() => indexedDbStorage),
    },
  ),
);
