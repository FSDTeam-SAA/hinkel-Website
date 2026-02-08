import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCmsContentApi,
  deleteCmsContentApi,
  getCmsContentApi,
  getCmsContentByIdApi,
  getCmsTypesApi,
  updateCmsContentApi,
  uploadImageApi,
  CmsQueryParams,
} from "../api/cms.api";

export const useCreateCms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCmsContentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      queryClient.invalidateQueries({ queryKey: ["cms-types"] });
    },
  });
};

export const useGetCms = (params: CmsQueryParams = {}) => {
  return useQuery({
    queryKey: ["cms-content", params],
    queryFn: () => getCmsContentApi(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useGetCmsById = (id: string) => {
  return useQuery({
    queryKey: ["cms-content-detail", id],
    queryFn: () => getCmsContentByIdApi(id),
    enabled: !!id,
  });
};

export const useUpdateCms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCmsContentApi,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      queryClient.invalidateQueries({
        queryKey: ["cms-content-detail", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["cms-types"] });
    },
  });
};

export const useDeleteCms = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCmsContentApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cms-content"] });
      queryClient.invalidateQueries({ queryKey: ["cms-types"] });
    },
  });
};

export const useGetCmsTypes = () => {
  return useQuery({
    queryKey: ["cms-types"],
    queryFn: getCmsTypesApi,
  });
};

export const useUploadImage = () => {
  return useMutation({
    mutationFn: uploadImageApi,
  });
};
