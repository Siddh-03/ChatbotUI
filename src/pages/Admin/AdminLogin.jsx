import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { adminService } from "../../services/adminService"; // Keep for later

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    // Real login blocked for now? Use bypass.
    setError("API unavailable. Please use Guest Login.");
  };

  const handleBypass = () => {
    // 1. Set the token that AdminLayout looks for
    localStorage.setItem("adminUser", JSON.stringify({ name: "Dev Admin" }));
    // 2. Redirect
    navigate("/admin/users");
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{ color: "var(--primary-color)", marginBottom: "10px" }}>
          Admin Portal
        </h2>
        <p style={{ color: "#666", marginBottom: "20px" }}>Restricted Access</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "15px", textAlign: "left" }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div style={{ marginBottom: "20px", textAlign: "left" }}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
          <button type="submit" style={btnStyle}>
            Sign In
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #eee",
            paddingTop: "15px",
          }}
        >
          <button onClick={handleBypass} style={bypassBtnStyle}>
            Login as Guest (Bypass)
          </button>
        </div>
      </div>
    </div>
  );
};

// Internal Styles for speed
const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#f4f7f9",
};
const cardStyle = {
  backgroundColor: "white",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
  width: "100%",
  maxWidth: "380px",
  textAlign: "center",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "5px",
  boxSizing: "border-box",
};
const labelStyle = { fontSize: "0.9rem", fontWeight: "600", color: "#333" };
const btnStyle = {
  width: "100%",
  padding: "12px",
  background: "var(--primary-color)",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "1rem",
  fontWeight: "600",
};
const bypassBtnStyle = {
  background: "transparent",
  border: "1px dashed #999",
  color: "#666",
  padding: "8px 16px",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "0.85rem",
};

export default AdminLogin;
