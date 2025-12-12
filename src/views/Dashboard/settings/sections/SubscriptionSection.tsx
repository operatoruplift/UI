import React from 'react'

export const SubscriptionSection: React.FC = () => {
  const billingHistory = [
    { date: 'Dec 15, 2024', plan: 'Pro Plan', amount: '$99.00' },
    { date: 'Nov 15, 2024', plan: 'Pro Plan', amount: '$99.00' }
  ]

  return (
    <div className="space-y-3 flex flex-col h-full">
      {billingHistory.map((bill, i) => (
        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-foreground/5">
          <div>
            <p className="text-sm text-foreground">{bill.date}</p>
            <p className="text-xs text-foreground/60">{bill.plan}</p>
          </div>
          <p className="font-semibold text-foreground">{bill.amount}</p>
        </div>
      ))}
    </div>
  )
}

