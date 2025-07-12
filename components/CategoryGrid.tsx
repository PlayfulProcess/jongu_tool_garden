'use client'

import { Category, CATEGORIES } from '@/lib/types'

interface CategoryGridProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category) => void;
}

export default function CategoryGrid({ selectedCategory, onCategorySelect }: CategoryGridProps) {
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Browse by Category
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {Object.values(CATEGORIES).map((category) => (
          <div
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            className={`category-card ${
              selectedCategory === category.id 
                ? 'border-primary-500 bg-primary-50' 
                : ''
            }`}
          >
            <span className="text-4xl mb-4 block">{category.icon}</span>
            <div className="font-semibold text-gray-800 mb-2">
              {category.name}
            </div>
            <div className="text-gray-500 text-sm">
              {category.count} tools
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 