This is what I ahve pasted in the SUpabase project. Let me know if it is right and if I need to change it and next steps.

-- Tools table
CREATE TABLE tools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  claude_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('anxiety', 'mood', 'relationships', 'parenting', 'mindfulness', 'growth')),
  description TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_link TEXT,
  creator_background TEXT,
  thumbnail_url TEXT,
  avg_rating DECIMAL(2,1) DEFAULT 0,
  total_ratings INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  user_ip TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(tool_id, user_ip)
);

-- Submissions table (moderation queue)
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  claude_url TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  creator_name TEXT NOT NULL,
  creator_link TEXT,
  creator_background TEXT,
  thumbnail_url TEXT,
  submitter_ip TEXT,
  reviewed BOOLEAN DEFAULT false,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_approved ON tools(approved);
CREATE INDEX idx_tools_rating ON tools(avg_rating DESC);
CREATE INDEX idx_tools_created ON tools(created_at DESC);

-- Row Level Security (RLS) Policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Tools: Public read access for approved tools
CREATE POLICY "Public read approved tools" ON tools
  FOR SELECT USING (approved = true);

-- Ratings: Public read access
CREATE POLICY "Public read ratings" ON ratings
  FOR SELECT USING (true);

-- Ratings: Insert with rate limiting (handled in API)
CREATE POLICY "Public insert ratings" ON ratings
  FOR INSERT WITH CHECK (true);

-- Submissions: Public insert only
CREATE POLICY "Public insert submissions" ON submissions
  FOR INSERT WITH CHECK (true);

-- Function to update tool rating after new rating
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE tools SET
    avg_rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM ratings WHERE tool_id = NEW.tool_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings WHERE tool_id = NEW.tool_id
    )
  WHERE id = NEW.tool_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update ratings
CREATE TRIGGER update_tool_rating_trigger
  AFTER INSERT ON ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_tool_rating();