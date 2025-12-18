import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";
import "../../styles/Dashboard.css"; // Reusing your existing dashboard styles

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Check local storage in real app

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      setIsAuthenticated(false);
    }
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="dash-app-container">
      <AdminSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div
        className={`dash-main-content-wrapper ${
          sidebarCollapsed ? "dash-sidebar-collapsed" : ""
        }`}
      >
        {/* Simple Admin Header */}
        <header className="dash-main-header">
          <h3 style={{ margin: 0 }}>Administrator Control</h3>
        </header>

        <main className="dash-main-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
