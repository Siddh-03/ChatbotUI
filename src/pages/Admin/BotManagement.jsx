import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { adminService } from "../../services/adminService";

const BotManagement = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prompt: "",
  });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchBots();
  }, []);

  const fetchBots = async () => {
    try {
      const data = await adminService.getAllBots();
      setBots(data);
    } catch (error) {
      console.error("Failed to fetch bots", error);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Bot Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.prompt.trim()) newErrors.prompt = "System Prompt is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setCreating(true);
    try {
      await adminService.createBot(formData);
      setShowModal(false);
      setFormData({ name: "", description: "", prompt: "" }); // Reset
      fetchBots(); // Refresh list
    } catch (error) {
      alert("Failed to create bot. " + (error.response?.data?.message || ""));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2>Bot Management</h2>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ width: "auto", padding: "10px 20px" }}
        >
          + Create New Bot
        </button>
      </div>

      {loading ? (
        <p>Loading bots...</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
          }}
        >
          {bots.map((bot) => (
            <div
              key={bot.id}
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0" }}>{bot.name}</h3>
              <p style={{ color: "#666", fontSize: "0.9rem" }}>
                {bot.description}
              </p>
              <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
                <button
                  className="btn-secondary"
                  style={{ fontSize: "0.8rem", padding: "5px 10px" }}
                >
                  Edit
                </button>
                <button
                  className="btn-danger"
                  style={{
                    fontSize: "0.8rem",
                    padding: "5px 10px",
                    background: "#ff4d4f",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- MODAL FIX --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0 }}>Create New Bot</h3>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Bot Name</label>
              <input
                style={inputStyle}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Finance Assistant"
              />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={labelStyle}>Description</label>
              <input
                style={inputStyle}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Short description of capabilities"
              />
              {errors.description && (
                <span style={errorStyle}>{errors.description}</span>
              )}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>System Prompt</label>
              <textarea
                style={{ ...inputStyle, height: "100px", resize: "vertical" }}
                value={formData.prompt}
                onChange={(e) =>
                  setFormData({ ...formData, prompt: e.target.value })
                }
                placeholder="You are a helpful AI assistant..."
              />
              {errors.prompt && <span style={errorStyle}>{errors.prompt}</span>}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="btn-primary"
                style={{ width: "auto" }}
              >
                {creating ? "Creating..." : "Create Bot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for the Modal Fix
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
  backdropFilter: "blur(2px)",
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "500px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
  animation: "fadeIn 0.2s ease-out",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "5px",
  boxSizing: "border-box",
};

const labelStyle = { fontSize: "0.9rem", fontWeight: "600", color: "#333" };
const errorStyle = {
  color: "red",
  fontSize: "0.8rem",
  marginTop: "4px",
  display: "block",
};

const cancelBtnStyle = {
  background: "none",
  border: "1px solid #ddd",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default BotManagement;
