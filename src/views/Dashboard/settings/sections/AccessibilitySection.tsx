import React from 'react'
import { Moon, PauseCircle, Contrast, Volume2 } from 'lucide-react'

export const AccessibilitySection: React.FC = () => {
  const accessibilityOptions = [
    { label: 'Dark Mode', description: 'Always use dark theme', Icon: Moon, enabled: true },
    { label: 'Reduced Motion', description: 'Minimize animations and transitions', Icon: PauseCircle, enabled: false },
    { label: 'High Contrast', description: 'Improve text and element visibility', Icon: Contrast, enabled: false },
    { label: 'Screen Reader', description: 'Enhanced support for assistive technology', Icon: Volume2, enabled: true }
  ]

  return (
    <div className="space-y-3 max-w-2xl mx-auto flex flex-col h-full">
      {accessibilityOptions.map(item => (
        <div key={item.label} className="flex items-center justify-between p-5 rounded-lg bg-foreground/5">
          <div className="flex items-center gap-4">
            <div>
              <p className="font-semibold text-foreground">{item.label}</p>
              <p className="text-sm text-foreground/60">{item.description}</p>
            </div>
          </div>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="w-5 h-5 rounded accent-primary cursor-pointer" defaultChecked={item.enabled} />
          </label>
        </div>
      ))}
    </div>
  )
}

