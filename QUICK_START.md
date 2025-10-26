# Quick Start Guide - DailyOps+

## 🚀 Fastest Path to Deployment

### Option A: Deploy Without Supabase (Easiest - 5 minutes)

**Just to get the app running:**
1. Push code to GitHub
2. Deploy to Vercel
3. Done! App works in demo mode

**Steps:**
```bash
# In your project directory
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR-USERNAME/dailyops-plus.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy"

**That's it!** App is live. Use any email/password to login (demo mode).

---

### Option B: Deploy WITH Supabase (Full Features - 15 minutes)

**For persistent data and real authentication:**

#### 1. Deploy to Vercel First (Option A above)

#### 2. Add Supabase (Add Environment Variables)

**What you need to add to Vercel:**

| Variable Name | Where to Find It |
|--------------|-----------------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API → Project URL |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API → anon public key |

**How to add:**
1. In Vercel → Your Project → Settings → Environment Variables
2. Add both variables above
3. Check all environments (Production, Preview, Development)
4. Redeploy

#### 3. Create Database Tables

In Supabase:
1. Go to SQL Editor
2. Run the SQL from `DEPLOYMENT.md`
3. Done!

---

## 📋 Environment Variables Reference

### Required for Full Features (Supabase):

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `SUPABASE_URL` | `https://xxx.supabase.co` | Supabase Dashboard → Settings → API |
| `SUPABASE_ANON_KEY` | `eyJhbG...` (long string) | Supabase Dashboard → Settings → API |

### Optional for Integrations:

You can add integrations via UI, or add these for default config:
- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `GRAFANA_BASE_URL`
- `GRAFANA_API_KEY`
- `SLACK_WEBHOOK_URL`

---

## 📁 Files You Should Read

1. **DEPLOYMENT_STEPS.md** - Simple deployment steps
2. **SUPABASE_SETUP.md** - Detailed Supabase setup
3. **VERCEL_ENV_SETUP.md** - How to add environment variables
4. **DEPLOYMENT.md** - Complete setup with SQL

---

## 🎯 Summary

**Minimum to deploy:** Just push to Vercel (no environment variables needed)

**To enable full features:** Add 2 environment variables (SUPABASE_URL and SUPABASE_ANON_KEY)

**Everything else:** Configured via the UI in the Settings page

---

## ✅ After Deployment

Your app will be at: `https://your-project-name.vercel.app`

**Pages available:**
- `/` - DailyOps Dashboard
- `/focus.html` - Focus timer
- `/settings.html` - Settings and integrations

**Test:**
1. Click Login
2. Use any email/password (in demo mode)
3. Navigate around
4. Check Settings page

**Once you add Supabase:**
- Real authentication
- Persistent data
- User accounts
- Saved integrations

---

## 🆘 Need Help?

- Check `DEPLOYMENT_STEPS.md` for deployment
- Check `SUPABASE_SETUP.md` for Supabase setup  
- Check `VERCEL_ENV_SETUP.md` for environment variables
- Check logs in Vercel dashboard if something fails

---

**You're ready to go!** 🚀

