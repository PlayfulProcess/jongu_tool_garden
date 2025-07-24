export interface Tool {
  id: string;
  title: string;
  claude_url: string;
  category: string;
  description: string;
  creator_name: string;
  creator_link?: string;
  creator_background?: string;
  thumbnail_url?: string;
  avg_rating: number;
  total_ratings: number;
  view_count: number;
  click_count: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  title: string;
  claude_url: string;
  category: string;
  description: string;
  creator_name: string;
  creator_link?: string;
  creator_background?: string;
  thumbnail_url?: string;
  reviewed: boolean;
  approved: boolean;
  created_at: string;
}

export interface Rating {
  id: string;
  tool_id: string;
  user_ip: string;
  rating: number;
  review_text?: string;
  created_at: string;
}

export interface SubmissionFormData {
  title: string;
  claude_url: string;
  category: string;
  description: string;
  creator_name: string;
  creator_link?: string;
  creator_background?: string;
  thumbnail_url?: string;
}

export type Category = 'anxiety' | 'mood' | 'relationships' | 'parenting' | 'mindfulness' | 'growth';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  anxiety: {
    id: 'anxiety',
    name: 'Anxiety & Stress',
    icon: '😰',
    count: 32,
    description: 'Tools for managing anxiety and stress'
  },
  mood: {
    id: 'mood',
    name: 'Mood & Depression',
    icon: '🌧️',
    count: 18,
    description: 'Tools for improving mood and managing depression'
  },
  relationships: {
    id: 'relationships',
    name: 'Relationships',
    icon: '💕',
    count: 24,
    description: 'Tools for building and maintaining healthy relationships'
  },
  parenting: {
    id: 'parenting',
    name: 'Parenting & Family',
    icon: '👨‍👩‍👧‍👦',
    count: 29,
    description: 'Tools for parents and family dynamics'
  },
  mindfulness: {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: '🧘',
    count: 25,
    description: 'Mindfulness and meditation practices'
  },
  growth: {
    id: 'growth',
    name: 'Personal Growth',
    icon: '✨',
    count: 19,
    description: 'Tools for personal development and growth'
  }
}; 