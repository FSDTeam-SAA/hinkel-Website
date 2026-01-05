import { api } from "@/lib/api";

export async function subscribeToNewsletter(email: string) {
  try {
    const res = await api.post("/guest/subscribe", { email });
    return res.data;
  } catch (err: any) {
    console.error("Error subscribing to newsletter:", err);
    throw new Error(
      err?.response?.data?.message || "Failed to subscribe to newsletter",
    );
  }
}
