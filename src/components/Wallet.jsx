
import React, { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'
import { ArrowDownLeft, ArrowUpRight, History, Copy, ExternalLink } from 'lucide-react'

function Wallet({ user }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWalletData()
  }, [user])

  const fetchWalletData = async () => {
    try {
      // جلب بيانات المستخدم
      const { data: userData } = await supabase
        .from('users')
        .select('balance, wallet_address')
        .eq('id', user.id)
        .single()

      if (userData) {
        setBalance(userData.balance || 0)
        setWalletAddress(userData.wallet_address || '')
      }

      // جلب المعاملات
      const { data: txs } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setTransactions(txs || [])
    } catch (error) {
      console.error('خطأ في جلب بيانات المحفظة:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      // يمكن إضافة إشعار هنا
    }
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
      case 'referral_bonus':
        return <ArrowDownLeft size={20} className="text-green-400" />
      case 'withdraw':
        return <ArrowUpRight size={20} className="text-red-400" />
      default:
        return <History size={20} className="text-gray-400" />
    }
  }

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'reward':
      case 'referral_bonus':
        return 'text-green-400'
      case 'withdraw':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const formatAmount = (amount, type) => {
    const prefix = ['deposit', 'reward', 'referral_bonus'].includes(type) ? '+' : '-'
    return `${prefix}${amount}`
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
      {/* رصيد */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 mb-4">
        <p className="text-blue-200 text-sm mb-1">الرصيد المتاح</p>
        <h2 className="text-4xl font-bold text-white mb-2">
          {balance.toFixed(8)} <span className="text-xl">SYT</span>
        </h2>
        <p className="text-blue-200 text-sm">
          ≈ ${(balance * 0.001).toFixed(2)} USD
        </p>
      </div>

      {/* عنوان المحفظة */}
      <div className="bg-gray-900 rounded-xl p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">عنوان المحفظة</span>
          {walletAddress && (
            <button
              onClick={copyAddress}
              className="text-blue-400 text-sm flex items-center gap-1"
            >
              <Copy size={14} /> نسخ
            </button>
          )}
        </div>
        
        {walletAddress ? (
          <code className="text-sm text-white break-all">
            {walletAddress}
          </code>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500 text-sm mb-3">لم يتم ربط محفظة بعد</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
              ربط محفظة
            </button>
          </div>
        )}
      </div>

      {/* أزرار سريعة */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button className="bg-gray-900 text-white p-4 rounded-xl flex flex-col items-center gap-2">
          <ArrowDownLeft size={24} className="text-green-400" />
          <span className="text-sm">إيداع</span>
        </button>
        <button className="bg-gray-900 text-white p-4 rounded-xl flex flex-col items-center gap-2">
          <ArrowUpRight size={24} className="text-red-400" />
          <span className="text-sm">سحب</span>
        </button>
      </div>

      {/* سجل المعاملات */}
      <div className="bg-gray-900 rounded-xl p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <History size={18} />
          سجل المعاملات
        </h3>

        <div className="space-y-3">
          {transactions.length === 0 ? (
            <p className="text-center text-gray-500 py-4">لا توجد معاملات</p>
          ) : (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-gray-800 p-2 rounded-lg">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      {tx.type === 'deposit' && 'إيداع'}
                      {tx.type === 'withdraw' && 'سحب'}
                      {tx.type === 'reward' && 'مكافأة'}
                      {tx.type === 'referral_bonus' && 'إحالة'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.created_at).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-bold ${getTransactionColor(tx.type)}`}>
                    {formatAmount(tx.amount, tx.type)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {tx.status === 'completed' ? 'مكتمل' : tx.status}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default Wallet
