from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from backend.utils.grafana_api import GrafanaClient
from backend.utils.slack_notify import SlackNotifier

router = APIRouter()

@router.get("/grafana")
async def get_grafana_alerts():
    """Get Grafana/Alertmanager alerts"""
    grafana = GrafanaClient()
    return grafana.get_alerts()

@router.post("/slack/end-of-day")
async def send_end_of_day_report(report: dict):
    """Send end of day report to Slack"""
    slack = SlackNotifier()
    return slack.send_end_of_day_report(report)
