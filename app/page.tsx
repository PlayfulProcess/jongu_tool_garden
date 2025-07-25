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
      console.log('Loaded tools:', toolsData.length, toolsData)
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

  const handleCategorySelect = (category: Category | null) => {
    setSelectedCategory(category)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }


  const handleToolSubmit = async (formData: any) => {
    try {
      const success = await db.submitTool(formData)
      if (success) {
        alert('🎉 Thank you! Your tool has been submitted and will appear once reviewed (usually within 1 week).')
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
    avgRating: tools.length > 0 
      ? (tools.reduce((sum, tool) => sum + tool.avg_rating * tool.total_ratings, 0) / Math.max(tools.reduce((sum, tool) => sum + tool.total_ratings, 0), 1)).toFixed(1)
      : '0.0'
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main>
        <Hero stats={stats} />
        
        <section id="categories" className="mb-16">
          <div className="container mx-auto px-4">
            <CategoryGrid 
              selectedCategory={selectedCategory}
              onCategorySelect={handleCategorySelect}
            />
          </div>
        </section>

        <section id="tools" className="mb-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-3xl font-bold text-gray-800">
                Community Tools
              </h2>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'rating' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📊 By Rating
                </button>
                <button 
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'newest' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📅 Newest
                </button>
                <button 
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === 'popular' 
                      ? 'bg-primary-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔥 Popular
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <SearchBar onSearch={handleSearch} />
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

      <section id="submit" className="bg-white py-16 mt-16">
        <div className="container mx-auto px-4">
          <SubmissionForm onSubmit={handleToolSubmit} />
        </div>
      </section>

      <footer className="text-center py-10 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 mb-2">
            &copy; 2025 Jongu Tool Garden. Community-powered emotional wellness.
          </p>
          <p className="text-gray-500 text-sm mb-2">
            Built by{' '}
            <a 
              href="https://www.playfulprocess.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline font-medium"
            >
              PlayfulProcess
            </a>
            {' '}• Open source • Building gateways, not gatekeepers
          </p>
          <p className="text-gray-500 text-sm mb-2">
            🚧 Beta Version - We're constantly improving and adding new features
          </p>
          <p className="text-gray-500 text-sm">
            <a 
              href="https://www.playfulprocess.com/contact/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Contact Us
            </a>
            {' • '}
            <a 
              href="https://github.com/PlayfulProcess/jongu_tool_garden" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
} 