import React, { useState } from "react";
import { createPortal } from "react-dom"; // IMPORT THIS
import SettingsCard from "./SettingsCard";
import { FaTimes } from "react-icons/fa";

const AccountSection = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const handleDelete = () => {
    alert("Account permanently deleted.");
    setShowDeleteModal(false);
    setDeleteConfirmation("");
  };

  // The Modal Component (Teleported)
  const DeleteModal = () => (
    <div className="settings-modal-overlay">
      <div className="settings-modal card">
        <button
          className="settings-close-modal"
          onClick={() => setShowDeleteModal(false)}
        >
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
        />
        <div className="settings-modal-actions">
          <button
            className="dash-button-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="dash-button-danger"
            disabled={deleteConfirmation !== "Delete my account"}
            onClick={handleDelete}
            style={{
              opacity: deleteConfirmation !== "Delete my account" ? 0.5 : 1,
              cursor:
                deleteConfirmation !== "Delete my account"
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            Delete My Account
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <SettingsCard
        icon="fas fa-user-cog"
        title="Account Management"
        description="Manage your account status and related actions."
        delay="0.35s"
      >
        <ul className="dash-account-actions-list">
          <li>
            <div className="action-details">
              <strong>Deactivate Account</strong>
              <p>Temporarily suspend your account.</p>
            </div>
            <button className="dash-button-secondary dash-button-sm">
              <i className="fas fa-power-off"></i> Deactivate
            </button>
          </li>
          <li className="dash-danger-zone-item">
            <div className="action-details">
              <strong>Delete Account</strong>
              <p>Permanently delete your account and data.</p>
            </div>
            <button
              className="dash-button-danger dash-button-sm"
              onClick={() => setShowDeleteModal(true)}
            >
              <i className="fas fa-trash-alt"></i> Delete
            </button>
          </li>
        </ul>
      </SettingsCard>

      {/* RENDER MODAL VIA PORTAL */}
      {showDeleteModal && createPortal(<DeleteModal />, document.body)}
    </>
  );
};

export default AccountSection;
