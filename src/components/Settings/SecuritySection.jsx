import React, { useState } from "react";
import SettingsCard from "./SettingsCard";

const SecuritySection = () => {
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

  const toggle = (field) => {
    setShow((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPasswords({ current: "", new: "", confirm: "" });
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

      <button className="dash-button" onClick={handleUpdate}>
        <i className="fas fa-key"></i> Change Password
      </button>
    </SettingsCard>
  );
};

export default SecuritySection;
