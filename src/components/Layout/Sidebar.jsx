import React from 'react';
import { 
  FaRobot, FaRegComments, FaRegCreditCard, FaChartSimple, 
  FaGear, FaBookOpen, FaLifeRing, FaShapes, FaAngleLeft,
  FaAngleRight, FaCircleUser
} from 'react-icons/fa6';

const navItems = [
  // Renamed Dashboard to AI Chatbots as requested for UI
  { id: 'dashboard', label: 'AI Chatbots', icon: FaRobot, href: '/dashboard', badge: null },
  { id: 'subscriptions', label: 'Subscriptions', icon: FaRegCreditCard, href: '/subscriptions', badge: null },
  
  // Commented out other options as requested
  // { id: 'conversations', label: 'Conversations', icon: FaRegComments, href: '/conversations', badge: '3' },
  // { id: 'analytics', label: 'Analytics', icon: FaChartSimple, href: '#', badge: null },
  // { id: 'settings', label: 'Settings', icon: FaGear, href: '#', badge: null },
  // { divider: true },
  // { id: 'documentation', label: 'Documentation', icon: FaBookOpen, href: '#', badge: null },
  // { id: 'support', label: 'Support', icon: FaLifeRing, href: '#', badge: null },
  // { id: 'services', label: 'Services', icon: FaShapes, href: '#', badge: null }
];

const Sidebar = ({ collapsed, onToggle, activePage, userName, greeting }) => {
  return (
    <aside className={`dash-sidebar ${collapsed ? 'dash-collapsed' : ''}`}>
      <div className="dash-sidebar-header">
        <div className="dash-logo-container">
          {/* Replaced Icon with Image - Set your path below */}
          <div className="dash-logo-icon">
            <img src="/assist/images/ybai.png" alt="Logo" /> 
          </div>
          <h2 className="dash-logo-text">YBAI Solutions</h2>
        </div>
        <button className="dash-sidebar-toggle-btn" onClick={onToggle}>
          <span>{collapsed ? <FaAngleRight /> : <FaAngleLeft />}</span>
        </button>
      </div>

      <div className="dash-user-profile">
        <div className="dash-user-avatar"><FaCircleUser /></div>
        <span className="dash-user-greeting">{greeting},</span>
        <div className="dash-user-name">{userName}</div>
      </div>

      <nav className="dash-main-nav">
        <ul>
          {navItems.map((item, index) => 
            item.divider ? (
              <li key={`divider-${index}`} className="dash-nav-divider"></li>
            ) : (
              <li key={item.id} className={activePage === item.id ? 'dash-active' : ''}>
                <a href={item.href} onClick={(e) => item.href === '#' && e.preventDefault()}>
                  <span className="dash-nav-icon"><item.icon /></span>
                  <span className="dash-nav-text">{item.label}</span>
                  {item.badge && <span className="dash-badge">{item.badge}</span>}
                </a>
              </li>
            )
          )}
        </ul>
      </nav>

      <div className="dash-sidebar-footer">
         {/* Theme switcher removed as requested */}
      </div>
    </aside>
  );
};

export default Sidebar;