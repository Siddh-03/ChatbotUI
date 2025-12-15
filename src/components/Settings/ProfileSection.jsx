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

  // State for validation errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const nameParts = user.name ? user.name.split(" ") : ["", ""];
      setFormData({
        firstName: user.firstName || nameParts[0] || "",
        lastName: user.lastName || nameParts.slice(1).join(" ") || "",
        email: user.email || "",
        username: user.username || "",
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
    if (!formData.username.trim()) tempErrors.username = "Username is required";

    // Phone Validation: Must be 10 digits
    if (formData.phone && formData.phone.length !== 10) {
      tempErrors.phone = "Phone number must be 10 digits";
    }

    setErrors(tempErrors);
    // Return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: Only allow numbers
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, ""); // Remove non-digits
      if (numericValue.length <= 10) {
        // Max 10 digits
        setFormData({ ...formData, phone: numericValue });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSave = () => {
    if (validate()) {
      updateProfile(formData);
      alert("Profile updated successfully!");
    }
  };

  return (
    <SettingsCard
      icon="fas fa-user-circle"
      title="Profile & Account"
      description="Update your personal details from here."
    >
      {/* First & Last Name Grid */}
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
        {errors.username && (
          <span className="dash-error-text">{errors.username}</span>
        )}
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
