# Vercel Environment Variables Setup

## ⚠️ **Variable Security Levels**

### ✅ **Safe to expose (NEXT_PUBLIC_)**
These are safe to be sent to the browser by design:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 🔒 **Server-side only (NO NEXT_PUBLIC_ prefix)**
These must stay secret on the server:

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
ADMIN_PASSWORD=your_secure_admin_password
RESEND_API_KEY=your_resend_api_key_here
ADMIN_EMAIL=your_email@example.com
```

## 🚀 Vercel Deployment Setup

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with the correct value:

### Required Variables:
- `NEXT_PUBLIC_SUPABASE_URL` (your Supabase project URL)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (your Supabase anon key)
- `SUPABASE_SERVICE_ROLE_KEY` (your Supabase service role key)
- `ADMIN_PASSWORD` (your admin panel password)

### Optional Variables:
- `RESEND_API_KEY` (for email notifications)
- `ADMIN_EMAIL` (admin email address)

## 🔧 Environment Targets

Set all variables for these environments:
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

## 🛡️ Security Benefits

- **Service role key** and **admin password** are server-side only
- **Public keys** (URL, anon key) are safe by design to expose
- **Only sensitive credentials** are protected
- **Simpler architecture** - no complex API configuration needed

## ✅ Verification

After deployment, check:
1. Admin login works at `/admin`
2. Tool submissions work
3. No sensitive variables in browser dev tools