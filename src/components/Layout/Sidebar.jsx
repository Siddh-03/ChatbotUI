import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaRobot,
  FaRegCreditCard,
  FaCog,
  FaAngleLeft,
  FaAngleRight,
  FaUserAstronaut,
} from "react-icons/fa";

const Sidebar = ({ collapsed, onToggle, user, greeting }) => {
  const location = useLocation();

  // Helper to check if a link is active
  const isActive = (path) => (location.pathname === path ? "dash-active" : "");

  // Use First Name if available, otherwise fallback to full name or "User"
  const displayName = user?.firstName || user?.name || "User";

  return (
    <aside className={`dash-sidebar ${collapsed ? "dash-collapsed" : ""}`}>
      <div className="dash-sidebar-header">
        <div className="dash-logo-container">
          <div className="dash-logo-icon">
            <img src="/assist/images/ybai_shadow.png" alt="Logo" />
          </div>
          <h2 className="dash-logo-text">YBAI Solutions</h2>
        </div>
        <button className="dash-sidebar-toggle-btn" onClick={onToggle}>
          {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
        </button>
      </div>

      <div className="dash-user-profile">
        <div className="dash-user-avatar">
          {/* If user has a photo URL, you could use it here, otherwise default icon */}
          <FaUserAstronaut />
        </div>
        {/* Updated Greeting Logic */}
        <span className="dash-user-greeting">{greeting},</span>
        <div className="dash-user-name">{displayName}</div>
      </div>

      <nav className="dash-main-nav">
        <ul>
          <li className={isActive("/dashboard")}>
            <Link to="/dashboard">
              <span className="dash-nav-icon">
                <FaRobot />
              </span>
              <span className="dash-nav-text">AI Chatbots</span>
            </Link>
          </li>
          <li className={isActive("/subscriptions")}>
            <Link to="/subscriptions">
              <span className="dash-nav-icon">
                <FaRegCreditCard />
              </span>
              <span className="dash-nav-text">Subscriptions</span>
            </Link>
          </li>

          <li className={isActive("/settings")}>
            <Link to="/settings">
              <span className="dash-nav-icon">
                <FaCog />
              </span>
              <span className="dash-nav-text">Settings</span>
            </Link>
          </li>

          <li className="dash-nav-divider"></li>
        </ul>
      </nav>

      <div className="dash-sidebar-footer">
        {/* Theme toggle logic will go here */}
      </div>
    </aside>
  );
};

export default Sidebar;
