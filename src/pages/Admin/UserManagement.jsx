import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      if (res.data.status === "success") {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    // Optimistic UI Update
    const newStatus = !user.is_active;
    try {
      await adminService.updateUser({
        user_id: user.user_id,
        is_active: newStatus,
      });
      setUsers(
        users.map((u) =>
          u.user_id === user.user_id ? { ...u, is_active: newStatus } : u
        )
      );
    } catch (e) {
      alert("Failed to update status");
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
          <p>Loading...</p>
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
                  }}
                >
                  <th style={{ padding: "15px" }}>ID</th>
                  <th style={{ padding: "15px" }}>Name</th>
                  <th style={{ padding: "15px" }}>Email</th>
                  <th style={{ padding: "15px" }}>Phone</th>
                  <th style={{ padding: "15px" }}>Status</th>
                  <th style={{ padding: "15px" }}>Actions</th>
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
                    <td style={{ padding: "15px" }}>#{user.user_id}</td>
                    <td style={{ padding: "15px" }}>{user.name}</td>
                    <td style={{ padding: "15px" }}>{user.email}</td>
                    <td style={{ padding: "15px" }}>{user.phone_number}</td>
                    <td style={{ padding: "15px" }}>
                      <button
                        className={`dash-button-sm ${
                          user.is_active
                            ? "dash-button-secondary"
                            : "dash-button-danger"
                        }`}
                        onClick={() => handleToggleStatus(user)}
                      >
                        {user.is_active ? "Active" : "Banned"}
                      </button>
                    </td>
                    <td style={{ padding: "15px" }}>
                      <button
                        className="dash-button-sm dash-button-danger"
                        onClick={async () => {
                          if (confirm("Delete this user permanently?")) {
                            await adminService.deleteUser(user.user_id);
                            fetchUsers();
                          }
                        }}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
