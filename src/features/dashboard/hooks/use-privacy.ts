// src/features/dashboard/hooks/use-privacy.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPrivacyApi, updatePrivacyApi } from "../api/privacy.api";
import { PrivacyConfig } from "../types/privacy.types";
import { useSession } from "next-auth/react";

export const usePrivacy = () => {
  const { data: session } = useSession();
  return useQuery({
    queryKey: ["privacy"],
    queryFn: () => getPrivacyApi(session?.accessToken),
    enabled: !!session?.accessToken,
  });
};

export const useUpdatePrivacy = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: Partial<PrivacyConfig>) =>
      updatePrivacyApi(data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["privacy"] });
    },
  });
};
