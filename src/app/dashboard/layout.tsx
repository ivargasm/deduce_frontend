import Sidebar from "@/components/Sidebar";
import { ForceTermsModal } from "@/components/ForceTermsModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 w-full relative pt-16 lg:pt-0">
        {children}
      </main>
      <ForceTermsModal />
    </div>
  );
}
