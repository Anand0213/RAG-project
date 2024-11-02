import React from 'react';
import './ChatBot.css';

function ChatBot({ chatMessages, handleMessageSend, userInput, setUserInput }) {
  return (
    <div className="chat-bot">
      <div className="chat-window">
        {chatMessages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
      </div>
      <input 
        type="text" 
        value={userInput} 
        onChange={(e) => setUserInput(e.target.value)} 
        placeholder="Type your message" 
      />
      <button onClick={handleMessageSend}>Send</button>
    </div>
  );
}

export default ChatBot;
