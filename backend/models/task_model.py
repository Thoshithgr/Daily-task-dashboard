from pydantic import BaseModel
from typing import Optional, List

class Task(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    status: str  # todo, in_progress, done
    priority: str  # low, medium, high
    tags: List[str] = []
    created_at: str
    updated_at: str

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = "todo"
    priority: Optional[str] = "medium"
    tags: Optional[List[str]] = []
