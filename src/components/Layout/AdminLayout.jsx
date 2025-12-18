import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AdminSidebar from "../Admin/AdminSidebar";
import "../../styles/Dashboard.css";
import { FaBars } from "react-icons/fa";

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false); // desktop collapse
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false); // mobile drawer
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        // on mobile, use only overlay, no desktop collapse state
        setSidebarCollapsed(false);
        setSidebarMobileOpen(false);
      } else {
        // on desktop, sidebar is always visible; start expanded
        setSidebarMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) setIsAuthenticated(false);
  }, []);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setSidebarMobileOpen((open) => !open); // open/close drawer
    } else {
      setSidebarCollapsed((c) => !c); // collapse/expand width
    }
  };

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  // Header toggle should be visible ONLY when sidebar is not accessible:
  // mobile + drawer closed.
  const showHeaderToggle = isMobile && !sidebarMobileOpen;

  return (
    <div
      className={`dash-app-container ${
        sidebarMobileOpen ? "dash-sidebar-mobile-open" : ""
      }`}
    >
      <AdminSidebar
        // Desktop: collapse width; Mobile: always full width (drawer)
        collapsed={!isMobile && sidebarCollapsed}
        onToggle={handleSidebarToggle}
      />

      {sidebarMobileOpen && (
        <div
          className="dash-mobile-overlay"
          onClick={() => setSidebarMobileOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 998,
          }}
        />
      )}

      <div
        className={`dash-main-content-wrapper ${
          !isMobile && sidebarCollapsed ? "dash-sidebar-collapsed" : ""
        }`}
      >
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
          {showHeaderToggle && (
            <button
              onClick={handleSidebarToggle}
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
          )}

          <h3 style={{ margin: 0 }}>Admin Console</h3>
        </header>

        <main className="dash-main-content-area" style={{ padding: "30px" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
