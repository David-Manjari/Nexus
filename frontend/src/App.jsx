import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleGuard from "./auth/RoleGuard";
import AppLayout from "./layouts/AppLayout";
import { PAGE_LINKS } from "./layouts/Navbar";
import LoginPage from "./pages/auth/LoginPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminRolesPage from "./pages/admin/AdminRolesPage";
import Approvals from "./pages/approvals/Approvals";
import Disbursements from "./pages/disbursements/Disbursements";
import NotificationsPage from "./pages/notifications/NotificationsPage";

function getActivePage(pathname) {
  const pageId = pathname.replace(/^\/+/, "").split("/")[0];
  return PAGE_LINKS.find((page) => page.id === pageId) ?? PAGE_LINKS[0];
}

function DashboardHome() {
  const { user } = useAuth();

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <p style={{ margin: 0, color: "#475569" }}>Welcome back, {user?.name}</p>
      <h2 style={{ margin: 0 }}>Operations dashboard</h2>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        <span style={{ background: "#eff6ff", color: "#1d4ed8", padding: "8px 12px", borderRadius: "999px" }}>
          Role: {user?.role}
        </span>
        <span style={{ background: "#f1f5f9", color: "#334155", padding: "8px 12px", borderRadius: "999px" }}>
          Department: {user?.department}
        </span>
      </div>
    </div>
  );
}

function Shell() {
  const { pathname } = useLocation();
  const activePage = getActivePage(pathname);

  return (
    <AppLayout activePage={activePage.id}>
      <main className="page-content">
        <p className="page-eyebrow">Nexus workspace</p>
        <h1>{activePage.label}</h1>
        <Outlet />
      </main>
    </AppLayout>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/disbursements" element={<Disbursements />} />
          <Route path="/notifications" element={<NotificationsPage />} />

          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <Navigate to="/admin/users" replace />
              </RoleGuard>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <AdminUsersPage />
              </RoleGuard>
            }
          />

          <Route
            path="/admin/roles"
            element={
              <RoleGuard allowedRoles={["admin"]}>
                <AdminRolesPage />
              </RoleGuard>
            }
          />
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;