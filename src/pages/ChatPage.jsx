import React, { useState, useEffect } from "react";
import "../styles/Chat.css";
import { FiSidebar, FiChevronDown } from "react-icons/fi";
import { useDashboard } from "../hooks/useDashboard";

// Import new sub-components
import ChatSidebar from "../components/Chat/ChatSidebar";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import { chatService } from '../services/chatService';

const ChatPage = () => {
  // --- STATE ---
  const { user } = useDashboard(); // Get user from global hook
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Chat Data
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  // UI State
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [currentModel, setCurrentModel] = useState("Edu YBAI 4.0");
  const [editingMessageId, setEditingMessageId] = useState(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("ybai_chat_history") || "[]"
    );
    setChatHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("ybai_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  // --- HANDLERS ---
  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
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

  const startNewChat = () => {
    if (messages.length > 0) saveCurrentChat();
    setMessages([]);
    setInputValue("");
    setFiles([]);
    setEditingMessageId(null);
    setCurrentChatId(Date.now());
    if (window.innerWidth <= 768) setIsMobileSidebarOpen(false);
  };

  const loadChat = (chatId) => {
    if (messages.length > 0) saveCurrentChat();
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setCurrentChatId(chat.id);
      setEditingMessageId(null);
    }
    if (window.innerWidth <= 768) setIsMobileSidebarOpen(false);
  };

  const handleRenameChat = (id, newTitle) => {
    setChatHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleDeleteChat = (id) => {
    setChatHistory((prev) => prev.filter((c) => c.id !== id));
    if (currentChatId === id) {
      startNewChat();
    }
  };

  const handleSend = async () => {
  if ((!inputValue.trim() && files.length === 0) || isTyping) return;

  // 1. Add User Message immediately (Optimistic UI)
  const userMsg = {
    id: Date.now(),
    text: inputValue,
    sender: "user",
    timestamp: new Date(),
    attachments: files.map(f => f.name)
  };
  setMessages(prev => [...prev, userMsg]);
  setInputValue("");
  setFiles([]);
  setIsTyping(true);

  try {
    // 2. REAL API CALL
    const data = await chatService.sendMessage(userMsg.text, currentModel, files);
    
    // 3. Add AI Response from Backend
    const aiMsg = {
      id: Date.now() + 1,
      text: data.text, // Assuming backend returns { text: "..." }
      sender: "ai",
      timestamp: new Date()
    };
    setMessages(prev => [...prev, aiMsg]);
  } catch (error) {
    console.error("Chat error:", error);
    // Add error message to chat
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      text: "Error connecting to AI.", 
      sender: "ai", 
      isError: true 
    }]);
  } finally {
    setIsTyping(false);
  }
};

  const handleSaveEditedMessage = () => {
    const newText = (inputValue || "").trim();
    if (!editingMessageId || !newText) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === editingMessageId ? { ...m, text: newText, edited: true } : m
      )
    );
    setEditingMessageId(null);
    setInputValue("");
    setFiles([]);
  };

  return (
    <div className="chat-layout">
      <div
        className={`chat-container ${
          isMobileSidebarOpen ? "mobile-nav-open" : ""
        }`}
      >
        <ChatSidebar
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onToggle={handleSidebarToggle}
          onStartNewChat={startNewChat}
          history={chatHistory}
          currentChatId={currentChatId}
          onLoadChat={loadChat}
          onRenameChat={handleRenameChat}
          onDeleteChat={handleDeleteChat}
          user={user}
        />

        <main
          className="chat-area"
          onClick={() => {
            setShowModelMenu(false);
            if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
          }}
        >
          {/* Header remains here as it controls specific page state */}
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
                  {["Edu YBAI 4.0", "Edu YBAI 3.5"].map((model) => (
                    <div
                      key={model}
                      className="popover-item"
                      onClick={() => setCurrentModel(model)}
                    >
                      {model}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div />
          </header>

          <MessageList
            messages={messages}
            isTyping={isTyping}
            onCopy={(text) => {
              navigator.clipboard.writeText(text);
              alert("Copied!");
            }}
            onEdit={handleSaveEditedMessage}
            onPromptClick={setInputValue}
          />

          <ChatInput
            input={inputValue}
            setInput={setInputValue}
            onSend={handleSend}
            files={files}
            setFiles={setFiles}
            onFileSelect={(e) => setFiles(Array.from(e.target.files))}
            editingId={editingMessageId}
            onCancelEdit={() => {
              setEditingMessageId(null);
              setInputValue("");
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
