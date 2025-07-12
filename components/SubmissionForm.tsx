'use client'

import { useState } from 'react'
import { SubmissionFormData, CATEGORIES } from '@/lib/types'
import { validateClaudeUrl, validateImgurUrl } from '@/lib/utils'

interface SubmissionFormProps {
  onSubmit: (data: SubmissionFormData) => Promise<boolean>;
}

export default function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [formData, setFormData] = useState<SubmissionFormData>({
    title: '',
    claude_url: '',
    category: '',
    description: '',
    creator_name: '',
    creator_link: '',
    creator_background: '',
    thumbnail_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: keyof SubmissionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Tool title is required'
    }

    if (!formData.claude_url.trim()) {
      newErrors.claude_url = 'Claude URL is required'
    } else if (!validateClaudeUrl(formData.claude_url)) {
      newErrors.claude_url = 'Please enter a valid Claude.ai URL'
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.creator_name.trim()) {
      newErrors.creator_name = 'Creator name is required'
    }

    if (formData.thumbnail_url && !validateImgurUrl(formData.thumbnail_url)) {
      newErrors.thumbnail_url = 'Please enter a valid Imgur URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      const success = await onSubmit(formData)
      if (success) {
        setFormData({
          title: '',
          claude_url: '',
          category: '',
          description: '',
          creator_name: '',
          creator_link: '',
          creator_background: '',
          thumbnail_url: ''
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Share Your Tool
        </h2>
        <p className="text-xl text-gray-600">
          Created something helpful? Share it with the community. Whether you're a therapist, 
          student, parent, or wellness enthusiast - if it helps people, we want it here.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Tool Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="e.g., Anxiety Breathing Reset"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.title ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Claude Artifact URL
          </label>
          <input
            type="url"
            value={formData.claude_url}
            onChange={(e) => handleChange('claude_url', e.target.value)}
            placeholder="https://claude.ai/chat/..."
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.claude_url ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          />
          {errors.claude_url && <p className="text-red-500 text-sm mt-1">{errors.claude_url}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.category ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          >
            <option value="">Select a category...</option>
            {Object.values(CATEGORIES).map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="What does this tool help with? Who is it for? How long does it take?"
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors resize-vertical ${
              errors.description ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Your Name/Handle
          </label>
          <input
            type="text"
            value={formData.creator_name}
            onChange={(e) => handleChange('creator_name', e.target.value)}
            placeholder="e.g., Sarah M., Dr. Chen, Alex the Mindfulness Teacher"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.creator_name ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          />
          {errors.creator_name && <p className="text-red-500 text-sm mt-1">{errors.creator_name}</p>}
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Your Website/Social Media (Optional)
          </label>
          <input
            type="url"
            value={formData.creator_link}
            onChange={(e) => handleChange('creator_link', e.target.value)}
            placeholder="e.g., your website, LinkedIn, Instagram, or booking page"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
          />
          <p className="text-gray-500 text-sm mt-1">
            💡 When people click your name, they'll go here. Leave blank if you prefer no contact.
          </p>
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Your Background (Optional)
          </label>
          <input
            type="text"
            value={formData.creator_background}
            onChange={(e) => handleChange('creator_background', e.target.value)}
            placeholder="e.g., MFT Student, Licensed Therapist, Parent, Coach, etc."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-2">
            Tool Thumbnail (Optional)
          </label>
          <input
            type="url"
            value={formData.thumbnail_url}
            onChange={(e) => handleChange('thumbnail_url', e.target.value)}
            placeholder="Imgur link (e.g., https://i.imgur.com/abc123.png)"
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.thumbnail_url ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          />
          <p className="text-gray-500 text-sm mt-1">
            💡 Upload your image to{' '}
            <a href="https://imgur.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
              imgur.com
            </a>
            {' '}and paste the direct link here. Makes your tool stand out!
          </p>
          {errors.thumbnail_url && <p className="text-red-500 text-sm mt-1">{errors.thumbnail_url}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full text-lg py-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? '🌱 Submitting...' : '🚀 Share Your Tool'}
        </button>
      </form>
    </div>
  )
} 