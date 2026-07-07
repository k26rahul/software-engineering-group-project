import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layouts
import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Pages
import HomePage from "@/pages/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import LibrarianDashboard from "@/pages/librarian/LibrarianDashboard";
import MemberDashboard from "@/pages/member/MemberDashboard";
import ManagementDashboard from "@/pages/management/ManagementDashboard";

export default function App() {
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
          path="/librarian/*"
          element={
            <DashboardLayout requiredRole="Librarian">
              <LibrarianDashboard />
            </DashboardLayout>
          }
        />

        {/* Member Routes */}
        <Route
          path="/member/*"
          element={
            <DashboardLayout requiredRole="Member">
              <MemberDashboard />
            </DashboardLayout>
          }
        />

        {/* Management Routes */}
        <Route
          path="/management/*"
          element={
            <DashboardLayout requiredRole="Management">
              <ManagementDashboard />
            </DashboardLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
