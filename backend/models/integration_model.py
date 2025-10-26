from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime

class Integration(BaseModel):
    id: int
    name: str  # Jira, Grafana, Slack, etc.
    type: str  # jira, grafana, slack, webhook, etc.
    enabled: bool
    config: Dict  # Stores API keys, URLs, tokens, etc.
    user_id: Optional[str] = None
    created_at: str
    updated_at: str

class IntegrationCreate(BaseModel):
    name: str
    type: str
    enabled: Optional[bool] = True
    config: Dict

class IntegrationUpdate(BaseModel):
    name: Optional[str] = None
    enabled: Optional[bool] = None
    config: Optional[Dict] = None

