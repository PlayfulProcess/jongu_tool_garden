# Jongu Tool Garden 🌱

A community-powered platform for sharing and discovering emotional wellness tools created by therapists, parents, and wellness enthusiasts.

## Features

- **Tool Discovery**: Browse tools by category, search, and sort by rating/popularity
- **Community Submissions**: Submit your own tools for review and approval
- **Rating System**: Rate tools and see community feedback
- **Creator Profiles**: Link to creator websites and backgrounds
- **Responsive Design**: Works beautifully on desktop and mobile
- **Real-time Updates**: Live filtering and sorting

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Edge Functions)
- **Deployment**: Vercel (Frontend), Supabase (Backend)
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd jongu-tool-garden
npm install
```

### 2. Set Up Supabase

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Set Up Database Schema**
   - Go to your Supabase dashboard → SQL Editor
   - Run the following SQL:

```sql
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
```

3. **Configure Environment Variables**
   - Copy `env.example` to `.env.local`
   - Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_simple_admin_password
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables in Vercel**
   - Go to your project settings → Environment Variables
   - Add all variables from `.env.local`

### Deploy to Supabase

Your Supabase backend is already deployed! Just make sure to:

1. **Enable Row Level Security** (done in SQL above)
2. **Configure API Keys** (done in environment variables)
3. **Set up Edge Functions** (optional for email notifications)

## Project Structure

```
jongu-tool-garden/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── SearchBar.tsx
│   ├── CategoryGrid.tsx
│   ├── ToolGrid.tsx
│   ├── ToolCard.tsx
│   └── SubmissionForm.tsx
├── lib/                   # Utilities and config
│   ├── supabase.ts        # Supabase client
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Helper functions
├── public/                # Static assets
└── package.json           # Dependencies
```

## Key Features Implementation

### Tool Filtering & Search
- Client-side filtering for instant results
- Category-based filtering
- Full-text search across title, description, and creator
- Multiple sorting options (rating, newest, popular)

### Submission System
- Form validation with real-time feedback
- Rate limiting (5 minutes between submissions)
- Moderation queue for approval
- URL validation for Claude artifacts and Imgur images

### Rating System
- IP-based rating to prevent spam
- Automatic average calculation
- Star rating display
- Review text support

### Responsive Design
- Mobile-first approach
- Tailwind CSS for consistent styling
- Smooth animations and transitions
- Accessible design patterns

## Admin Interface

Access `/admin` for a simple approval interface:

- Password-protected (set in `ADMIN_PASSWORD`)
- List pending submissions
- One-click approve/reject
- Basic analytics

## Customization

### Styling
- Modify `tailwind.config.js` for theme changes
- Update `app/globals.css` for custom styles
- Use the design system in `components/`

### Categories
- Edit `lib/types.ts` to add/modify categories
- Update category icons and descriptions
- Modify the category grid layout

### Features
- Add new API routes in `app/api/`
- Extend the database schema as needed
- Add new components following the existing patterns

## Performance Optimization

### Frontend
- Next.js Image component for optimized images
- Lazy loading for tool grid
- Client-side filtering for instant results
- Optimistic UI updates

### Backend
- Database indexes on frequently queried columns
- Connection pooling via Supabase
- Rate limiting for API endpoints
- Efficient queries with proper filtering

## Monitoring & Analytics

### Built-in Metrics
- Tool view/click tracking
- Rating analytics
- Submission statistics
- User engagement metrics

### External Tools
- Vercel Analytics (optional)
- Supabase Dashboard
- Error logging via console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for your own community tool garden!

## Support

For questions or issues:
- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository

---

**Built with ❤️ for the wellness community** 