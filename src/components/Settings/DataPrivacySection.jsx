import React, { useState } from "react";
import SettingsCard from "./SettingsCard";

const DataPrivacySection = () => {
  const [retention, setRetention] = useState("90 Days");

  const handleExport = () => {
    alert("Preparing your data export... You will receive an email shortly.");
  };

  const handleRetentionChange = (e) => {
    setRetention(e.target.value);
    // You would typically save this preference to the backend here
    console.log(`Retention period updated to: ${e.target.value}`);
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
          value={retention}
          onChange={handleRetentionChange}
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