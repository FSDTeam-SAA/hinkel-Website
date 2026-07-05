import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const refreshAccessToken = async (refreshToken: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/auth/refresh-access-token`,
      {
        refreshToken,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw error;
  }
};
