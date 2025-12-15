import React from "react";
import { FaTimes } from "react-icons/fa";

const UpgradePlanModal = ({
  isOpen,
  onClose,
  chatbot,
  selectedPlan,
  onConfirm,
}) => {
  if (!isOpen || !chatbot || !selectedPlan) return null;

  return (
    <div className={`modal ${isOpen ? "open" : ""}`} id="upgradePlanModal">
      <div className="modal-content card">
        <span
          className="close-modal-btn"
          onClick={onClose}
          data-modal-id="upgradePlanModal"
        >
          <FaTimes />
        </span>

        <div className="upgrade-modal-header-info">
          <img
            src={chatbot.image}
            alt={chatbot.title}
            className="upgrade-modal-chatbot-icon-img"
            id="upgradeModalChatbotImage"
          />
          <h3
            id="upgradeModalChatbotName"
            className="upgrade-modal-chatbot-title"
          >
            Upgrade to {selectedPlan.name} Plan
          </h3>
        </div>
        <div>
          <div className="plan-details">
            <div className="price-display">
              <h2>
                {selectedPlan.price === 0
                  ? "Free"
                  : `$${selectedPlan.price}/month`}
              </h2>
              {selectedPlan.price > 0 && (
                <p className="billing-info">Billed monthly, cancel anytime</p>
              )}
            </div>

            <div className="features-list">
              <h4>Plan includes:</h4>
              <ul>
                {selectedPlan.features.map((feature, index) => (
                  <li key={index}>
                    <span className="check-icon">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="payment-section">
            <button className="dash-button" onClick={onConfirm}>
              Upgrade Now
            </button>
            <button className="dash-button-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradePlanModal;
