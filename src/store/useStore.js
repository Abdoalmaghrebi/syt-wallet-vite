
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../config/supabase'

const useStore = create(
  persist(
    (set, get) => ({
      // المستخدم
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // الإجراءات
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      login: async (initData) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Telegram-Init-Data': initData
            },
            body: JSON.stringify({ initData })
          })

          const data = await response.json()
          
          if (data.success) {
            set({ 
              user: data.user, 
              isAuthenticated: true,
              isLoading: false 
            })
            return { success: true, user: data.user }
          } else {
            throw new Error(data.message)
          }
        } catch (error) {
          set({ isLoading: false })
          return { success: false, error: error.message }
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        supabase.auth.signOut()
      },

      updateBalance: (amount) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              balance: (user.balance || 0) + amount
            }
          })
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),

      // إعادة تعيين
      reset: () => set({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      })
    }),
    {
      name: 'syt-wallet-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
)

export default useStore
