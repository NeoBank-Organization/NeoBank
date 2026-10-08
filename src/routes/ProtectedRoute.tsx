import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { UserRole } from "../features/auth/auth.types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  role,
}) => {
  const location = useLocation();

  const accessToken = sessionStorage.getItem("accessToken");
  const userData = sessionStorage.getItem("user");

  if (!accessToken || !userData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};