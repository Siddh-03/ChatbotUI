import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    plan_name: "",
    price: "",
    credits: "",
    duration: 30,
    storage: 100,
    discount: 0,
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    const res = await adminService.getAllPlans();
    if (res.data.status === "success") setPlans(res.data.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await adminService.createPlan(form);
    setShowModal(false);
    loadPlans();
  };

  return (
    <div className="dash-page-content dash-active">
      <div
        className="dash-page-header"
        style={{ display: "flex", justifyContent: "space-between" }}
      >
        <div>
          <h2>Subscription Plans</h2>
          <p>Manage pricing tiers</p>
        </div>
        <button className="dash-button" onClick={() => setShowModal(true)}>
          + New Plan
        </button>
      </div>

      <div className="dash-grid dash-grid-3">
        {plans.map((plan) => (
          <div
            key={plan.plan_id}
            className="dash-card"
            style={{ textAlign: "center" }}
          >
            <h3 style={{ color: "var(--dash-primary-color)" }}>
              {plan.plan_name}
            </h3>
            <h1 style={{ fontSize: "2.5rem", margin: "10px 0" }}>
              ${plan.price}
            </h1>
            <p style={{ color: "var(--dash-text-muted)" }}>
              {plan.credits} Credits / {plan.duration} Days
            </p>
            <hr className="dash-hr" />
            <button
              className="dash-button-sm dash-button-danger"
              onClick={async () => {
                if (confirm("Delete this plan?")) {
                  await adminService.deletePlan(plan.plan_id);
                  loadPlans();
                }
              }}
            >
              Delete Plan
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div
          className="dash-modal-overlay dash-open"
          style={{ display: "flex" }}
        >
          <div className="dash-modal-content">
            <h3>New Subscription Plan</h3>
            <form onSubmit={handleCreate}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "15px",
                }}
              >
                <div className="dash-form-group">
                  <label>Plan Name</label>
                  <input
                    className="dash-form-control"
                    value={form.plan_name}
                    onChange={(e) =>
                      setForm({ ...form, plan_name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="dash-form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    className="dash-form-control"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="dash-form-group">
                  <label>Credits</label>
                  <input
                    type="number"
                    className="dash-form-control"
                    value={form.credits}
                    onChange={(e) =>
                      setForm({ ...form, credits: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="dash-form-group">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    className="dash-form-control"
                    value={form.duration}
                    onChange={(e) =>
                      setForm({ ...form, duration: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                type="submit"
                className="dash-button"
                style={{ width: "100%", marginTop: "15px" }}
              >
                Create Plan
              </button>
              <button
                type="button"
                className="dash-button-secondary"
                style={{ width: "100%", marginTop: "10px" }}
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
