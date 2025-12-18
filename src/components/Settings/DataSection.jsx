import React from "react";
import SettingsCard from "./SettingsCard";

const DataSection = () => {
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
        >
          <option>Keep Indefinitely</option>
          <option>90 Days</option>
          <option>30 Days</option>
          <option>Do Not Store</option>
        </select>
      </div>
      <button className="dash-button-secondary">
        <i className="fas fa-file-download"></i> Export My Data
      </button>
    </SettingsCard>
  );
};

export default DataSection;
