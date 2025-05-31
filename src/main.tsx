import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Function to find or create a root element for the React app
function getOrCreateRootElement(): HTMLElement {
  // First, try to find an existing root element
  let rootElement = document.getElementById('root');
  
  if (!rootElement) {
    // If no root element exists, try to find a chat container
    rootElement = document.getElementById('chat-container');
  }
  
  if (!rootElement) {
    // If still no element, try to find any element with class 'maia-chat'
    rootElement = document.querySelector('.maia-chat') as HTMLElement;
  }
  
  if (!rootElement) {
    // As a last resort, create a root element and append it to body
    console.log('No suitable container found, creating root element');
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
  }
  
  return rootElement;
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

function initializeApp() {
  try {
    const rootElement = getOrCreateRootElement();
    const root = createRoot(rootElement);
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
    
    console.log('Maia chat app initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Maia chat app:', error);
  }
}
