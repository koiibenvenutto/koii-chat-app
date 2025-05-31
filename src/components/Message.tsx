import React from 'react';
import './Message.css'; // Import the CSS file
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface MessageProps {
  id: string | number; // Unique key for React list
  text: string;
  sender: 'user' | 'ai';
  // timestamp?: string; // Optional: if we want to display time
}

const MessageComponent: React.FC<MessageProps> = ({ text, sender }) => {
  const messageClass = sender === 'user' ? 'message user' : 'message ai';

  return (
    <div className={messageClass}>
      <div className="message-sender">{sender === 'user' ? 'You' : "KOii's journal"}</div>
      <div className="message-text">
        {sender === 'ai' ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {text}
          </ReactMarkdown>
        ) : (
          text
        )}
      </div>
    </div>
  );
};

export default MessageComponent; 