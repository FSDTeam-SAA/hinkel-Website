import { api } from "@/lib/api";

export async function subscribeToNewsletter(email: string) {
  try {
    const res = await api.post("/guest/subscribe", { email });
    return res.data;
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to subscribe to newsletter";
    throw new Error(message);
  }
}

export async function getAllSubscribers(params: Record<string, unknown> = {}) {
  try {
    const res = await api.get("/guest/get-all-emails", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    throw new Error("Failed to fetch subscribers");
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const res = await api.delete(`/guest/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting subscriber:", error);
    const err = error as {
      response?: { data?: { message?: string } };
      message?: string;
    };
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to delete subscriber";
    throw new Error(message);
  }
}
