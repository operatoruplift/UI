import React from 'react'

export const SignupDivider: React.FC = () => {
  return (
    <div className="relative py-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-foreground/10"></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-3 bg-background text-foreground/60 text-xs font-medium">Already have an account?</span>
      </div>
    </div>
  )
}

