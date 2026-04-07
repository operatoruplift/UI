import React, { useState } from 'react'
import { SettingsSidebar, settingsTabs } from './components'
import {
  ProfileSection,
  MCPServerSection,
  AccessibilitySection,
  ShortcutsSection,
  DevicesSection,
  SubscriptionSection,
  UsageSection,
  ActionsSection,
  KeysSection,
  PermissionsSection,
} from './sections'

const sectionComponents: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  mcp: MCPServerSection,
  accessibility: AccessibilitySection,
  shortcuts: ShortcutsSection,
  devices: DevicesSection,
  subscription: SubscriptionSection,
  usage: UsageSection,
  actions: ActionsSection,
  keys: KeysSection,
  permissions: PermissionsSection,
}

export function Profile() {
  const [activeTab, setActiveTab] = useState('profile')

  const ActiveComponent = sectionComponents[activeTab] || ProfileSection
  const activeTabData = settingsTabs.find(tab => tab.id === activeTab)
  const activeTabLabel = activeTabData?.label || 'Settings'
  const activeTabDescription = activeTabData?.description || ''
  const ActiveIcon = activeTabData?.icon

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="w-52 lg:w-56 flex-shrink-0 border-r border-foreground/5 bg-foreground/[0.01]">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5 border-b border-foreground/5 bg-foreground/[0.01]">
          <div className="flex items-center gap-3">
            {ActiveIcon && (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-primary/10 flex items-center justify-center">
                <span className="text-primary">{ActiveIcon}</span>
              </div>
            )}
            <div className="space-y-0.5">
              <h2 className="text-lg font-semibold text-foreground">{activeTabLabel}</h2>
              <p className="text-sm text-foreground/40">{activeTabDescription}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-auto">
          <div className="p-6 lg:p-8 max-w-4xl">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  )
}
