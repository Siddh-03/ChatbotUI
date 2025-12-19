import React, { useState, useEffect } from "react";
import SettingsCard from "./SettingsCard";
import { useDashboard } from "../../hooks/useDashboard";

const ProfileSection = () => {
  const { user, updateProfile } = useDashboard();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    avatar: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      // If user.firstName exists (from our hook logic), use it.
      // Otherwise fallback to splitting 'name' manually.
      let first = user.firstName;
      let last = user.lastName;

      if (!first && user.name) {
        const parts = user.name.split(" ");
        first = parts[0];
        last = parts.slice(1).join(" ");
      }

      setFormData({
        firstName: first || "",
        lastName: last || "",
        email: user.email || "",
        username: user.username || user.email?.split("@")[0] || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName.trim())
      tempErrors.firstName = "First name is required";
    if (!formData.lastName.trim())
      tempErrors.lastName = "Last name is required";

    // Username is often read-only or derived, but if editable:
    // if (!formData.username.trim()) tempErrors.username = "Username is required";

    if (formData.phone && formData.phone.length !== 10) {
      tempErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData({ ...formData, phone: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSave = () => {
    if (validate()) {
      // Updates local context. Note: Backend API to update name isn't available yet,
      // so this will only reflect in the UI for the current session or until refresh
      // if not persisted to DB.
      updateProfile(formData);
      alert("Profile updated successfully (Local session only)!");
    }
  };

  return (
    <SettingsCard
      icon="fas fa-user-circle"
      title="Profile & Account"
      description="Update your personal details from here."
    >
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}
      >
        <div className="dash-form-group">
          <label>
            First Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="firstName"
            className={`dash-form-control ${
              errors.firstName ? "error-border" : ""
            }`}
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span className="dash-error-text">{errors.firstName}</span>
          )}
        </div>
        <div className="dash-form-group">
          <label>
            Last Name <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="text"
            name="lastName"
            className={`dash-form-control ${
              errors.lastName ? "error-border" : ""
            }`}
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <span className="dash-error-text">{errors.lastName}</span>
          )}
        </div>
      </div>

      <div className="dash-form-group">
        <label>Email Address</label>
        <input
          type="email"
          name="email"
          className="dash-form-control"
          value={formData.email}
          disabled
          style={{ opacity: 0.7, cursor: "not-allowed" }}
        />
      </div>

      <div className="dash-form-group">
        <label>
          Username <span style={{ color: "red" }}>*</span>
        </label>
        <input
          type="text"
          name="username"
          className={`dash-form-control ${
            errors.username ? "error-border" : ""
          }`}
          value={formData.username}
          onChange={handleChange}
          disabled
          style={{ opacity: 0.7, cursor: "not-allowed" }}
        />
      </div>

      <div className="dash-form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          name="phone"
          className={`dash-form-control ${errors.phone ? "error-border" : ""}`}
          value={formData.phone}
          onChange={handleChange}
          placeholder="1234567890"
        />
        {errors.phone && (
          <span className="dash-error-text">{errors.phone}</span>
        )}
      </div>

      <button className="dash-button" onClick={handleSave}>
        <i className="fas fa-save"></i> Save Profile
      </button>
    </SettingsCard>
  );
};

export default ProfileSection;
