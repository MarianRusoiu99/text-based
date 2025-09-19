import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { enableMockMode } from './services/mockApi'

// Enable mock mode for development when backend is not available
if (import.meta.env.DEV) {
  enableMockMode();
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
