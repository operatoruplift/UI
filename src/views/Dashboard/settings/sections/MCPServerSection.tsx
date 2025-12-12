import React from 'react'
import { Button } from '@/components/ui/button'

export const MCPServerSection: React.FC = () => {
  return (
      <div className="space-y-4 max-w-2xl mx-auto flex flex-col h-full">
        {/* <div className="p-6 rounded-lg bg-foreground/5 border border-foreground/10">
          <p className="font-semibold text-foreground mb-4">Add New Server</p>
          <div className="space-y-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">Server URL</label>
              <input type="text" placeholder="https://api.example.com" className="w-full px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">API Key</label>
              <input type="password" placeholder="••••••••••••" className="w-full px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 text-foreground placeholder:text-foreground/40 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all" />
            </div>
            <Button className="w-full bg-primary text-primary-foreground">Add Server</Button>
          </div>
        </div> */}

        <div className="p-6 rounded-lg bg-foreground/5 transition-all">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold text-foreground">Production Server</p>
              <p className="text-sm text-foreground/60">https://api.example.com</p>
            </div>
            <span className="text-xs px-3 py-1.5 rounded-full bg-foreground/5 text-foreground font-medium">Active</span>
          </div>
          <Button variant="outline" size="sm">Remove Server</Button>
        </div>
      </div>
  )
}

