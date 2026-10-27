import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css'
import App from './App.jsx'

// Replace with your actual Google Client ID or use import.meta.env.VITE_GOOGLE_CLIENT_ID if stored in your frontend .env
const GOOGLE_CLIENT_ID =import.meta.env.VITE_GOOGLE_CLIENT_ID
console.log(GOOGLE_CLIENT_ID)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </StrictMode>
)