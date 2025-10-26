# 🚀 DailyOps+

Your personal productivity and work command center — for managing focus, work, and efficiency.

## 📋 Overview

DailyOps+ combines your daily DevOps/IT work overview, tracks focus time and productivity, and integrates with Jira, Grafana, and Slack for quick insights.

## 🎯 Features

### User Authentication
- **User Registration & Login**: Secure authentication powered by Supabase
- **User Profile Management**: Store user information and preferences
- **Session Management**: Persistent login sessions

### DailyOps (Work Dashboard)
- View and manage Jira or Zoho tickets
- Display Grafana/Alertmanager alerts
- Quick Notes and Checklist
- Generate "End of Day Report" → post to Slack or email
- Add reminders (audits, reviews, patching)

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
- **Secure Storage**: All credentials stored securely in Supabase

## 🛠️ Tech Stack

- **Frontend**: HTML + Tailwind CSS + Vanilla JS
- **Backend**: Python + FastAPI
- **Database & Auth**: Supabase (PostgreSQL + built-in authentication)
- **Hosting**: Vercel (Full-stack deployment)

## 🚀 Getting Started

### Prerequisites

- Python 3.9+
- Node.js (optional, for local dev)
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
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
```

3. Set up environment variables:
```bash
cp ../.env.example ../.env
# Edit .env with your credentials
```

4. Run the backend server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

5. Open the frontend:
```bash
cd ../frontend
# Open index.html in your browser or use a simple HTTP server
python -m http.server 3000
```

6. Visit `http://localhost:3000` in your browser.

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Required)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Direct API keys (can also be configured via UI)
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=your-api-token

GRAFANA_BASE_URL=https://grafana.example.com
GRAFANA_API_KEY=your-grafana-api-key

SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Note**: For production, set these environment variables in Vercel.

## 📦 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. **Set up Supabase**:
   - Create a project at [supabase.com](https://supabase.com)
   - Run the SQL schema from DEPLOYMENT.md
   - Get your URL and anon key

2. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/dailyops-plus.git
   git push -u origin main
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables (SUPABASE_URL, SUPABASE_ANON_KEY)
   - Deploy!

The application will be live at `https://your-project.vercel.app`

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
│   │   └── integrations.py    # Integration management
│   ├── models/                 # Data models
│   │   ├── task_model.py
│   │   ├── focus_model.py
│   │   └── integration_model.py
│   └── utils/                  # Utilities
│       ├── jira_api.py
│       ├── grafana_api.py
│       ├── slack_notify.py
│       └── supabase_client.py # Supabase client
├── frontend/
│   ├── index.html              # DailyOps dashboard
│   ├── focus.html              # FocusDesk page
│   ├── settings.html           # Settings & integrations
│   ├── config.js               # Environment config
│   ├── script.js               # Main logic
│   ├── focus.js                # Focus logic
│   ├── settings.js             # Settings logic
│   └── style.css               # Custom styles
├── requirements.txt
├── vercel.json
├── DEPLOYMENT.md
├── .gitignore
└── README.md
```

## 🎨 Customization

### Adding New Integrations

**Via UI (Recommended)**:
1. Go to the Settings page
2. Click "Add Integration"
3. Select integration type
4. Fill in configuration details
5. Test and enable

**Programmatically**:
1. Add integration type to `backend/routes/integrations.py`
2. Update `frontend/settings.js` to add config fields for the new type
3. Add API client methods in `backend/utils/`

### Styling

The app uses Tailwind CSS. Customize styles in:
- `frontend/style.css` for custom CSS
- Inline Tailwind classes in HTML files

## 🔐 Security

- All credentials are stored securely in Supabase
- User authentication is handled by Supabase Auth
- Row Level Security (RLS) policies ensure data isolation
- Environment variables are used for sensitive configuration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- Built with [FastAPI](https://fastapi.tiangolo.com/)
- UI powered by [Tailwind CSS](https://tailwindcss.com/)
- Hosted on [Vercel](https://vercel.com/)

## 📧 Support

For issues, questions, or feature requests, please open an issue on GitHub.
