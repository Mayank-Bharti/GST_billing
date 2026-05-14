import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminUsers from "./pages/AdminUsers";

import Profile from "./pages/Profile";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Invoices from "./pages/Invoices";
import CreateInvoice from "./pages/CreateInvoice";

// Placeholder components for other pages
const Overview = () => (
  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem" }}>
    {[
      { label: "Invoices", value: "0", color: "#c9a84c" },
      { label: "Products", value: "0", color: "#4a9e7e" },
      { label: "Customers", value: "0", color: "#5b7fb5" },
      { label: "Revenue", value: "₹0", color: "#d4a853" },
    ].map((item) => (
      <div key={item.label} className="glass" style={{ padding: "1.5rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", textTransform: "uppercase", marginBottom: "0.5rem" }}>{item.label}</p>
        <h3 style={{ fontSize: "1.75rem", fontWeight: 800, fontFamily: "var(--font-display)" }}>{item.value}</h3>
      </div>
    ))}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Overview />} />
            <Route path="profile" element={<Profile />} />
            <Route path="customers" element={<Customers />} />
            <Route path="products" element={<Products />} />
            <Route path="invoices" element={<Invoices />} />
            <Route path="invoices/create" element={<CreateInvoice />} />
            
            {/* Admin Specific Routes */}
            <Route
              path="admin/users"
              element={
                <ProtectedRoute adminOnly>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* 404 Redirect → Home for guests */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
