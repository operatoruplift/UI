import React from 'react'

export const SignupHeader: React.FC = () => {
  return (
    <div className="text-center mb-10">
      <div className="mb-4">
        <h1 className="text-4xl bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">Uplift</h1>
      </div>
      <p className="text-lg font-semibold text-foreground mb-2">Create Account</p>
      <p className="text-foreground/60 text-sm">Join our community and start exploring</p>
    </div>
  )
}

