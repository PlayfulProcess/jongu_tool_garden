-- Jongu Tool Garden Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tools table (approved tools)
CREATE TABLE tools (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    claude_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    creator_name VARCHAR(255) NOT NULL,
    creator_link TEXT,
    creator_background TEXT,
    thumbnail_url TEXT,
    approved BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table (pending approval)
CREATE TABLE submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    claude_url TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    creator_name VARCHAR(255) NOT NULL,
    creator_link TEXT,
    creator_background TEXT,
    thumbnail_url TEXT,
    reviewed BOOLEAN DEFAULT false,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
    user_ip VARCHAR(45) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tool_id, user_ip)
);

-- Function to update tool ratings
CREATE OR REPLACE FUNCTION update_tool_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tools
    SET 
        avg_rating = (
            SELECT ROUND(AVG(rating)::numeric, 2)
            FROM ratings 
            WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
        ),
        total_ratings = (
            SELECT COUNT(*)
            FROM ratings 
            WHERE tool_id = COALESCE(NEW.tool_id, OLD.tool_id)
        )
    WHERE id = COALESCE(NEW.tool_id, OLD.tool_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update tool ratings
CREATE TRIGGER update_tool_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_tool_rating();

-- Function to increment counters
CREATE OR REPLACE FUNCTION increment(x INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
BEGIN
    RETURN x + 1;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) policies
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public read access to approved tools
CREATE POLICY "Public read access to approved tools" ON tools
    FOR SELECT USING (approved = true);

-- Public insert access to submissions
CREATE POLICY "Public can submit tools" ON submissions
    FOR INSERT WITH CHECK (true);

-- Public insert/update access to ratings
CREATE POLICY "Public can rate tools" ON ratings
    FOR ALL USING (true);

-- Indexes for better performance
CREATE INDEX idx_tools_category ON tools(category);
CREATE INDEX idx_tools_approved ON tools(approved);
CREATE INDEX idx_tools_created_at ON tools(created_at DESC);
CREATE INDEX idx_tools_avg_rating ON tools(avg_rating DESC);
CREATE INDEX idx_submissions_reviewed ON submissions(reviewed);
CREATE INDEX idx_ratings_tool_id ON ratings(tool_id);