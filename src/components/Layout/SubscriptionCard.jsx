import React from "react";
import { FaCommentDots, FaArrowUp } from "react-icons/fa6";

const SubscriptionCard = ({ chatbot, currentPlanId, onUpgradeClick }) => {
  return (
    <div className="dash-card subscription-chatbot-card dash-animate-in">
      <div className="subscription-chatbot-card-header">
        <img
          src={chatbot.image}
          alt={chatbot.title}
          className="chatbot-icon-img"
        />
        <div className="chatbot-info">
          <h3>{chatbot.title}</h3>
          <p className="description">{chatbot.description}</p>
        </div>
      </div>

      <div className="subscription-plans-container">
        {chatbot.plans.map((plan) => (
          <div
            key={plan.id}
            className={`plan-card-item ${
              plan.id === currentPlanId ? "current-plan" : ""
            }`}
          >
            <h4>{plan.name}</h4>
            <div className="price">
              {plan.price === 0 ? "Free" : `$${plan.price}/month`}
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            {plan.id === currentPlanId ? (
              <span className="current-plan-indicator">✓ Current Plan</span>
            ) : (
              <button
                className="dash-button dash-button-sm select-plan-btn"
                onClick={() => onUpgradeClick(chatbot, plan)}
              >
                <FaArrowUp /> Select Plan
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCard;
