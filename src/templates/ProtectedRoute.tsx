import { useRole } from "@/contexts";
import { getUser } from "@/utilities";
import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("logiEx-token");
  const allowedRole = useRole();

  try {
    if (token) {
      const user = getUser();
      const userRole = user?.role;
      if (allowedRole === userRole) {
        return children;
      }
    }
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("logiEx-token");
    return <Navigate to="/" />;
  }

  return <Navigate to="/authentication" replace />;
}

export { ProtectedRoute };
