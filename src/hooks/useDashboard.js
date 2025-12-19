import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useDashboard = () => {
  const navigate = useNavigate();

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // User State
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

  // Layout & UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "Hello! How can I help?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // --- Fetch Profile Data ---
  const fetchUserProfile = useCallback(async () => {
    try {
      const response = await authService.getUserProfile();
      if (response.data) {
        const { name, email, user_id } = response.data;

        // Recover phone from signup cache if available (since backend doesn't return it yet)
        const cachedData = JSON.parse(
          localStorage.getItem("tempSignupData") || "{}"
        );
        const phone =
          cachedData.email === email ? cachedData.phone : user.phone;

        // Split name into First/Last
        const nameParts = name ? name.split(" ") : ["User"];
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(" ");

        const updatedUser = {
          ...user,
          firstName,
          lastName,
          name,
          email,
          phone: phone || "", // Use cached phone or empty
          id: user_id,
        };

        setUser(updatedUser);
        localStorage.setItem("agentVerseUser", JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      if (error.response?.status === 401) {
        // Token expired
        authService.logout();
      }
    }
  }, []);

  useEffect(() => {
    const initDashboard = async () => {
      if (isAuthenticated) {
        await fetchUserProfile();
      }
      setShowLoader(false);
    };
    initDashboard();
  }, [isAuthenticated, fetchUserProfile]);

  // Auth Actions
  const login = async (email, password) => {
    try {
      setShowLoader(true);
      await authService.login(email, password);

      setIsAuthenticated(true);
      localStorage.setItem("isAuthenticated", "true");

      await fetchUserProfile();
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
