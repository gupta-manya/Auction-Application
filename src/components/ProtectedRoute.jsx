// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const storedRole = localStorage.getItem("role");

  if (storedRole !== role) {
    alert("Unauthorized access! Please login with correct role.");
    return <Navigate to="/login" replace />;
  }

  return children;
}