# 🚀 DailyOps+

Your personal productivity and work command center — for managing focus, work, and efficiency.

## 📋 Overview

DailyOps+ combines your daily DevOps/IT work overview, tracks focus time and productivity, and integrates with Jira, Grafana, and Slack for quick insights.

**✅ Ready to deploy to Vercel! Works without Supabase (add it later when needed)**

## 🎯 Features

### User Authentication
- **User Registration & Login**: Secure authentication powered by Supabase (or demo mode)
- **Demo Mode**: Works without Supabase - uses any email/password for testing
- **User Profile Management**: Store user information and preferences
- **Session Management**: Persistent login sessions

### DailyOps (Work Dashboard)
- View and manage tasks
- Display Grafana/Alertmanager alerts
- Quick Notes and Checklist
- Generate "End of Day Report" → post to Slack
- Add reminders and track progress

### FocusDesk (Productivity Mode)
- To-do list with tags (Work / Personal / Health)
- Pomodoro Timer (focus sessions)
- Daily Summary Dashboard
- Productivity analytics (hours focused, tasks done)
- Weekly streaks and goal visualization

### Settings & Integrations
- **UI-Based Configuration**: Add and manage integrations without touching backend code
- **Multiple Integration Types**: Configure Grafana, Jira, Slack, and custom webhooks
- **Test Connections**: Verify integration credentials before enabling
- **Enable/Disable Integrations**: Toggle integrations on the fly

## 🛠️ Tech Stack

- **Frontend**: HTML + Tailwind CSS + Vanilla JS
- **Backend**: Python + FastAPI
- **Database & Auth**: Supabase (PostgreSQL + authentication) - Optional
- **Hosting**: Vercel (Full-stack deployment)

## 🚀 Quick Start

### ⚡ Fastest Way (5 minutes - No Supabase)

See **QUICK_START.md** for the fastest path to deployment!

### 📚 Detailed Guides

- **DEPLOYMENT_STEPS.md** - Simple step-by-step deployment
- **SUPABASE_SETUP.md** - Setting up Supabase (when ready)
- **VERCEL_ENV_SETUP.md** - Adding environment variables

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Deploy to Vercel
# - Go to vercel.com
# - Import your repo
# - Click Deploy
# - Done!
```

### Option 2: Add Supabase Later (Optional)

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Get your URL and anon key
3. Add to Vercel environment variables
4. Run SQL schema from `DEPLOYMENT.md`
5. Redeploy

## 🚀 Local Development

### Prerequisites
- Python 3.9+
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dailyops-plus
```

2. Set up the backend:
```bash
cd backend
pip install -r ../requirements.txt
```

3. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

4. Open the frontend in your browser or with a simple HTTP server

## 📦 Deployment

The app **works without Supabase** initially!

1. **Deploy to Vercel** - See `DEPLOYMENT_STEPS.md` for details
2. **Add Supabase** (optional) - Add environment variables in Vercel dashboard later
3. **Done!** - Your app is live

### Environment Variables (Optional)

Set these in Vercel when ready for Supabase:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

## 📁 Project Structure

```
dailyops-plus/
├── backend/
│   ├── main.py                 # FastAPI entry
│   ├── routes/                 # API routes
│   │   ├── tasks.py
│   │   ├── focus.py
│   │   ├── alerts.py
│   │   ├── auth.py
│   │   └── integrations.py
│   ├── models/                 # Data models
│   └── utils/                  # Utilities
├── frontend/
│   ├── index.html              # DailyOps dashboard
│   ├── focus.html              # FocusDesk page
│   ├── settings.html           # Settings & integrations
│   ├── config.js               # Environment config
│   └── *.js                    # JavaScript files
├── requirements.txt
├── vercel.json                 # Vercel config
├── DEPLOYMENT_STEPS.md         # Simple deployment guide
├── DEPLOYMENT.md               # Full deployment guide
└── README.md
```

## 🎨 Usage

### First Time Setup
1. Deploy to Vercel (no environment variables needed)
2. Visit your deployed URL
3. Click "Login" - use any email/password (demo mode)
4. Navigate to Settings to add integrations

### Adding Integrations
1. Go to Settings page
2. Click "Add Integration"
3. Select type (Grafana, Jira, Slack, or Webhook)
4. Fill in configuration details
5. Test connection
6. Enable when ready

## 🔐 Security

- All credentials stored securely in Supabase (when configured)
- Row Level Security (RLS) policies for data isolation
- Environment variables for sensitive data
- Demo mode available for testing without Supabase

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [Vercel](https://vercel.com/)
- Database by [Supabase](https://supabase.com/)

## 📧 Support

For issues, questions, or feature requests, please open an issue on GitHub.
