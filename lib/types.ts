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

export type Category = 'mindfulness' | 'distress-tolerance' | 'emotion-regulation' | 'interpersonal-effectiveness';

export interface CategoryInfo {
  id: Category;
  name: string;
  icon: string;
  count: number;
  description: string;
}

export const CATEGORIES: Record<Category, CategoryInfo> = {
  mindfulness: {
    id: 'mindfulness',
    name: 'Mindfulness',
    icon: '🧘',
    count: 0,
    description: 'Being present, aware, and non-judgmental in the moment'
  },
  'distress-tolerance': {
    id: 'distress-tolerance',
    name: 'Distress Tolerance',
    icon: '🛡️',
    count: 0,
    description: 'Skills to survive crises and tolerate distressing emotions'
  },
  'emotion-regulation': {
    id: 'emotion-regulation',
    name: 'Emotion Regulation',
    icon: '🎭',
    count: 0,
    description: 'Understanding and managing emotions effectively'
  },
  'interpersonal-effectiveness': {
    id: 'interpersonal-effectiveness',
    name: 'Interpersonal Effectiveness',
    icon: '🤝',
    count: 0,
    description: 'Building healthy relationships and communicating effectively'
  }
}; 