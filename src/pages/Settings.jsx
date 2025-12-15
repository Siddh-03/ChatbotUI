import React from "react";
import DashboardLayout from "../components/Layout/DashboardLayout";
import ProfileSection from "../components/Settings/ProfileSection";
import SecuritySection from "../components/Settings/SecuritySection";
import AccountSection from "../components/Settings/AccountSection";
import NotificationSection from "../components/Settings/NotificationSection";
import ApiSection from "../components/Settings/ApiSection";
import DataPrivacySection from "../components/Settings/DataPrivacySection";
import { useDashboard } from "../hooks/useDashboard";
import "../styles/Settings.css";

const Settings = () => {
  const { user } = useDashboard();

  return (
    <DashboardLayout activePage="settings" userName={user?.name || "User"}>
      <div className="dash-page-content dash-active">
        <div className="dash-page-header">
          <h2>System Configuration</h2>
          <p>
            Manage your AgentVerse account, preferences, and security settings.
          </p>
        </div>

        <div className="dash-settings-grid">
          {/* 1. Profile Section */}
          <ProfileSection />

          {/* 2. Security Section */}
          <SecuritySection />

          {/* 3. Notifications Section */}
          <NotificationSection />

          {/* 4. API Section */}
          <ApiSection />

          {/* 5. Data & Privacy Section (NEW) */}
          <DataPrivacySection />

          {/* 6. Account/Danger Zone Section */}
          <AccountSection />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
