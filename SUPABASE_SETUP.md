# Supabase Setup Guide for DailyOps+

## What You Need to Add to Make it Work with Supabase

Follow these simple steps:

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account (if you don't have one)
3. Click "New Project"
4. Fill in:
   - **Project Name**: dailyops-plus (or any name you want)
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
5. Click "Create new project"
6. Wait 2-3 minutes for the project to be ready

## Step 2: Get Your Credentials

Once your project is ready:

1. Click on your project
2. Go to **Settings** (gear icon on the left sidebar)
3. Click on **API** in the settings menu
4. You'll see two important values:

### Required Values:
- **Project URL**: Something like `https://abcdefghijklmnop.supabase.co`
- **anon public key**: A long string starting with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ...`

Copy both of these values!

## Step 3: Add to Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Click **Settings** (top menu)
3. Click **Environment Variables** (left sidebar)
4. Add these **two** variables:

### Variable 1:
- **Key**: `SUPABASE_URL`
- **Value**: Your Project URL (from Step 2)
- **Environment**: Production, Preview, Development (select all three)
- Click **Save**

### Variable 2:
- **Key**: `SUPABASE_ANON_KEY`
- **Value**: Your anon public key (from Step 2)
- **Environment**: Production, Preview, Development (select all three)
- Click **Save**

## Step 4: Create Database Tables

1. In Supabase, click **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy and paste this SQL code:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  config JSONB DEFAULT '{}',
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  tags TEXT[] DEFAULT '{}',
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create focus_sessions table
CREATE TABLE IF NOT EXISTS focus_sessions (
  id SERIAL PRIMARY KEY,
  duration INTEGER NOT NULL,
  task_id INTEGER REFERENCES tasks(id),
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  user_id UUID REFERENCES auth.users,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE focus_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policies for integrations
CREATE POLICY "Users can view their own integrations"
  ON integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations"
  ON integrations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations"
  ON integrations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations"
  ON integrations FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for tasks
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for focus_sessions
CREATE POLICY "Users can view their own focus sessions"
  ON focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own focus sessions"
  ON focus_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own focus sessions"
  ON focus_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own focus sessions"
  ON focus_sessions FOR DELETE
  USING (auth.uid() = user_id);
```

4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 5: Redeploy Your App

1. In Vercel dashboard, go to **Deployments**
2. Find your latest deployment
3. Click the **three dots** menu (...)
4. Click **Redeploy**
5. Wait for deployment to complete

## Step 6: Test It!

1. Go to your deployed app URL
2. Click "Register" or "Login"
3. Create an account with a real email
4. You should now be able to:
   - Log in with your account
   - Have persistent sessions
   - Store integrations and data in Supabase

## Summary

**What to add to Vercel:**
1. `SUPABASE_URL` = Your Supabase project URL
2. `SUPABASE_ANON_KEY` = Your Supabase anon key

**That's it!** The app will automatically connect when these are added and you redeploy.

## Troubleshooting

**"Still showing demo mode":**
- Make sure you added BOTH environment variables
- Make sure you saved them in Vercel
- Make sure you redeployed after adding them

**"Database errors":**
- Make sure you ran the SQL script in Step 4
- Check that it completed successfully

**"Can't register":**
- Check Supabase logs: Go to Authentication → Logs in Supabase
- Make sure you used a valid email

## Quick Reference

Where to find Supabase values:
- **URL**: Supabase Dashboard → Settings → API → Project URL
- **Key**: Supabase Dashboard → Settings → API → anon/public key

Where to add in Vercel:
- Vercel Dashboard → Your Project → Settings → Environment Variables

