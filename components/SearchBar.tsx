'use client'

import { useState } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(query)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(query)
    }
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search tools by topic, feeling, or creator..."
          className="w-full max-w-2xl px-6 py-4 border-2 border-gray-200 rounded-full text-center text-lg focus:outline-none focus:border-primary-500 transition-colors"
        />
      </form>
    </div>
  )
} 