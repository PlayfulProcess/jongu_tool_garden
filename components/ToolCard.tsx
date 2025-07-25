'use client'

import React, { useState } from 'react'
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
  const [imageLoading, setImageLoading] = useState(true)

  // Convert various image URLs to direct image URLs
  const getDirectImageUrl = (url: string | undefined) => {
    if (!url) return undefined
    
    try {
      const urlObj = new URL(url)
      
      // If it's already a direct image URL (any domain), use it
      if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
        return url
      }
      
      // Handle Imgur URLs
      if (urlObj.hostname === 'imgur.com' || urlObj.hostname === 'i.imgur.com') {
        // If it's already i.imgur.com, use as-is (add extension if missing)
        if (urlObj.hostname === 'i.imgur.com') {
          if (!url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
            return url + '.jpg' // Default to jpg if no extension
          }
          return url
        }
        
        // Convert imgur.com/xyz to i.imgur.com/xyz.jpg
        const match = urlObj.pathname.match(/^\/([a-zA-Z0-9]+)$/)
        if (match) {
          return `https://i.imgur.com/${match[1]}.jpg`
        }
        
        // Skip albums for now
        if (urlObj.pathname.includes('/a/')) {
          return undefined
        }
      }
      
      // Handle other image hosting services
      const imageHosts = ['i.redd.it', 'raw.githubusercontent.com', 'github.com', 'media.giphy.com', 'i.giphy.com']
      if (imageHosts.some(host => urlObj.hostname.includes(host))) {
        return url
      }
      
      return undefined
    } catch (error) {
      return undefined
    }
  }

  const thumbnailUrl = getDirectImageUrl(tool.thumbnail_url)
  
  // Debug: Log thumbnail processing
  React.useEffect(() => {
    console.log(`[${tool.title}] Original: ${tool.thumbnail_url} -> Processed: ${thumbnailUrl}`)
  }, [tool.title, tool.thumbnail_url, thumbnailUrl])

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
              onError={() => setImageError(true)}
              onLoad={() => setImageLoading(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/30 to-secondary-500/30" />
            {imageLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            )}
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