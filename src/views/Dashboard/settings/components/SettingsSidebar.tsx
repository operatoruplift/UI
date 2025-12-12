import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Link2, Server, Eye, Smartphone, CreditCard, Zap, ChevronRight, LogOut, MemoryStick, Settings2, Keyboard } from 'lucide-react'
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
}

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export const settingsTabs: SettingsTab[] = [
  { id: 'profile', label: 'Profile', description: 'Manage your account information and preferences', icon: <User size={18} /> },
  // { id: 'mcp', label: 'MCP Server', description: 'Configure and manage your MCP server connections', icon: <Server size={18} /> },
  // { id: 'accessibility', label: 'Accessibility', description: 'Customize your experience with accessibility options', icon: <Eye size={18} /> },
  // { id: 'memory', label: 'Memory', description: 'Customize your experience with accessibility options', icon: <MemoryStick size={18} /> },
  // { id: 'shortcuts', label: 'Shortcuts', description: 'Manage keyboard shortcuts', icon: <Keyboard size={18} /> },
  // { id: 'devices', label: 'Devices', description: 'Manage devices accessing your account', icon: <Smartphone size={18} /> },
  // { id: 'subscription', label: 'Subscription', description: 'Manage your subscription plan and billing information', icon: <CreditCard size={18} /> },
  { id: 'usage', label: 'Usage', description: 'Monitor your resource consumption', icon: <Zap size={18} /> },
  { id: 'actions', label: 'Actions', description: 'Manage app data and perform actions', icon: <Settings2 size={18} /> }
]

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="w-[240px] flex flex-col gap-2 p-4">
      <div className="flex-1">
        {settingsTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all w-full ${
              activeTab === tab.id
                ? 'bg-foreground/5 text-foreground'
                : 'text-foreground/70 hover:text-foreground hover:bg-foreground/10'
            }`}
          >
            <span className="text-foreground/60">{tab.icon}</span>
            <span className="flex-1 text-left">{tab.label}</span>
            {activeTab === tab.id && <ChevronRight size={14} />}
          </button>
        ))}
      </div>

      <button
        onClick={() => setShowLogoutDialog(true)}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all text-foreground/70 hover:text-destructive hover:bg-destructive/10 mt-auto"
      >
        <LogOut size={18} className="text-foreground/60" />
        <span className="flex-1 text-left">Logout</span>
      </button>

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

