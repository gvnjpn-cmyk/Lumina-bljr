import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#050810] flex">
      <Sidebar user={session.user} />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <TopBar user={session.user} />
        <main className="flex-1 p-4 md:p-6 pt-20 md:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
