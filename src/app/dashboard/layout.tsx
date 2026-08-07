import Sidebar from "@/components/Sidebar";
import { ForceTermsModal } from "@/components/ForceTermsModal";
import ProtectedRoute from "@/app/components/ProtectedRoutes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <Sidebar />
        <main className="flex-1 w-full relative pt-16 lg:pt-0">
          {children}
        </main>
        <ForceTermsModal />
      </div>
    </ProtectedRoute>
  );
}
