import React, { useState, useEffect, useRef } from "react";
import "../styles/Login.css"; // Reuse your existing styles!
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get email passed from the Signup page
  const [email, setEmail] = useState(location.state?.email || "");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isExpired, setIsExpired] = useState(false);

  const otpRefs = useRef([]);

  // Redirect if no email is found (user tried to access page directly)
  useEffect(() => {
    if (!email) {
      navigate("/signup");
    }
  }, [email, navigate]);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0 && !success) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setIsExpired(true);
    }
    return () => clearInterval(interval);
  }, [timer, success]);

  // Handle Input Change
  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use the specific endpoint for Email Verification
      await authService.verifyEmailByEmail(email, code);

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 3000); // Redirect to login after 3 seconds
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Invalid Code."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    try {
      // Usually, hitting the signup endpoint again triggers a resend,
      // or you might need a specific 'resend-verification' endpoint.
      // For now, we'll alert the user.
      alert("Resend code feature coming soon via backend!");
      setTimer(60);
      setIsExpired(false);
    } catch (err) {
      setError("Could not resend code.");
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
            <p className="subtitle">
              We sent a code to <b>{email}</b>
            </p>

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
