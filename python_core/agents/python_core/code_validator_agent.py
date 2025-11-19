# python_core/agents/code_validator_agent.py
from .base_agent import BaseAgent
import ast, subprocess, os, json, tempfile

class CodeValidatorAgent(BaseAgent):
    def __init__(self, name="validator"):
        super().__init__(name)
        self.register("syntax_check", self.syntax_check)
        self.register("run_pytests", self.run_pytests)

    def syntax_check(self, code_str: str):
        try:
            ast.parse(code_str)
            return {"ok": True, "message": "Syntax OK"}
        except SyntaxError as e:
            return {"ok": False, "error": str(e)}

    def run_pytests(self, timeout=60):
        # run pytest in python_core directory
        try:
            res = subprocess.run(["pytest", "-q"], cwd=os.path.dirname(__file__) + "/..", capture_output=True, text=True, timeout=timeout)
            return {"ok": res.returncode == 0, "stdout": res.stdout, "stderr": res.stderr}
        except Exception as e:
            return {"ok": False, "error": str(e)}
