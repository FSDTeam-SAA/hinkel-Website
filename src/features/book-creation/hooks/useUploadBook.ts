import { useMutation } from "@tanstack/react-query";
import { uploadBook } from "../api/order.api";
import { UploadBookRequest } from "../types";
import { toast } from "sonner";

export function useUploadBook() {
  const mutation = useMutation({
    mutationFn: (data: UploadBookRequest) => uploadBook(data),
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || "Book uploaded successfully!");
      } else {
        toast.error(data.message || "Failed to upload book");
      }
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message?: string;
    }) => {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to upload book";
      toast.error(errorMessage);
    },
  });

  return {
    uploadBook: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
}
