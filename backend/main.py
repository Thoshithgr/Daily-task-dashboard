from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import tasks, focus, alerts, auth, integrations

app = FastAPI(title="DailyOps+ API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(focus.router, prefix="/api/focus", tags=["Focus"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["Alerts"])
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(integrations.router, prefix="/api/integrations", tags=["Integrations"])

@app.get("/")
async def root():
    return {"message": "DailyOps+ API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
