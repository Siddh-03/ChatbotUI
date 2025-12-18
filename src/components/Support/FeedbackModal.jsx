import React from "react";

const FeedbackModal = ({ isOpen, onClose }) => {
  // Prevent closing when clicking inside the content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`dash-modal-overlay ${isOpen ? "dash-open" : ""}`}
      onClick={onClose} // Close when clicking outside
    >
      <div
        className="dash-modal-content dash-feedback-modal"
        onClick={handleContentClick}
      >
        <button className="dash-close-modal-btn" onClick={onClose}>
          &times;
        </button>

        {/* Header with Icon */}
        <h3
          style={{
            fontSize: "1.2rem",
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
            fontWeight: "700",
          }}
        >
          <i
            className="fas fa-comment-alt-smile"
            style={{
              color: "var(--dash-primary-color)",
              marginRight: "10px",
              fontSize: "1.4rem",
            }}
          ></i>
          Submit Feedback
        </h3>

        <p
          style={{
            color: "var(--dash-text-muted)",
            fontSize: "0.9rem",
            marginBottom: "25px",
          }}
        >
          Your feedback helps us improve AgentVerse.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Feedback Sent!");
            onClose();
          }}
        >
          <div className="dash-form-group">
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "0.85rem",
                color: "var(--dash-text-muted)",
              }}
            >
              Feedback Type
            </label>
            <select
              className="dash-form-control"
              style={{
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='%235a677b' viewBox='0 0 16 16'%3E%3Cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3E%3C/svg%3E")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 18px center",
                backgroundSize: "18px",
              }}
            >
              <option>General Feedback</option>
              <option>Bug Report</option>
              <option>Feature Request</option>
              <option>Kudos!</option>
            </select>
          </div>

          <div className="dash-form-group">
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "600",
                fontSize: "0.85rem",
                color: "var(--dash-text-muted)",
              }}
            >
              Your Message
            </label>
            <textarea
              className="dash-form-control"
              rows="5"
              placeholder="Tell us more..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="dash-button"
            style={{ width: "100%", marginTop: "10px" }}
          >
            <i className="fas fa-paper-plane"></i> Send Feedback
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
