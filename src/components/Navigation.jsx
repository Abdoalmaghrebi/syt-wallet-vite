
import React from 'react'
import { Home, Wallet, ListTodo, Users } from 'lucide-react'

function Navigation({ activeTab, setActiveTab }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'الرئيسية' },
    { id: 'tasks', icon: ListTodo, label: 'المهام' },
    { id: 'referrals', icon: Users, label: 'الإحالات' },
    { id: 'wallet', icon: Wallet, label: 'المحفظة' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-blue-400' : 'text-gray-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation
