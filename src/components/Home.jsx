
import React, { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { Wallet, ArrowRight, Sparkles, TrendingUp, Award } from 'lucide-react'

function Home({ user, setActiveTab }) {
  const [stats, setStats] = useState({
    balance: 0,
    totalEarned: 0,
    tasksCompleted: 0,
    referralCount: 0
  })
  const [recentTasks, setRecentTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHomeData()
  }, [user])

  const fetchHomeData = async () => {
    try {
      // جلب بيانات المستخدم
      const { data: userData } = await supabase
        .from('users')
        .select('balance, total_earned, tasks_completed, referral_count')
        .eq('id', user.id)
        .single()

      if (userData) {
        setStats({
          balance: userData.balance || 0,
          totalEarned: userData.total_earned || 0,
          tasksCompleted: userData.tasks_completed || 0,
          referralCount: userData.referral_count || 0
        })
      }

      // جلب المهام المتاحة
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .limit(3)

      setRecentTasks(tasks || [])
    } catch (error) {
      console.error('خطأ في جلب البيانات:', error)
    } finally {
      setLoading(false)
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
      {/* ترحيب */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">
          أهلاً {user?.first_name || 'بك'}! 👋
        </h1>
        <p className="text-gray-400">لنكسب بعض SYT اليوم</p>
      </div>

      {/* رصيد سريع */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-blue-200 text-sm mb-1">رصيدك</p>
            <h2 className="text-3xl font-bold text-white">
              {stats.balance.toFixed(4)} <span className="text-lg">SYT</span>
            </h2>
          </div>
          <div className="bg-white/20 p-3 rounded-xl">
            <Wallet size={32} className="text-white" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-blue-200 text-sm">
            إجمالي الأرباح: {stats.totalEarned.toFixed(4)} SYT
          </p>
          <button 
            onClick={() => setActiveTab('wallet')}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1"
          >
            المحفظة <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award size={20} className="text-yellow-400" />
            <span className="text-gray-400 text-sm">المهام</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.tasksCompleted}</p>
          <p className="text-xs text-gray-500">مهمة مكتملة</p>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} className="text-green-400" />
            <span className="text-gray-400 text-sm">الإحالات</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.referralCount}</p>
          <p className="text-xs text-gray-500">صديق دعوته</p>
        </div>
      </div>

      {/* مهام مقترحة */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-400" />
            مهام سريعة
          </h3>
          <button 
            onClick={() => setActiveTab('tasks')}
            className="text-blue-400 text-sm"
          >
            عرض الكل
          </button>
        </div>

        <div className="space-y-2">
          {recentTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => setActiveTab('tasks')}
              className="bg-gray-900 rounded-xl p-4 flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/20 p-2 rounded-lg">
                  <Award size={20} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {task.title?.ar || task.title}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.is_repeatable ? 'متكررة' : 'مرة واحدة'}
                  </p>
                </div>
              </div>
              
              <span className="text-green-400 font-bold text-sm">
                +{task.reward_amount}
              </span>
            </div>
          ))}
          
          {recentTasks.length === 0 && (
            <p className="text-center text-gray-500 py-4 text-sm">
              لا توجد مهام متاحة حالياً
            </p>
          )}
        </div>
      </div>

      {/* دعوة صديق */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-bold text-white mb-1">ادعُ أصدقاءك!</h4>
            <p className="text-green-200 text-sm">
              احصل على 10% من أرباحهم
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('referrals')}
            className="bg-white text-green-600 px-4 py-2 rounded-lg text-sm font-medium"
          >
            دعوة
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
