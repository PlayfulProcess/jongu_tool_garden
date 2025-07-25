'use client'

interface HeroProps {
  stats: {
    totalTools: number;
    avgRating: string;
  };
}

export default function Hero({ stats }: HeroProps) {
  return (
    <section className="py-16 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text">
          Community Wellness Tool Garden
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Discover wellness tools organized by DBT skills: Mindfulness practices, Distress Tolerance techniques, 
          Emotion Regulation guides, and Interpersonal Effectiveness builders. Journaling apps, creativity prompts, 
          relationship boosters, and therapeutic exercises. Created by real people for real people.
        </p>
        
        <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
          🌟 Open source • Community-driven • For everyone, by everyone<br/>
          <em>Building gateways, not gatekeepers</em>
        </p>
        
        <div className="flex flex-col md:flex-row justify-center gap-16 mb-12">
          <div className="text-center">
            <span className="block text-4xl font-bold text-primary-600">
              {stats.totalTools}
            </span>
            <span className="text-gray-600 text-sm">Community Tools</span>
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