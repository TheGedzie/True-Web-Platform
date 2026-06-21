import { Navigate, Outlet } from "react-router-dom";

export const AuthGuard = () => {
  const token = localStorage.getItem("token");

  if (token) {
    return <Navigate to="/education" replace />;
  }

  return <Outlet />;
};
