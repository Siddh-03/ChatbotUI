import React from "react";
import { useDashboard } from "../../hooks/useDashboard";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import ChatbotWidget from "./ChatbotWidget";
import PageLoader from "./PageLoader";
import "../../styles/dashboard.css";

const DashboardLayout = ({
  children,
  activePage = "dashboard",
  userName = "Siddharth Ambaliya",
}) => {
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
  } = useDashboard();

  return (
    <div
      className={`dash-app-container ${
        sidebarMobileOpen ? "dash-sidebar-mobile-open" : ""
      }`}
    >
      <PageLoader showLoader={showLoader} />

      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePage={activePage}
        userName={userName}
        greeting={getGreeting()}
      />

      {/* MAIN FIX: Add sidebarCollapsed class directly to wrapper */}
      <div
        className={`dash-main-content-wrapper ${
          sidebarCollapsed ? "dash-sidebar-collapsed" : ""
        }`}
      >
        <Header
          onMobileMenuToggle={() => setSidebarMobileOpen(!sidebarMobileOpen)}
          showProfileDropdown={showProfileDropdown}
          onProfileToggle={() => setShowProfileDropdown(!showProfileDropdown)}
          userName={userName}
        />

        <main className="dash-main-content-area">{children}</main>
      </div>

      <MobileBottomNav activePage={activePage} />

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
