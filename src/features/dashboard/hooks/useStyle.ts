// src/features/dashboard/hooks/useStyle.ts
"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStylesApi, createStyleApi, updateStyleApi } from "../api/style.api";

export const useStyles = () => {
  return useQuery({
    queryKey: ["styles"],
    queryFn: getStylesApi,
  });
};

export const useCreateStyle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createStyleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] });
    },
  });
};

export const useUpdateStyle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateStyleApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["styles"] });
    },
  });
};
