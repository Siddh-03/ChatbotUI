import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../components/Layout/DashboardLayout";
import { FaCommentDots, FaArrowUp } from "react-icons/fa6";
import { dashboardService } from "../services/dashboardService"; // Import Service
import "../styles/dashboard.css";

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
  const [chatbots, setChatbots] = useState([]); // State for bots
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Dashboard | AgentVerse";
  }, []);

  // Fetch Bots on Load
  useEffect(() => {
    const fetchBots = async () => {
      try {
        const data = await dashboardService.getChatbots();
        setChatbots(data);
      } catch (error) {
        console.error("Failed to load chatbots:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBots();
  }, []);

  const filterChatbots = (bot) => {
    if (activeTab === "all") return true;
    return bot.category.includes(activeTab);
  };

  const handleChatClick = (botType) => {
    navigate(`/chat/${botType}`);
  };

  const handleUpgradeClick = () => {
    navigate("/subscriptions");
  };

  return (
    <DashboardLayout>
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

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading chatbots...
          </div>
        ) : (
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
                    <button
                      className="dash-button dash-button-sm"
                      onClick={() => handleChatClick(bot.type)}
                    >
                      <span>
                        <FaCommentDots />
                      </span>{" "}
                      Chat
                    </button>
                    <button
                      className="dash-button-secondary dash-button-sm"
                      onClick={handleUpgradeClick}
                    >
                      <span>
                        <FaArrowUp />
                      </span>{" "}
                      Upgrade
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
