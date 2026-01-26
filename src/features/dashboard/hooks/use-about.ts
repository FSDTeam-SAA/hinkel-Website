// src/features/dashboard/hooks/use-about.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAboutApi, updateAboutApi } from "../api/about.api";
import { AboutConfig } from "../types/about.types";
import { useSession } from "next-auth/react";

export const useAbout = () => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["about"],
    queryFn: () => getAboutApi(session?.accessToken),
    enabled: !!session?.accessToken,
  });
};

export const useUpdateAbout = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: Partial<AboutConfig>) =>
      updateAboutApi(data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about"] });
    },
  });
};
