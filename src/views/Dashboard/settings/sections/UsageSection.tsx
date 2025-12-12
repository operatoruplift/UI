import React from 'react'
import { SubscriptionSection } from './SubscriptionSection'

export const UsageSection: React.FC = () => {
  const stats = [
    { label: 'API Calls', value: '12,450', limit: '50,000/month', percent: 25 },
    { label: 'Storage Used', value: '2.4 GB', limit: '100 GB', percent: 2 },
    { label: 'Agents Active', value: '8', limit: '20', percent: 40 },
    { label: 'Team Members', value: '3', limit: '10', percent: 30 }
  ]

  const usageTrend = [65, 78, 82, 71, 88, 92, 85]

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-full">
      <div className="grid grid-cols-2 gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="p-4 rounded-lg bg-foreground/5">
            <p className="text-xs text-foreground/60 uppercase tracking-wide font-medium mb-2">{stat.label}</p>
            <p className="text-3xl text-foreground mb-2">{stat.value}</p>
            <div className="w-full relative h-1.5 rounded-full bg-foreground/10">
              <div className="h-full absolute top-0 left-0 rounded-full bg-primary" style={{ width: `${stat.percent}%` }}></div>
            </div>
            <p className="text-xs text-foreground/50 mt-2">{stat.limit}</p>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-lg bg-foreground/5">
        <p className="text-sm font-semibold text-foreground mb-4">Usage Trend (Last 7 Days)</p>
        <div className="flex items-end gap-2 h-24">
          {usageTrend.map((val, i) => (
            <div key={i} className="flex-1 rounded-t-lg bg-primary hover:opacity-80 transition-opacity" style={{ height: `${(val / 100) * 100}%` }} title={`${val}%`} />
          ))}
        </div>
        <p className="text-xs text-foreground/50 mt-3">Mon • Tue • Wed • Thu • Fri • Sat • Sun</p>
      </div>
      <SubscriptionSection/>
    </div>
  )
}

