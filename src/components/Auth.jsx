
import React, { useEffect, useState } from 'react'
import { useWebApp } from '@vkruglikov/react-telegram-web-app'
import useStore from '../store/useStore'

function Auth() {
  const WebApp = useWebApp()
  const { login, isLoading } = useStore()
  const [error, setError] = useState(null)
  const [localLoading, setLocalLoading] = useState(true)

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        // التحقق من وجود Telegram
        if (!WebApp?.initData) {
          if (import.meta.env.DEV) {
            console.log('وضع التطوير: بدون Telegram')
            setLocalLoading(false)
            return
          }
          throw new Error('يرجى فتح التطبيق من Telegram')
        }

        // توسيع الشاشة
        WebApp.expand()
        WebApp.ready()

        console.log('📱 جاري المصادقة...')
        
        const result = await login(WebApp.initData)
        
        if (!result.success) {
          throw new Error(result.error || 'فشل تسجيل الدخول')
        }

        console.log('✅ نجح:', result.user)

      } catch (err) {
        console.error('❌ خطأ:', err)
        setError(err.message)
      } finally {
        setLocalLoading(false)
      }
    }

    authenticateUser()
  }, [WebApp, login])

  if (localLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">جاري تسجيل الدخول...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
        <div className="text-red-500 text-center mb-4 text-lg">⚠️</div>
        <p className="text-red-400 text-center mb-6">{error}</p>
        
        {import.meta.env.DEV && (
          <div className="bg-gray-900 rounded-xl p-4 mb-4 max-w-sm">
            <p className="text-gray-400 text-sm mb-2">وضع المطور:</p>
            <button 
              onClick={() => {
                useStore.setState({
                  user: {
                    id: 'dev-user-123',
                    telegram_id: 123456789,
                    first_name: 'مطور',
                    username: 'developer',
                    balance: 1000,
                    referral_code: 'SYT123',
                    referral_count: 5
                  },
                  isAuthenticated: true,
                  isLoading: false
                })
              }}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full"
            >
              تسجيل دخول وهمي
            </button>
          </div>
        )}
        
        <button 
          onClick={() => window.location.reload()}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  return null
}

export default Auth
