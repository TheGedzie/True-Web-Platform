// utils/ProtectedRoute/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/register" replace />;
  }

  return <Outlet />;
};
