import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import SubscriptionCard from "../components/Layout/SubscriptionCard";
import UpgradePlanModal from "../components/Modals/UpgradePlanModal";
import { subscriptionService } from "../services/subscriptionService"; // Import Service
import "../styles/dashboard.css";
import "../styles/Subscription.css";

const SubscriptionsPage = () => {
  // 1. Add State for Data & Loading
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    document.title = "Subscriptions | AgentVerse"; // Change this text to whatever you want
  }, []);

  // 2. Fetch Data on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await subscriptionService.getSubscriptions();
        setSubscriptionsData(data);
      } catch (error) {
        console.error("Failed to load subscriptions:", error);
        // Fallback or empty state could go here
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpgradeClick = (chatbot, plan) => {
    setSelectedChatbot(chatbot);
    setSelectedPlan(plan);
    setUpgradeModalOpen(true);
  };

  const handleCloseModal = () => {
    setUpgradeModalOpen(false);
    setSelectedChatbot(null);
    setSelectedPlan(null);
  };

  const handleConfirmUpgrade = async () => {
    try {
      // 3. Call Real Upgrade API
      await subscriptionService.upgradePlan(
        selectedChatbot.id,
        selectedPlan.id
      );
      alert(`Successfully upgraded to ${selectedPlan.name}!`);

      // Optional: Refresh the list to show new status
      const newData = await subscriptionService.getSubscriptions();
      setSubscriptionsData(newData);

      handleCloseModal();
    } catch (error) {
      alert("Upgrade failed. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="dash-page-content dash-active" id="page-subscriptions">
        <div className="dash-page-header">
          <h1>My Subscriptions</h1>
          <p>Manage your active subscriptions and explore upgrade options.</p>
        </div>

        {/* 4. Show Loading State or Data */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading plans...
          </div>
        ) : (
          <div className="dash-grid subscription-grid dash-grid-cols-1">
            {subscriptionsData.map((chatbot) => (
              <SubscriptionCard
                key={chatbot.id}
                chatbot={chatbot}
                currentPlanId={chatbot.currentPlan}
                onUpgradeClick={handleUpgradeClick}
              />
            ))}
          </div>
        )}
      </div>

      <UpgradePlanModal
        isOpen={upgradeModalOpen}
        onClose={handleCloseModal}
        chatbot={selectedChatbot}
        selectedPlan={selectedPlan}
        onConfirm={handleConfirmUpgrade}
      />
    </DashboardLayout>
  );
};

export default SubscriptionsPage;
