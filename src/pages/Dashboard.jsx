// src/pages/Dashboard.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FaCommentDots, FaCircleInfo, FaArrowUp } from "react-icons/fa6";
import "../styles/dashboard.css";

const chatbots = [
  {
    id: 1,
    type: "educationai",
    category: "education learning study academic recommended",
    title: "Education AI Chatbot",
    description:
      "Your AI partner for academic research, learning, and complex topics.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    plan: "PRO",
  },
  // ... (rest of your chatbots array remains the same)
  {
    id: 2,
    type: "storytelling",
    category: "creative storytelling entertainment lifestyle recommended",
    title: "Story telling chatbot",
    description:
      "Crafts engaging narratives and helps you weave your own tales.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    plan: "FREE",
  },
  {
    id: 3,
    type: "sport",
    category: "sport entertainment lifestyle news recommended",
    title: "Sport Chatbot",
    description: "Your go-to source for sports news, scores, and discussions.",
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&h=200&fit=crop",
    plan: "",
  },
  {
    id: 4,
    type: "visualgenerator",
    category: "creative visual design art productivity recommended",
    title: "Visual Generator chatbot",
    description:
      "Creates stunning images and visual content from your prompts.",
    image:
      "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=200&h=200&fit=crop",
    plan: "",
  },
  {
    id: 5,
    type: "mentalhealth",
    category: "health mentalhealth wellness support lifestyle recommended",
    title: "Mental Health chatbot",
    description:
      "Provides a supportive space for mental well-being and guidance.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
    plan: "",
  },
  {
    id: 6,
    type: "summary",
    category: "productivity utility tools education text recommended",
    title: "Summary AI chatbot",
    description: "Condenses long texts and documents into concise summaries.",
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=200&h=200&fit=crop",
    plan: "",
  },
];

const tabs = [
  "all",
  "recommended",
  "education",
  "creative",
  "health",
  "lifestyle",
  "productivity",
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate(); // Initialize hook

  const filterChatbots = (bot) => {
    if (activeTab === "all") return true;
    return bot.category.includes(activeTab);
  };

  // Handlers
  const handleChatClick = (botType) => {
    navigate(`/chat/${botType}`);
  };

  const handleUpgradeClick = () => {
    navigate("/subscriptions");
  };

  return (
    <DashboardLayout activePage="dashboard">
      <div className="dash-page-content dash-active">
        <div className="dash-page-header">
          <h2>AI Chatbot</h2>
          <p>Deploy specialized AI chatbots to conquer any challenge.</p>
        </div>

        <div className="dash-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`dash-tab-btn ${
                activeTab === tab ? "dash-active" : ""
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="dash-grid dash-agent-grid dash-has-horizontal-cards">
          {chatbots.filter(filterChatbots).map((bot) => (
            <div
              key={bot.id}
              className={`dash-card dash-agent-card dash-horizontal-medium dash-animate-in dash-agent-${bot.type}`}
            >
              {bot.plan && (
                <div className="dash-purchased-plan-badge">{bot.plan}</div>
              )}
              <div className="dash-agent-image-wrapper">
                <img src={bot.image} alt={bot.title} />
              </div>
              <div className="dash-agent-card-content">
                <h3>{bot.title}</h3>
                <p className="dash-field">{bot.description}</p>
                <div className="dash-actions">
                  {/* Updated Chat Button */}
                  <button
                    className="dash-button dash-button-sm"
                    onClick={() => handleChatClick(bot.type)}
                  >
                    <span>
                      <FaCommentDots />
                    </span>
                    Chat
                  </button>

                  {/* Updated Upgrade Button */}
                  <button
                    className="dash-button-secondary dash-button-sm"
                    onClick={handleUpgradeClick}
                  >
                    <span>
                      <FaArrowUp />
                    </span>
                    Upgrade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
