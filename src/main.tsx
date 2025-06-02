import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Function to find the specific KOii chat container
function getKOiiChatContainer(): HTMLElement | null {
  // ONLY look for the specific KOii chat container - no fallbacks
  const chatContainer = document.getElementById('KOii-chat-container');
  
  if (!chatContainer) {
    console.log('KOii-chat-container not found. Chat will not render on this page.');
    return null;
  }
  
  console.log('KOii-chat-container found. Initializing chat...');
  return chatContainer;
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  try {
    const chatContainer = getKOiiChatContainer();
    
    // Only proceed if we found the specific container
    if (!chatContainer) {
      console.log('Chat container not found. Skipping chat initialization.');
      return;
    }
    
    const root = createRoot(chatContainer);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    
    console.log('KOii chat app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize KOii chat app:', error);
  }
}
