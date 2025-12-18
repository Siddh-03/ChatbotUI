import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaUserShield,
  FaUsers,
  FaRobot,
  FaClipboardList,
  FaCreditCard,
  FaComments,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { adminService } from "../../services/adminService";

const AdminSidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const isActive = (path) =>
    location.pathname.startsWith(path) ? "dash-active" : "";

  return (
    <aside className={`dash-sidebar ${collapsed ? "dash-collapsed" : ""}`}>
      {/* HEADER */}
      <div
        className="dash-sidebar-header"
        style={{ padding: collapsed ? "20px 0" : "20px" }}
      >
        <div
          className="dash-logo-container"
          style={{ justifyContent: collapsed ? "center" : "flex-start" }}
        >
          <FaUserShield
            className="dash-logo-icon"
            style={{
              fontSize: "1.8rem",
              color: "var(--dash-primary-color)",
              margin: 0,
            }}
          />
          {!collapsed && (
            <h2 className="dash-logo-text" style={{ marginLeft: "10px" }}>
              Admin
            </h2>
          )}
        </div>
        {/* Only show toggle button inside sidebar on Mobile. On Desktop, it's usually in the header. 
            But if you want it here: */}
        {!collapsed && (
          <button
            className="dash-sidebar-toggle-btn"
            onClick={onToggle}
            style={{ marginLeft: "auto" }}
          >
            <FaBars />
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="dash-main-nav">
        <ul>
          <li className={isActive("/admin/users")}>
            <Link to="/admin/users" title="User Management">
              <span className="dash-nav-icon">
                <FaUsers />
              </span>
              <span className="dash-nav-text">Users</span>
            </Link>
          </li>
          <li className={isActive("/admin/bots")}>
            <Link to="/admin/bots" title="Bot Management">
              <span className="dash-nav-icon">
                <FaRobot />
              </span>
              <span className="dash-nav-text">Bots</span>
            </Link>
          </li>
          <li className={isActive("/admin/plans")}>
            <Link to="/admin/plans" title="Plans">
              <span className="dash-nav-icon">
                <FaCreditCard />
              </span>
              <span className="dash-nav-text">Plans</span>
            </Link>
          </li>
          <li className={isActive("/admin/feedbacks")}>
            <Link to="/admin/feedbacks" title="Feedback">
              <span className="dash-nav-icon">
                <FaComments />
              </span>
              <span className="dash-nav-text">Feedback</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* FOOTER */}
      <div className="dash-sidebar-footer">
        <button
          onClick={adminService.logout}
          className="dash-button-secondary"
          style={{
            width: "100%",
            justifyContent: "center",
            display: "flex",
            gap: "10px",
          }}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
