import { useCallback, useEffect, useState } from "react";
import { getAllOrders } from "../api/allOrders.api";

export interface Order {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    role: string;
    isVerified: boolean;
    profileImage: string;
  } | null;
  deliveryType: string;
  pageCount: number;
  totalAmount: number;
  status: string;
  deliveryStatus: string;
  stripeSessionId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  approvalStatus?: string;
  book?: string;
  title?: string;
  refundStatus?: string;
  stripePaymentIntentId?: string;
}

export function useAllOrders(page: number = 1, limit: number = 10) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllOrders(page, limit);
      setOrders(res.data); // API shape: { success, count, data }
      setTotalCount(res.count || 0);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    totalCount,
    loading,
    error,
    refetch: fetchOrders,
  };
}
