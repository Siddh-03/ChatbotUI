import React, { useState } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useDashboard();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone Logic: Only allow numbers, max 10
    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: numericValue }));
      }
      return;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Auto-fill username from email
      if (name === "email") {
        const userPart = value.split("@")[0];
        newData.username = userPart;
      }
      return newData;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (!formData.username.trim()) newErrors.username = "Required";
    if (formData.password.length < 6) newErrors.password = "Min 6 chars";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mismatch";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      signup(formData);
      navigate("/dashboard");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-container">
        <div className="logo-container">
          <img
            src="/assist/images/ybai_shadow.png"
            alt="Logo"
            className="logo-image"
          />
        </div>

        <h1>Create Account</h1>
        <p className="subtitle">Join AgentVerse today</p>

        <form onSubmit={handleSubmit}>
          {/* Name Row */}
          <div style={{ display: "flex", gap: "15px" }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label>First Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "input-error" : ""}
                  style={{ paddingLeft: "15px" }} /* Override icon padding */
                />
              </div>
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label>Last Name</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "input-error" : ""}
                  style={{ paddingLeft: "15px" }}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "input-error" : ""}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Username</label>
            <div className="input-wrapper">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                name="username"
                placeholder="Auto-generated"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? "input-error" : ""}
                disabled 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone (Optional)</label>
            <div className="input-wrapper">
              <i className="fas fa-phone input-icon"></i>
              <input
                type="tel"
                name="phone"
                placeholder="1234567890"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "input-error" : ""}
              />
              <i
                className={`fas ${
                  showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle-icon`}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              ></i>
            </div>
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="btn-primary">
            Create Account
          </button>
        </form>

        <p className="switch-form-text">
          Already have an account?{" "}
          <Link to="/login" className="no-underline-force">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
