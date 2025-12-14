import React, { useState, useEffect, useRef } from 'react';
import '../styles/Login.css'; 
import { Link, useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  // Data
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  
  // UI & Logic
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

  // --- Handlers ---

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) {
        setErrors({ email: "Email address is required." });
        return;
    } 
    setErrors({});
    setStep(2);
    setTimer(60);
    setIsExpired(false);
    setOtp(['', '', '', '', '', '']); 
  };

  const handleResend = () => {
    setTimer(60);
    setIsExpired(false);
    setOtp(['', '', '', '', '', '']);
    setErrors({});
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const handleOtpChange = (index, value) => {
    if (isExpired) return;
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (errors.otp) setErrors({ ...errors, otp: '' });
    if (value && index < 5) otpRefs.current[index + 1].focus();
  };

  const handleOtpKeyDown = (index, e) => {
    if (isExpired) return;
    if (e.key === 'Backspace' && !otp[index] && index > 0) otpRefs.current[index - 1].focus();
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (isExpired) return;
    const code = otp.join('');
    if (code.length < 6) {
        setErrors({ otp: "Please enter the full 6-digit code." });
        return;
    }
    setErrors({});
    setStep(3); // Moves to merged Password step
  };

  // --- MERGED PASSWORD SUBMIT ---
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const pwd = passwords.new;
    
    // Regex Checks
    const isLengthValid = pwd.length >= 8;
    const hasUpper = /[A-Z]/.test(pwd);
    const hasLower = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);

    if (!isLengthValid || !hasUpper || !hasLower || !hasNumber || !hasSpecial) {
        setErrors({ newPass: "Please fulfill all password requirements below." });
        return;
    }

    if (passwords.new !== passwords.confirm) {
        setErrors({ confirmPass: "Passwords do not match." });
        return;
    }

    setErrors({});
    setStep(4); // Moves directly to Success
    setTimeout(() => navigate('/login'), 3000);
  };

  // --- Render ---
  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/assist/images/ybai_shadow.png" alt="Logo" className="logo-image" />
      </div>

      {step === 1 && <h1>Verify Your Email</h1>}
      {step === 2 && <h1>Enter OTP</h1>}
      {step === 3 && <h1>Set New Password</h1>}
      {step === 4 && <h1>Account Secured!</h1>}

      {/* Progress Dots (Now only 3 steps shown in dots) */}
      {step < 4 && (
        <div className="progress-dots">
          {[1, 2, 3].map((num) => (
            <div key={num} className={`dot ${step === num ? 'active' : ''}`}></div>
          ))}
        </div>
      )}

      {/* STEP 1: EMAIL */}
      {step === 1 && (
        <form onSubmit={handleEmailSubmit} noValidate>
          <p className="subtitle">Enter your email to receive a verification code.</p>
          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <i className="fas fa-envelope input-icon"></i>
              <input 
                type="email" 
                className={errors.email ? 'input-error' : ''}
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <button type="submit" className="btn-primary">Get OTP</button>
          <div className="switch-form-text">
            <Link to="/login" className="no-underline-force">Go Back</Link>
          </div>
        </form>
      )}

      {/* STEP 2: OTP */}
      {step === 2 && (
        <form onSubmit={handleOtpSubmit} noValidate>
          <p className="subtitle">We've sent a 6-digit code to <b>{email}</b>. Verify the OTP!</p>
          
          <div className="otp-container">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (otpRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                disabled={isExpired}
                className={`otp-box ${errors.otp ? 'input-error' : ''}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
              />
            ))}
          </div>
          
          {isExpired && <span className="otp-error-message">OTP expired. Please resend.</span>}
          {errors.otp && !isExpired && <span className="error-text" style={{textAlign:'center'}}>{errors.otp}</span>}

          <div className={`timer-text ${isExpired ? 'expired' : ''}`}>
             Time left: 00:{timer < 10 ? `0${timer}` : timer}
          </div>
          
          <div className="switch-form-text" style={{marginBottom: '15px'}}>
            Didn't receive code? <span className="no-underline-force" onClick={handleResend}>Resend OTP</span>
          </div>

          <button type="submit" className="btn-primary" disabled={isExpired}>Verify OTP</button>
          <span className="go-back-link" onClick={() => setStep(1)}>Go Back</span>
        </form>
      )}

      {/* STEP 3: NEW PASSWORD & CONFIRM (Combined) */}
      {step === 3 && (
        <form onSubmit={handleFinalSubmit} noValidate>
           <p className="subtitle">Create a strong password and confirm it.</p>
           
           {/* New Password Input */}
           <div className="form-group">
            <label>New Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input 
                type={showPass ? "text" : "password"} 
                className={errors.newPass ? 'input-error' : ''}
                placeholder="Enter new password"
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
              <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`} onClick={() => setShowPass(!showPass)}></i>
            </div>
            {errors.newPass && <span className="error-text">{errors.newPass}</span>}
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <i className="fas fa-lock input-icon"></i>
              <input 
                type={showConfirmPass ? "text" : "password"} 
                className={errors.confirmPass ? 'input-error' : ''}
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
              <i className={`fas ${showConfirmPass ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`} onClick={() => setShowConfirmPass(!showConfirmPass)}></i>
            </div>
            {errors.confirmPass && <span className="error-text">{errors.confirmPass}</span>}
          </div>

          {/* Validation List */}
          <ul className="password-criteria">
            <li className={passwords.new.length >= 8 ? 'valid' : ''}>
                <i className={`fas ${passwords.new.length >= 8 ? 'fa-check' : 'fa-circle'}`}></i> At least 8 characters
            </li>
            <li className={/[A-Z]/.test(passwords.new) ? 'valid' : ''}>
                <i className={`fas ${/[A-Z]/.test(passwords.new) ? 'fa-check' : 'fa-circle'}`}></i> Uppercase letter
            </li>
            <li className={/[a-z]/.test(passwords.new) ? 'valid' : ''}>
                <i className={`fas ${/[a-z]/.test(passwords.new) ? 'fa-check' : 'fa-circle'}`}></i> Lowercase letter
            </li>
            <li className={/[0-9]/.test(passwords.new) ? 'valid' : ''}>
                <i className={`fas ${/[0-9]/.test(passwords.new) ? 'fa-check' : 'fa-circle'}`}></i> Number
            </li>
            <li className={/[!@#$%^&*]/.test(passwords.new) ? 'valid' : ''}>
                <i className={`fas ${/[!@#$%^&*]/.test(passwords.new) ? 'fa-check' : 'fa-circle'}`}></i> Special character
            </li>
          </ul>

          <button type="submit" className="btn-primary">Reset Password</button>
        </form>
      )}

       {/* STEP 4: SUCCESS */}
       {step === 4 && (
        <div style={{textAlign: 'center', padding: '20px 0'}}>
            <div style={{fontSize: '3.5rem', color: '#27AE60', marginBottom: '15px'}}>
                <i className="fas fa-check-circle"></i>
            </div>
            <h2 style={{color: '#1E1E2D', marginBottom: '10px'}}>Account Secured!</h2>
            <p className="subtitle">Your password has been set. Redirecting...</p>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;