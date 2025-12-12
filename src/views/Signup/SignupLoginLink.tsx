import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export const SignupLoginLink: React.FC = () => {
  return (
    <Link to="/login">
      <Button variant="outline" className="w-full h-11 font-semibold border-foreground/10 hover:bg-foreground/5 transition-colors">
        Sign In
      </Button>
    </Link>
  )
}

