// features/dashboard/hooks/useAllBooks.ts
"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllBooks, uploadBook } from "../api/allbooks.api";

export const useAllBooks = () => {
    return useQuery({
        queryKey: ["ordered-books"],
        queryFn: getAllBooks,
    });
};

export const useUploadBook = () => {
    return useMutation({
        mutationFn: (formData: FormData) => uploadBook(formData),
    });
};