import { Navigate } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function DashboardLayout({ children, requiredRole }) {
  const user = useAuthStore((state) => state.user);

  // Simple route protection
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Very basic role check
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" replace />; // or to a 403 page
  }

  return (
    <div className="bg-muted/40 flex min-h-screen w-full flex-col">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        {/* Desktop Sidebar */}
        <aside className="bg-background fixed inset-y-0 left-0 z-10 hidden w-64 flex-col border-r sm:flex">
          <Sidebar />
        </aside>

        {/* Header & Main content */}
        <Header />

        <main className="flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">{children}</main>
      </div>
    </div>
  );
}
