import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import BookCreation from "@/features/book-creation/pages/BookCreation";
import { authOptions } from "@/lib/auth-options";

export default async function page() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=%2Fcreate-book");
  }

  return <BookCreation />;
}
