import React from "react";

const SettingsCard = ({ icon, title, description, children, delay = "0s" }) => {
  return (
    <div className="dash-settings-card" style={{ animationDelay: delay }}>
      <div className="dash-settings-card-header">
        <i className={`${icon} dash-settings-icon`}></i>
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      <div className="dash-settings-card-body">{children}</div>
    </div>
  );
};

export default SettingsCard;
