import React from 'react'

interface ResultsCountProps {
  filtered: number
  total: number
}

export const ResultsCount: React.FC<ResultsCountProps> = ({ filtered, total }) => {
  return (
    <div className="text-xs text-foreground/50">
      {filtered} of {total} agents
    </div>
  )
}

