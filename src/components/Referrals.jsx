
import React, { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Users, Copy, Gift, Share2 } from 'lucide-react'

function Referrals({ user }) {
  const [referrals, setReferrals] = useState([])
  const [stats, setStats] = useState({
    referralCount: 0,
    referralEarnings: 0,
    referralCode: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReferralData()
  }, [user])

  const fetchReferralData = async () => {
    try {
      // جلب بيانات المستخدم
      const { data: userData } = await supabase
        .from('users')
        .select('referral_code, referral_count, referral_earnings')
        .eq('id', user.id)
        .single()

      if (userData) {
        setStats({
          referralCount: userData.referral_count || 0,
          referralEarnings: userData.referral_earnings || 0,
          referralCode: userData.referral_code || ''
        })
      }

      // جلب قائمة الإحالات
      const { data: refs } = await supabase
        .from('referrals')
        .select(`
          *,
          referred:referred_id (
            first_name,
            username,
            created_at
          )
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })

      setReferrals(refs || [])
    } catch (error) {
      console.error('خطأ في جلب الإحالات:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = () => {
    const link = `https://t.me/syt_wallet_bot?start=${stats.referralCode}`
    navigator.clipboard.writeText(link)
    // يمكن إضافة إشعار نجاح هنا
  }

  const shareReferral = () => {
    const link = `https://t.me/syt_wallet_bot?start=${stats.referralCode}`
    const text = `انضم لمحفظة SYT واحصل على مكافآت! 🚀\n\n${link}`
    
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`)
    } else {
      navigator.clipboard.writeText(text)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="p-4 pb-20">
      {/* الإحصائيات */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <Users size={24} className="mx-auto mb-2 text-blue-400" />
          <p className="text-2xl font-bold text-white">{stats.referralCount}</p>
          <p className="text-xs text-gray-400">عدد الإحالات</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 text-center">
          <Gift size={24} className="mx-auto mb-2 text-green-400" />
          <p className="text-2xl font-bold text-white">{stats.referralEarnings}</p>
          <p className="text-xs text-gray-400">أرباح الإحالات</p>
        </div>
      </div>

      {/* كود الإحالة */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 mb-4">
        <p className="text-blue-200 text-sm mb-3">كود الإحالة الخاص بك</p>
        
        <div className="bg-black/30 rounded-lg p-3 mb-3">
          <code className="text-xl font-bold text-white tracking-wider">
            {stats.referralCode}
          </code>
        </div>

        <div className="flex gap-2">
          <button
            onClick={copyReferralCode}
            className="flex-1 bg-white/20 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Copy size={16} /> نسخ الرابط
          </button>
          <button
            onClick={shareReferral}
            className="flex-1 bg-white text-blue-600 py-2 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> مشاركة
          </button>
        </div>
      </div>

      {/* شرح نظام الإحالة */}
      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Gift size={18} className="text-yellow-400" />
          كيف تعمل الإحالات؟
        </h3>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-blue-400">1.</span>
            شارك كودك مع أصدقائك
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">2.</span>
            عند تسجيلهم يحصلون على 100 SYT مكافأة
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400">3.</span>
            تحصل أنت على 10% من أرباحهم
          </li>
        </ul>
      </div>

      {/* قائمة الإحالات */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="font-semibold mb-4">الإحالات الأخيرة</h3>
        
        {referrals.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users size={48} className="mx-auto mb-3 opacity-30" />
            <p>لم تقم بأي إحالات بعد</p>
            <p className="text-sm mt-1">ابدأ بدعوة أصدقائك!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <span className="text-blue-400 font-bold">
                      {ref.referred?.first_name?.[0] || '?'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {ref.referred?.first_name || 'مستخدم'}
                    </p>
                    <p className="text-xs text-gray-500">
                      @{ref.referred?.username || 'unknown'}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-green-400 font-bold text-sm">
                    +{ref.referrer_bonus} SYT
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(ref.created_at).toLocaleDateString('ar-SA')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Referrals
