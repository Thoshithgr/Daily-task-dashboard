# Deployment Guide for DailyOps+

This guide will help you deploy DailyOps+ to Vercel and Supabase.

## Prerequisites

- A GitHub account
- A Vercel account (free tier available)
- A Supabase account (free tier available)
- Git installed on your machine

## Step 1: Set up Supabase

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Note down your project URL and anon key from the API settings
4. In the SQL Editor, run the following SQL to create the profiles table:

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

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own integrations"
  ON integrations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own integrations"
  ON integrations FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own tasks"
  ON tasks FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own sessions"
  ON focus_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own sessions"
  ON focus_sessions FOR ALL
  USING (auth.uid() = user_id);
```

## Step 2: Push to GitHub

1. Initialize git repository if not already done:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - DailyOps+ with settings and auth"
   ```

2. Create a new repository on GitHub

3. Push to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/dailyops-plus.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your repository
4. In the environment variables section, add:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
5. Click "Deploy"

## Step 4: Configure Vercel (if needed)

Vercel might require some adjustments for the Python backend:

1. In your Vercel project settings, go to "Functions"
2. Ensure the runtime is set to Python 3.9+
3. Update build settings if needed

## Step 5: Access your application

Once deployed, you'll get a Vercel URL (e.g., `https://your-project.vercel.app`)

## Environment Variables

Make sure to set these in Vercel:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

## Testing Locally

Before deploying, you can test locally:

1. Create a `.env` file in the root directory:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

4. Open the frontend in your browser at `http://localhost:8000` (or serve it with a simple HTTP server)

## Features Included

✅ User Registration and Login
✅ Settings page with integration management
✅ UI-based configuration for Grafana, Jira, Slack, and Webhooks
✅ Task management
✅ Focus timer (Pomodoro)
✅ Alerts dashboard
✅ Database integration with Supabase

## Notes

- The settings page allows you to add and configure integrations without touching the backend code
- All integrations are stored securely in Supabase
- User authentication is handled by Supabase Auth
- The application is ready for production use

