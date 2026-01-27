// src/features/website-content/hooks/use-faq-content.ts
import { useQuery } from "@tanstack/react-query";
import { getPublicFaqApi } from "../api/website-content.api";

export const usePublicFaq = () => {
  return useQuery({
    queryKey: ["public-faq"],
    queryFn: () => getPublicFaqApi(),
  });
};
