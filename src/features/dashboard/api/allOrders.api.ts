import { api } from "@/lib/api";

export async function getAllOrders(page: number = 1, limit: number = 10) {
  try {
    const res = await api.get(`order/admin/all-orders?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    throw error;
  }
}

