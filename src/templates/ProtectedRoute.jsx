/* eslint-disable react/prop-types */
import { useRole } from "@/contexts";
import { jwtDecode } from "jwt-decode";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("logiEx-token");
  const allowedRole = useRole();

  try {
    if (token) {
      const { role: userRole } = jwtDecode(token);
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
