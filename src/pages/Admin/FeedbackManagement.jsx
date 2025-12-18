import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

const FeedbackManagement = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      const res = await adminService.getAllFeedbacks();
      if (res.data.status === "success") setFeedbacks(res.data.data);
    } catch (e) {
      console.error("Fetch error", e);
    }
  };

  return (
    <div className="dash-page-content dash-active">
      <div className="dash-page-header">
        <h2>User Feedback</h2>
        <p>Review complaints and suggestions</p>
      </div>

      <div className="dash-grid">
        {feedbacks.map((fb) => (
          <div key={fb.feedback_id} className="dash-card">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  backgroundColor: fb.is_complaint
                    ? "var(--dash-danger-light)"
                    : "var(--dash-info-light)",
                  color: fb.is_complaint
                    ? "var(--dash-danger-color)"
                    : "var(--dash-info-color)",
                }}
              >
                {fb.is_complaint ? "COMPLAINT" : "FEEDBACK"}
              </span>
              <small className="text-muted">{fb.created_at}</small>
            </div>
            <p style={{ marginTop: "15px", fontStyle: "italic" }}>
              "{fb.feedback}"
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: "15px",
              }}
            >
              <small>User: {fb.user?.name || "Unknown"}</small>
              <button
                className="dash-button-sm dash-button-secondary"
                onClick={async () => {
                  if (confirm("Archive feedback?")) {
                    await adminService.deleteFeedback(fb.feedback_id);
                    loadFeedbacks();
                  }
                }}
              >
                Archive
              </button>
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && (
          <p style={{ textAlign: "center" }}>No feedback found.</p>
        )}
      </div>
    </div>
  );
};

export default FeedbackManagement;
