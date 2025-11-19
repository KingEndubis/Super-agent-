# python_core/agents/base_agent.py
from typing import Callable, Dict, Any

class BaseAgent:
    def __init__(self, name: str):
        self.name = name
        self.tools: Dict[str, Callable] = {}

    def register(self, tool_name: str, fn: Callable):
        self.tools[tool_name] = fn

    def call(self, tool_name: str, *args, **kwargs) -> Any:
        if tool_name not in self.tools:
            raise KeyError(f"Tool {tool_name} not found on {self.name}")
        return self.tools[tool_name](*args, **kwargs)
