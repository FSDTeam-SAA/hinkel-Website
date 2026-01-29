import { api } from "@/lib/api";

export async function subscribeToNewsletter(email: string) {
  try {
    const res = await api.post("/guest/subscribe", { email });
    return res.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    const err = error as { response?: { data?: { message?: string } }; message?: string };
    const message = err.response?.data?.message || err.message || "Failed to subscribe to newsletter";
    throw new Error(message);
  }
}
