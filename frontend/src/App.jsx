import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import useAuthStore from "@/store/authStore";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PendingApprovalPage from "@/pages/auth/PendingApprovalPage";
import LibrarianDashboard from "@/pages/librarian/LibrarianDashboard";
import MemberDashboard from "@/pages/member/MemberDashboard";
import ManagementDashboard from "@/pages/management/ManagementDashboard";

export default function App() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (isInitializing) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/" element={<HomePage />} />

        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />
        <Route path="/pending-approval" element={<PendingApprovalPage />} />

        {/* Authenticated Routes (Dashboards) */}

        {/* Librarian Routes */}
        <Route
          path="/librarian/*"
          element={
            <DashboardLayout requiredRole="LIBRARIAN">
              <LibrarianDashboard />
            </DashboardLayout>
          }
        />

        {/* Member Routes */}
        <Route
          path="/member/*"
          element={
            <DashboardLayout requiredRole="MEMBER">
              <MemberDashboard />
            </DashboardLayout>
          }
        />

        {/* Management Routes */}
        <Route
          path="/management/*"
          element={
            <DashboardLayout requiredRole="CAMPUS_MANAGEMENT">
              <ManagementDashboard />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
