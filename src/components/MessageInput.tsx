import React, { useState } from 'react';
import './MessageInput.css'; // Import the CSS file

interface MessageInputProps {
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isLoading) {
      onSendMessage(inputText.trim());
      setInputText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-form">
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder={isLoading ? "Maia is thinking..." : "Type your message..."}
        className="message-input"
        disabled={isLoading}
      />
      <button type="submit" className="send-button" disabled={isLoading || !inputText.trim()}>
        {isLoading ? 'Sending...' : 'Send'}
      </button>
    </form>
  );
};

export default MessageInput; 