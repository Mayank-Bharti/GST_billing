import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Users,
  FileText,
  Package,
  User as UserIcon,
  LogOut,
  Settings,
  LayoutDashboard,
  Gem,
  Menu,
  X,
} from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/home");
  };

  const closeSidebar = () => setSidebarOpen(false);

  // Get user initials
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div>
          {/* Brand */}
          <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-3" style={{ textDecoration: "none" }} onClick={closeSidebar}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "var(--radius-md)",
                    background: "linear-gradient(135deg, #c9a84c, #e8d48b)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Gem size={18} color="#0a0a0f" />
                </div>
                <div>
                  <span style={{ fontSize: "0.95rem", fontWeight: 700, fontFamily: "var(--font-display)", display: "block", lineHeight: 1.2 }}>
                    Mayank Madhuri
                  </span>
                  <span style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "0.15em", color: "var(--primary)", fontWeight: 600 }}>
                    Jewellers
                  </span>
                </div>
              </Link>

              {/* Mobile close */}
              <button
                className="mobile-menu-btn"
                onClick={closeSidebar}
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ marginBottom: "0.375rem", paddingLeft: "0.75rem" }}>
            <span style={{ fontSize: "0.625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)" }}>
              Main
            </span>
          </div>
          <nav>
            <NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeSidebar}>
              <LayoutDashboard size={19} /> Dashboard
            </NavLink>
            <NavLink to="/invoices" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeSidebar}>
              <FileText size={19} /> Invoices
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeSidebar}>
              <Package size={19} /> Products
            </NavLink>
            <NavLink to="/customers" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeSidebar}>
              <Users size={19} /> Customers
            </NavLink>

            {user?.role === "admin" && (
              <>
                <div style={{ margin: "0.75rem 0 0.375rem", paddingLeft: "0.75rem" }}>
                  <span style={{ fontSize: "0.625rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)" }}>
                    Admin
                  </span>
                </div>
                <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeSidebar}>
                  <Settings size={19} /> User Management
                </NavLink>
              </>
            )}
          </nav>
        </div>

        {/* Bottom */}
        <div style={{ borderTop: "1px solid var(--border-gold)", paddingTop: "0.75rem" }}>
          <NavLink to="/profile" className="nav-link" onClick={closeSidebar}>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-full)",
                background: "linear-gradient(135deg, #c9a84c, #e8d48b)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.625rem",
                fontWeight: 700,
                color: "#0a0a0f",
                flexShrink: 0,
              }}
            >
              {initials}
            </div>
            <span style={{ fontSize: "0.875rem" }}>{user?.name}</span>
          </NavLink>
          <button
            onClick={handleLogout}
            className="nav-link"
            style={{
              width: "100%",
              textAlign: "left",
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontFamily: "var(--font-family)",
              fontSize: "0.9375rem",
            }}
          >
            <LogOut size={19} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header
          className="glass"
          style={{
            marginBottom: "1.5rem",
            padding: "1rem 1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.75rem",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 style={{ fontSize: "clamp(1.1rem, 3vw, 1.4rem)", fontWeight: 800, fontFamily: "var(--font-display)", marginBottom: "0.1rem" }}>
                Hello, {user?.name} 👋
              </h1>
              <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                Welcome back to your workspace
              </p>
            </div>
          </div>
          {/* <div className="flex gap-3">
            <button
              className="btn btn-primary"
              style={{ width: "auto", padding: "0.55rem 1rem", fontSize: "0.8125rem", whiteSpace: "nowrap" }}
            >
              + New Invoice
            </button>
          </div> */}
        </header>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
