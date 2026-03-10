// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app'
import App from './App.jsx'
import './index.css'

// ✅ التقاط الأخطاء
window.onerror = function(msg, url, line) {
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; background: black; min-height: 100vh;">
      <h2>خطأ في التطبيق:</h2>
      <p>${msg}</p>
      <p>السطر: ${line}</p>
      <p>الملف: ${url}</p>
    </div>
  `
}

try {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <WebAppProvider>
        <App />
      </WebAppProvider>
    </React.StrictMode>,
  )
} catch (err) {
  document.body.innerHTML = `
    <div style="padding: 20px; color: red; background: black;">
      <h2>خطأ في React:</h2>
      <p>${err.message}</p>
      <pre>${err.stack}</pre>
    </div>
  `
}
