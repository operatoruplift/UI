import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/workspace')
  }

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-2 rounded-lg hover:bg-foreground/10 transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground/70" />
        </button>
        <h1 className="text-4xl text-foreground">UpliftHub</h1>
      </div>
      <p className="text-sm max-w-md text-foreground/60">Browse and install agents to enhance your workflow</p>
    </div>
  )
}

