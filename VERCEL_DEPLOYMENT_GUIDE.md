# Vercel Deployment Environment Variables Setup

## Required Environment Variables

Add these in your Vercel project dashboard (Settings > Environment Variables):

### Public Variables (Available to browser)
```
NEXT_PUBLIC_SUPABASE_URL=https://mvvkgteugrlbafvjfmzk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dmtndGV1Z3JsYmFmdmpmbXprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzODY3MTQsImV4cCI6MjA2ODk2MjcxNH0.C34mOkhL0lAcfMZDOsMXt84JvTcx9X-GKe3XesJFaoc
```

### Server-only Variables (NOT exposed to browser)
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12dmtndGV1Z3JsYmFmdmpmbXprIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzM4NjcxNCwiZXhwIjoyMDY4OTYyNzE0fQ.vL0rOcex4WPVdzuGXBbDKCdIDFmVU0NJqosgy3pE-qE
ADMIN_PASSWORD=isthishelpinginChristreturn?
RESEND_API_KEY=re_S5R1Gq7P_688zep6yea27crcE18Qagzny
ADMIN_EMAIL=pp@playfulprocess.com
```

## How to Add to Vercel

1. Go to your project in Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add each variable one by one:
   - Key: variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - Value: the value from above
   - Environment: Production, Preview, and Development (select all)

## Common Issues

- **404 on API routes**: Make sure all environment variables are added
- **Database connection fails**: Check SUPABASE_SERVICE_ROLE_KEY is set correctly
- **Admin panel 401 error**: Verify ADMIN_PASSWORD matches your local
- **Image uploads fail**: Ensure NEXT_PUBLIC_* variables are set

## Testing

After deployment, test:
1. Visit `/api/debug` to check if environment variables are loaded
2. Try submitting a tool to test database connection
3. Access admin panel at `/admin` with the password

## Security Note

The PUBLIC variables are safe to expose as they're designed for browser use. The SERVICE_ROLE_KEY and ADMIN_PASSWORD should never be committed to git or exposed to the browser.