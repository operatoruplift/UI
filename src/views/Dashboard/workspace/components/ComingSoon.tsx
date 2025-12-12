import React from 'react'
import { Shield, Download, Settings, Network, Folder, MessageSquare, HardDrive, Lock, Sparkles } from 'lucide-react'

export const WorkspaceComingSoon: React.FC = () => {
  const features = [
    { 
      icon: Shield, 
      label: 'Isolated Context', 
      desc: 'session based context' 
    },
    { 
      icon: Download, 
      label: 'Install & Manage', 
      desc: 'Local installation, centralized control' 
    },
    { 
      icon: Settings, 
      label: 'Customize', 
      desc: 'Full configuration control' 
    },
    { 
      icon: Network, 
      label: 'Connect Agents', 
      desc: 'Build powerful agent networks' 
    },
    { 
      icon: Folder, 
      label: 'Projects', 
      desc: 'Organize by workflow needs' 
    },
    { 
      icon: MessageSquare, 
      label: 'Chat Integration', 
      desc: 'Unified communication hub' 
    },
    { 
      icon: HardDrive, 
      label: '100% Local', 
      desc: 'Maximum privacy & control' 
    },
    { 
      icon: Lock, 
      label: 'Permissions', 
      desc: 'Fine-grained access control' 
    },
  ]

  return (
    <div className="flex max-w-5xl justify-center mx-auto relative z-10 flex-col h-full rounded-lg p-6 gap-4">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-4xl">Workspace</h2>
            <Sparkles size={20} className="text-primary animate-pulse" />
          </div>
          <p className="text-sm text-foreground/60">
            Your command center for agent orchestration
          </p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-sm">
          Coming Soon
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {features.map((feature, i) => {
          const Icon = feature.icon
          return (
            <div 
              key={i} 
              className="group relative p-4 rounded-lg border border-foreground/5 bg-foreground/[0.01] hover:border-primary/20 hover:bg-primary/5 transition-all duration-200 cursor-default"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm text-foreground mb-0.5">{feature.label}</h3>
                  <p className="text-xs text-foreground/50 leading-tight">{feature.desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-foreground/5">
        <p className="text-xs text-center text-foreground/40">
          Build powerful workflows • Complete privacy • Full control • All local
        </p>
      </div>
    </div>
  )
}

