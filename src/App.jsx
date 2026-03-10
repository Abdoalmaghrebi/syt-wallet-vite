// src/App.jsx
import React, { useEffect, useState } from 'react'
import { useTelegram } from '@vkruglikov/react-telegram-web-app'
import useStore from './store/useStore'
import Auth from './components/Auth'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Tasks from './components/Tasks'
import Wallet from './components/Wallet'
import Referrals from './components/Referrals'

function App() {
  const { ready, expand } = useTelegram()
  const [activeTab, setActiveTab] = useState('home')
  const { user, isAuthenticated, isLoading, setLoading } = useStore()

  useEffect(() => {
    if (ready) {
      expand()
    }
  }, [ready, expand])

  useEffect(() => {
    // التحقق من وجود مستخدم مخزن
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('syt-wallet-storage')
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser)
          if (parsed.state?.user) {
            useStore.setState({ 
              user: parsed.state.user, 
              isAuthenticated: true 
            })
          }
        } catch (e) {
          console.error('خطأ في قراءة التخزين:', e)
        }
      }
      setLoading(false)
    }
    
    checkAuth()
  }, [setLoading])

  const renderContent = () => {
    if (!isAuthenticated || !user) {
      return <Auth />
    }

    switch (activeTab) {
      case 'home':
        return <Home user={user} setActiveTab={setActiveTab} />
      case 'tasks':
        return <Tasks user={user} />
      case 'wallet':
        return <Wallet user={user} />
      case 'referrals':
        return <Referrals user={user} />
      default:
        return <Home user={user} setActiveTab={setActiveTab} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="pb-16">
        {renderContent()}
      </div>
      
      {isAuthenticated && user && (
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  )
}

export default App
