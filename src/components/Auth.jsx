
import React, { useEffect, useState } from 'react'
import { useTelegram } from '@vkruglikov/react-telegram-web-app'
import { supabase } from '../config/supabase'

function Auth() {
  const { initDataUnsafe, initData, ready } = useTelegram()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!ready) return

    const authenticateUser = async () => {
      try {
        if (!initData) {
          throw new Error('لا يوجد بيانات Telegram')
        }

        // إرسال initData للتحقق
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': initData
          },
          body: JSON.stringify({ initData })
        })

        if (!response.ok) {
          throw new Error('فشل التحقق من الهوية')
        }

        const data = await response.json()
        
        if (data.success) {
          setUser(data.user)
          // حفظ الجلسة في Supabase
          await supabase.auth.setSession({
            access_token: data.token,
            refresh_token: data.refreshToken
          })
        } else {
          throw new Error(data.message || 'فشل تسجيل الدخول')
        }

      } catch (err) {
        console.error('خطأ في المصادقة:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    authenticateUser()
  }, [ready, initData])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-center mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg"
        >
          إعادة المحاولة
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="bg-gray-900 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-4">
          {user.photo_url && (
            <img 
              src={user.photo_url} 
              alt={user.first_name}
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
            <p className="text-gray-400">@{user.username}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 mb-4">
        <h3 className="text-gray-400 text-sm mb-2">الرصيد</h3>
        <p className="text-3xl font-bold text-green-400">{user.balance} SYT</p>
      </div>

      <div className="bg-gray-900 rounded-xl p-6">
        <h3 className="text-gray-400 text-sm mb-2">كود الإحالة</h3>
        <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3">
          <code className="text-blue-400">{user.referral_code}</code>
          <button className="text-sm text-white bg-blue-500 px-3 py-1 rounded">
            نسخ
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          عدد الإحالات: {user.referral_count}
        </p>
      </div>
    </div>
  )
}

export default Auth
