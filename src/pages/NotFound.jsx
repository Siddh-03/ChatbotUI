import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../styles/Dashboard.css";
// Reuse your existing button styles if you have them

const NotFound = () => {

    useEffect(() => {
    document.title = "Not Found | AgentVerse";
  }, []);

  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.errorCode}>404</h1>
      <h2 style={styles.message}>Oops! Page not found.</h2>
      <p style={styles.description}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => navigate("/")}
        className="dash-button" // Using your existing class
        style={{ marginTop: "20px" }}
      >
        Go Back Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff", // White theme
    color: "#333",
    fontFamily: "Inter, sans-serif",
    textAlign: "center",
  },
  errorCode: {
    fontSize: "6rem",
    fontWeight: "bold",
    color: "#0D9488", // Your brand green color
    margin: 0,
  },
  message: {
    fontSize: "2rem",
    margin: "10px 0",
  },
  description: {
    color: "#666",
    marginBottom: "20px",
  },
};

export default NotFound;
