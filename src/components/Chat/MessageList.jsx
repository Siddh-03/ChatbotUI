import React, { useRef, useEffect } from "react";
import { FiUser, FiCopy, FiEdit2, FiPaperclip } from "react-icons/fi";

const MessageList = ({ messages, isTyping, onCopy, onEdit, onPromptClick }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

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
              onClick={() => onCopy(code)}
              title="Copy Code"
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

  if (messages.length === 0) {
    return (
      <div className="messages-list">
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
              onClick={() => onPromptClick("Summarize this article")}
            >
              <h4>📝 Summarize</h4>
              <p>Summarize long text</p>
            </div>
            <div
              className="prompt-card"
              onClick={() => onPromptClick("Generate code for a React button")}
            >
              <h4>💻 Code</h4>
              <p>Generate React code</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-list">
      {messages.map((msg) => (
        <div key={msg.id} className={`message ${msg.sender}`}>
          <div className="msg-avatar">
            {msg.sender === "user" ? (
              <FiUser />
            ) : (
              <img src="/assist/images/ybai_shadow.png" width="24" alt="AI" />
            )}
          </div>
          <div className="msg-content">
            {renderMessageContent(msg.text)}
            {msg.edited && (
              <div style={{ fontSize: "0.75rem", opacity: 0.7 }}>(edited)</div>
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
              onClick={() => onCopy(msg.text)}
              title="Copy"
            />
            {msg.sender === "user" && (
              <FiEdit2
                style={{ cursor: "pointer" }}
                onClick={() => onEdit(msg)}
                title="Edit message"
              />
            )}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="message ai">
          <div className="msg-avatar">...</div>
          <div className="msg-content">...</div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
