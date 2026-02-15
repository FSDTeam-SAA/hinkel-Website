// src/features/dashboard/hooks/use-terms-conditions.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTermConditionApi,
  createTermConditionApi,
  updateTermConditionApi,
  deleteTermConditionApi,
} from "../api/terms-conditions.api";
import { TermConditionPayload } from "../types/terms-conditions.types";
import { useSession } from "next-auth/react";

export const TERMS_CONDITIONS_QUERY_KEY = ["terms-conditions"];

export const useTermCondition = () => {
  return useQuery({
    queryKey: TERMS_CONDITIONS_QUERY_KEY,
    queryFn: () => getTermConditionApi(),
  });
};

export const useCreateTermCondition = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: TermConditionPayload) =>
      createTermConditionApi(data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TERMS_CONDITIONS_QUERY_KEY });
    },
  });
};

export const useUpdateTermCondition = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<TermConditionPayload>;
    }) => updateTermConditionApi(id, data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TERMS_CONDITIONS_QUERY_KEY });
    },
  });
};

export const useDeleteTermCondition = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (id: string) =>
      deleteTermConditionApi(id, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TERMS_CONDITIONS_QUERY_KEY });
    },
  });
};
