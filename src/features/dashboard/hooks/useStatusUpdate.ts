// features/dashboard/hooks/useStatusUpdate.ts

import { useState } from "react";
import { changeOrderStatus } from "../api/statuschange.api";

export function useStatusUpdate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const updateStatus = async (
    orderId: string,
    status: string,
    rejectionReason?: string,
  ) => {
    setLoading(true);
    setError(null);

    try {
      await changeOrderStatus(orderId, status, rejectionReason);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateStatus,
    loading,
    error,
  };
}
