import React, { useState } from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import SupportCard from "../components/Support/SupportCard";
import FeedbackModal from "../components/Support/FeedbackModal";
import "../styles/Support.css";

const Support = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  return (
    <DashboardLayout activePage="support">
      <div className="dash-page-content dash-active">
        <div className="dash-page-header">
          <h2>Feedback & Support Central</h2>
          <p>
            Your go-to place for help, tutorials, and sharing your valuable
            input.
          </p>
        </div>

        <div className="dash-feedback-support-grid">
          {/* 1. Submit Feedback */}
          <SupportCard
            icon="fas fa-face-grin-beam"
            title="Submit Feedback"
            description="Share thoughts, suggestions, or report an issue. Your feedback helps us improve AgentVerse."
            btnText="Open Form"
            btnIcon="fas fa-paper-plane"
            colorClass="primary"
            delay="0s"
            onClick={() => setShowFeedbackModal(true)}
          />

          {/* 2. Contact Support */}
          <SupportCard
            icon="fas fa-headset"
            title="Contact Support"
            description="Email our team or find options for live assistance during business hours."
            btnText="Get In Touch"
            btnIcon="fas fa-envelope"
            colorClass="secondary"
            delay="0.07s"
            onClick={() =>
              (window.location.href = "mailto:support@agentverse.ai")
            }
          />

          {/* 3. Help Tutorials */}
          <SupportCard
            icon="fas fa-video"
            title="Help Tutorials"
            description="Watch video guides and walkthroughs to master AgentVerse features quickly."
            btnText="Watch Intro"
            btnIcon="fas fa-play-circle"
            colorClass="warning"
            delay="0.14s"
            onClick={() => alert("Video Player Modal would open here")}
          />

          {/* 4. Knowledge Base */}
          <SupportCard
            icon="fas fa-book-open"
            title="Knowledge Base"
            description="Find answers to common questions and explore detailed articles in our FAQs and docs."
            btnText="Explore FAQs"
            btnIcon="fas fa-search"
            colorClass="info"
            delay="0.21s"
            onClick={() => alert("Navigate to Documentation Page")}
          />

          {/* 5. Community Forum */}
          <SupportCard
            icon="fas fa-users"
            title="Community Forum"
            description="Connect with other AgentVerse users, share tips, and ask your questions."
            btnText="Join Discussion"
            btnIcon="fas fa-comments"
            colorClass="danger"
            delay="0.28s"
            onClick={() => alert("Navigating to Community Forum...")}
          />

          {/* 6. Suggest Feature */}
          <SupportCard
            icon="fas fa-lightbulb"
            title="Suggest a Feature"
            description="Have a great idea for AgentVerse? Let us know through our feature request portal."
            btnText="Suggest Idea"
            btnIcon="fas fa-vote-yea"
            colorClass="purple"
            delay="0.35s"
            onClick={() => setShowFeedbackModal(true)}
          />
        </div>
      </div>

      {/* Modals */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
      />
    </DashboardLayout>
  );
};

export default Support;
