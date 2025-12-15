// src/components/Auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useDashboard } from "../../hooks/useDashboard";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useDashboard();

  if (!isAuthenticated) {
    // Redirect them to the login page, but remember where they were trying to go
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
