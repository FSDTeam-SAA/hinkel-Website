
import { api } from "@/lib/api";
import { PricingResponse } from "../types/pricing.types";

export const GetPricing = async () => {
    try {
        const res = await api.get<PricingResponse>("/pricing/admin/get-prices");
        return res.data;
    } catch (error) {
        throw error;
    }
};
