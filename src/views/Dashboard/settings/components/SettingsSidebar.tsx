import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Server, Eye, Smartphone, CreditCard, Zap, ChevronRight, LogOut, MemoryStick, Settings2, Keyboard, Settings, Key, Shield } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SettingsTab {
  id: string
  label: string
  description: string
  icon: React.ReactNode
  group: 'account' | 'preferences' | 'billing' | 'security'
}

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const settingsTabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', description: 'Manage your account information and preferences', icon: <User size={18} />, group: 'account' },
  { id: 'keys', label: 'Agentic Vault', description: 'Manage time-limited access keys that govern what agents can do', icon: <Key size={18} />, group: 'security' },
  { id: 'permissions', label: 'Permissions', description: 'Permission rules engine fetched live from the Rust runtime', icon: <Shield size={18} />, group: 'security' },
  { id: 'usage', label: 'Usage', description: 'Monitor your resource consumption', icon: <Zap size={18} />, group: 'billing' },
  { id: 'actions', label: 'Actions', description: 'Manage app data and perform actions', icon: <Settings2 size={18} />, group: 'preferences' },
]

const groupLabels: Record<string, string> = {
  account: 'Account',
  security: 'Security',
  preferences: 'Preferences',
  billing: 'Billing & Usage',
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  // Group tabs by category
  const groupedTabs = settingsTabs.reduce((acc, tab) => {
    if (!acc[tab.group]) acc[tab.group] = []
    acc[tab.group].push(tab)
    return acc
  }, {} as Record<string, SettingsTab[]>)

  const groupOrder = ['account', 'security', 'preferences', 'billing']

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-foreground/5">
        <div className="flex items-center gap-2">
          <Settings size={18} className="text-primary" />
          <h2 className="text-sm font-semibold text-foreground">Settings</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {groupOrder.map(groupKey => {
          const tabs = groupedTabs[groupKey]
          if (!tabs?.length) return null
          
          return (
            <div key={groupKey} className="space-y-1">
              <p className="px-3 py-1.5 text-[10px] uppercase tracking-wider text-foreground/30 font-semibold">
                {groupLabels[groupKey]}
              </p>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 w-full group ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-foreground border border-primary/20'
                      : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5 border border-transparent'
                  }`}
                >
                  <span className={`transition-colors ${
                    activeTab === tab.id ? 'text-primary' : 'text-foreground/40 group-hover:text-foreground/60'
                  }`}>
                    {tab.icon}
                  </span>
                  <span className="flex-1 text-left font-medium">{tab.label}</span>
                  <ChevronRight 
                    size={14} 
                    className={`transition-all ${
                      activeTab === tab.id 
                        ? 'text-primary opacity-100' 
                        : 'text-foreground/20 opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              ))}
            </div>
          )
        })}
      </div>

      {/* Footer - Logout */}
      <div className="p-3 border-t border-foreground/5">
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full text-foreground/50 hover:text-destructive hover:bg-destructive/10 group"
        >
          <LogOut size={18} className="group-hover:text-destructive transition-colors" />
          <span className="flex-1 text-left font-medium">Logout</span>
        </button>
      </div>

      {/* Logout Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to sign in again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowLogoutDialog(false)
                handleLogout()
              }}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

