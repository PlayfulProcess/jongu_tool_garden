'use client'

interface HeroProps {
  stats: {
    totalTools: number;
    totalRatings: number;
    avgRating: string;
  };
}

export default function Hero({ stats }: HeroProps) {
  return (
    <section className="py-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Community Emotional Wellness Tools
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Practical tools created by therapists, parents, and wellness enthusiasts. 
          Try them, rate them, share what works.
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-10 mb-12">
          <div className="text-center">
            <span className="block text-4xl font-bold text-primary-600">
              {stats.totalTools}
            </span>
            <span className="text-gray-600 text-sm">Community Tools</span>
          </div>
          
          <div className="text-center">
            <span className="block text-4xl font-bold text-primary-600">
              {stats.totalRatings.toLocaleString()}
            </span>
            <span className="text-gray-600 text-sm">People Helped</span>
          </div>
          
          <div className="text-center">
            <span className="block text-4xl font-bold text-primary-600">
              {stats.avgRating}
            </span>
            <span className="text-gray-600 text-sm">Average Rating</span>
          </div>
        </div>
      </div>
    </section>
  )
} 