import React from "react";
import SettingsCard from "./SettingsCard";

const ApiSection = () => {
  const apiKey = "ak_live_5594839203_xyz";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
    alert("API Key copied to clipboard!");
  };

  return (
    <SettingsCard
      icon="fas fa-code-branch"
      title="API & Integrations"
      description="Manage API keys and connect third-party services."
      delay="0.21s"
    >
      <div className="dash-form-group">
        <label htmlFor="settings-api-key">Main API Key</label>
        <div className="dash-api-key-display">
          <input
            type="text"
            id="settings-api-key"
            className="dash-form-control"
            value={apiKey}
            readOnly
          />
          <button
            className="dash-button-sm dash-button-secondary dash-icon-btn"
            title="Copy API Key"
            onClick={copyToClipboard}
          >
            <i className="fas fa-copy"></i>
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <button
          className="dash-button-secondary"
          onClick={() => alert("Key regeneration started...")}
        >
          <i className="fas fa-sync-alt"></i> Regenerate Key
        </button>
        <button
          className="dash-button"
          onClick={() => alert("New API Key created!")}
        >
          <i className="fas fa-plus"></i> New Key
        </button>
      </div>

      <hr className="dash-hr" />

      <p
        style={{
          fontSize: "0.9rem",
          marginBottom: "15px",
          marginTop: "15px",
          color: "var(--dash-text-muted)",
        }}
      >
        Connected Integrations: None yet.
      </p>
      <button
        className="dash-button-secondary"
        onClick={() => alert("Opening integration manager...")}
      >
        <i className="fas fa-plug"></i> Manage Integrations
      </button>
    </SettingsCard>
  );
};

export default ApiSection;
