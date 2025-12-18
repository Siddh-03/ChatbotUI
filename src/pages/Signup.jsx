import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; // Import directly

const Signup = () => {
  useEffect(() => {
    document.title = "Signup | AgentVerse";
  }, []);

  const navigate = useNavigate();
  // We use local state for submitting to control the data format
  const [loading, setLoading] = useState(false);

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

    if (name === "phone") {
      const numericValue = value.replace(/\D/g, "");
      if (numericValue.length <= 10) {
        setFormData((prev) => ({ ...prev, phone: numericValue }));
      }
      return;
    }

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      if (name === "email") {
        const userPart = value.split("@")[0];
        newData.username = userPart;
      }
      return newData;
    });

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";
    if (formData.password.length < 6) newErrors.password = "Min 6 chars";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Mismatch";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // --- PREPARE DATA FOR NEW API ---
        const apiPayload = {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`, // Combine names
          phone_number: formData.phone, // Rename to phone_number
          password: formData.password,
          profession_id: 1, // Default ID (1 = Standard User)
        };

        const response = await authService.signup(apiPayload);

        if (
          response.status === "success" ||
          response.message?.includes("success")
        ) {
          // If API requires verification, you might redirect to a verify page here
          alert("Registration Successful! Please Login.");
          navigate("/login");
        } else {
          // Handle API failure message
          setErrors({ email: response.message || "Registration failed" });
        }
      } catch (error) {
        console.error("Signup Error:", error);
        setErrors({ email: error.response?.data?.message || "Server Error" });
      } finally {
        setLoading(false);
      }
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
                  style={{ paddingLeft: "15px" }}
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
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Username (Auto)</label>
            <div className="input-wrapper">
              <i className="fas fa-user input-icon"></i>
              <input
                type="text"
                name="username"
                value={formData.username}
                disabled
                style={{ background: "#f5f5f5" }}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Phone</label>
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

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
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
