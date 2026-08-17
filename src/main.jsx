import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Marks that JavaScript is running, before the first paint. The scroll-reveal
// animation hides content only under this class, so a JS failure degrades to a
// fully visible page instead of a blank one.
document.documentElement.classList.add('js')

// BASE_URL is '/' in dev and '/CV_Website/' in the GitHub Pages build, so the
// router basename tracks vite.config.js automatically.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
