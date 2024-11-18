import React, { useEffect, useRef } from 'react';
import { FaUserCircle, FaRobot, FaTimes } from 'react-icons/fa';
import './ChatBot.css';

function ChatBot({ chatMessages, handleMessageSend, userInput, setUserInput, closeChatBot }) {
  const chatWindowRef = useRef(null); // Create a ref to the chat window

  // Scroll to the bottom whenever chatMessages changes
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [chatMessages]);

  return (
    <div className="chat-bot-overlay">
      <div className="chat-bot-dialog">
        <div className="chat-bot-header">
          <h2>ChatBot</h2>
          <button className="close-button" onClick={closeChatBot}>
            <FaTimes />
          </button>
        </div>
        <div className="chat-window" ref={chatWindowRef}>
          {chatMessages.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
            >
              {message.sender === 'user' ? (
                <div className="message-content user">
                  <FaUserCircle className="user-icon" />
                  <div className="text">{message.text}</div>
                </div>
              ) : (
                <div className="message-content bot">
                  <FaRobot className="bot-icon" />
                  <div className="text">{message.text}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="input-container">
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            rows={2}
          />
          <button className="send-button" onClick={handleMessageSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
