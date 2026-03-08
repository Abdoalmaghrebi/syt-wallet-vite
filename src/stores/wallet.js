import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = 'https://your-api-url.com/api'

export const useWalletStore = defineStore('wallet', {
  state: () => ({
    wallet: null,
    loading: false,
    error: null
  }),
  
  actions: {
    async login() {
      this.loading = true
      
      try {
        const tg = window.Telegram.WebApp
        const initData = tg.initData
        
        const response = await axios.post(`${API_URL}/auth/login`, {}, {
          headers: {
            'X-Telegram-Init-Data': initData
          }
        })
        
        this.wallet = response.data.wallet
        
      } catch (error) {
        this.error = error.message
        console.error('Login error:', error)
      } finally {
        this.loading = false
      }
    }
  }
})
