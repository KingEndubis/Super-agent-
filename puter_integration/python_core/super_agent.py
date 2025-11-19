# python_core/super_agent.py
"""
Python Super Agent entrypoint.
If run with an argument JSON, it treats it as a task request and prints JSON result to stdout.
"""

import sys
import json
from agents.base_agent import BaseAgent
from agents.quant_agent import QuantAgent
from agents.privacy_agent import PrivacyAgent
from agents.code_validator_agent import CodeValidatorAgent

class SuperAgent:
    def __init__(self):
        self.agents = {}

    def create_agent(self, name, cls, *args, **kwargs):
        agent = cls(name, *args, **kwargs)
        self.agents[name] = agent
        return agent

    def run(self, agent_name, tool_name, *args, **kwargs):
        if agent_name not in self.agents:
            raise ValueError(f"Agent {agent_name} not found")
        agent = self.agents[agent_name]
        return getattr(agent, tool_name)(*args, **kwargs)

def main():
    sa = SuperAgent()
    sa.create_agent("quant", QuantAgent)
    sa.create_agent("privacy", PrivacyAgent)
    sa.create_agent("validator", CodeValidatorAgent)

    if len(sys.argv) > 1:
        try:
            req = json.loads(sys.argv[1])
        except Exception:
            req = {"task": "status"}
        # Support simple status or run: {"agent":"quant","tool":"simple_moving_average","args":[[1,2,3]], "kwargs":{}}
        if req.get("task") == "status":
            print(json.dumps({"status":"ok","agents":list(sa.agents.keys())}))
            return
        agent = req.get("agent")
        tool = req.get("tool")
        args = req.get("args", [])
        kwargs = req.get("kwargs", {})
        try:
            result = sa.run(agent, tool, *args, **kwargs)
            print(json.dumps(result))
        except Exception as e:
            print(json.dumps({"error": str(e)}))
    else:
        # interactive quick test
        print(json.dumps({"status":"python_core_ready","agents":list(sa.agents.keys())}))

if __name__ == "__main__":
    main()
