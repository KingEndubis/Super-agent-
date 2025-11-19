# python_core/agents/quant_agent.py
from .base_agent import BaseAgent
import pandas as pd

class QuantAgent(BaseAgent):
    def __init__(self, name="quant"):
        super().__init__(name)
        self.register("simple_moving_average", self.simple_moving_average)
        self.register("describe_prices", self.describe_prices)

    def simple_moving_average(self, prices, window=5):
        s = pd.Series(prices)
        return s.rolling(window=window).mean().fillna(None).tolist()

    def describe_prices(self, prices):
        s = pd.Series(prices)
        return {
            "count": int(s.count()),
            "mean": float(s.mean()),
            "std": float(s.std()),
            "min": float(s.min()),
            "max": float(s.max())
        }
