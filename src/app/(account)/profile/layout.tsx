import ProfileSidebar from "@/components/account/common/ProfileSidebar";

// app/profile/layout.tsx
export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container  flex min-h-[600px] gap-8 py-10">
      <aside className="w-64">
        <ProfileSidebar />
      </aside>
      <main className="flex-1 rounded-xl mx-auto border border-gray-100 bg-white p-8 shadow-sm">
        {children}
      </main>
    </div>
  );
}