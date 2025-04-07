import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './components/layouts/LanguageContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider> {/* Wrap App with LanguageProvider */}
      <App />
    </LanguageProvider>
  </StrictMode>,
)
