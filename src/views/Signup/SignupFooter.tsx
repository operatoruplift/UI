import React from 'react'
import { Link } from 'react-router-dom'

export const SignupFooter: React.FC = () => {
  return (
    <div className="mt-8 space-y-4 text-center text-sm">
      <p className="text-foreground/60">
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-primary hover:text-primary/80 font-medium transition-colors">
          Terms of Service
        </Link>
      </p>
      <p className="text-foreground/40 text-xs">
        Version 1.0 • © 2024 Uplift. All rights reserved.
      </p>
    </div>
  )
}

