import React, { useState, useEffect, useRef } from "react";
import "../styles/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authService"; // Import Service

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Data
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [passwords, setPasswords] = useState({ new: "", confirm: "" });

  // UI
  const [errors, setErrors] = useState({});
  const [timer, setTimer] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const otpRefs = useRef([]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (step === 2 && timer === 0) {
      setIsExpired(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // --- STEP 1: SEND OTP ---
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setErrors({ email: "Email required." });

    setLoading(true);
    try {
      // API CALL
      await authService.forgotPassword(email);
      setStep(2);
      setTimer(60);
      setIsExpired(false);
      setErrors({});
    } catch (error) {
      setErrors({
        email:
          error.response?.data?.message ||
          "User not found or error sending OTP.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      await authService.forgotPassword(email); // Resend API
      setTimer(60);
      setIsExpired(false);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch (error) {
      alert("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: VERIFY OTP ---
  const handleOtpChange = (index, value) => {
    if (isExpired || isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) return setErrors({ otp: "Enter full 6-digit code." });

    setLoading(true);
    try {
      // API CALL
      await authService.verifyOtp(email, code);
      setStep(3); // Success, move to password
      setErrors({});
    } catch (error) {
      setErrors({ otp: "Invalid or expired OTP." });
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 3: RESET PASSWORD ---
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    const { new: newPass, confirm: confirmPass } = passwords;

    if (newPass.length < 8)
      return setErrors({ newPass: "Password too short." });
    if (newPass !== confirmPass)
      return setErrors({ confirmPass: "Passwords do not match." });

    setLoading(true);
    try {
      const code = otp.join("");
      // API CALL
      await authService.resetPassword(email, code, newPass);
      setStep(4); // Success screen
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      setErrors({ newPass: "Failed to reset password. Try again." });
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

        {step === 1 && <h1>Reset Password</h1>}
        {step === 2 && <h1>Enter Verification Code</h1>}
        {step === 3 && <h1>Set New Password</h1>}
        {step === 4 && <h1>Success!</h1>}

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit}>
            <p className="subtitle">Enter your email to receive a code.</p>
            <div className="form-group">
              <label>Email</label>
              <div className="input-wrapper">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={errors.email ? "input-error" : ""}
                />
              </div>
              {errors.email && (
                <span className="error-text">{errors.email}</span>
              )}
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Sending..." : "Get OTP"}
            </button>
            <div className="switch-form-text">
              <Link to="/login" className="go-back-link">
                Back to Login
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <p className="subtitle">
              Sent to <b>{email}</b>
            </p>
            <div className="otp-container">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  className="otp-box"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                />
              ))}
            </div>
            {errors.otp && (
              <span
                className="error-text"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                {errors.otp}
              </span>
            )}

            <div className="timer-text">
              00:{timer < 10 ? `0${timer}` : timer}
            </div>
            {isExpired && (
              <span className="go-back-link" onClick={handleResend}>
                Resend OTP
              </span>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || isExpired}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {/* STEP 3: PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit}>
            <p className="subtitle">Create a strong password.</p>
            <div className="form-group">
              <label>New Password</label>
              <div className="input-wrapper">
                <input
                  type={showPass ? "text" : "password"}
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  placeholder="New password"
                />
                <i
                  className={`fas ${
                    showPass ? "fa-eye-slash" : "fa-eye"
                  } password-toggle-icon`}
                  onClick={() => setShowPass(!showPass)}
                ></i>
              </div>
              {errors.newPass && (
                <span className="error-text">{errors.newPass}</span>
              )}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPass ? "text" : "password"}
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  placeholder="Confirm password"
                />
              </div>
              {errors.confirmPass && (
                <span className="error-text">{errors.confirmPass}</span>
              )}
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* STEP 4: SUCCESS */}
        {step === 4 && (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#27AE60" }}>Password Reset!</h2>
            <p>Redirecting to login...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
