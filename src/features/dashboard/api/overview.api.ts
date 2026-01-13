// features/dashboard/api/overview.api.ts

import { api } from "@/lib/api";

export async function getOverviewData() {
    try {
        const res = await api.get("order/admin/dashboard-stats");
        return res.data;
    } catch (error) {
        console.error("Error fetching overview data:", error);
        throw error;
    }
}
