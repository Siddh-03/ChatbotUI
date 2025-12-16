import React, { useRef, useState, useEffect } from "react";
import { FiPaperclip, FiMic, FiSend, FiX, FiCheck } from "react-icons/fi";

const ChatInput = ({
  onSend,
  onFileSelect,
  input,
  setInput,
  files,
  setFiles,
  editingId,
  onCancelEdit,
}) => {
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const recognitionRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);

  // Initialize Speech Recognition
  useEffect(() => {
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
        setInput((prev) => `${prev} ${transcript}`.trim());
      };

      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, [setInput]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [input]);

  const handleVoiceToggle = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported in this browser.");
      return;
    }
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="input-area-wrapper">
      <div className="input-container">
        {/* Editing Banner */}
        {editingId && (
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
              onClick={onCancelEdit}
              title="Cancel edit"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* File Previews */}
        {files.length > 0 && !editingId && (
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
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="input-actions">
          <div className="left-actions">
            <button
              className="action-btn"
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              disabled={!!editingId}
            >
              <FiPaperclip size={20} />
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                style={{ display: "none" }}
                ref={fileInputRef}
                onChange={onFileSelect}
                disabled={!!editingId}
              />
            </button>
            <button
              className={`action-btn ${isRecording ? "recording" : ""}`}
              onClick={handleVoiceToggle}
              title="Voice Input"
              disabled={!!editingId}
            >
              <FiMic size={20} />
            </button>
          </div>
          <div className="right-actions">
            <button
              className="action-btn send-btn"
              onClick={onSend}
              disabled={!input.trim() && files.length === 0}
              title={editingId ? "Save edit" : "Send"}
            >
              {editingId ? <FiCheck size={18} /> : <FiSend size={18} />}
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
  );
};

export default ChatInput;
