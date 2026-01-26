// src/features/website-content/hooks/use-about-content.ts
import { useQuery } from "@tanstack/react-query";
import { getPublicAboutApi } from "../api/website-content.api";

export const usePublicAbout = () => {
  return useQuery({
    queryKey: ["public-about"],
    queryFn: () => getPublicAboutApi(),
  });
};
