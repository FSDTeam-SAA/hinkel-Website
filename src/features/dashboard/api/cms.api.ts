import { api } from "@/lib/api";

// Types
export interface CmsContent {
  _id: string;
  type: string;
  title?: string;
  richText?: string; // JSON string
  plainText?: string;
  image?: string;
  isActive?: boolean;
  order?: number;
  metadata?: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface CreateCmsDto {
  type: string;
  title?: string;
  richText?: string;
  plainText?: string;
  isActive?: boolean; // defaults to true in backend
  order?: number;
  metadata?: string;
  image?: File;
}

export interface UpdateCmsDto {
  type?: string;
  title?: string;
  richText?: string;
  plainText?: string;
  isActive?: boolean;
  order?: number;
  metadata?: string;
  image?: File;
}

export interface CmsQueryParams {
  type?: string;
  isActive?: string; // 'true' | 'false'
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// API Functions

export const createCmsContentApi = (data: CreateCmsDto) => {
  const formData = new FormData();
  formData.append("type", data.type);
  if (data.title) formData.append("title", data.title);
  if (data.richText) formData.append("richText", data.richText);
  if (data.plainText) formData.append("plainText", data.plainText);
  if (data.isActive !== undefined)
    formData.append("isActive", String(data.isActive));
  if (data.order !== undefined) formData.append("order", String(data.order));
  if (data.metadata) formData.append("metadata", data.metadata);
  if (data.image) formData.append("image", data.image);

  return api.post("/content/cms", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getCmsContentApi = (params: CmsQueryParams = {}) => {
  // Build query string
  const query = new URLSearchParams();
  if (params.type) query.append("type", params.type);
  if (params.isActive) query.append("isActive", params.isActive);
  if (params.page) query.append("page", params.page.toString());
  if (params.limit) query.append("limit", params.limit.toString());
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.sortOrder) query.append("sortOrder", params.sortOrder);

  return api.get(`/content/cms?${query.toString()}`);
};

export const getCmsContentByIdApi = (id: string) => {
  return api.get(`/content/cms/${id}`);
};

export const getCmsContentByTypeApi = (type: string, page = 1, limit = 10) => {
  return api.get(`/content/cms/type/${type}?page=${page}&limit=${limit}`);
};

export const updateCmsContentApi = ({
  id,
  data,
}: {
  id: string;
  data: UpdateCmsDto;
}) => {
  const formData = new FormData();
  if (data.type) formData.append("type", data.type);
  if (data.title) formData.append("title", data.title);
  if (data.richText) formData.append("richText", data.richText);
  if (data.plainText) formData.append("plainText", data.plainText);
  if (data.isActive !== undefined)
    formData.append("isActive", String(data.isActive));
  if (data.order !== undefined) formData.append("order", String(data.order));
  if (data.metadata) formData.append("metadata", data.metadata);
  if (data.image) formData.append("image", data.image);

  return api.patch(`/content/cms/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteCmsContentApi = (id: string) => {
  return api.delete(`/content/cms/${id}`);
};

export const getCmsTypesApi = () => {
  return api.get("/content/types/list");
};

export const uploadImageApi = (image: File) => {
  const formData = new FormData();
  formData.append("images", image);
  return api.post("/upload/images", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
