import React from 'react'
import { Filter } from 'lucide-react'
import { CategoryChips } from '../search'

interface FilterSectionProps {
  categories: string[]
  selectedType: string | null
  onSelectType: (type: string | null) => void
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  categories,
  selectedType,
  onSelectType,
}) => {
  return (
    <div className="flex items-center gap-2">
      <Filter size={14} className="text-foreground/60 flex-shrink-0" />
      <CategoryChips 
        categories={categories} 
        selectedType={selectedType} 
        onSelect={onSelectType} 
      />
    </div>
  )
}

