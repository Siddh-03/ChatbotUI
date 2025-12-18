import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";
import "../../styles/Dashboard.css";
import { FaBars } from "react-icons/fa"; // Import Hamburger Icon

const AdminLayout = () => {
  // Desktop: Default Open (false). Mobile: Default Closed (true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    window.innerWidth < 768
  );
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Auth Check
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) setIsAuthenticated(false);
  }, []);

  // Responsive Handler
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  return (
    <div className="dash-app-container">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* IMPORTANT: This class controls the left margin */}
      <div
        className={`dash-main-content-wrapper ${
          sidebarCollapsed ? "dash-sidebar-collapsed" : ""
        }`}
      >
        {/* Header */}
        <header
          className="dash-main-header"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            padding: "0 20px",
            height: "70px",
            background: "white",
            borderBottom: "1px solid #eee",
          }}
        >
          {/* Toggle Button (Visible when collapsed OR on Mobile) */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
              color: "var(--dash-text-color)",
            }}
          >
            <FaBars />
          </button>

          <h3 style={{ margin: 0 }}>Admin Console</h3>
        </header>

        <main className="dash-main-content-area" style={{ padding: "30px" }}>
          {/* This Outlet renders Users, Bots, etc. */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
