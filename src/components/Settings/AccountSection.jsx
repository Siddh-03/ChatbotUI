import React, { useState } from "react";
import { createPortal } from "react-dom";
import SettingsCard from "./SettingsCard";
import { FaTimes } from "react-icons/fa";
import { authService } from "../../services/authService"; // Import Service
import { useDashboard } from "../../hooks/useDashboard";
import DeleteModal from "./DeleteModal";


const AccountSection = () => {
  const { logout } = useDashboard();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  // --- HANDLER: DEACTIVATE ---
  const handleDeactivate = async () => {
    if (window.confirm("Are you sure you want to deactivate your account? You will be logged out.")) {
      try {
        await authService.deactivateAccount();
        alert("Account deactivated. Goodbye!");
        logout(); // Auto logout
      } catch (error) {
        alert("Failed to deactivate account. Please try again.");
        console.error(error);
      }
    }
  };

  // --- HANDLER: DELETE ---
  const handleDelete = async () => {
    setLoading(true);
    try {
      await authService.deleteAccount();
      alert("Your account has been permanently deleted.");
      setShowDeleteModal(false);
      logout(); // Auto logout
    } catch (error) {
      alert("Failed to delete account. Please contact support.");
      console.error(error);
      setLoading(false);
    }
  };

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
            <button 
              className="dash-button-secondary dash-button-sm"
              onClick={handleDeactivate}
            >
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

      {showDeleteModal && createPortal(<DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={loading}
        deleteConfirmation={deleteConfirmation}
        setDeleteConfirmation={setDeleteConfirmation}
      />, document.body)}
    </>
  );
};

export default AccountSection;