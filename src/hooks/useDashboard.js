import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useDashboard = () => {
  const navigate = useNavigate();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // User State - Defaults to LocalStorage or Static Data
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("agentVerseUser");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          firstName: "User",
          lastName: "",
          email: "",
          name: "User",
          phone: "",
        };
  });

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLoader, setShowLoader] = useState(false); // Changed default to false
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "Hello! How can I help?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  /* // --- DISABLED PROFILE FETCHING ---
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await authService.getUserProfile();
      // ... (Rest of the logic commented out)
    } catch (error) {
       // ...
    }
  }, []);
  */

  // Dummy function to prevent errors if components call it
  const fetchUserProfile = useCallback(async () => {
    console.log("Profile fetching is currently disabled.");
  }, []);

  /* // --- DISABLED AUTO-FETCH ON MOUNT ---
  useEffect(() => {
    const initDashboard = async () => {
      if (isAuthenticated) {
        await fetchUserProfile();
      }
      setShowLoader(false);
    };
    initDashboard();
  }, [isAuthenticated, fetchUserProfile]);
  */

  // Auth Actions
  const login = async (email, password) => {
    try {
      setShowLoader(true);
      await authService.login(email, password);

      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");

      // We are NOT fetching the profile anymore
      // await fetchUserProfile();

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    } finally {
      setShowLoader(false);
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
  };

  // Chat Helpers
  const handleChatSubmit = (e) => {
    if (e) e.preventDefault();
    if (chatInput.trim()) {
      setChatMessages((prev) => [
        ...prev,
        { type: "user", text: chatInput },
        { type: "bot", text: "Processing..." },
      ]);
      setChatInput("");
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  return {
    isAuthenticated,
    user,
    login,
    logout,
    fetchUserProfile,
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarMobileOpen,
    setSidebarMobileOpen,
    showProfileDropdown,
    setShowProfileDropdown,
    showLoader,
    showChatbot,
    setShowChatbot,
    chatMessages,
    chatInput,
    setChatInput,
    handleChatSubmit,
    getGreeting,
  };
};
