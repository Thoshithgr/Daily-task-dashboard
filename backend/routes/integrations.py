from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime
from backend.models.integration_model import Integration, IntegrationCreate, IntegrationUpdate
import os

router = APIRouter()

# Mock database - will be replaced with Supabase in production
integrations_db = [
    {
        "id": 1,
        "name": "Grafana",
        "type": "grafana",
        "enabled": False,
        "config": {},
        "user_id": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": 2,
        "name": "Jira",
        "type": "jira",
        "enabled": False,
        "config": {},
        "user_id": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": 3,
        "name": "Slack",
        "type": "slack",
        "enabled": False,
        "config": {},
        "user_id": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    },
    {
        "id": 4,
        "name": "Webhook",
        "type": "webhook",
        "enabled": False,
        "config": {},
        "user_id": None,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
]

@router.get("/", response_model=List[Integration])
async def get_integrations():
    """Get all integrations"""
    return integrations_db

@router.get("/{integration_id}", response_model=Integration)
async def get_integration(integration_id: int):
    """Get a specific integration"""
    for integration in integrations_db:
        if integration["id"] == integration_id:
            return integration
    raise HTTPException(status_code=404, detail="Integration not found")

@router.post("/", response_model=Integration)
async def create_integration(integration: IntegrationCreate):
    """Create a new integration"""
    new_id = len(integrations_db) + 1
    new_integration = Integration(
        id=new_id,
        name=integration.name,
        type=integration.type,
        enabled=integration.enabled or True,
        config=integration.config,
        user_id=None,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )
    integrations_db.append(new_integration.dict())
    return new_integration

@router.put("/{integration_id}", response_model=Integration)
async def update_integration(integration_id: int, integration_update: IntegrationUpdate):
    """Update an integration"""
    for i, integration in enumerate(integrations_db):
        if integration["id"] == integration_id:
            updated_data = integration_update.dict(exclude_unset=True)
            updated_integration = {**integration, **updated_data, "updated_at": datetime.now().isoformat()}
            integrations_db[i] = updated_integration
            return Integration(**updated_integration)
    raise HTTPException(status_code=404, detail="Integration not found")

@router.delete("/{integration_id}")
async def delete_integration(integration_id: int):
    """Delete an integration"""
    for i, integration in enumerate(integrations_db):
        if integration["id"] == integration_id:
            integrations_db.pop(i)
            return {"message": "Integration deleted"}
    raise HTTPException(status_code=404, detail="Integration not found")

@router.post("/{integration_id}/test")
async def test_integration(integration_id: int):
    """Test an integration connection"""
    integration = None
    for i in integrations_db:
        if i["id"] == integration_id:
            integration = i
            break
    
    if not integration:
        raise HTTPException(status_code=404, detail="Integration not found")
    
    if not integration["enabled"]:
        raise HTTPException(status_code=400, detail="Integration is not enabled")
    
    # TODO: Implement actual connection testing based on integration type
    return {"status": "success", "message": f"Connection to {integration['name']} successful"}

