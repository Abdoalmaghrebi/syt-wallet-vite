// src/App.jsx
import React, { useEffect } from 'react'
import { useTelegram } from '@vkruglikov/react-telegram-web-app'
import Auth from './components/Auth'

function App() {
  const { ready, expand } = useTelegram()

  useEffect(() => {
    if (ready) {
      expand()
    }
  }, [ready, expand])

  return (
    <div className="min-h-screen bg-black text-white">
      <Auth />
    </div>
  )
}

export default App
