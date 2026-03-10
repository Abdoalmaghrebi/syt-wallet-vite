
import React, { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { CheckCircle2, Clock, Gift } from 'lucide-react'

function Tasks({ user }) {
  const [tasks, setTasks] = useState([])
  const [userTasks, setUserTasks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTasks()
  }, [user])

  const fetchTasks = async () => {
    try {
      // جلب المهام المتاحة
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      // جلب مهام المستخدم
      const { data: myTasks } = await supabase
        .from('user_tasks')
        .select('*')
        .eq('user_id', user.id)

      setTasks(allTasks || [])
      setUserTasks(myTasks || [])
    } catch (error) {
      console.error('خطأ في جلب المهام:', error)
    } finally {
      setLoading(false)
    }
  }

  const getTaskStatus = (taskId) => {
    const userTask = userTasks.find(ut => ut.task_id === taskId)
    return userTask?.status || 'pending'
  }

  const handleTaskAction = async (task) => {
    const status = getTaskStatus(task.id)
    
    if (status === 'pending') {
      // فتح الرابط المطلوب
      if (task.requirements?.url) {
        window.open(task.requirements.url, '_blank')
      }
      
      // تسجيل المهمة كمعلقة
      await supabase.from('user_tasks').insert({
        user_id: user.id,
        task_id: task.id,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      
      fetchTasks()
    }
  }

  const claimReward = async (taskId) => {
    const { error } = await supabase.rpc('claim_task_reward', {
      p_user_id: user.id,
      p_task_id: taskId
    })
    
    if (!error) {
      fetchTasks()
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
      <h2 className="text-xl font-bold mb-4">المهام المتاحة</h2>
      
      <div className="space-y-3">
        {tasks.map((task) => {
          const status = getTaskStatus(task.id)
          const isCompleted = status === 'completed' || status === 'claimed'
          const isPending = status === 'pending'
          const isSubmitted = status === 'submitted'

          return (
            <div
              key={task.id}
              className={`bg-gray-900 rounded-xl p-4 ${
                isCompleted ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Gift size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {task.title?.ar || task.title}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {task.description?.ar || task.description}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="text-green-400 font-bold">
                    +{task.reward_amount} {task.reward_currency}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  {isCompleted && <CheckCircle2 size={16} className="text-green-400" />}
                  {isSubmitted && <Clock size={16} className="text-yellow-400" />}
                  <span>
                    {isCompleted && 'تم الاستلام'}
                    {isSubmitted && 'قيد المراجعة'}
                    {isPending && 'متاحة'}
                  </span>
                </div>

                {isPending && (
                  <button
                    onClick={() => handleTaskAction(task)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    بدء المهمة
                  </button>
                )}

                {status === 'completed' && (
                  <button
                    onClick={() => claimReward(task.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    استلام المكافأة
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Tasks
