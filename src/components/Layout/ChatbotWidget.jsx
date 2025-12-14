import React from 'react';
import { FaHeadphones, FaXmark } from 'react-icons/fa6';

const ChatbotWidget = ({ show, onToggle, messages, input, onInputChange, onSubmit }) => {
  return (
    <>
      <button className="dash-chatbot-fab" onClick={onToggle}>
        <span><FaHeadphones /></span>
      </button>

      {show && (
        <div className="dash-chatbot-widget dash-open">
          <div className="dash-chatbot-header">
            <span>AgentVerse Helper</span>
            <button className="dash-close-chatbot-btn" onClick={onToggle}>
              <span><FaXmark /></span>
            </button>
          </div>
          <div className="dash-chatbot-body">
            {messages.map((msg, idx) => (
              <p key={idx} className={`dash-chat-message ${msg.type === 'user' ? 'dash-user-message' : 'dash-bot-message'}`}>
                {msg.text}
              </p>
            ))}
          </div>
          <div className="dash-chatbot-footer">
            <input 
              type="text" 
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
              placeholder="Type your message..."
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
