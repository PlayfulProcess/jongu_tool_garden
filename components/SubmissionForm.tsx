'use client'

import { useState } from 'react'
import { SubmissionFormData, CATEGORIES } from '@/lib/types'
import { validateImgurUrl } from '@/lib/utils'
import { db } from '@/lib/supabase'

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
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, thumbnail_upload: 'Please select a valid image file (JPG, PNG, GIF, WebP)' }))
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, thumbnail_upload: 'Image must be smaller than 5MB' }))
      return
    }

    setUploadingImage(true)
    setErrors(prev => ({ ...prev, thumbnail_upload: '' }))

    try {
      // Show preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)

      // Upload to Supabase
      const result = await db.uploadThumbnail(file)
      
      if (result.error) {
        setErrors(prev => ({ ...prev, thumbnail_upload: result.error || 'Upload failed' }))
        setImagePreview(null)
      } else if (result.url) {
        setFormData(prev => ({ ...prev, thumbnail_url: result.url }))
        // Clear any existing URL input
        setErrors(prev => ({ ...prev, thumbnail_url: '' }))
      }
    } catch (error) {
      console.error('Upload error:', error)
      setErrors(prev => ({ ...prev, thumbnail_upload: 'Failed to upload image. Please try again.' }))
      setImagePreview(null)
    } finally {
      setUploadingImage(false)
    }
  }

  const clearImage = () => {
    setFormData(prev => ({ ...prev, thumbnail_url: '' }))
    setImagePreview(null)
    setErrors(prev => ({ ...prev, thumbnail_upload: '', thumbnail_url: '' }))
  }

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
      newErrors.claude_url = 'Tool URL is required'
    } else if (!isValidUrl(formData.claude_url)) {
      newErrors.claude_url = 'Please enter a valid URL'
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
          Found or created something helpful? Share it with the community. Whether it's a web tool, 
          calculator, app, or worksheet - if it helps people, we want it here.
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
            Tool URL
          </label>
          <input
            type="url"
            value={formData.claude_url}
            onChange={(e) => handleChange('claude_url', e.target.value)}
            placeholder="https://example.com/your-tool..."
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
              errors.claude_url ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
            }`}
          />
          <p className="text-gray-500 text-sm mt-1">
            💡 Share any helpful tool from the internet - web tools, apps, calculators, worksheets, etc.
          </p>
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
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative">
              <img 
                src={imagePreview} 
                alt="Thumbnail preview" 
                className="w-32 h-24 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
              >
                ×
              </button>
            </div>
          )}

          {/* File Upload */}
          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage || !!formData.thumbnail_url}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {uploadingImage && (
              <div className="flex items-center mt-2 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500 mr-2"></div>
                Uploading image...
              </div>
            )}
            {errors.thumbnail_upload && <p className="text-red-500 text-sm mt-1">{errors.thumbnail_upload}</p>}
          </div>

          {/* Divider */}
          {!formData.thumbnail_url && (
            <div className="flex items-center my-4">
              <hr className="flex-1 border-gray-300" />
              <span className="px-3 text-gray-500 text-sm">or paste a URL</span>
              <hr className="flex-1 border-gray-300" />
            </div>
          )}

          {/* URL Input */}
          {!imagePreview && (
            <div>
              <input
                type="url"
                value={formData.thumbnail_url}
                onChange={(e) => handleChange('thumbnail_url', e.target.value)}
                placeholder="Direct image link (e.g., https://i.imgur.com/abc123.png)"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.thumbnail_url ? 'border-red-500' : 'border-gray-200 focus:border-primary-500'
                }`}
              />
              {errors.thumbnail_url && <p className="text-red-500 text-sm mt-1">{errors.thumbnail_url}</p>}
            </div>
          )}

          <p className="text-gray-500 text-sm mt-2">
            💡 Upload an image directly or paste a link from Imgur, GitHub, etc. Makes your tool stand out!
          </p>
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