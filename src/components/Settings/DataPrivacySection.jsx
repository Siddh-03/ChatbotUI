import React from "react";
import SettingsCard from "./SettingsCard";
import { authService } from "../../services/authService";

const DataPrivacySection = () => {
  const handleExport = async () => {
    try {
      alert("Preparing your data export... This might take a moment.");
      // In a real app, this would get a Blob and trigger a file download
      // For now, we simulate the API call
      await authService.exportData();
      alert("Your data has been emailed to you!");
    } catch (error) {
      console.log("Export triggered (Mock)");
    }
  };

  return (
    <SettingsCard
      icon="fas fa-database"
      title="Data & Privacy"
      description="Manage your data and privacy settings."
      delay="0.28s"
    >
      <div className="dash-form-group">
        <label htmlFor="settings-data-retention">
          Conversation History Retention
        </label>
        <select
          id="settings-data-retention"
          className="dash-form-control"
          defaultValue="90 Days"
          style={{ cursor: "pointer" }}
        >
          <option>Keep Indefinitely</option>
          <option>90 Days</option>
          <option>30 Days</option>
          <option>Do Not Store</option>
        </select>
      </div>
      <button className="dash-button-secondary" onClick={handleExport}>
        <i className="fas fa-file-download"></i> Export My Data
      </button>
    </SettingsCard>
  );
};

export default DataPrivacySection;
