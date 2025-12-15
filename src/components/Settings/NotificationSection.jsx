import React, { useState } from "react";
import SettingsCard from "./SettingsCard";

const NotificationOption = ({ label, checked, onChange }) => (
  <div className="dash-notification-option">
    <span>{label}</span>
    <label className="dash-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="dash-slider"></span>
    </label>
  </div>
);

const NotificationSection = () => {
  const [prefs, setPrefs] = useState({
    tasks: true,
    announcements: true,
    summary: false,
    promo: false,
  });

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SettingsCard
      icon="fas fa-bell"
      title="Notification Preferences"
      description="Control how and when you receive notifications."
      delay="0.14s"
    >
      <NotificationOption
        label="Task Completion Alerts"
        checked={prefs.tasks}
        onChange={() => toggle("tasks")}
      />
      <NotificationOption
        label="New Chatbot Announcements"
        checked={prefs.announcements}
        onChange={() => toggle("announcements")}
      />
      <NotificationOption
        label="Weekly Summary Email"
        checked={prefs.summary}
        onChange={() => toggle("summary")}
      />
      <div style={{ borderBottom: "none" }}>
        {" "}
        {/* Remove border for last item */}
        <NotificationOption
          label="Promotional Updates"
          checked={prefs.promo}
          onChange={() => toggle("promo")}
        />
      </div>
    </SettingsCard>
  );
};

export default NotificationSection;
