import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    features: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Mock data for now or fetch from API
    setPlans([
      { id: 1, name: "Free", price: "$0", features: ["Basic Chat", "1 Bot"] },
      {
        id: 2,
        name: "Pro",
        price: "$29",
        features: ["Unlimited Chat", "5 Bots"],
      },
    ]);
    setLoading(false);
  }, []);

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Plan Name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.features) newErrors.features = "Add at least one feature";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;

    // Convert comma string to array
    const newPlan = {
      ...formData,
      features: formData.features.split(",").map((f) => f.trim()),
    };

    // Call API here (mocking for now)
    setPlans([...plans, { id: Date.now(), ...newPlan }]);
    setShowModal(false);
    setFormData({ name: "", price: "", features: "" });
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
        <h2>Subscription Plans</h2>
        <button
          className="btn-primary"
          onClick={() => setShowModal(true)}
          style={{ width: "auto" }}
        >
          + Create Plan
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {plans.map((plan) => (
          <div
            key={plan.id}
            style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              border: "1px solid #eee",
              textAlign: "center",
            }}
          >
            <h3>{plan.name}</h3>
            <h2 style={{ color: "var(--primary-color)", margin: "10px 0" }}>
              {plan.price}
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                textAlign: "left",
                margin: "20px 0",
              }}
            >
              {Array.isArray(plan.features) &&
                plan.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: "8px" }}>
                    ✓ {f}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>Add Subscription Plan</h3>

            <div style={{ marginBottom: "15px" }}>
              <label>Plan Name</label>
              <input
                style={inputStyle}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g. Enterprise"
              />
              {errors.name && <span style={errorStyle}>{errors.name}</span>}
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label>Price</label>
              <input
                style={inputStyle}
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="e.g. $49"
              />
              {errors.price && <span style={errorStyle}>{errors.price}</span>}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label>Features (Comma separated)</label>
              <textarea
                style={{ ...inputStyle, height: "80px" }}
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="24/7 Support, Unlimited Bots, API Access"
              />
              {errors.features && (
                <span style={errorStyle}>{errors.features}</span>
              )}
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
                className="btn-primary"
                style={{ width: "auto" }}
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Reuse the same styles from BotManagement
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};
const modalContentStyle = {
  backgroundColor: "white",
  padding: "30px",
  borderRadius: "16px",
  width: "90%",
  maxWidth: "450px",
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  marginTop: "5px",
  boxSizing: "border-box",
};
const errorStyle = { color: "red", fontSize: "0.8rem" };
const cancelBtnStyle = {
  background: "none",
  border: "1px solid #ddd",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
};

export default PlanManagement;
