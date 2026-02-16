// src/features/website-content/hooks/use-return-policy-content.ts
import { useQuery } from "@tanstack/react-query";
import { getReturnPolicyApi } from "@/features/dashboard/api/return-policy.api";

export const usePublicReturnPolicy = () => {
  return useQuery({
    queryKey: ["public-return-policy"],
    queryFn: () => getReturnPolicyApi(),
  });
};
