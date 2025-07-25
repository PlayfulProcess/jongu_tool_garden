'use client'

import { Category, CATEGORIES, Tool } from '@/lib/types'

interface CategoryGridProps {
  selectedCategory: Category | null;
  onCategorySelect: (category: Category | null) => void;
  tools: Tool[];
}

export default function CategoryGrid({ selectedCategory, onCategorySelect, tools }: CategoryGridProps) {
  // Calculate category counts
  const getCategoryCount = (categoryId: Category) => {
    return tools.filter(tool => tool.category === categoryId).length
  }
  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        Browse by Category
      </h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {/* All Categories Button */}
        <div
          onClick={() => onCategorySelect(null)}
          className={`category-card ${
            selectedCategory === null 
              ? 'border-primary-500 bg-primary-50' 
              : ''
          }`}
        >
          <span className="text-4xl mb-4 block">🌟</span>
          <div className="font-semibold text-gray-800 mb-2">
            All Tools
          </div>
          <div className="text-gray-500 text-sm">
            View all
          </div>
        </div>
        
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
              {getCategoryCount(category.id)} tools
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 