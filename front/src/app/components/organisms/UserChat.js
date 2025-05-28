"use client";

import React from "react";
import { FaPaperPlane, FaUserCircle } from "react-icons/fa";
import { RiRobot3Line } from "react-icons/ri";
import MarkdownView from "react-showdown";
import "./UserChat.css";

const UserChat = ({ language, message, messages, handleSendMessage, handleChangeMessage }) => {
  const handleChange = (event) => {
    handleChangeMessage(event.target.value);
  };

  return (
    <div className="user-chat-container">
      <div className="messages-container custom-scrollbar">
        {messages?.map((msg, index) => (
          <div 
            key={index} 
            className={`message-wrapper ${msg.sender === "user" ? "user-message" : "ai-message"}`}
          >
            {msg.sender === "ai" && (
              <div className="ai-icon">
                <RiRobot3Line />
              </div>
            )}
            <div className={`message-bubble ${msg.sender === "user" ? "user-bubble" : "ai-bubble"}`}>
              <MarkdownView 
                markdown={msg.text} 
                options={{ tables: true, emoji: true }} 
                className="markdown-content"
              />
            </div>
            {msg.sender === "user" && (
              <div className="user-icon">
                <FaUserCircle />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            placeholder="Escriu un missatge..."
            value={message}
            onChange={handleChange}
            className="message-input"
            rows={1}
            style={{ minHeight: '3.5rem', maxHeight: '10rem' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`send-button ${message.trim() ? "active" : "disabled"}`}
          >
            <FaPaperPlane className="send-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserChat;