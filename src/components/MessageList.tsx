import React, { useEffect, useRef } from 'react';
import MessageComponent from './Message';
import type { MessageProps } from './Message';
import './MessageList.css';

interface MessageListProps {
  messages: MessageProps[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={messageListRef}>
      {messages.length === 0 ? (
        <p className="empty-chat-message">No messages yet. Start the conversation!</p>
      ) : (
        messages.map((msg) => (
          <MessageComponent key={msg.id} id={msg.id} text={msg.text} sender={msg.sender} />
        ))
      )}
    </div>
  );
};

export default MessageList; 