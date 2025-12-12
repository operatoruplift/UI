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
  ActionsSection
} from './sections'
import { ScrollArea } from '@/components/ui/scroll-area'

const sectionComponents: Record<string, React.ComponentType> = {
  profile: ProfileSection,
  mcp: MCPServerSection,
  accessibility: AccessibilitySection,
  shortcuts: ShortcutsSection,
  devices: DevicesSection,
  subscription: SubscriptionSection,
  usage: UsageSection,
  actions: ActionsSection
}

export function Profile() {
  const [activeTab, setActiveTab] = useState('profile')

  const ActiveComponent = sectionComponents[activeTab] || ProfileSection
  const activeTabData = settingsTabs.find(tab => tab.id === activeTab)
  const activeTabLabel = activeTabData?.label || 'Settings'
  const activeTabDescription = activeTabData?.description || ''

  return (
    <div className="flex divide-x h-full">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollArea className='w-full '>
        <div className="flex flex-1 flex-col">
          <div className='p-2 px-4 space-y-1 border-b border-foreground/5'>
            <h2 className="text-foreground text-lg">{activeTabLabel}</h2>
            <p className="text-foreground/60 text-sm">{activeTabDescription}</p>
          </div>
          <div className="h-full p-8">
            <ActiveComponent />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
