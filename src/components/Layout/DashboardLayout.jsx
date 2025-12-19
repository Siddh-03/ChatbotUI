import React from "react";
import { useDashboard } from "../../hooks/useDashboard";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import ChatbotWidget from "./ChatbotWidget";
import PageLoader from "./PageLoader";
import "../../styles/dashboard.css";

const DashboardLayout = ({ children }) => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarMobileOpen,
    setSidebarMobileOpen,
    showProfileDropdown,
    setShowProfileDropdown,
    showChatbot,
    setShowChatbot,
    chatMessages,
    chatInput,
    setChatInput,
    showLoader,
    handleChatSubmit,
    getGreeting,
    user, // Get the full user object
  } = useDashboard();

  // Smart toggle: close on mobile, collapse on desktop
  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setSidebarMobileOpen(false);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  return (
    <div
      className={`dash-app-container ${
        sidebarMobileOpen ? "dash-sidebar-mobile-open" : ""
      }`}
    >
      <PageLoader showLoader={showLoader} />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        user={user} // Pass the full user object to Sidebar
        greeting={getGreeting()}
      />

      <div
        className={`dash-main-content-wrapper ${
          sidebarCollapsed ? "dash-sidebar-collapsed" : ""
        }`}
        onClick={() => {
          if (sidebarMobileOpen && window.innerWidth <= 768) {
            setSidebarMobileOpen(false);
          }
        }}
      >
        <Header
          onMobileMenuToggle={() => setSidebarMobileOpen(!sidebarMobileOpen)}
          showProfileDropdown={showProfileDropdown}
          onProfileToggle={() => setShowProfileDropdown(!showProfileDropdown)}
          userName={user?.name || "User"}
        />

        <main className="dash-main-content-area">{children}</main>
      </div>

      <MobileBottomNav />

      <ChatbotWidget
        show={showChatbot}
        onToggle={() => setShowChatbot(!showChatbot)}
        messages={chatMessages}
        input={chatInput}
        onInputChange={setChatInput}
        onSubmit={handleChatSubmit}
      />
    </div>
  );
};

export default DashboardLayout;
