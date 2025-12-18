// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PageLoader from "./components/Layout/PageLoader";
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/Layout/AdminLayout";
import AdminLogin from "./pages/Admin/AdminLogin";
import UserManagement from "./pages/Admin/UserManagement";
import BotManagement from "./pages/Admin/BotManagement";
import PlanManagement from "./pages/Admin/PlanManagement";
import FeedbackManagement from "./pages/Admin/FeedbackManagement";

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
          {/* --- ADMIN ROUTES --- */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<UserManagement />} />
            <Route path="bots" element={<BotManagement />} />
            <Route path="plans" element={<PlanManagement />} />
            <Route path="feedbacks" element={<FeedbackManagement />} />
            {/* Default redirect to users */}
            <Route index element={<UserManagement />} />
          </Route>
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
