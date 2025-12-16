// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PageLoader from "./components/Layout/PageLoader";
import NotFound from "./pages/NotFound";

// Lazy load heavy pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Settings = lazy(() => import("./pages/Settings"));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<PageLoader showLoader={true} />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Protected */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:botId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />{" "}
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
