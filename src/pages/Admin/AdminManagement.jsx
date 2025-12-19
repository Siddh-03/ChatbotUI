import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminService } from "../../services/adminService";
import { FaPlus, FaTrash, FaUserShield, FaUserTie } from "react-icons/fa";

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllAdmins();
      // The backend returns a list directly or inside an object depending on implementation
      // Based on admin_auth.py: return jsonify([...list]), 200
      if (Array.isArray(res.data)) {
        setAdmins(res.data);
      } else if (res.data && Array.isArray(res.data.data)) {
        setAdmins(res.data.data);
      } else {
        // Fallback or just the data itself if axios unwrapped it
        setAdmins(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching admins:", error);
      // If 403, likely not a superadmin
      if (error.response && error.response.status === 403) {
        alert(
          "Access Denied: You need Superadmin privileges to view this list."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (adminId) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await adminService.deleteAdmin(adminId);
      // Remove from UI on success
      setAdmins((prev) => prev.filter((a) => a.admin_id !== adminId));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete admin. You might not have permission.");
    }
  };

  return (
    <div className="dash-page-content dash-active">
      <div className="dash-page-header">
        <h2>Admin Management</h2>
        <p>View and manage other administrators.</p>
      </div>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          className="dash-button"
          onClick={() => navigate("/admin/create-admin")}
        >
          <FaPlus /> Register New Admin
        </button>
      </div>

      <div className="dash-card">
        {loading ? (
          <p>Loading admins...</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              className="dash-table"
              style={{ width: "100%", borderCollapse: "collapse" }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--dash-border-color)",
                    textAlign: "left",
                    background: "var(--dash-main-bg)",
                  }}
                >
                  <th style={{ padding: "12px" }}>ID</th>
                  <th style={{ padding: "12px" }}>Role</th>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Email</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr
                    key={admin.admin_id}
                    style={{
                      borderBottom: "1px solid var(--dash-border-color)",
                    }}
                  >
                    <td style={{ padding: "12px" }}>#{admin.admin_id}</td>
                    <td style={{ padding: "12px" }}>
                      {admin.is_superadmin ? (
                        <span
                          style={{
                            color: "var(--dash-primary-color)",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FaUserShield /> Superadmin
                        </span>
                      ) : (
                        <span
                          style={{
                            color: "var(--dash-text-muted)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FaUserTie /> Admin
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>{admin.name}</td>
                    <td style={{ padding: "12px" }}>{admin.email}</td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.8rem",
                          background: admin.is_active
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(239, 68, 68, 0.1)",
                          color: admin.is_active ? "#10b981" : "#ef4444",
                        }}
                      >
                        {admin.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      {/* Do not allow deleting yourself or other superadmins if logic requires check, currently simplistic */}
                      <button
                        className="dash-button-sm dash-button-danger"
                        onClick={() => handleDelete(admin.admin_id)}
                        title="Delete Admin"
                        style={{
                          background: "var(--dash-danger-color, #ef4444)",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}

                {admins.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "var(--dash-text-muted)",
                      }}
                    >
                      No other admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminManagement;
