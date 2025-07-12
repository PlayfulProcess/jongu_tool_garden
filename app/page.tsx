'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import SearchBar from '@/components/SearchBar'
import CategoryGrid from '@/components/CategoryGrid'
import ToolGrid from '@/components/ToolGrid'
import SubmissionForm from '@/components/SubmissionForm'
import { Tool, Category } from '@/lib/types'
import { db } from '@/lib/supabase'

export default function HomePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [filteredTools, setFilteredTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'popular'>('rating')

  useEffect(() => {
    loadTools()
  }, [])

  useEffect(() => {
    filterAndSortTools()
  }, [tools, selectedCategory, searchQuery, sortBy])

  const loadTools = async () => {
    try {
      const toolsData = await db.getTools({ sort: sortBy })
      setTools(toolsData)
    } catch (error) {
      console.error('Error loading tools:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortTools = () => {
    let filtered = [...tools]

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(tool =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.creator_name.toLowerCase().includes(query)
      )
    }

    // Sort tools
    if (sortBy === 'rating') {
      filtered.sort((a, b) => b.avg_rating - a.avg_rating)
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === 'popular') {
      filtered.sort((a, b) => b.total_ratings - a.total_ratings)
    }

    setFilteredTools(filtered)
  }

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(selectedCategory === category ? null : category)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleSortChange = () => {
    const sortOptions: Array<'rating' | 'newest' | 'popular'> = ['rating', 'newest', 'popular']
    const currentIndex = sortOptions.indexOf(sortBy)
    const nextIndex = (currentIndex + 1) % sortOptions.length
    setSortBy(sortOptions[nextIndex])
  }

  const handleToolSubmit = async (formData: any) => {
    try {
      const success = await db.submitTool(formData)
      if (success) {
        alert('🎉 Thank you! Your tool has been submitted and will appear once reviewed (usually within 24 hours).')
        return true
      } else {
        alert('❌ There was an error submitting your tool. Please try again.')
        return false
      }
    } catch (error) {
      console.error('Error submitting tool:', error)
      alert('❌ There was an error submitting your tool. Please try again.')
      return false
    }
  }

  const stats = {
    totalTools: tools.length,
    totalRatings: tools.reduce((sum, tool) => sum + tool.total_ratings, 0),
    avgRating: tools.length > 0 
      ? (tools.reduce((sum, tool) => sum + tool.avg_rating, 0) / tools.length).toFixed(1)
      : '0.0'
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero stats={stats} />
        
        <section className="mb-12">
          <div className="container mx-auto px-4">
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>

        <section className="mb-16">
          <div className="container mx-auto px-4">
            <CategoryGrid 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </section>

        <section className="mb-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 text-center">
                Community Tools
              </h2>
              <button 
                onClick={handleSortChange}
                className="btn-secondary"
              >
                {sortBy === 'rating' && '📊 Sort by Rating'}
                {sortBy === 'newest' && '📅 Sort by Newest'}
                {sortBy === 'popular' && '🔥 Sort by Popular'}
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading tools...</p>
              </div>
            ) : (
              <ToolGrid tools={filteredTools} />
            )}
          </div>
        </section>
      </main>

      <section className="bg-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <SubmissionForm onSubmit={handleToolSubmit} />
        </div>
      </section>

      <footer className="text-center py-10 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-gray-600">
            &copy; 2025 Jongu Tool Garden. Community-powered emotional wellness. Free for everyone, forever.
          </p>
        </div>
      </footer>
    </div>
  )
} 