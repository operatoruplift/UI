import React from 'react'

type TabType = 'recommended' | 'trending'

interface TabsProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'recommended' as TabType, label: 'Recommended' },
    { id: 'trending' as TabType, label: 'Trending' },
  ]

  return (
    <div className="flex items-center gap-1 border-b border-foreground/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 text-sm font-medium transition-colors relative ${
            activeTab === tab.id
              ? 'text-foreground'
              : 'text-foreground/60 hover:text-foreground/80'
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  )
}

