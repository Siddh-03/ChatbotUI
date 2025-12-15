import React, { useState } from 'react';
import '../styles/Login.css'; // Make sure this path matches where your CSS is
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false
  });

  const [errors, setErrors] = useState({}); // State to hold error messages
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Validate Email
    if (!formData.email) {
      newErrors.email = "Email address is required.";
    }

    // 2. Validate Password
    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    setErrors(newErrors);

    // Only submit if no errors
    if (Object.keys(newErrors).length === 0) {
      console.log("Form Submitted:", formData);
      // Add your API login call here
    }
  };

  return (
    <div className="auth-page-wrapper">
    <div className="auth-container">
      <div className="logo-container">
        <img src="/assist/images/ybai_shadow.png" alt="Edu AI Logo" className="logo-image" />
      </div>
      
      <h1>Edu YBAI</h1>
      <p className="subtitle">Sign in to chat with your AI assistants and manage your bots</p>

      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="loginEmail">Email</label>
          <div className="input-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input 
              type="email" 
              id="loginEmail" 
              name="email" 
              // Add 'input-error' class if there is an error
              className={errors.email ? 'input-error' : ''}
              placeholder="erica@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {/* Show error text if exists */}
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="loginPassword">Password</label>
          <div className="input-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input 
              type={showPassword ? "text" : "password"} 
              id="loginPassword" 
              name="password" 
              className={`has-both-icons ${errors.password ? 'input-error' : ''}`}
              placeholder="••••••••••"
              value={formData.password}
              onChange={handleChange}
            />
            <i 
              className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`} 
              onClick={() => setShowPassword(!showPassword)}
            ></i>
          </div>
          {errors.password && <span className="error-text">{errors.password}</span>}
        </div>

        <div className="password-options">
          <label className="remember-me">
            <input 
              type="checkbox" 
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <span>Remember for 30 days</span>
          </label>
          <Link to="/forgot-password" class="forgot-password">Forgot Password?</Link>
        </div>

        <div className="btn-primary-container">
          <button type="submit" className="btn-primary">Sign in</button>
        </div>
      </form>

      <p className="switch-form-text">
        Don't have an account? <Link to="/signup" className="no-underline-force">Create an account</Link>
      </p>
    </div>
    </div>
  );
};

export default Login;