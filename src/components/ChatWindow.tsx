import React from 'react';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import type { MessageProps } from './Message'; // For typing messages prop
import './ChatWindow.css'; // Import the CSS file

// We'll define these later
// import MessageList from './MessageList';
// import MessageInput from './MessageInput';

interface ChatWindowProps {
  messages: MessageProps[];
  onSendMessage: (messageText: string) => void;
  isLoading: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onSendMessage, isLoading }) => {
  return (
    <div className="chat-window">
      <MessageList messages={messages} />
      <MessageInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default ChatWindow; 