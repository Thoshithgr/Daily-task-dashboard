from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from backend.models.focus_model import FocusSession, FocusSessionCreate, FocusStats

router = APIRouter()

# Mock database - replace with Supabase
focus_sessions = []

@router.post("/sessions", response_model=FocusSession)
async def create_focus_session(session: FocusSessionCreate):
    """Create a focus session"""
    new_session = FocusSession(
        id=len(focus_sessions) + 1,
        duration=session.duration,
        task_id=session.task_id,
        completed=session.completed or False,
        notes=session.notes,
        created_at=datetime.now().isoformat()
    )
    focus_sessions.append(new_session)
    return new_session

@router.get("/sessions", response_model=List[FocusSession])
async def get_focus_sessions():
    """Get all focus sessions"""
    return focus_sessions

@router.get("/stats")
async def get_focus_stats():
    """Get focus statistics"""
    total_sessions = len(focus_sessions)
    total_minutes = sum(s.duration for s in focus_sessions)
    completed_sessions = len([s for s in focus_sessions if s.completed])
    
    return FocusStats(
        total_sessions=total_sessions,
        total_minutes=total_minutes,
        completed_sessions=completed_sessions,
        avg_session_minutes=total_minutes / total_sessions if total_sessions > 0 else 0
    )

@router.get("/sessions/{session_id}", response_model=FocusSession)
async def get_focus_session(session_id: int):
    """Get a specific focus session"""
    for session in focus_sessions:
        if session.id == session_id:
            return session
    raise HTTPException(status_code=404, detail="Focus session not found")
