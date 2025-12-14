import { useState, useEffect } from "react";

export const useDashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your AgentVerse Helper. How can I assist you today?",
    },
    {
      type: "bot",
      text: "You can ask me about features, navigation, common issues, or specific AI chatbots.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // REMOVED THIS ENTIRE useEffect - NO MORE BODY CLASS MANIPULATION
  // useEffect(() => {
  //   document.body.classList.toggle('dash-sidebar-collapsed', sidebarCollapsed);
  //   document.body.classList.toggle('dash-sidebar-mobile-open', sidebarMobileOpen);
  // }, [sidebarCollapsed, sidebarMobileOpen]);

  const handleChatSubmit = () => {
    if (chatInput.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { type: "user", text: chatInput },
        {
          type: "bot",
          text: "Thank you for your message. Our AI assistant is processing your request.",
        },
      ]);
      setChatInput("");
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return {
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
  };
};
