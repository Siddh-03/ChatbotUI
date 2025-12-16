import React from "react";
import { Link } from "react-router-dom"; // Import Link
import { useDashboard } from "../../hooks/useDashboard"; // Import Hook for logout
import {
  FaBars,
  FaMagnifyingGlass,
  FaRegBell,
  FaRegCircleQuestion,
  FaCircleUser,
  FaGear,
  FaAngleRight,
} from "react-icons/fa6";

const Header = ({
  onMobileMenuToggle,
  showProfileDropdown,
  onProfileToggle,
  userName,
}) => {
  const { logout } = useDashboard(); // Get logout function

  return (
    <header className="dash-main-header">
      <button
        className="dash-mobile-sidebar-toggle"
        onClick={onMobileMenuToggle}
      >
        <span>
          <FaBars />
        </span>
      </button>

      <div className="dash-search-bar">
        <span className="dash-search-icon">
          <FaMagnifyingGlass />
        </span>
        <input
          type="text"
          placeholder="Search chatbots, prompts, or conversations..."
        />
      </div>

      <div className="dash-header-actions">
        <button className="dash-icon-btn" title="Notifications">
          <span>
            <FaRegBell />
          </span>
          <span className="dash-badge-dot"></span>
        </button>
        <button className="dash-icon-btn" title="Help & Support">
          <span>
            <FaRegCircleQuestion />
          </span>
        </button>

        <div style={{ position: "relative" }}>
          <button className="dash-icon-btn" onClick={onProfileToggle}>
            <span>
              <FaCircleUser />
            </span>
          </button>

          {showProfileDropdown && (
            <div className="dash-profile-dropdown-menu dash-active">
              <div className="dash-menu-header">
                <span className="dash-username">{userName}</span>
              </div>
              <ul>
                <li>
                  {/* FIX: Link to Settings Page */}
                  <Link to="/settings" onClick={onProfileToggle}>
                    <FaGear /> Account Settings
                  </Link>
                </li>
                <li>
                  {/* FIX: Real Logout Action */}
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      logout();
                    }}
                  >
                    <FaAngleRight /> Logout
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
