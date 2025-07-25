import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateClaudeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname === 'claude.ai' && 
           (urlObj.pathname.startsWith('/chat/') || urlObj.pathname.startsWith('/public/artifacts/'))
  } catch {
    return false
  }
}

export function sanitizeText(text: string): string {
  return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
             .replace(/<[^>]*>?/gm, '')
             .trim()
}

export function validateSubmission(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (!data.title || data.title.length < 3 || data.title.length > 255) {
    errors.push('Title must be between 3 and 255 characters')
  }
  
  if (!data.claude_url || !isValidUrl(data.claude_url)) {
    errors.push('Must be a valid URL')
  }
  
  if (!data.category || !['mindfulness', 'distress-tolerance', 'emotion-regulation', 'interpersonal-effectiveness'].includes(data.category)) {
    errors.push('Invalid category')
  }
  
  if (!data.description || data.description.length < 10 || data.description.length > 2000) {
    errors.push('Description must be between 10 and 2000 characters')
  }
  
  if (!data.creator_name || data.creator_name.length < 2 || data.creator_name.length > 255) {
    errors.push('Creator name must be between 2 and 255 characters')
  }
  
  if (data.creator_link && !isValidUrl(data.creator_link)) {
    errors.push('Creator link must be a valid URL')
  }
  
  return { valid: errors.length === 0, errors }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

export function validateImgurUrl(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Allow common image hosting domains
    const allowedDomains = [
      'i.imgur.com',
      'imgur.com',
      'i.redd.it',
      'github.com',
      'raw.githubusercontent.com',
      'media.giphy.com',
      'i.giphy.com'
    ]
    
    const isAllowedDomain = allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    )
    
    // Must be from allowed domain OR be a direct image URL
    return isAllowedDomain || url.match(/\.(jpg|jpeg|png|gif|webp)$/i) !== null
  } catch {
    return false
  }
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getTimeAgo(date: string): string {
  const now = new Date()
  const past = new Date(date)
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`
  return `${Math.floor(diffInSeconds / 31536000)}y ago`
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Simple rate limiting for submissions
const submissionLimits = new Map<string, number>()

export function checkSubmissionLimit(ip: string): boolean {
  const now = Date.now()
  const lastSubmission = submissionLimits.get(ip) || 0
  const cooldown = 5 * 60 * 1000 // 5 minutes
  
  if (now - lastSubmission < cooldown) {
    return false
  }
  
  submissionLimits.set(ip, now)
  return true
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  if (realIP) {
    return realIP
  }
  
  return 'unknown'
}

export function generateStars(rating: number): string {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
  
  return '⭐'.repeat(fullStars) + 
         (hasHalfStar ? '⭐' : '') + 
         '☆'.repeat(emptyStars)
} 