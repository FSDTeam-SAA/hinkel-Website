"use client";
import { useEffect, useState } from "react";
import { getAllOrders } from "../api/allOrders.api";

export interface Order {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  pageCount: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export function useAllOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await getAllOrders();
        setOrders(res.data); // API shape: { success, count, data }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
  };
}
