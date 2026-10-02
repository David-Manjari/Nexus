import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RoleGuard({
  allowedRoles = [],
  children,
  fallback = <Navigate to="/unauthorized" replace />,
}) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = Array.isArray(user.roles) ? user.roles : [user.role];
  const hasAccess = allowedRoles.length === 0 || allowedRoles.some((role) => userRoles.includes(role));

  if (!hasAccess) {
    return fallback;
  }

  return children;
}
