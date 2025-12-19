import React, { useState } from "react";
import { authService } from "../../services/authService";

const DeleteModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleDelete = async () => {
    // Backend Limitation Check
    setError(
      "This feature is currently disabled by the administrator (Backend endpoint missing)."
    );
    return;

    /* // REAL LOGIC (Keep for when backend adds the route)
    setLoading(true);
    try {
      await authService.deleteAccount();
      authService.logout();
    } catch (err) {
      setError("Failed to delete account. Please try again.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div className="modal-overlay">
      <div className="delete-modal">
        <h3>Delete Account</h3>
        <p>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </p>

        {error && (
          <p
            style={{
              color: "#e74c3c",
              fontSize: "0.9rem",
              marginBottom: "10px",
              background: "#fadbd8",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {error}
          </p>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="btn-delete-confirm"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
