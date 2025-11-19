# python_core/agents/privacy_agent.py
from .base_agent import BaseAgent
import json

class PrivacyAgent(BaseAgent):
    def __init__(self, name="privacy"):
        super().__init__(name)
        self.register("mock_removal_request", self.mock_removal_request)

    def mock_removal_request(self, broker_name: str, person_name: str):
        payload = {
            "broker": broker_name,
            "subject": person_name,
            "action": "request_removal",
            "notes": "Template removal request. Real vendor verification required."
        }
        # return as dict so callers can extend/serialize
        return payload
