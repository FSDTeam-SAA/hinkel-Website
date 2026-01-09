// features/auth/api/changepassword.api.ts
import { api } from "@/lib/api";



export const changePassword = async (data: { userId: string; oldPassword: string; newPassword: string }, accessToken: string) => {
    const res = await api.post('/auth/change-password', data, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return res.data;
};
