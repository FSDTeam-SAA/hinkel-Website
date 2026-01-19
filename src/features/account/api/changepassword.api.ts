// features/account/api/changepassword.api.ts
import { api } from "@/lib/api";

export const changePassword = async (data: { oldPassword: string; newPassword: string }, accessToken: string) => {
    try {
        const response = await api.post("/auth/change-password", data, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
