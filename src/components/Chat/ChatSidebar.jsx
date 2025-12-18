import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Import Hook
import {
  FiSidebar,
  FiPlus,
  FiSearch,
  FiUser,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

const ChatSidebar = ({
  isCollapsed,
  isMobileOpen,
  onToggle,
  onStartNewChat,
  history,
  currentChatId,
  onLoadChat,
  onRenameChat,
  onDeleteChat,
  user,
}) => {
  const navigate = useNavigate(); // 2. Initialize Hook
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Group history logic
  const getGroupedHistory = () => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    const now = new Date();

    history
      .filter((c) => c.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .forEach((chat) => {
        const date = new Date(chat.date);
        const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) groups.Today.push(chat);
        else if (diffDays === 1) groups.Yesterday.push(chat);
        else groups.Older.push(chat);
      });
    return groups;
  };

  // 3. Handle Logout Logic
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      localStorage.removeItem("authToken"); // Clear Token
      localStorage.removeItem("user"); // Clear User Data
      navigate("/login"); // Redirect
    }
  };

  return (
    <aside
      className={`sidebar ${isCollapsed ? "collapsed" : ""} ${
        isMobileOpen ? "mobile-open" : ""
      }`}
    >
      <div className="sidebar-header">
        <div className="logo">
          <img
            src="/assist/images/ybai_shadow.png"
            alt="Logo"
            className="logo-image"
          />
          {!isCollapsed && <span>Edu AI</span>}
        </div>
        <button className="sidebar-toggle-btn" onClick={onToggle}>
          <FiSidebar size={20} />
        </button>
      </div>

      <div className="new-chat-container">
        <button className="new-chat-btn" onClick={onStartNewChat}>
          <FiPlus size={20} />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {!isCollapsed && (
        <div style={{ padding: "0 15px" }}>
          <div
            style={{
              background: "var(--bg-tertiary)",
              padding: "8px",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <FiSearch color="var(--text-secondary)" />
            <input
              style={{
                background: "transparent",
                border: "none",
                outline: "none",
                width: "100%",
                color: "var(--text-primary)",
              }}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="chat-history">
        {Object.entries(getGroupedHistory()).map(
          ([group, items]) =>
            items.length > 0 && (
              <div key={group} className="history-group">
                {!isCollapsed && <h4>{group}</h4>}
                {items.map((chat) => (
                  <div key={chat.id} className="history-item-wrapper">
                    <div
                      className={`history-item ${
                        currentChatId === chat.id ? "active" : ""
                      }`}
                      onClick={() => onLoadChat(chat.id)}
                    >
                      {!isCollapsed && (
                        <span style={{ flex: 1 }}>{chat.title}</span>
                      )}
                      {!isCollapsed && (
                        <FiMoreVertical
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(
                              activeMenuId === chat.id ? null : chat.id
                            );
                          }}
                        />
                      )}
                    </div>
                    {activeMenuId === chat.id && (
                      <div
                        className="popover-menu"
                        style={{ top: "30px", right: "10px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="popover-item"
                          onClick={() => {
                            const newName = prompt("Rename chat:", chat.title);
                            if (newName) {
                              onRenameChat(chat.id, newName);
                              setActiveMenuId(null);
                            }
                          }}
                        >
                          <FiEdit2 /> Rename
                        </div>
                        <div
                          className="popover-item danger"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to delete this chat?"
                              )
                            ) {
                              onDeleteChat(chat.id);
                              setActiveMenuId(null);
                            }
                          }}
                        >
                          <FiTrash2 /> Delete
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
        )}
      </div>

      <div className="sidebar-footer">
        <div
          className="user-profile"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <div className="user-avatar">
            <FiUser />
          </div>
          {!isCollapsed && (
            <div className="user-info">
              <span className="user-name">{user?.name || "User"}</span>
              <span className="user-sub">Max Plan</span>
            </div>
          )}
          {showProfileMenu && (
            <div
              className="popover-menu"
              style={{ bottom: "100%", left: "10px", marginBottom: "10px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="popover-item"
                onClick={() => navigate("/settings")} // 4. Navigate Settings
              >
                <FiSettings /> Settings
              </div>
              <div
                className="popover-item danger"
                onClick={handleLogout} // 5. Call Logout
              >
                <FiLogOut /> Log out
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ChatSidebar;
