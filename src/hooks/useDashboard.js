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

  // UI State
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { type: "bot", text: "Hello! How can I help?" },
  ]);
  const [chatInput, setChatInput] = useState("");

  // --- FETCH USER PROFILE ---
  const fetchUserProfile = useCallback(async () => {
    // TEMPORARY: Commented out to avoid 401 Unauthorized loops during testing
    /*
    try {
      const response = await authService.getUserProfile();

      // The backend returns: { user_id, email, name, is_verified }
      if (response && response.data) {
        const backendData = response.data;

        // Split name into First and Last
        const fullName = backendData.name || "";
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        const userData = {
          ...backendData,
          firstName,
          lastName,
          // Ensure these fields exist even if backend sends null
          phone: backendData.phone || user.phone || "",
        };

        setUser(userData);
        localStorage.setItem("agentVerseUser", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
    */
  }, [user.phone]);

  // --- AUTO-FETCH ON MOUNT ---
  useEffect(() => {
    const initDashboard = async () => {
      if (isAuthenticated) {
        // await fetchUserProfile(); // <--- Commented out
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

      // Fetch full profile immediately after login to get the name
      // await fetchUserProfile(); // <--- Commented out to prevent 401 error from logout

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

  // Profile Update Helper (Updates Local State)
  const updateProfile = (newData) => {
    setUser((prev) => {
      const updated = { ...prev, ...newData };
      // Re-construct full name if first/last changed
      if (newData.firstName || newData.lastName) {
        updated.name = `${updated.firstName || ""} ${
          updated.lastName || ""
        }`.trim();
      }
      localStorage.setItem("agentVerseUser", JSON.stringify(updated));
      return updated;
    });
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
    updateProfile,
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
