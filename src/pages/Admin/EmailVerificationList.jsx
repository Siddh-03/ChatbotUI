import React, { useState, useEffect } from "react";
import { adminService } from "../../services/adminService";

const EmailVerificationList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminService.getEmailVerifications();
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setLogs(res.data.data);
      }
    } catch (error) {
      console.error("Error fetching email logs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dash-page-content dash-active">
      <div className="dash-page-header">
        <h2>Email Verifications</h2>
        <p>View the log of email verification codes sent to users.</p>
      </div>

      <div className="dash-card">
        {loading ? (
          <p>Loading records...</p>
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
                  <th style={{ padding: "12px" }}>User ID</th>
                  <th style={{ padding: "12px" }}>Code</th>
                  <th style={{ padding: "12px" }}>Sent At</th>
                  <th style={{ padding: "12px" }}>Expires At</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr
                    key={log.id}
                    style={{
                      borderBottom: "1px solid var(--dash-border-color)",
                    }}
                  >
                    <td style={{ padding: "12px" }}>#{log.id}</td>
                    <td style={{ padding: "12px" }}>User #{log.user_id}</td>
                    <td style={{ padding: "12px", fontFamily: "monospace" }}>
                      {log.verification_code}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td style={{ padding: "12px" }}>
                      {new Date(log.expires_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{ padding: "20px", textAlign: "center" }}
                    >
                      No verification records found.
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

export default EmailVerificationList;
