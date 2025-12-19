import React, { useState } from "react";
// import { authService } from "../../services/authService"; // Keep if you use it later

const DeleteModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmInput, setConfirmInput] = useState(""); // 1. New State for Input

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmInput !== "delete") return; // Safety check

    // Backend Limitation Check
    setError(
      "This feature is currently disabled by the administrator (Backend endpoint missing)."
    );
    return;

    /* setLoading(true);
    try {
      await authService.deleteAccount();
      // ...
    } catch (err) {
      setError("Failed to delete account.");
    } finally {
      setLoading(false);
    } 
    */
  };

  return (
    <div className="settings-modal-overlay">
      <div className="settings-modal card">
        <div className="settings-modal-header">
          <h3 className="settings-modal-title">Delete Account</h3>
          <button className="settings-close-modal" onClick={onClose}>
            &times;
          </button>
        </div>

        <p className="settings-modal-text">
          This action cannot be undone. To confirm, please type{" "}
          <strong>delete</strong> below.
        </p>

        {/* 2. New Input Field */}
        <div className="settings-modal-input">
          <input
            type="text"
            className="dash-form-control"
            placeholder="Type 'delete'"
            value={confirmInput}
            onChange={(e) => setConfirmInput(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {error && (
          <p
            className="dash-error-text"
            style={{
              background: "#fffafa",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ff4b4b",
              marginBottom: "15px",
            }}
          >
            {error}
          </p>
        )}

        <div className="settings-modal-actions">
          <button
            className="dash-button-secondary dash-button-sm"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="dash-button-danger dash-button-sm"
            onClick={handleDelete}
            // 3. Disable button if input doesn't match "delete"
            disabled={loading || confirmInput !== "delete"}
            style={{ opacity: confirmInput !== "delete" ? 0.5 : 1 }}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
