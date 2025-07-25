'use client'

export default function Header() {
  return (
    <header className="glass sticky top-0 z-50 border-b border-gray-200/20 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-5">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🌱</span>
            <span className="text-2xl font-bold gradient-text">
              Jongu Tool Garden
            </span>
          </div>
          
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#tools" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Browse Tools
            </a>
            <a href="#categories" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Categories
            </a>
            <a href="#submit" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              Share a Tool
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 font-medium transition-colors">
              About
            </a>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
} 