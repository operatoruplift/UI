import { staticConfig } from '@/config/static'
import React from 'react'
import { Link } from 'react-router-dom'

export const LoginFooter: React.FC = () => {
  return (
    <div className="mt-8 space-y-4 text-center text-sm">
      <p className="text-foreground/60">
        By signing in, you agree to our{' '}
        <Link to="/terms" className="text-accent hover:text-accent/80 font-medium transition-colors">
          Terms of Service
        </Link>
      </p>
      <p className="text-foreground/40 text-xs">
        Version {staticConfig.version} • © {new Date().getFullYear()} {staticConfig.legalName}. All rights reserved.
      </p>
    </div>
  )
}

