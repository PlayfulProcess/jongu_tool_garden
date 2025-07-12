'use client'

import { Tool } from '@/lib/types'
import { generateStars, formatRating } from '@/lib/utils'

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const handleTryTool = () => {
    // Track click
    fetch(`/api/tools/${tool.id}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'click' })
    }).catch(console.error)

    // Open tool in new tab
    window.open(tool.claude_url, '_blank')
  }

  const handleCreatorClick = () => {
    if (tool.creator_link) {
      window.open(tool.creator_link, '_blank')
    }
  }

  return (
    <div className="tool-card">
      <div 
        className={`h-40 flex items-center justify-center text-5xl relative overflow-hidden ${
          tool.thumbnail_url 
            ? 'bg-cover bg-center' 
            : 'bg-gradient-to-br from-primary-500 to-secondary-500'
        }`}
        style={tool.thumbnail_url ? { backgroundImage: `url(${tool.thumbnail_url})` } : {}}
      >
        {tool.thumbnail_url && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30" />
        )}
        <div className="relative z-10 text-white">
          {!tool.thumbnail_url && '🌸'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          {tool.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">
          {tool.description}
        </p>
        
        <div className="flex justify-between items-center mb-4 text-sm text-gray-500">
          <div 
            className={`font-medium ${
              tool.creator_link 
                ? 'text-primary-600 hover:text-primary-700 cursor-pointer hover:underline' 
                : 'text-gray-500'
            }`}
            onClick={handleCreatorClick}
          >
            Created by {tool.creator_name}
            {tool.creator_background && ` (${tool.creator_background})`}
          </div>
          <span>⏱️ 5 min</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-yellow-500">{generateStars(tool.avg_rating)}</span>
          <span className="text-sm text-gray-600">
            {formatRating(tool.avg_rating)} ({tool.total_ratings} people)
          </span>
        </div>
        
        <button 
          onClick={handleTryTool}
          className="btn-primary w-full"
        >
          🌟 Try This Tool
        </button>
      </div>
    </div>
  )
} 