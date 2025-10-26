# How to Add Environment Variables in Vercel

## Step-by-Step with Screenshots Guide

### Step 1: Get Your Supabase Credentials

#### In Supabase Dashboard:

1. **Login to [supabase.com](https://supabase.com)**

2. **Select your project** (or create a new one)

3. **Click on the gear icon** (⚙️) on the left sidebar - This is "Settings"

4. **Click on "API"** from the settings menu

5. You'll see a page with:
   - **Project URL**: Something like `https://abcdefg.supabase.co`
   - **anon public**: A long key starting with `eyJhbGci...`

6. **Copy BOTH values**

---

### Step 2: Add to Vercel

#### In Vercel Dashboard:

1. **Go to [vercel.com](https://vercel.com)** and login

2. **Select your DailyOps+ project**

3. **Click "Settings"** (top menu bar)

4. **Click "Environment Variables"** (left sidebar)

5. **Click "Add New"** button

6. **Add First Variable:**
   ```
   Key: SUPABASE_URL
   Value: (paste your Project URL from Supabase)
   Environment: ☑ Production ☑ Preview ☑ Development
   ```
   Click **Save**

7. **Click "Add New"** again

8. **Add Second Variable:**
   ```
   Key: SUPABASE_ANON_KEY
   Value: (paste your anon public key from Supabase)
   Environment: ☑ Production ☑ Preview ☑ Development
   ```
   Click **Save**

9. **You're done!** Now redeploy

---

### Step 3: Redeploy

1. In Vercel, go to **"Deployments"** tab
2. Click the **three dots** (...) on the latest deployment
3. Click **"Redeploy"**
4. Wait for it to finish

---

### Step 4: Verify Connection

1. Visit your deployed app
2. Try to register with a real email
3. If it works, you're connected to Supabase!

---

## Quick Checklist

✅ Copied SUPABASE_URL from Supabase  
✅ Copied SUPABASE_ANON_KEY from Supabase  
✅ Added SUPABASE_URL to Vercel  
✅ Added SUPABASE_ANON_KEY to Vercel  
✅ Checked all environments (Production, Preview, Development)  
✅ Redeployed the app  

---

## What Happens Automatically

Once you add these two environment variables and redeploy:
- ✅ App automatically connects to Supabase
- ✅ Authentication uses Supabase
- ✅ Data is stored in your Supabase database
- ✅ User data persists across sessions
- ✅ Integrations are saved to the database

**No code changes needed!** It all works automatically.

---

## Troubleshooting

**Q: I added the variables but still in demo mode**
A: Make sure you redeployed after adding the variables

**Q: Where do I see my environment variables in Vercel?**
A: Settings → Environment Variables

**Q: Can I test locally with these same values?**
A: Yes! Create a `.env` file in the root directory:
```
SUPABASE_URL=your-project-url
SUPABASE_ANON_KEY=your-anon-key
```

**Q: Do I need to run SQL in Supabase first?**
A: Yes! Go to SQL Editor in Supabase and run the SQL from `SUPABASE_SETUP.md`

