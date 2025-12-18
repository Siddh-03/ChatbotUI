import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

const MOCK_USERS = [
  {
    user_id: 1,
    name: "Siddhartha",
    email: "sid@example.com",
    phone_number: "9876543210",
    is_active: true,
  },
  {
    user_id: 2,
    name: "Boss Man",
    email: "boss@agentverse.com",
    phone_number: "1231231234",
    is_active: true,
  },
  {
    user_id: 3,
    name: "Spammer",
    email: "spam@fake.com",
    phone_number: "0000000000",
    is_active: false,
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(MOCK_USERS); // mock data by default
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // show mock data instantly, then try real API
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500); // simulate like your second file

    return () => clearTimeout(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminService.getAllUsers();
      if (res.data.status === "success" && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching users, keeping mock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const newStatus = !user.is_active;

    // Optimistic UI
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
      alert("Failed to update status");
      // rollback on failure
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === user.user_id ? { ...u, is_active: !newStatus } : u
        )
      );
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm("Delete this user permanently?")) return;

    // Optimistic delete
    const prevUsers = users;
    setUsers((prev) => prev.filter((u) => u.user_id !== user.user_id));

    try {
      await adminService.deleteUser(user.user_id);
    } catch (e) {
      alert("Failed to delete user");
      setUsers(prevUsers);
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
          <p>Loading users...</p>
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
                    background: "#f9f9f9",
                  }}
                >
                  <th style={{ padding: "12px" }}>ID</th>
                  <th style={{ padding: "12px" }}>Name</th>
                  <th style={{ padding: "12px" }}>Email</th>
                  <th style={{ padding: "12px" }}>Phone</th>
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
                    <td style={{ padding: "12px" }}>{user.phone_number}</td>
                    <td style={{ padding: "12px" }}>
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
                    <td style={{ padding: "12px" }}>
                      <button
                        className="dash-button-sm dash-button-danger"
                        onClick={() => handleDelete(user)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      style={{ padding: "12px", textAlign: "center" }}
                    >
                      No users found.
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
