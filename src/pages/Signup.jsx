import React, { useState, useEffect } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const Signup = () => {
  useEffect(() => {
    document.title = "Signup | AgentVerse";
  }, []);

  const navigate = useNavigate();
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

  // --- PASSWORD VALIDATION HELPER ---
  const validatePassword = (pwd) => {
    // Regex: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    // Special chars allowed: @$!%*?& and others commonly used
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Required";
    if (!formData.lastName.trim()) newErrors.lastName = "Required";
    if (!formData.email.trim()) newErrors.email = "Required";

    // Phone Validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Required";
    } else if (formData.phone.length !== 10) {
      newErrors.phone = "Must be 10 digits";
    }

    // Password Validation
    if (!formData.password) {
      newErrors.password = "Required";
    } else if (!validatePassword(formData.password)) {
      newErrors.password =
        "Password must be 8+ chars, with 1 Upper, 1 Lower, 1 Number, & 1 Special Char";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mismatch";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const apiPayload = {
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone_number: formData.phone,
          password: formData.password,
          profession_id: 1,
        };

        const response = await authService.signup(apiPayload);

        // --- DEBUG: Log the success response to see what the server sent ---
        console.log("Signup API Success Response:", response);

        // --- FIXED REDIRECT LOGIC ---
        // If the code reaches here, axios did NOT throw an error (Status 200-299).
        // Unless the server explicitly sent "status: 'failure'" inside the JSON, we assume success.
        if (response?.status === "failure" || response?.error) {
          setErrors({
            email: response.message || response.error || "Registration failed",
          });
        } else {
          // Default to success for any 2xx response
          navigate("/verify-email", { state: { email: formData.email } });
        }
      } catch (error) {
        console.error("Signup Catch Error:", error);

        // Handle 409 Conflict specifically (User already exists)
        if (error.response?.status === 409) {
          setErrors({
            email: "Email or Phone already registered. Please login.",
          });
        } else {
          const serverMessage =
            error.response?.data?.message ||
            error.response?.data?.error ||
            (typeof error.response?.data === "string"
              ? error.response.data
              : "Registration failed. Please try again.");

          setErrors({ email: serverMessage });
        }
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
                className={errors.phone ? "input-error" : ""}
              />
            </div>
            {errors.phone && <span className="error-text">{errors.phone}</span>}
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

        <p className="switch-form-text" style={{ marginTop: "10px" }}>
          Have a code?{" "}
          <Link to="/verify-email" className="no-underline-force">
            Verify Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
