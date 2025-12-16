import React from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";

const DeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  deleteConfirmation,
  setDeleteConfirmation,
}) => {
  if (!isOpen) return null;

  // The Modal handles its own Portal to document.body
  return createPortal(
    <div className="settings-modal-overlay">
      <div className="settings-modal card">
        <button className="settings-close-modal" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="settings-modal-title">Permanently Delete Account</h3>
        <p className="settings-modal-text">
          This action is irreversible. All your data will be permanently erased.
        </p>
        <label className="settings-modal-label">
          To confirm, please type "<strong>Delete my account</strong>" below:
        </label>
        <input
          type="text"
          className="dash-form-control settings-modal-input"
          placeholder='Type "Delete my account"'
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          autoFocus // Focus automatically when opened
        />
        <div className="settings-modal-actions">
          <button className="dash-button-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="dash-button-danger"
            disabled={deleteConfirmation !== "Delete my account" || loading}
            onClick={onConfirm}
            style={{
              opacity: deleteConfirmation !== "Delete my account" ? 0.5 : 1,
              cursor:
                deleteConfirmation !== "Delete my account"
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading ? "Deleting..." : "Delete My Account"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default DeleteModal;
