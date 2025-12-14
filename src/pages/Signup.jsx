import React, { useState } from 'react';
import '../styles/Login.css'; // Reusing your main styles
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 1. Phone Logic: Only allow numbers, max 10 digits
    if (name === 'phone') {
        const numericValue = value.replace(/\D/g, ''); // Remove non-digits
        if (numericValue.length <= 10) {
            setFormData(prev => ({ ...prev, phone: numericValue }));
        }
        return; 
    }

    setFormData(prev => {
        const newData = { ...prev, [name]: value };
        
        // 2. Username Logic: Auto-fill from Email (before @)
        if (name === 'email') {
            const userPart = value.split('@')[0];
            newData.username = userPart;
        }
        return newData;
    });

    // Clear error for this field
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    // --- Validations ---
    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.username.trim()) newErrors.username = "Username is required";
    
    // Phone Validation (Optional but must be 10 digits if entered)
    if (formData.phone && formData.phone.length !== 10) {
        newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Signup Submitted", formData);
      // TODO: Add your API Call here
    }
  };

  return (
    <div className="auth-container">
      <div className="logo-container">
        <img src="/assist/images/ybai_shadow.png" alt="Logo" className="logo-image" />
      </div>
      
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        
        {/* First Name & Last Name (Side by Side for cleaner look) */}
        <div style={{ display: 'flex', gap: '15px' }}>
            <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="firstName">First Name</label>
                <div className="input-wrapper">
                    <input 
                    type="text" 
                    name="firstName" 
                    className={errors.firstName ? 'input-error' : ''}
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    style={{ paddingLeft: '15px' }} /* Override padding since no icon */
                    />
                </div>
                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group" style={{ flex: 1 }}>
                <label htmlFor="lastName">Last Name</label>
                <div className="input-wrapper">
                    <input 
                    type="text" 
                    name="lastName" 
                    className={errors.lastName ? 'input-error' : ''}
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    style={{ paddingLeft: '15px' }} /* Override padding since no icon */
                    />
                </div>
                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>
        </div>

        {/* Email Field */}
        <div className="form-group">
          <label htmlFor="signupEmail">Email</label>
          <div className="input-wrapper">
            <i className="fas fa-envelope input-icon"></i>
            <input 
              type="email" 
              name="email" 
              className={errors.email ? 'input-error' : ''}
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <span className="error-text">{errors.email}</span>}
        </div>

        {/* Username Field (Auto-filled) */}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <div className="input-wrapper">
            <i className="fas fa-user input-icon"></i>
            <input 
              type="text" 
              name="username" 
              className={errors.username ? 'input-error' : ''}
              placeholder="Auto-generated from email"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          {errors.username && <span className="error-text">{errors.username}</span>}
        </div>

        {/* Phone Field (Optional, 10 Digits) */}
        <div className="form-group">
          <label htmlFor="phone">Phone (Optional)</label>
          <div className="input-wrapper">
            <i className="fas fa-phone input-icon"></i>
            <input 
              type="tel" 
              name="phone" 
              className={errors.phone ? 'input-error' : ''}
              placeholder="1234567890"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          {errors.phone && <span className="error-text">{errors.phone}</span>}
        </div>

        {/* Password Field */}
        <div className="form-group">
          <label htmlFor="signupPassword">Password</label>
          <div className="input-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input 
              type={showPassword ? "text" : "password"} 
              name="password" 
              className={errors.password ? 'input-error' : ''}
              placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="input-wrapper">
            <i className="fas fa-lock input-icon"></i>
            <input 
              type={showConfirmPassword ? "text" : "password"} 
              name="confirmPassword" 
              className={errors.confirmPassword ? 'input-error' : ''}
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            <i 
              className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'} password-toggle-icon`} 
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            ></i>
          </div>
          {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
        </div>

        <div className="btn-primary-container">
          <button type="submit" className="btn-primary">Create Account</button>
        </div>
      </form>

      <p className="switch-form-text">
        Already have an account? <Link to="/login" className="no-underline-force">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;