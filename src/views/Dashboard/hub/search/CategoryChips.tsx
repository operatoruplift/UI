import React from 'react'

interface CategoryChipsProps {
  categories: string[]
  selectedType: string | null
  onSelect: (category: string | null) => void
}

export const CategoryChips: React.FC<CategoryChipsProps> = ({ 
  categories, 
  selectedType, 
  onSelect 
}) => {
  return (
    <div className="flex items-center gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(selectedType === cat ? null : cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
            selectedType === cat
              ? 'bg-primary/20 text-primary border border-primary'
              : 'bg-foreground/5 border border-foreground/10 text-foreground hover:bg-foreground/10'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}

