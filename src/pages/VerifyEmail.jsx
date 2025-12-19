import React, { useState, useEffect, useRef } from "react";
import "../styles/Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isExpired, setIsExpired] = useState(false);

  const otpRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0 && !success) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsExpired(true);
    }
    return () => clearInterval(interval);
  }, [timer, success]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clean email: Remove whitespace AND invisible characters
    const cleanEmail = email.trim().replace(/[\u200B-\u200D\uFEFF]/g, "");

    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authService.verifyEmailByEmail(cleanEmail, code);
      console.log("Verify Success Response:", response);

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Verification Error:", err);

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Verification failed. Invalid or Expired Code.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    alert("Resend code feature coming soon via backend!");
    setTimer(60);
    setIsExpired(false);
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

        {success ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h2 style={{ color: "#27AE60", marginBottom: "10px" }}>
              Verified!
            </h2>
            <p>Your email has been confirmed.</p>
            <p className="subtitle">Redirecting to login...</p>
          </div>
        ) : (
          <>
            <h1>Verify Account</h1>

            {location.state?.email ? (
              <p className="subtitle">
                We sent a code to <b>{email}</b>
              </p>
            ) : (
              <div style={{ marginBottom: "20px" }}>
                <p className="subtitle">
                  Enter your email and the code sent to you.
                </p>
                <div className="form-group" style={{ textAlign: "left" }}>
                  <label>Email Address</label>
                  <div className="input-wrapper">
                    <i className="fas fa-envelope input-icon"></i>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      style={{ width: "100%" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
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
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>

              {error && (
                <span
                  className="error-text"
                  style={{
                    display: "block",
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  {error}
                </span>
              )}

              <div className="timer-text">
                {timer > 0
                  ? `00:${timer < 10 ? `0${timer}` : timer}`
                  : "Code Expired"}
              </div>

              {isExpired && (
                <div style={{ textAlign: "center", marginBottom: "15px" }}>
                  <span
                    className="go-back-link"
                    onClick={handleResend}
                    style={{ display: "inline", marginTop: 0 }}
                  >
                    Resend Code
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={loading || (isExpired && !success)}
              >
                {loading ? "Verifying..." : "Verify Email"}
              </button>

              <div className="switch-form-text">
                <Link to="/login" className="go-back-link">
                  Back to Login
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
