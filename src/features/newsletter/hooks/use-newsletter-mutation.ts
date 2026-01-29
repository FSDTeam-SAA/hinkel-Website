import { useMutation } from "@tanstack/react-query";
import { subscribeToNewsletter } from "../api/newsletter.api";
import { toast } from "sonner";

export const useNewsletterMutation = () => {
  return useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: (data) => {
      toast.success(data?.message || "Successfully subscribed to newsletter!");
    },
    onError: (error: Error) => {
      let message = error.message;
      if (message.toLowerCase().includes("already") || message.toLowerCase().includes("exist")) {
        message = "Already subscribed";
      }
      toast.error(message || "Failed to subscribe. Please try again.");
    },
  });
};
