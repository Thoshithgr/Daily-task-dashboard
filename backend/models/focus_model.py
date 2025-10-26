from pydantic import BaseModel
from typing import Optional

class FocusSession(BaseModel):
    id: int
    duration: int  # minutes
    task_id: Optional[int] = None
    completed: bool = False
    notes: Optional[str] = None
    created_at: str

class FocusSessionCreate(BaseModel):
    duration: int
    task_id: Optional[int] = None
    completed: Optional[bool] = False
    notes: Optional[str] = None

class FocusStats(BaseModel):
    total_sessions: int
    total_minutes: int
    completed_sessions: int
    avg_session_minutes: float
