import React from 'react';
import { FaRobot, FaRegCreditCard } from 'react-icons/fa6';

const navItems = [
  { id: 'dashboard', label: 'Chatbots', icon: FaRobot },
  { id: 'subscriptions', label: 'Subs', icon: FaRegCreditCard },
  // Removed others
];

const MobileBottomNav = ({ activePage }) => {
  return (
    <nav className="dash-mobile-bottom-nav">
      <ul>
        {navItems.map(item => (
          <li key={item.id} className={activePage === item.id ? 'dash-active' : ''}>
            <a href="#" onClick={(e) => e.preventDefault()}>
              <span><item.icon /></span> {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileBottomNav;