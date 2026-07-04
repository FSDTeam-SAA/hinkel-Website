import type { Metadata } from "next";
import DashboardShell from "@/components/dashboard/common/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | sketchLABS",
  description: "Manage your books, categories, site content and many more ...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardShell>{children}</DashboardShell>;
}
