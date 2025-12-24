import React, { useState } from "react";
import SettingsCard from "./SettingsCard";
import { authService } from "../../services/authService";
import { useDashboard } from "../../hooks/useDashboard";

const SecuritySection = () => {
  const { user } = useDashboard(); // Get user email from context
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [status, setStatus] = useState({ loading: false, type: "", msg: "" });

  const toggle = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    // Clear errors when typing
    if (status.msg) setStatus({ loading: false, type: "", msg: "" });
  };

  const handleUpdate = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      setStatus({
        loading: false,
        type: "error",
        msg: "All fields are required.",
      });
      return;
    }
    if (passwords.new !== passwords.confirm) {
      setStatus({
        loading: false,
        type: "error",
        msg: "New passwords do not match!",
      });
      return;
    }

    try {
      setStatus({ loading: true, type: "", msg: "" });
      await authService.changePassword(
        user.email,
        passwords.current,
        passwords.new
      );
      setStatus({
        loading: false,
        type: "success",
        msg: "Password updated successfully!",
      });
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      // FIX: Check 'error' property first (used by user 1.py), then 'message'
      const errorText =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Incorrect current password.";

      setStatus({
        loading: false,
        type: "error",
        msg: errorText,
      });
    }
  };

  return (
    <SettingsCard
      icon="fas fa-shield-alt"
      title="Security Settings"
      description="Manage your password and account security."
      delay="0.1s"
    >
      {/* Current Password */}
      <div className="dash-form-group">
        <label>Current Password</label>
        <div className="dash-input-wrapper" style={{ position: "relative" }}>
          <input
            type={show.current ? "text" : "password"}
            name="current"
            className="dash-form-control"
            value={passwords.current}
            onChange={handleChange}
            placeholder="Enter current password"
            style={{ paddingRight: "35px" }}
          />
          <i
            className={`fas ${show.current ? "fa-eye-slash" : "fa-eye"}`}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#a0a0b0",
            }}
            onClick={() => toggle("current")}
          ></i>
        </div>
      </div>

      {/* New Password */}
      <div className="dash-form-group">
        <label>New Password</label>
        <div className="dash-input-wrapper" style={{ position: "relative" }}>
          <input
            type={show.new ? "text" : "password"}
            name="new"
            className="dash-form-control"
            value={passwords.new}
            onChange={handleChange}
            placeholder="Enter new password"
            style={{ paddingRight: "35px" }}
          />
          <i
            className={`fas ${show.new ? "fa-eye-slash" : "fa-eye"}`}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#a0a0b0",
            }}
            onClick={() => toggle("new")}
          ></i>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="dash-form-group">
        <label>Confirm New Password</label>
        <div className="dash-input-wrapper" style={{ position: "relative" }}>
          <input
            type={show.confirm ? "text" : "password"}
            name="confirm"
            className="dash-form-control"
            value={passwords.confirm}
            onChange={handleChange}
            placeholder="Confirm new password"
            style={{ paddingRight: "35px" }}
          />
          <i
            className={`fas ${show.confirm ? "fa-eye-slash" : "fa-eye"}`}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#a0a0b0",
            }}
            onClick={() => toggle("confirm")}
          ></i>
        </div>
      </div>

      {/* Status Message Area */}
      {status.msg && (
        <div
          style={{
            marginBottom: "15px",
            color: status.type === "error" ? "#ff4b4b" : "#00c853",
            fontSize: "0.9rem",
          }}
        >
          {status.msg}
        </div>
      )}

      <button
        className="dash-button"
        onClick={handleUpdate}
        disabled={status.loading}
        style={{ opacity: status.loading ? 0.7 : 1 }}
      >
        {status.loading ? (
          <i className="fas fa-spinner fa-spin"></i>
        ) : (
          <i className="fas fa-key"></i>
        )}
        {status.loading ? " Updating..." : " Change Password"}
      </button>
    </SettingsCard>
  );
};

export default SecuritySection;
