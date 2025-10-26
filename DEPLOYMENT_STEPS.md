# Simple Deployment Steps for DailyOps+

## What Changed?
The app now works **WITHOUT** Supabase initially. You can deploy to Vercel first, then add Supabase credentials later when ready.

## Step 1: Deploy to Vercel (No Supabase Required!)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "DailyOps+ - Ready for Vercel"
   git remote add origin https://github.com/YOUR-USERNAME/dailyops-plus.git
   git push -u origin main
   ```

2. **Go to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository

3. **Configure the project:**
   - Framework Preset: Leave as "Other" (or "Python" if available)
   - Root Directory: Leave as `.` (root)
   - Build Command: Leave empty
   - Output Directory: Leave empty
   - Install Command: `pip install -r requirements.txt`

4. **Environment Variables:**
   - Don't add any environment variables yet
   - The app will run in "demo mode" without Supabase

5. **Click Deploy!**
   - Wait for the deployment to complete
   - Your app will be live at `https://your-project.vercel.app`

## Step 2: Test Your Deployment

1. Visit your deployed URL
2. Click "Login" - use any email/password (it will create a mock user)
3. Navigate to Settings
4. Try adding an integration (data won't persist, but UI works)

## Step 3: When Ready - Add Supabase (Optional)

### Create Supabase Project:
1. Go to [supabase.com](https://supabase.com)
2. Create a free account and project
3. Wait for the project to be ready (takes ~2 minutes)

### Get Your Credentials:
1. In Supabase dashboard, go to Settings → API
2. Copy:
   - **Project URL** (e.g., `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Update Vercel Environment Variables:
1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these two variables:
   - Key: `SUPABASE_URL`
     Value: Your Supabase project URL
   - Key: `SUPABASE_ANON_KEY`
     Value: Your anon key
4. Save and redeploy

### Create Database Tables:
1. In Supabase dashboard, go to "SQL Editor"
2. Click "New Query"
3. Run the SQL from `DEPLOYMENT.md` (the schema creation script)
4. Wait for it to complete successfully

### Redeploy:
1. In Vercel, go to "Deployments"
2. Click the "..." menu on the latest deployment
3. Click "Redeploy"

## That's It!

Your app will now:
- Use real authentication when Supabase is configured
- Store data in Supabase database
- Use persistent sessions

If Supabase is not configured, it runs in demo mode with mock authentication.

## Troubleshooting

**Deployment fails:**
- Check the Vercel deployment logs
- Make sure all files are committed to git

**Can't login:**
- If Supabase not configured, use any email/password
- If Supabase is configured, use a real email to register

**API routes not working:**
- Check that `vercel.json` is in your root directory
- Make sure the routes are configured correctly

## Notes

- The app works fine without Supabase initially
- Mock authentication is used when Supabase credentials are missing
- You can add Supabase anytime without redeploying
- Just add the environment variables and redeploy

