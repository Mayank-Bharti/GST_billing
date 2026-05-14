import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const LoadingScreen = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "var(--bg-dark)",
      flexDirection: "column",
      gap: "1.25rem",
    }}
  >
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        width: 40,
        height: 40,
        border: "3px solid rgba(99, 102, 241, 0.15)",
        borderTopColor: "var(--primary)",
        borderRadius: "50%",
      }}
    />
    <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>Loading...</p>
  </div>
);

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
