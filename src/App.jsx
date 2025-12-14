// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ChatPage from './pages/ChatPage';
import Subscription from './pages/Subscription';
// import Conversations from './pages/Conversations';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Commenting out auth pages for now as requested */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Dynamic route for chat, e.g., /chat/education or /chat/sports */}
        <Route path="/chat/:botId" element={<ChatPage />} />
        
        {/* Subscription page isn't created yet, so user can add it here later */}
        <Route path="/subscriptions" element={<Subscription />} />
        
        {/* <Route path="/conversations" element={<Conversations />} /> */}
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </div>
  );
}

export default App;