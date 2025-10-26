# 🚀 Quick Start Guide - DailyOps+

Get DailyOps+ up and running in 5 minutes!

## ⚡ Fast Setup

### Option 1: Local Development (Recommended)

1. **Start the backend:**
   ```bash
   ./start.sh
   ```
   This will:
   - Create a virtual environment
   - Install dependencies
   - Start the FastAPI server on http://localhost:8000

2. **Open the frontend:**
   ```bash
   cd frontend
   python3 -m http.server 3000
   ```
   Then open http://localhost:3000 in your browser

3. **Access API docs:**
   Visit http://localhost:8000/docs for interactive API documentation

### Option 2: Docker (For Production-like Environment)

```bash
# Start both frontend and backend
docker-compose up

# Backend: http://localhost:8000
# Frontend: http://localhost:3000
```

## 🔧 Configuration

1. **Copy environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your credentials:**
   - Jira API credentials
   - Grafana API key
   - Slack webhook URL
   - (Optional) Supabase credentials

## 📱 Usage

### DailyOps Dashboard (`http://localhost:3000`)
- View and manage tasks
- Check alerts from Grafana
- Take quick notes
- Generate end-of-day reports

### FocusDesk (`http://localhost:3000/focus.html`)
- Start Pomodoro timer (15, 25, or 45 minutes)
- Track focus sessions
- View productivity stats
- Manage focus tasks

## 🎯 Next Steps

1. **Test the integrations:**
   - Add some tasks
   - Start a focus session
   - Try the Pomodoro timer

2. **Set up real integrations:**
   - Connect your Jira account
   - Configure Grafana alerts
   - Set up Slack notifications

3. **Deploy to production:**
   - Frontend: Deploy to Vercel
   - Backend: Deploy to Render/Railway

## 🆘 Troubleshooting

**Backend won't start:**
- Make sure Python 3.9+ is installed
- Check that port 8000 is available
- Activate virtual environment: `source venv/bin/activate`

**Frontend can't connect to API:**
- Update API_BASE_URL in `frontend/script.js` and `frontend/focus.js`
- Make sure CORS is enabled in backend
- Check that backend is running on port 8000

## 📚 Documentation

- Full README: See README.md
- API Docs: http://localhost:8000/docs (when backend is running)
- Architecture: See project structure in README

Happy productivity! 🎉
