
import { useState } from "react";
import { GetPricing } from "../api/getpricing.api";
import { PricingResponse } from "../types/pricing.types";

export const useGetPricing = () => {
    const [pricing, setPricing] = useState<PricingResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getPricing = async () => {
        setLoading(true);
        try {
            const res = await GetPricing();
            setPricing(res);
        } catch (error) {
            setError(error as string);
        } finally {
            setLoading(false);
        }
    };

    return { pricing, loading, error, getPricing };
};