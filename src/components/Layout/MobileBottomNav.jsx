import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaRobot, FaRegCreditCard } from "react-icons/fa6";

const navItems = [
  { id: "dashboard", label: "Chatbots", icon: FaRobot, path: "/dashboard" },
  {
    id: "subscriptions",
    label: "Subs",
    icon: FaRegCreditCard,
    path: "/subscriptions",
  },
];

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Gets current URL path

  return (
    <nav className="dash-mobile-bottom-nav">
      <ul>
        {navItems.map((item) => (
          <li
            key={item.id}
            // Checks if the current URL matches the item's path
            className={location.pathname === item.path ? "dash-active" : ""}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }}
            >
              <span>
                <item.icon />
              </span>{" "}
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;
