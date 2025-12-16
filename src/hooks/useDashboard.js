// src/hooks/useDashboard.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useDashboard = () => {
  const navigate = useNavigate();

  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("isAuthenticated") === "true";
  });

  // --- User State (Priority: Second File's Michael Scofield) ---
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("agentVerseUser");
    return savedUser
      ? JSON.parse(savedUser)
      : {
          firstName: "Michael",
          lastName: "Scofield",
          username: "structural_engineer",
          email: "michael.scofield@foxriver.com",
          phone: "555-0199",
          avatar: "",
          name: "Michael Scofield", // Helper for display
        };
  });

  // --- Layout State ---
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  // --- Chat Widget State ---
  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your AgentVerse Helper. How can I assist you today?",
    },
  ]);
  const [chatInput, setChatInput] = useState("");

  // --- Loader Effect (Priority: Second File's 2000ms) ---
  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // --- Auth Actions ---
  const login = async (email, password) => {
    try {
      setShowLoader(true);
      // REAL API CALL
      await authService.login(email, password);

      // If successful, update state
      const savedUser = JSON.parse(localStorage.getItem("agentVerseUser"));
      setUser(savedUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Login failed");
      return false;
    } finally {
      setShowLoader(false);
    }
  };

  const signup = (userData) => {
    const newUser = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
      phone: userData.phone,
      avatar:
        userData.avatar || `https://i.pravatar.cc/150?u=${userData.username}`,
      name: `${userData.firstName} ${userData.lastName}`.trim(),
    };

    setUser(newUser);
    localStorage.setItem("agentVerseUser", JSON.stringify(newUser));

    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
    navigate("/login");
  };

  // --- Update Profile (Priority: Second File's Implementation) ---
  const updateProfile = (newData) => {
    setUser((prev) => {
      const updatedUser = { ...prev, ...newData };
      // Ensure 'name' property is updated if first/last name changes
      if (newData.firstName || newData.lastName) {
        updatedUser.name = `${newData.firstName || prev.firstName} ${
          newData.lastName || prev.lastName
        }`.trim();
      }
      localStorage.setItem("agentVerseUser", JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  // --- Chat Logic (Priority: Second File's Implementation) ---
  const handleChatSubmit = (e) => {
    if (e) e.preventDefault();
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

  // --- Greeting Helper ---
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return {
    // Auth
    isAuthenticated,
    login,
    signup,
    logout,

    // User
    user,
    updateProfile,

    // Layout
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarMobileOpen,
    setSidebarMobileOpen,
    showProfileDropdown,
    setShowProfileDropdown,
    showLoader,

    // Chat
    showChatbot,
    setShowChatbot,
    chatMessages,
    chatInput,
    setChatInput,
    handleChatSubmit,

    // Helpers
    getGreeting,
  };
};
