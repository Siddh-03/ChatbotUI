import React, { useState, useEffect, useRef } from "react";
import "../styles/Chat.css";
import {
  FiSidebar,
  FiPlus,
  FiSearch,
  FiUser,
  FiPaperclip,
  FiMic,
  FiSend,
  FiCopy,
  FiEdit2,
  FiMoreVertical,
  FiX,
  FiTrash2,
  FiSettings,
  FiLogOut,
  FiChevronDown,
  FiCheck,
} from "react-icons/fi";

const ChatPage = () => {
  // --- STATE ---
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [files, setFiles] = useState([]);
  const [isRecording, setIsRecording] = useState(false);

  // Chat History
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Menus & Popovers
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeHistoryMenu, setActiveHistoryMenu] = useState(null);

  // Model selection
  const [currentModel, setCurrentModel] = useState("Edu YBAI 4.0");

  // Message edit (NEW)
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    // Load History from LocalStorage
    const savedHistory = JSON.parse(
      localStorage.getItem("ybai_chat_history") || "[]"
    );
    setChatHistory(savedHistory);

    // Setup Speech Recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue((prev) => `${prev} ${transcript}`.trim());
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  // Save History when it changes
  useEffect(() => {
    localStorage.setItem("ybai_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [inputValue]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // --- CHAT LOGIC ---
  const startNewChat = () => {
    if (messages.length > 0) saveCurrentChat();

    setMessages([]);
    setInputValue("");
    setFiles([]);
    setEditingMessageId(null);
    setEditingText("");
    setCurrentChatId(Date.now());

    if (window.innerWidth <= 768) setIsMobileSidebarOpen(false);
  };

  const saveCurrentChat = () => {
    if (messages.length === 0) return;

    const title = messages[0]?.text?.substring(0, 30) || "New Chat";
    const newHistoryItem = {
      id: currentChatId || Date.now(),
      title,
      date: new Date().toISOString(),
      messages,
    };

    setChatHistory((prev) => {
      const filtered = prev.filter((c) => c.id !== newHistoryItem.id);
      return [newHistoryItem, ...filtered];
    });
  };

  const loadChat = (chatId) => {
    if (messages.length > 0) saveCurrentChat();

    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setCurrentChatId(chat.id);
      setEditingMessageId(null);
      setEditingText("");
    }
    if (window.innerWidth <= 768) setIsMobileSidebarOpen(false);
  };

  // --- HISTORY ACTIONS (Rename/Delete) ---
  const handleRenameChat = (id, newTitle) => {
    setChatHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
    setActiveHistoryMenu(null);
  };

  const handleDeleteChat = (id) => {
    if (window.confirm("Are you sure you want to delete this chat?")) {
      setChatHistory((prev) => prev.filter((c) => c.id !== id));

      if (currentChatId === id) {
        setMessages([]);
        setCurrentChatId(null);
        setEditingMessageId(null);
        setEditingText("");
      }
      setActiveHistoryMenu(null);
    }
  };

  // --- MESSAGE SEND / EDIT ---
  const handleSend = () => {
    if ((!inputValue.trim() && files.length === 0) || isTyping) return;

    // if currently editing, save edit instead of sending new (NEW behavior)
    if (editingMessageId) {
      handleSaveEditedMessage();
      return;
    }

    const userMsg = {
      id: Date.now(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
      attachments: files.map((f) => f.name),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setFiles([]);
    setIsTyping(true);

    setTimeout(() => {
      let responseText =
        "I'm the Edu AI simulator. I can help with that! (Model: " +
        currentModel +
        ")";
      if (userMsg.text.toLowerCase().includes("code")) {
        responseText = "Here is a Python example:\n``````";
      }

      const aiMsg = {
        id: Date.now() + 1,
        text: responseText,
        sender: "ai",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleStartEditMessage = (msg) => {
    if (msg.sender !== "user") return;
    setEditingMessageId(msg.id);
    setEditingText(msg.text || "");
    setInputValue(msg.text || "");
    textareaRef.current?.focus();
  };

  const handleCancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingText("");
    setInputValue("");
  };

  const handleSaveEditedMessage = () => {
    const newText = (inputValue || "").trim();
    if (!editingMessageId) return;
    if (!newText) return;

    // Update message immutably by mapping (correct pattern) [web:21][web:22]
    setMessages((prev) =>
      prev.map((m) =>
        m.id === editingMessageId ? { ...m, text: newText, edited: true } : m
      )
    );

    setEditingMessageId(null);
    setEditingText("");
    setInputValue("");
    setFiles([]);
  };

  // --- OTHER HANDLERS ---
  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isRecording) recognitionRef.current.stop();
    else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  const getGroupedHistory = () => {
    const groups = { Today: [], Yesterday: [], Older: [] };
    const now = new Date();

    chatHistory
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

  const renderMessageContent = (text) => {
    const parts = (text || "").split(/(``````)/g);
    return parts.map((part, index) => {
      if (part.startsWith("``````")) {
        const code = part.slice(3, -3).trim();
        return (
          <pre key={index}>
            <code>{code}</code>
            <button
              className="action-btn"
              style={{ position: "absolute", right: 10, top: 10 }}
              onClick={() => handleCopy(code)}
            >
              <FiCopy />
            </button>
          </pre>
        );
      }
      return (
        <span key={index} style={{ whiteSpace: "pre-wrap" }}>
          {part}
        </span>
      );
    });
  };

  return (
    <div className="chat-layout">
      <div className="chat-container">
        {/* --- SIDEBAR --- */}
        <aside
          className={`sidebar ${isSidebarCollapsed ? "collapsed" : ""} ${
            isMobileSidebarOpen ? "mobile-open" : ""
          }`}
        >
          <div className="sidebar-header">
            <div className="logo">
              <img
                src="/assist/images/ybai_shadow.png"
                alt="Logo"
                className="logo-image"
              />
              {!isSidebarCollapsed && <span>Edu AI</span>}
            </div>
            <button
              className="sidebar-toggle-btn"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            >
              <FiSidebar size={20} />
            </button>
          </div>

          <div className="new-chat-container">
            <button className="new-chat-btn" onClick={startNewChat}>
              <FiPlus size={20} />
              {!isSidebarCollapsed && <span>New Chat</span>}
            </button>
          </div>

          {!isSidebarCollapsed && (
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
                    {!isSidebarCollapsed && <h4>{group}</h4>}

                    {items.map((chat) => (
                      <div key={chat.id} className="history-item-wrapper">
                        <div
                          className={`history-item ${
                            currentChatId === chat.id ? "active" : ""
                          }`}
                          onClick={() => loadChat(chat.id)}
                        >
                          {!isSidebarCollapsed && (
                            <span style={{ flex: 1 }}>{chat.title}</span>
                          )}

                          {!isSidebarCollapsed && (
                            <FiMoreVertical
                              style={{ cursor: "pointer" }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHistoryMenu(
                                  activeHistoryMenu === chat.id ? null : chat.id
                                );
                              }}
                            />
                          )}
                        </div>

                        {activeHistoryMenu === chat.id && (
                          <div
                            className="popover-menu"
                            style={{ top: "30px", right: "10px" }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div
                              className="popover-item"
                              onClick={() => {
                                const newName = prompt(
                                  "Rename chat:",
                                  chat.title
                                );
                                if (newName) handleRenameChat(chat.id, newName);
                              }}
                            >
                              <FiEdit2 /> Rename
                            </div>
                            <div
                              className="popover-item danger"
                              onClick={() => handleDeleteChat(chat.id)}
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
              {!isSidebarCollapsed && (
                <div className="user-info">
                  <span className="user-name">Siddharth Ambaliya</span>
                  <span className="user-sub">Max Plan</span>
                </div>
              )}

              {showProfileMenu && (
                <div
                  className="popover-menu"
                  style={{
                    bottom: "100%",
                    left: "10px",
                    marginBottom: "10px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="popover-item">
                    <FiSettings /> Settings
                  </div>
                  <div className="popover-item danger">
                    <FiLogOut /> Log out
                  </div>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* --- MAIN AREA --- */}
        <main
          className="chat-area"
          onClick={() => {
            setShowModelMenu(false);
            setActiveHistoryMenu(null);
            setShowProfileMenu(false);
          }}
        >
          <header className="chat-header">
            <button
              className="action-btn"
              style={{
                marginRight: 10,
                display: window.innerWidth <= 768 ? "block" : "none",
              }}
              onClick={(e) => {
                e.stopPropagation();
                setIsMobileSidebarOpen(true);
              }}
            >
              <FiSidebar />
            </button>

            <div style={{ position: "relative" }}>
              <div
                className="model-selector"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowModelMenu(!showModelMenu);
                }}
              >
                <span>{currentModel}</span>
                <FiChevronDown style={{ opacity: 0.5 }} />
              </div>

              {showModelMenu && (
                <div className="popover-menu" style={{ top: "40px", left: 0 }}>
                  <div
                    className="popover-item"
                    onClick={() => setCurrentModel("Edu YBAI 4.0")}
                  >
                    Edu YBAI 4.0
                  </div>
                  <div
                    className="popover-item"
                    onClick={() => setCurrentModel("Edu YBAI 3.5")}
                  >
                    Edu YBAI 3.5
                  </div>
                </div>
              )}
            </div>

            <div />
          </header>

          <div className="messages-list">
            {messages.length === 0 ? (
              <div className="initial-view">
                <img
                  src="/assist/images/ybai_shadow.png"
                  width="60"
                  alt="Logo"
                  style={{ marginBottom: 20 }}
                />
                <h2>How can I help you today?</h2>
                <div className="prompt-grid">
                  <div
                    className="prompt-card"
                    onClick={() => setInputValue("Summarize this article")}
                  >
                    <h4>📝 Summarize</h4>
                    <p>Summarize long text</p>
                  </div>
                  <div
                    className="prompt-card"
                    onClick={() =>
                      setInputValue("Generate code for a React button")
                    }
                  >
                    <h4>💻 Code</h4>
                    <p>Generate React code</p>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender}`}>
                  <div className="msg-avatar">
                    {msg.sender === "user" ? (
                      <FiUser />
                    ) : (
                      <img
                        src="/assist/images/ybai_shadow.png"
                        width="24"
                        alt="AI"
                      />
                    )}
                  </div>

                  <div className="msg-content">
                    {renderMessageContent(msg.text)}
                    {msg.edited && (
                      <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>
                        (edited)
                      </div>
                    )}

                    {msg.attachments && msg.attachments.length > 0 && (
                      <div className="msg-attachments">
                        {msg.attachments.map((f, i) => (
                          <div key={i} className="attachment-item">
                            <FiPaperclip /> {f}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div
                    className="message-actions"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      opacity: 0.65,
                    }}
                  >
                    <FiCopy
                      style={{ cursor: "pointer" }}
                      onClick={() => handleCopy(msg.text)}
                      title="Copy"
                    />

                    {msg.sender === "user" && (
                      <FiEdit2
                        style={{ cursor: "pointer" }}
                        onClick={() => handleStartEditMessage(msg)}
                        title="Edit message"
                      />
                    )}
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="message ai">
                <div className="msg-avatar">...</div>
                <div className="msg-content">...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-area-wrapper">
            <div className="input-container">
              {editingMessageId && (
                <div
                  style={{
                    padding: "8px 10px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                  }}
                >
                  <span>Editing message…</span>
                  <button
                    className="action-btn"
                    onClick={handleCancelEditMessage}
                    title="Cancel edit"
                  >
                    <FiX />
                  </button>
                </div>
              )}

              {files.length > 0 && !editingMessageId && (
                <div className="file-previews">
                  {files.map((f, i) => (
                    <div key={i} className="preview-chip">
                      {f.name}
                      <FiX
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setFiles((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      />
                    </div>
                  ))}
                </div>
              )}

              <textarea
                id="chat-input"
                ref={textareaRef}
                rows={1}
                placeholder="Message Edu AI..."
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (editingMessageId) setEditingText(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />

              <div className="input-actions">
                <div className="left-actions">
                  <button
                    className="action-btn"
                    onClick={() => fileInputRef.current?.click()}
                    title="Attach file"
                    disabled={!!editingMessageId}
                  >
                    <FiPaperclip size={20} />
                    <input
                      type="file"
                      multiple
                      style={{ display: "none" }}
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      disabled={!!editingMessageId}
                    />
                  </button>

                  <button
                    className={`action-btn ${isRecording ? "recording" : ""}`}
                    onClick={handleVoiceToggle}
                    title="Voice Input"
                    disabled={!!editingMessageId}
                  >
                    <FiMic size={20} />
                  </button>
                </div>

                <div className="right-actions">
                  <button
                    className="action-btn send-btn"
                    onClick={handleSend}
                    disabled={!inputValue.trim() && files.length === 0}
                    title={editingMessageId ? "Save edit" : "Send"}
                  >
                    {editingMessageId ? (
                      <FiCheck size={18} />
                    ) : (
                      <FiSend size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p
              style={{
                textAlign: "center",
                fontSize: "0.75rem",
                color: "var(--text-secondary)",
                marginTop: "10px",
              }}
            >
              Edu AI can make mistakes. Check important info.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
