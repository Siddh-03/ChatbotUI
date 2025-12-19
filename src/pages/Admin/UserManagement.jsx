import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";
import { FaTrash, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const UserManagement = () => {
  const [users, setUsers] = useState([]); // No more mock data!
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getAllUsers();
      // Backend returns: { status: "success", count: ..., data: [...] }
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to load users from the server.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.is_active;

    // Optimistic UI Update
    setUsers((prev) =>
      prev.map((u) =>
        u.user_id === user.user_id ? { ...u, is_active: newStatus } : u
      )
    );

    try {
      await adminService.updateUser({
        user_id: user.user_id,
        is_active: newStatus,
      });
    } catch (e) {
      console.error("Update failed:", e);
      alert("Failed to update status");
      // Rollback on failure
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id ? { ...u, is_active: !newStatus } : u
        )
      );
    }
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete user ${user.name}? This cannot be undone.`
      )
    )
      return;

    try {
      await adminService.deleteUser(user.user_id);
      // Remove from list on success
      setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));
    } catch (e) {
      console.error("Delete failed:", e);
      // Check for Superadmin permission error
      if (e.response && e.response.status === 403) {
        alert("Permission Denied: Only Superadmins can delete users.");
      } else {
        alert("Failed to delete user.");
      }
    }
  };

  return (
    <div className="dash-page-content dash-active">
      <div className="dash-page-header">
        <h2>User Management</h2>
        <p>Manage registered users and their account status.</p>
      </div>

      <div className="dash-card">
        {loading ? (
          <p>Loading users from database...</p>
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
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Email</th>
                  <th style={{ padding: "12px" }}>Phone</th>
                  <th style={{ padding: "12px" }}>Verified</th>
                  <th style={{ padding: "12px" }}>Status</th>
                  <th style={{ padding: "12px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.user_id}
                    style={{
                      borderBottom: "1px solid var(--dash-border-color)",
                    }}
                  >
                    <td style={{ padding: "12px" }}>#{user.user_id}</td>
                    <td style={{ padding: "12px" }}>{user.name}</td>
                    <td style={{ padding: "12px" }}>{user.email}</td>
                    <td style={{ padding: "12px" }}>
                      {user.phone_number || "N/A"}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {user.is_verified ? (
                        <span
                          style={{
                            color: "var(--dash-success-color, #10b981)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <FaCheckCircle /> Yes
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
                          <FaTimesCircle /> No
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        className={`dash-button-sm ${
                          user.is_active
                            ? "dash-button-secondary"
                            : "dash-button-danger"
                        }`}
                        onClick={() => handleToggleStatus(user)}
                        title="Click to toggle status"
                      >
                        {user.is_active ? "Active" : "Banned"}
                      </button>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <button
                        className="dash-button-sm dash-button-danger"
                        onClick={() => handleDelete(user)}
                        title="Delete User"
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

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        padding: "20px",
                        textAlign: "center",
                        color: "var(--dash-text-muted)",
                      }}
                    >
                      No users found in the database.
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

export default UserManagement;
