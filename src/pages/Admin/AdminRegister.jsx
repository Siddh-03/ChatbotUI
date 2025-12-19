import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { FaUserPlus, FaArrowLeft } from "react-icons/fa";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    is_superadmin: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await adminService.registerAdmin(formData);
      alert("Admin created successfully!");
      navigate("/admin/admins");
    } catch (err) {
      console.error("Registration failed:", err);
      setError(
        err.response?.data?.error ||
          "Failed to create admin. Ensure you are a Superadmin."
      );
    } finally {
      setLoading(false);
    }
  };

  // Inline styles to match dashboard inputs without creating new CSS file
  const inputStyle = {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "8px",
    border: "1px solid var(--dash-border-color)",
    backgroundColor: "var(--dash-main-bg)",
    color: "var(--dash-text-color)",
    fontSize: "0.95rem",
    marginTop: "5px",
    marginBottom: "20px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div className="dash-page-content dash-active">
      <div className="dash-page-header">
        <h2>Register New Admin</h2>
        <p>Create a new administrative account.</p>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <button
          onClick={() => navigate("/admin/admins")}
          className="dash-button-secondary"
          style={{
            marginBottom: "20px",
            border: "none",
            paddingLeft: 0,
            justifyContent: "flex-start",
          }}
        >
          <FaArrowLeft /> Back to List
        </button>

        <div className="dash-card">
          {error && (
            <div
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
                padding: "12px",
                borderRadius: "8px",
                marginBottom: "20px",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                style={inputStyle}
                placeholder="e.g. John Doe"
              />
            </div>

            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                style={inputStyle}
                placeholder="••••••••"
              />
            </div>

            <div
              style={{
                marginBottom: "25px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                id="is_superadmin"
                name="is_superadmin"
                checked={formData.is_superadmin}
                onChange={handleChange}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
              <label
                htmlFor="is_superadmin"
                style={{ cursor: "pointer", fontSize: "0.95rem" }}
              >
                Grant <strong>Superadmin</strong> Privileges?
              </label>
            </div>

            <button
              type="submit"
              className="dash-button"
              style={{ width: "100%" }}
              disabled={loading}
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  <FaUserPlus /> Create Admin
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
