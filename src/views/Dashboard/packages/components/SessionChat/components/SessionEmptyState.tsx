import React from 'react'
import { Sparkles, MessageSquare, ArrowDown } from 'lucide-react'

export const SessionEmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-8 max-w-md mx-auto px-6">
        {/* Animated icon container */}
        <div className="relative flex justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-primary/10 blur-2xl animate-pulse" />
          </div>
          <div className="relative flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 backdrop-blur-sm">
            <MessageSquare size={40} className="text-primary" />
            <Sparkles 
              size={16} 
              className="absolute -top-1 -right-1 text-accent animate-pulse" 
            />
          </div>
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            Start Your Research
          </h2>
          <p className="text-base text-foreground/60 leading-relaxed">
            Ask questions, explore ideas, and discover insights. Your conversation begins here.
          </p>
        </div>

        {/* Subtle hint */}
        <div className="flex items-center justify-center gap-2 text-sm text-foreground/40 animate-bounce">
          <ArrowDown size={16} />
          <span>Type a message below to get started</span>
        </div>
      </div>
    </div>
  )
}

