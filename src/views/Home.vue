<template>
  <div class="home">
    <div class="header">
      <h1>SYT Wallet</h1>
      <p>المحفظة الرقمية الآمنة</p>
    </div>
    
    <div class="loading" v-if="loading">
      جاري التحميل...
    </div>
    
    <div class="wallet-card" v-else-if="wallet">
      <div class="balance-section">
        <span class="label">الرصيد</span>
        <span class="amount">{{ wallet.balance }}</span>
        <span class="currency">SYT</span>
      </div>
      
      <div class="address-section">
        <span class="label">عنوان المحفظة</span>
        <code>{{ wallet.address }}</code>
      </div>
    </div>
    
    <div class="login-section" v-else>
      <button @click="login" class="btn-primary">
        فتح المحفظة
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useWalletStore } from '../stores/wallet'

const store = useWalletStore()
const wallet = computed(() => store.wallet)
const loading = computed(() => store.loading)

const login = () => {
  store.login()
}
</script>

<style scoped>
.home {
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  color: #667eea;
  font-size: 28px;
}

.header p {
  color: #666;
  font-size: 14px;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.wallet-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  color: white;
}

.balance-section {
  text-align: center;
  margin-bottom: 20px;
}

.amount {
  font-size: 42px;
  font-weight: bold;
  display: block;
}

.currency {
  font-size: 16px;
  opacity: 0.9;
}

.address-section {
  background: rgba(255,255,255,0.15);
  border-radius: 8px;
  padding: 12px;
}

.address-section code {
  font-size: 12px;
  word-break: break-all;
}

.login-section {
  text-align: center;
  padding: 40px;
}

.btn-primary {
  background: #667eea;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  width: 100%;
}
</style>
