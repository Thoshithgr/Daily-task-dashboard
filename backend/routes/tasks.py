from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from backend.utils.jira_api import JiraClient
from backend.models.task_model import Task, TaskCreate

router = APIRouter()

# Mock database - replace with Supabase in production
tasks_db = []

@router.get("/", response_model=List[Task])
async def get_tasks():
    """Get all tasks"""
    return tasks_db

@router.post("/", response_model=Task)
async def create_task(task: TaskCreate):
    """Create a new task"""
    new_task = Task(
        id=len(tasks_db) + 1,
        title=task.title,
        description=task.description,
        status=task.status or "todo",
        priority=task.priority or "medium",
        category=task.category,
        tags=task.tags or [],
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )
    tasks_db.append(new_task)
    return new_task

@router.put("/{task_id}", response_model=Task)
async def update_task(task_id: int, task: TaskCreate):
    """Update a task"""
    for i, t in enumerate(tasks_db):
        if t.id == task_id:
            updated_task = Task(
                id=task_id,
                title=task.title,
                description=task.description,
                status=task.status or t.status,
                priority=task.priority or t.priority,
                category=task.category if task.category else t.category,
                tags=task.tags or t.tags,
                created_at=t.created_at,
                updated_at=datetime.now().isoformat()
            )
            tasks_db[i] = updated_task
            return updated_task
    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Delete a task"""
    for i, t in enumerate(tasks_db):
        if t.id == task_id:
            tasks_db.pop(i)
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

@router.get("/jira")
async def get_jira_tickets():
    """Get Jira tickets"""
    jira = JiraClient()
    return jira.get_tickets()
