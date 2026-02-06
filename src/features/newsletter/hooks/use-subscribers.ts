import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllSubscribers,
  deleteSubscriber,
} from "@/features/newsletter/api/newsletter.api";
import { toast } from "sonner";

export const useSubscribers = (params: Record<string, unknown> = {}) => {
  return useQuery({
    queryKey: ["subscribers", params],
    queryFn: () => getAllSubscribers(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscribers"] });
      toast.success("Subscriber deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete subscriber");
    },
  });
};
