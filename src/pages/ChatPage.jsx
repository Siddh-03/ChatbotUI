import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/Chat.css";
import { FiSidebar, FiChevronDown } from "react-icons/fi";
import { useDashboard } from "../hooks/useDashboard";
import ChatSidebar from "../components/Chat/ChatSidebar";
import MessageList from "../components/Chat/MessageList";
import ChatInput from "../components/Chat/ChatInput";
import { chatService } from "../services/chatService";

const AVAILABLE_MODELS = [
  { id: "fitfusion", name: "FitFusion AI" },
  { id: "marketing", name: "Marketing Bot" },
  { id: "mental_health", name: "Mental Health Support" },
  { id: "general", name: "Standard Assistant" },
];

const ChatPage = () => {
  const { user } = useDashboard();
  const { botId } = useParams();
  const navigate = useNavigate();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // FIX: Add state to track mobile screen size dynamically
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Initialize Model state from URL param or default to first available
  const [currentModel, setCurrentModel] = useState(
    botId && AVAILABLE_MODELS.find((m) => m.id === botId)
      ? botId
      : AVAILABLE_MODELS[0].id
  );

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [files, setFiles] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState(null);

  // FIX: Add useEffect to handle real-time window resizing
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Auto-close mobile sidebar if switching to desktop view
      if (!mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- AUTO-RESET WHEN URL CHANGES ---
  useEffect(() => {
    if (botId && botId !== currentModel) {
      setCurrentModel(botId);
      startNewChat();
    }
  }, [botId]);

  // Persistence
  useEffect(() => {
    const savedHistory = JSON.parse(
      localStorage.getItem("ybai_chat_history") || "[]"
    );
    setChatHistory(savedHistory);
  }, []);

  useEffect(() => {
    localStorage.setItem("ybai_chat_history", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const handleSidebarToggle = () => {
    if (isMobile) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const startNewChat = () => {
    if (messages.length > 0) {
      // Logic to save previous chat could go here if needed
    }
    setMessages([]);
    setInputValue("");
    setFiles([]);
    setEditingMessageId(null);
    setCurrentChatId(Date.now());
    if (isMobile) setIsMobileSidebarOpen(false);
  };

  const loadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setMessages(chat.messages || []);
      setCurrentChatId(chat.id);
      setEditingMessageId(null);
    }
    if (isMobile) setIsMobileSidebarOpen(false);
  };

  const handleRenameChat = (id, newTitle) => {
    setChatHistory((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleDeleteChat = (id) => {
    setChatHistory((prev) => prev.filter((c) => c.id !== id));
    if (currentChatId === id) startNewChat();
  };

  const handleSend = async () => {
    if ((!inputValue.trim() && files.length === 0) || isTyping) return;

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

    try {
      const additionalData = { attachments: files };

      if (currentModel === "mental_health") {
        additionalData.health_data = {
          sleep: "7 hours",
          stress: "low",
          exercise: "yes",
          mood: "neutral",
        };
      }

      const data = await chatService.sendMessage(
        userMsg.text,
        currentModel,
        additionalData
      );

      let aiText = data.text;
      try {
        if (aiText && (aiText.startsWith("{") || aiText.startsWith("["))) {
          const parsed = JSON.parse(aiText);
          if (parsed.results && Array.isArray(parsed.results)) {
            aiText = parsed.results.join("\n\n");
          } else if (parsed.response) {
            aiText = parsed.response;
          } else if (parsed.result) {
            aiText = parsed.result;
          }
        }
      } catch (e) {
        // parsing failed, treat as text
      }

      const aiMsg = {
        id: Date.now() + 1,
        text: aiText,
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text:
            error.text ||
            "Error: Could not connect to the agent. Please try again.",
          sender: "ai",
          isError: true,
        },
      ]);
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

  const onModelDropdownClick = (modelId) => {
    navigate(`/chat/${modelId}`);
    setShowModelMenu(false);
  };

  const currentModelName =
    AVAILABLE_MODELS.find((m) => m.id === currentModel)?.name || currentModel;

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
          <header className="chat-header">
            {/* FIX: Use isMobile state for consistent rendering */}
            <button
              className="action-btn"
              style={{
                marginRight: 10,
                display: isMobile ? "block" : "none",
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
                <span>{currentModelName}</span>
                <FiChevronDown style={{ opacity: 0.5 }} />
              </div>

              {showModelMenu && (
                <div className="popover-menu" style={{ top: "40px", left: 0 }}>
                  {AVAILABLE_MODELS.map((model) => (
                    <div
                      key={model.id}
                      className="popover-item"
                      onClick={() => onModelDropdownClick(model.id)}
                      style={{
                        fontWeight:
                          currentModel === model.id ? "bold" : "normal",
                      }}
                    >
                      {model.name}
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
            onCopy={(text) => navigator.clipboard.writeText(text)}
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
