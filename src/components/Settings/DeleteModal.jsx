import React, { useState } from "react";
import { authService } from "../../services/authService";

const DeleteModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmInput, setConfirmInput] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (confirmInput !== "delete") return;

    setLoading(true);
    setError("");

    try {
      // 1. Call API
      await authService.deleteAccount();

      // 2. Logout and Redirect (handled by logout service)
      await authService.logout();
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Failed to delete account. Please try again."
      );
      setLoading(false);
    }
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
            disabled={loading || confirmInput !== "delete"}
            style={{ opacity: confirmInput !== "delete" || loading ? 0.5 : 1 }}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
