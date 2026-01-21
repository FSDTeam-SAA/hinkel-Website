import { api } from "@/lib/api";
import { UploadBookRequest, UploadBookResponse } from "../types";

export const uploadBook = async (
  data: UploadBookRequest,
): Promise<UploadBookResponse> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("image", data.image);
  formData.append("orderId", data.orderId);
  if (data.approvalStatus) {
    formData.append("approvalStatus", data.approvalStatus);
  }

  const response = await api.put("/order/upload-book", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
