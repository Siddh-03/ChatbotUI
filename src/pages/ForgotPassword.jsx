import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import "../styles/Login.css"; // Reusing login styles for consistency

const ForgotPassword = () => {
  useEffect(() => {
    document.title = "Forgot Password | AgentVerse";
  }, []);

  const navigate = useNavigate();

  // Steps: 1 = Email, 2 = OTP, 3 = New Password
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Form Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // --- STEP 1: SEND OTP ---
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.forgotPassword(email);
      setSuccessMsg("OTP sent to your email.");
      setStep(2);
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to send OTP. User may not exist."
      );
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.verifyOtp(email, otp);
      setSuccessMsg("OTP Verified! Please set your new password.");
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: RESET PASSWORD ---
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    // Simple length check, backend handles regex
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend requires: email, otp, new_password
      await authService.resetPassword(email, otp, newPassword);
      setSuccessMsg("Password reset successful! Redirecting...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password.");
    } finally {
      setLoading(false);
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

        <h1>Reset Password</h1>

        {step === 1 && (
          <p className="subtitle">Enter your email to receive a code.</p>
        )}
        {step === 2 && (
          <p className="subtitle">
            Enter the OTP sent to <b>{email}</b>
          </p>
        )}
        {step === 3 && (
          <p className="subtitle">Create a new secure password.</p>
        )}

        {error && (
          <div
            className="error-text"
            style={{ textAlign: "center", marginBottom: "15px" }}
          >
            {error}
          </div>
        )}
        {successMsg && (
          <div
            style={{
              color: "#27ae60",
              textAlign: "center",
              marginBottom: "15px",
            }}
          >
            {successMsg}
          </div>
        )}

        <form
          onSubmit={
            step === 1
              ? handleSendOtp
              : step === 2
              ? handleVerifyOtp
              : handleResetPassword
          }
        >
          {/* STEP 1: EMAIL INPUT */}
          {step === 1 && (
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
                />
              </div>
            </div>
          )}

          {/* STEP 2: OTP INPUT */}
          {step === 2 && (
            <div className="form-group">
              <label>OTP Code</label>
              <div className="input-wrapper">
                <i className="fas fa-key input-icon"></i>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 3: NEW PASSWORD */}
          {step === 3 && (
            <>
              <div className="form-group">
                <label>New Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <i
                    className={`fas ${
                      showPassword ? "fa-eye-slash" : "fa-eye"
                    } password-toggle-icon`}
                    onClick={() => setShowPassword(!showPassword)}
                  ></i>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <div className="input-wrapper">
                  <i className="fas fa-lock input-icon"></i>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading
              ? "Processing..."
              : step === 1
              ? "Send OTP"
              : step === 2
              ? "Verify OTP"
              : "Reset Password"}
          </button>
        </form>

        <p className="switch-form-text">
          Remember your password?{" "}
          <Link to="/login" className="no-underline-force">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
