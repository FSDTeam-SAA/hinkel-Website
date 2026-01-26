// src/features/website-content/hooks/use-privacy-content.ts
import { useQuery } from "@tanstack/react-query";
import { getPublicPrivacyApi } from "../api/website-content.api";

export const usePublicPrivacy = () => {
  return useQuery({
    queryKey: ["public-privacy"],
    queryFn: () => getPublicPrivacyApi(),
  });
};
