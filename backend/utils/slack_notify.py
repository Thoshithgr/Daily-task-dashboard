import os
import requests
import json

class SlackNotifier:
    def __init__(self):
        self.webhook_url = os.getenv("SLACK_WEBHOOK_URL", "")
    
    def send_end_of_day_report(self, report: dict):
        """Send end of day report to Slack"""
        if not self.webhook_url:
            return {"message": "Slack webhook not configured"}
        
        payload = {
            "text": "📊 End of Day Report",
            "blocks": [
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "📊 End of Day Report"
                    }
                },
                {
                    "type": "section",
                    "fields": [
                        {
                            "type": "mrkdwn",
                            "text": f"*Tasks Completed:* {report.get('tasks_completed', 0)}"
                        },
                        {
                            "type": "mrkdwn",
                            "text": f"*Focus Time:* {report.get('focus_minutes', 0)} minutes"
                        }
                    ]
                }
            ]
        }
        
        response = requests.post(self.webhook_url, json=payload)
        return {"status": "sent", "response": response.status_code}
