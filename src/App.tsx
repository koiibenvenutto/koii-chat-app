import { useState, useEffect } from 'react';
import './App.css'
import ChatWindow from './components/ChatWindow';
import type { MessageProps } from './components/Message'; // For typing messages state

// Use Vite environment variable for API URL, fallback for local dev if not set
// Ensure we use HTTPS in production environments
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/chat/message';
// Extract the base URL for other endpoints
const API_BASE_URL = API_URL.substring(0, API_URL.lastIndexOf('/'));

interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

function App() {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [conversationId, setConversationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading state for initial message

  // Fetch initial message when component mounts
  useEffect(() => {
    fetchInitialMessage();
  }, []);

  // Fetch initial message when component mounts
  const fetchInitialMessage = async () => {
    try {
      const initialMsgUrl = `${API_BASE_URL}/initial-message`;
      console.log("Fetching initial message from:", initialMsgUrl);
      
      const response = await fetch(initialMsgUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'omit'
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch initial message: ${response.status}`);
      }

      const data = await response.json();
      
      // Set conversation ID from response
      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }
      
      // Add the AI-generated message as the first message
      const initialMessage: MessageProps = {
        id: 'initial-ai-message',
        text: data.message,
        sender: 'ai'
      };
      
      setMessages([initialMessage]);
    } catch (error) {
      console.error("Error fetching initial message:", error);
      
      // Fallback to default message
      const fallbackMessage: MessageProps = {
        id: 'fallback-welcome',
        text: "Welcome to KOii's journal! How can I help you today?",
        sender: 'ai'
      };
      
      setMessages([fallbackMessage]);
      // Generate a fallback conversation ID
      setConversationId(`fallback-${Date.now()}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Convert messages to history format for API
  const messagesToHistory = (messages: MessageProps[]): ChatHistoryItem[] => {
    return messages
      .filter(msg => msg.id !== 'initial-ai-message' && !msg.id.toString().startsWith('fallback'))
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
        timestamp: new Date().toISOString()
      }));
  };

  const handleSendMessage = async (text: string) => {
    const userMessage: MessageProps = {
      id: new Date().toISOString() + '-user', // Ensure unique ID
      text: text,
      sender: 'user'
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      // Log API URL to help with debugging
      console.log("Using API URL:", API_URL);
      
      // Prepare conversation history (excluding the current user message)
      const currentHistory = messagesToHistory(messages);
      
      const requestBody = {
        message: text,
        conversation_id: conversationId,
        history: currentHistory
      };
      
      console.log(`Sending message with ${currentHistory.length} history items for conversation ${conversationId}`);
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': window.location.origin
        },
        credentials: 'omit', // Don't send cookies to avoid CORS preflight issues
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // Try to get error detail from backend response
        let errorDetail = "Failed to get response from AI service.";
        try {
            const errorData = await response.json();
            errorDetail = errorData.detail || errorDetail;
        } catch {
            // Could not parse JSON, use default error or response.statusText
            errorDetail = response.statusText || errorDetail;
        }
        throw new Error(`API Error: ${response.status} - ${errorDetail}`);
      }

      const data = await response.json();
      
      // Update conversation ID if it changed
      if (data.conversation_id && data.conversation_id !== conversationId) {
        setConversationId(data.conversation_id);
      }
      
      const aiReply: MessageProps = {
        id: new Date().toISOString() + '-ai', // Ensure unique ID
        text: data.reply, // Assuming backend sends { "reply": "..." }
        sender: 'ai'
      };
      setMessages(prevMessages => [...prevMessages, aiReply]);

    } catch (error) {
      console.error("Error sending message or fetching AI reply:", error);
      const errorMessage: MessageProps = {
        id: new Date().toISOString() + '-error',
        text: `Error: ${error instanceof Error ? error.message : 'Could not connect to AI. Please try again.'}`,
        sender: 'ai' // Display error as an AI message for visibility
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <ChatWindow 
        messages={messages} 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading} 
      />
    </div>
  )
}

export default App
