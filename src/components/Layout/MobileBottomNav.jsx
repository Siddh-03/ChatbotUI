import React from "react";
import { useNavigate } from "react-router-dom"; // 1. Import hook
import { FaRobot, FaRegCreditCard } from "react-icons/fa6";

const navItems = [
  // 2. Add 'path' property
  { id: "dashboard", label: "Chatbots", icon: FaRobot, path: "/dashboard" },
  {
    id: "subscriptions",
    label: "Subs",
    icon: FaRegCreditCard,
    path: "/subscriptions",
  },
];

const MobileBottomNav = ({ activePage }) => {
  const navigate = useNavigate(); // 3. Initialize hook

  return (
    <nav className="dash-mobile-bottom-nav">
      <ul>
        {navItems.map((item) => (
          <li
            key={item.id}
            className={activePage === item.id ? "dash-active" : ""}
          >
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path); // 4. Navigate on click
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
