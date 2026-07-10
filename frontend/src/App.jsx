import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import useAuthStore from "@/store/authStore";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LibrarianDashboard from "@/pages/librarian/LibrarianDashboard";
import CatalogPage from "@/pages/librarian/catalog/CatalogPage";
import AddBookPage from "@/pages/librarian/catalog/AddBookPage";
import EditBookPage from "@/pages/librarian/catalog/EditBookPage";
import BookCopiesPage from "@/pages/librarian/catalog/BookCopiesPage";
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

        {/* Authenticated Routes (Dashboards) */}

        {/* Librarian Routes */}
        <Route
          path="/librarian"
          element={
            <DashboardLayout requiredRole="LIBRARIAN">
              <LibrarianDashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/librarian/catalog"
          element={
            <DashboardLayout requiredRole="LIBRARIAN">
              <CatalogPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/librarian/catalog/add"
          element={
            <DashboardLayout requiredRole="LIBRARIAN">
              <AddBookPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/librarian/catalog/:id/edit"
          element={
            <DashboardLayout requiredRole="LIBRARIAN">
              <EditBookPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/librarian/catalog/:id/copies"
          element={
            <DashboardLayout requiredRole="LIBRARIAN">
              <BookCopiesPage />
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
