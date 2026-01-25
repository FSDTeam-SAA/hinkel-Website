import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFaqApi, updateFaqApi } from "../api/faq.api";
import { FaqConfig } from "../types/faq.types";
import { useSession } from "next-auth/react";

export const useFaq = () => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["faqs"],
    queryFn: () => getFaqApi(session?.accessToken),
    enabled: !!session?.accessToken,
  });
};

export const useUpdateFaq = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: FaqConfig) => updateFaqApi(data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["faqs"] });
    },
  });
};
