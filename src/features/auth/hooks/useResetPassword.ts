// features/auth/hooks/useresetpassword.ts
"use client";
import { useState } from "react";
import { resetPassword as resetPasswordApi } from "../api/resetpassword.api";

export function useResetPassword() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);

    const handleResetPassword = async (data: { email: string; newPassword: string }) => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const response = await resetPasswordApi(data);
            setSuccess(true);
            return response;
        } catch (error) {
            const err = error as { response?: { data?: { message?: string } }; message?: string };
            setError(err.response?.data?.message || err.message || "Something went wrong");
            return null;
        } finally {
            setLoading(false);
        }
    }

    return { handleResetPassword, loading, error, success };
}
