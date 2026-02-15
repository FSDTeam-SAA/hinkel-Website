// src/features/dashboard/hooks/use-return-policy.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReturnPolicyApi,
  createReturnPolicyApi,
  updateReturnPolicyApi,
  deleteReturnPolicyApi,
} from "../api/return-policy.api";
import { ReturnPolicyPayload } from "../types/return-policy.types";
import { useSession } from "next-auth/react";

export const RETURN_POLICY_QUERY_KEY = ["return-policy"];

export const useReturnPolicy = () => {
  return useQuery({
    queryKey: RETURN_POLICY_QUERY_KEY,
    queryFn: () => getReturnPolicyApi(),
  });
};

export const useCreateReturnPolicy = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (data: ReturnPolicyPayload) =>
      createReturnPolicyApi(data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RETURN_POLICY_QUERY_KEY });
    },
  });
};

export const useUpdateReturnPolicy = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<ReturnPolicyPayload>;
    }) => updateReturnPolicyApi(id, data, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RETURN_POLICY_QUERY_KEY });
    },
  });
};

export const useDeleteReturnPolicy = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  return useMutation({
    mutationFn: (id: string) => deleteReturnPolicyApi(id, session?.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RETURN_POLICY_QUERY_KEY });
    },
  });
};
