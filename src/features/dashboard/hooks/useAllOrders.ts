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
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAllOrders();
      setOrders(res.data); // API shape: { success, count, data }
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
  };
}
