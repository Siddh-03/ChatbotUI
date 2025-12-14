import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import SubscriptionCard from "../components/Layout/SubscriptionCard";
import UpgradePlanModal from "../components/Modals/UpgradePlanModal";
import "../styles/dashboard.css";
import "../styles/Subscription.css";

const subscriptionsData = [
  {
    id: 1,
    title: "Education AI Chatbot",
    description:
      "Your AI partner for academic research, learning, and complex topics.",
    image:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=200&h=200&fit=crop",
    currentPlan: "pro",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["10 messages/day", "Basic topics", "Limited history"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 9.99,
        features: [
          "Unlimited messages",
          "All topics",
          "Advanced analytics",
          "Priority support",
        ],
      },
      {
        id: "team",
        name: "Team",
        price: 24.99,
        features: [
          "Everything in Pro",
          "Multiple users",
          "API access",
          "Custom training",
        ],
      },
    ],
  },
  {
    id: 2,
    title: "Story telling chatbot",
    description:
      "Crafts engaging narratives and helps you weave your own tales.",
    image:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
    currentPlan: "free",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["5 stories/month", "Basic genres", "Text-only"],
      },
      {
        id: "premium",
        name: "Premium",
        price: 4.99,
        features: [
          "Unlimited stories",
          "All genres",
          "Audio versions",
          "Illustration prompts",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Visual Generator chatbot",
    description:
      "Creates stunning images and visual content from your prompts.",
    image:
      "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=200&h=200&fit=crop",
    currentPlan: "pro",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["10 images/month", "Basic styles", "Standard resolution"],
      },
      {
        id: "pro",
        name: "Pro",
        price: 14.99,
        features: [
          "100 images/month",
          "All styles",
          "HD resolution",
          "Commercial license",
        ],
      },
      {
        id: "enterprise",
        name: "Enterprise",
        price: 49.99,
        features: [
          "Unlimited images",
          "Custom models",
          "API access",
          "Bulk generation",
        ],
      },
    ],
  },
  {
    id: 4,
    title: "Mental Health chatbot",
    description:
      "Provides a supportive space for mental well-being and guidance.",
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=200&h=200&fit=crop",
    currentPlan: "free",
    plans: [
      {
        id: "free",
        name: "Free",
        price: 0,
        features: ["Daily check-ins", "Basic exercises", "Community resources"],
      },
      {
        id: "premium",
        name: "Premium",
        price: 7.99,
        features: [
          "Unlimited sessions",
          "Advanced tools",
          "Progress tracking",
          "Expert content",
        ],
      },
    ],
  },
];

const SubscriptionsPage = () => {
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [selectedChatbot, setSelectedChatbot] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

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

  const handleConfirmUpgrade = () => {
    // Handle upgrade logic here
    console.log(
      `Upgrading to ${selectedPlan.name} for ${selectedChatbot.title}`
    );
    handleCloseModal();
  };

  return (
    <DashboardLayout activePage="subscriptions">
      <div className="dash-page-content dash-active" id="page-subscriptions">
        <div className="dash-page-header">
          <h1>My Subscriptions</h1>
          <p>
            Manage your active subscriptions and explore upgrade options for
            your AI chatbots.
          </p>
        </div>

        <div
          className="dash-grid subscription-grid dash-grid-cols-1 md:grid-cols-2"
          id="subscription-cards-container"
        >
          {subscriptionsData.map((chatbot) => (
            <SubscriptionCard
              key={chatbot.id}
              chatbot={chatbot}
              currentPlanId={chatbot.currentPlan}
              onUpgradeClick={handleUpgradeClick}
            />
          ))}
        </div>
      </div>

      {/* Upgrade Plan Modal */}
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
