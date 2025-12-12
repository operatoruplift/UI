import { staticConfig } from '@/config/static'
import { MoveRight } from 'lucide-react'
import React from 'react'

export const EmptyState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center space-y-2">
        <h2 className="text-5xl text-foreground">Boundless. Creative. Connected.</h2>
        <p className="text-lg  flex items-center justify-center gap-2 tracking-wide text-foreground/50">Install <MoveRight/> Plug <MoveRight/> Run</p>
      </div>
    </div>
  )
}

