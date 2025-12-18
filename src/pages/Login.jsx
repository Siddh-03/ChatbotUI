import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import "../styles/Login.css";

const Login = () => {
  useEffect(() => {
    document.title = "Login | AgentVerse";
  }, []);

  const navigate = useNavigate();
  const { login } = useDashboard();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email or password.");
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

        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to continue to AgentVerse</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={error ? "input-error" : ""}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={error ? "input-error" : ""}
              />
              <i
                className={`fas ${
                  showPassword ? "fa-eye-slash" : "fa-eye"
                } password-toggle-icon`}
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            {error && <span className="error-text">{error}</span>}
          </div>

          <div className="password-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary">
            Sign In
          </button>
        </form>

        <p className="switch-form-text">
          Don't have an account?{" "}
          <Link to="/signup" className="no-underline-force">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
