// src/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy } from "react";

// Components needed for structure
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import AdminLayout from "./components/Layout/AdminLayout";

// --- Lazy Load All Pages ---
// Public Pages
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin Pages
const AdminLogin = lazy(() => import("./pages/Admin/AdminLogin"));
const UserManagement = lazy(() => import("./pages/Admin/UserManagement"));
const BotManagement = lazy(() => import("./pages/Admin/BotManagement"));
const PlanManagement = lazy(() => import("./pages/Admin/PlanManagement"));
const FeedbackManagement = lazy(() =>
  import("./pages/Admin/FeedbackManagement")
);

// User Dashboard Pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const Subscription = lazy(() => import("./pages/Subscription"));
const Settings = lazy(() => import("./pages/Settings"));

const AppRoutes = () => {
  return (
    <Routes>
      {/* --- ADMIN ROUTES --- */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UserManagement />} />
        <Route path="bots" element={<BotManagement />} />
        <Route path="plans" element={<PlanManagement />} />
        <Route path="feedbacks" element={<FeedbackManagement />} />
        <Route index element={<UserManagement />} />
      </Route>

      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
