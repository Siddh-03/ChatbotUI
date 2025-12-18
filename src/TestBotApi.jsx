import React, { useState } from "react";
import axios from "axios";

const TestBotApi = () => {
  const [responseLog, setResponseLog] = useState("Waiting for test...");
  const [loading, setLoading] = useState(false);

  // 1. Config for FIT FUSION
  const testFitFusion = async () => {
    setLoading(true);
    try {
      // PROXY URL: /bot-api replaces the full domain
      const res = await axios.post(
        "/bot-api/ybai_fitfusionai",
        { query: "Suggest a workout plan for fat loss", top_k: 3 },
        {
          headers: {
            Authorization: "Bearer mysecrettoken123",
            "Content-Type": "application/json",
          },
        }
      );
      setResponseLog(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponseLog("Error: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  // 2. Config for MARKETING BOT
  const testMarketing = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/bot-api/ybai_marketingbot",
        { query: "How to promote fitness products?", top_k: 2 },
        {
          headers: {
            Authorization: "Bearer mysecrettoken123",
            "Content-Type": "application/json",
          },
        }
      );
      setResponseLog(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponseLog("Error: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  // 3. Config for MENTAL HEALTH BOT
  const testMentalHealth = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        "/bot-api/ybai_mental_health_chatbot",
        {
          query: "I feel anxious and overwhelmed.",
          health_data: {
            sleep: "5 hours",
            stress: "high",
            exercise: "none",
            mood: "low",
          },
          language: "en",
        },
        {
          headers: {
            "x-api-key":
              "7e5770f877366c727d05791020f01d5c48bb86395c65bfad5cd0645939863617",
            "Content-Type": "application/json",
          },
        }
      );
      setResponseLog(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResponseLog("Error: " + err.message);
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <h2>🤖 API Integration Test (via Proxy)</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <button onClick={testFitFusion} disabled={loading}>
          Test FitFusion
        </button>
        <button onClick={testMarketing} disabled={loading}>
          Test Marketing
        </button>
        <button onClick={testMentalHealth} disabled={loading}>
          Test Mental Health
        </button>
      </div>
      <pre
        style={{
          background: "#f4f4f4",
          padding: 15,
          borderRadius: 8,
          overflow: "auto",
          maxHeight: "500px",
        }}
      >
        {loading ? "Loading..." : responseLog}
      </pre>
    </div>
  );
};

export default TestBotApi;
