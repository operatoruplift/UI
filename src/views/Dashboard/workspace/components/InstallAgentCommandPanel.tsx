import React, { useState } from 'react'
import { Agent } from '@/services/dashboard/hub/agentService'
import { InstalledAgentConfiguration } from './InstalledAgentConfiguration'
import { InstalledAgentActions } from './InstalledAgentActions'
import { cn } from '@/lib/utils'
import { Play, Settings } from 'lucide-react'

interface AgentCommandPanelProps {
    agent: Agent
    onBack: () => void
    onUninstall: () => void
}

export const AgentCommandPanel: React.FC<AgentCommandPanelProps> = ({
    agent,
    onBack,
    onUninstall,
}) => {
    const [activeTab, setActiveTab] = useState<'actions' | 'configuration'>('actions')

    const tabs = [
        { id: 'actions', label: 'Actions', icon: <Play className='h-3 w-3' /> },
        { id: 'configuration', label: 'Configuration', icon: <Settings className='h-3 w-3' /> },
    ] as const

    return (
        <div className="flex flex-col w-full h-full">
            {/* Tab Header */}
            <div className="flex items-center border-b border-border">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-[2px] flex items-center gap-2',
                            activeTab === tab.id
                                ? 'border-primary text-primary bg-primary/5'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-auto">
                {activeTab === 'actions' && (
                    <div className="p-6">
                        <InstalledAgentActions
                            agent={agent}
                            onBack={onBack}
                            onUninstall={onUninstall}
                        />
                    </div>
                )}

                {activeTab === 'configuration' && (
                    <InstalledAgentConfiguration agent={agent} />
                )}
            </div>
        </div>
    )
}

