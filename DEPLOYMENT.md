# Deployment Guide - Jongu Tool Garden

This guide will walk you through deploying the Jongu Tool Garden to Vercel and Supabase.

## Prerequisites

- GitHub account
- Vercel account (free)
- Supabase account (free tier available)

## Step 1: Set Up Supabase

### 1.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `jongu-tool-garden` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for setup to complete (2-3 minutes)

### 1.2 Get API Keys

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key
   - **service_role** key (keep this secret!)

### 1.3 Set Up Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click "New query"
3. Copy and paste the entire SQL schema from the README.md file
4. Click "Run" to execute the schema

**Important**: This creates all tables, indexes, and security policies.

### 1.4 Verify Setup

1. Go to **Table Editor**
2. You should see three tables: `tools`, `ratings`, `submissions`
3. Check that Row Level Security (RLS) is enabled on all tables

## Step 2: Prepare Your Code

### 2.1 Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/jongu-tool-garden.git
git branch -M main
git push -u origin main
```

### 2.2 Environment Variables

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Admin Configuration
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_admin_password

# Optional: Email notifications
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=your_email@example.com
```

**Replace the values** with your actual Supabase credentials from Step 1.2.

## Step 3: Deploy to Vercel

### 3.1 Connect Repository

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 3.2 Configure Project

1. **Project Name**: `jongu-tool-garden` (or your preferred name)
2. **Framework Preset**: Next.js (should be auto-detected)
3. **Root Directory**: `./` (leave as default)
4. **Build Command**: `npm run build` (should be auto-detected)
5. **Output Directory**: `.next` (should be auto-detected)
6. **Install Command**: `npm install` (should be auto-detected)

### 3.3 Add Environment Variables

1. Before deploying, click "Environment Variables"
2. Add each variable from your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_supabase_service_role_key
NEXT_PUBLIC_ADMIN_PASSWORD = your_admin_password
```

3. Click "Add" for each variable
4. Make sure they're added to **Production**, **Preview**, and **Development**

### 3.4 Deploy

1. Click "Deploy"
2. Wait for build to complete (2-3 minutes)
3. Your app will be live at `https://your-project-name.vercel.app`

## Step 4: Test Your Deployment

### 4.1 Test Main Features

1. **Homepage**: Visit your Vercel URL
2. **Tool Submission**: Try submitting a test tool
3. **Admin Panel**: Visit `/admin` and login with your password
4. **Database**: Check Supabase dashboard to see if data is being saved

### 4.2 Test Admin Functions

1. Go to `https://your-domain.vercel.app/admin`
2. Login with your admin password
3. You should see any pending submissions
4. Test approve/reject functionality

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain

1. In Vercel dashboard, go to **Settings** → **Domains**
2. Add your domain (e.g., `toolgarden.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 24 hours)

### 5.2 SSL Certificate

Vercel automatically provides SSL certificates for all domains.

## Step 6: Monitoring & Maintenance

### 6.1 Vercel Monitoring

- **Analytics**: Built-in analytics in Vercel dashboard
- **Logs**: View function logs in Vercel dashboard
- **Performance**: Monitor Core Web Vitals

### 6.2 Supabase Monitoring

- **Database**: Monitor usage in Supabase dashboard
- **API**: View API usage and limits
- **Logs**: Check database logs for errors

### 6.3 Regular Tasks

1. **Review Submissions**: Check `/admin` regularly
2. **Monitor Usage**: Check Supabase usage limits
3. **Backup**: Supabase handles backups automatically
4. **Updates**: Keep dependencies updated

## Troubleshooting

### Common Issues

#### 1. Environment Variables Not Working

**Problem**: App shows "Failed to fetch tools"
**Solution**: 
- Check Vercel environment variables are set correctly
- Verify Supabase URL and keys are correct
- Check browser console for errors

#### 2. Database Connection Issues

**Problem**: Can't connect to Supabase
**Solution**:
- Verify RLS policies are set up correctly
- Check if tables exist in Supabase dashboard
- Ensure API keys have correct permissions

#### 3. Build Failures

**Problem**: Vercel build fails
**Solution**:
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify TypeScript types are correct

#### 4. Admin Panel Not Working

**Problem**: Can't access admin panel
**Solution**:
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` is set
- Verify password in environment variables
- Check browser console for errors

### Getting Help

1. **Vercel Support**: [vercel.com/support](https://vercel.com/support)
2. **Supabase Support**: [supabase.com/support](https://supabase.com/support)
3. **GitHub Issues**: Create issue in your repository

## Security Considerations

### 1. Environment Variables

- Never commit `.env.local` to git
- Use Vercel's environment variable system
- Rotate API keys regularly

### 2. Admin Access

- Use strong admin passwords
- Consider IP restrictions for admin panel
- Monitor admin access logs

### 3. Database Security

- RLS policies are already configured
- Monitor database access
- Regular security audits

## Performance Optimization

### 1. Vercel Optimizations

- Enable Vercel Analytics
- Use Next.js Image component
- Implement proper caching headers

### 2. Supabase Optimizations

- Monitor query performance
- Use indexes effectively
- Implement connection pooling

### 3. Frontend Optimizations

- Lazy load components
- Optimize bundle size
- Use CDN for static assets

## Cost Management

### Vercel Pricing

- **Hobby Plan**: Free for personal projects
- **Pro Plan**: $20/month for teams
- **Enterprise**: Custom pricing

### Supabase Pricing

- **Free Tier**: 500MB database, 2GB bandwidth
- **Pro Plan**: $25/month for more resources
- **Team Plan**: $599/month for teams

## Next Steps

1. **Add Analytics**: Implement Google Analytics or Vercel Analytics
2. **Email Notifications**: Set up email alerts for new submissions
3. **User Authentication**: Add user accounts and profiles
4. **Advanced Features**: Implement tool collections, favorites, etc.
5. **Mobile App**: Consider building a React Native app

---

**Your Jongu Tool Garden is now live! 🌱**

Share your platform with the wellness community and start collecting tools! 