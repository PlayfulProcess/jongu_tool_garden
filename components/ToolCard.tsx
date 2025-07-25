'use client'

import { useState } from 'react'
import { Tool } from '@/lib/types'
import { generateStars, formatRating } from '@/lib/utils'

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [showRating, setShowRating] = useState(false)
  const [selectedRating, setSelectedRating] = useState(0)
  const [isSubmittingRating, setIsSubmittingRating] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Convert Imgur URL to direct image URL
  const getDirectImageUrl = (url: string | undefined) => {
    if (!url) return undefined
    
    try {
      const urlObj = new URL(url)
      
      // If it's already a direct i.imgur.com URL, use it
      if (urlObj.hostname === 'i.imgur.com' && url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return url
      }
      
      // If it's an imgur.com URL, convert to direct image URL
      if (urlObj.hostname === 'imgur.com') {
        // Handle imgur.com/xyz format (single image)
        const match = urlObj.pathname.match(/^\/([a-zA-Z0-9]+)$/)
        if (match) {
          return `https://i.imgur.com/${match[1]}.jpg`
        }
        
        // Handle imgur.com/a/xyz format (album - use first image)
        const albumMatch = urlObj.pathname.match(/^\/a\/([a-zA-Z0-9]+)$/)
        if (albumMatch) {
          // For albums, we can't easily get the first image without API
          // Return undefined to fall back to gradient
          return undefined
        }
      }
      
      // If it's already a direct image URL from any domain, use it
      if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        return url
      }
      
      return undefined
    } catch (error) {
      console.error('Error parsing image URL:', error)
      return undefined
    }
  }

  const thumbnailUrl = getDirectImageUrl(tool.thumbnail_url)
  
  // Debug logging
  console.log('Tool:', tool.title, 'Original URL:', tool.thumbnail_url, 'Processed URL:', thumbnailUrl)

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

  const handleRateClick = () => {
    setShowRating(!showRating)
  }

  const handleStarClick = async (rating: number) => {
    if (isSubmittingRating) return
    
    setSelectedRating(rating)
    setIsSubmittingRating(true)

    try {
      const response = await fetch(`/api/tools/${tool.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating })
      })

      if (response.ok) {
        alert('✨ Thank you for rating this tool!')
        setShowRating(false)
        // Reload the page to update the rating display
        window.location.reload()
      } else {
        const error = await response.json()
        alert('Error submitting rating: ' + (error.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Error submitting rating. Please try again.')
    } finally {
      setIsSubmittingRating(false)
      setSelectedRating(0)
    }
  }

  return (
    <div className="tool-card">
      <div className="h-40 flex items-center justify-center text-5xl relative overflow-hidden bg-gradient-to-br from-primary-500 to-secondary-500">
        {thumbnailUrl && !imageError ? (
          <>
            <img 
              src={thumbnailUrl}
              alt={tool.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => {
                console.log('Image failed to load:', thumbnailUrl)
                setImageError(true)
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', thumbnailUrl)
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30" />
          </>
        ) : (
          <div className="relative z-10 text-white">
            🌸
          </div>
        )}
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
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500">{generateStars(tool.avg_rating)}</span>
            <span className="text-sm text-gray-600">
              {formatRating(tool.avg_rating)} ({tool.total_ratings} people)
            </span>
          </div>
          <button 
            onClick={handleRateClick}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            ⭐ Rate
          </button>
        </div>

        {showRating && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 mb-2">How would you rate this tool?</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  disabled={isSubmittingRating}
                  className={`text-2xl transition-colors ${
                    selectedRating >= star || (!selectedRating && star <= (selectedRating || 0))
                      ? 'text-yellow-500'
                      : 'text-gray-300 hover:text-yellow-400'
                  } ${isSubmittingRating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  ⭐
                </button>
              ))}
            </div>
            {isSubmittingRating && (
              <p className="text-xs text-gray-500 mt-1">Submitting rating...</p>
            )}
          </div>
        )}
        
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