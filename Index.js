// index.js
import Puter from "puter-js";
import express from "express";
import bodyParser from "body-parser";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import bossAgent from "./bossAgent.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(bodyParser.json());

// Minimal "agents registry" used by bossAgent
const agents = {}; // puter agents are registered by Puter runtime; we keep a local mirror for calls

// Simple health route
app.get("/health", (req, res) => res.json({ status: "ok" }));

// Endpoint to run a boss-level task that may call Python core when needed
app.post("/api/run", async (req, res) => {
  const input = req.body || {};
  try {
    // if an agent_name === "python_core" we call Python script via subprocess
    if (input.agent === "python_core") {
      // run python_core(super_agent) via child process and return JSON
      const py = spawn("python3", ["python_core/super_agent.py", JSON.stringify(input)], { stdio: ["pipe", "pipe", "pipe"] });
      let out = "";
      let err = "";
      py.stdout.on("data", (data) => (out += data.toString()));
      py.stderr.on("data", (data) => (err += data.toString()));
      py.on("close", () => {
        if (err) return res.status(500).json({ error: err });
        try {
          const parsed = JSON.parse(out);
          return res.json({ ok: true, result: parsed });
        } catch (e) {
          return res.json({ ok: true, raw: out });
        }
      });
      return;
    }

    // fallback: ask the bossAgent module
    const result = await bossAgent.actions.runTask(input, { agents, logger: console });
    res.json({ ok: true, result });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`HTTP bridge listening on ${PORT}`);
  // start puter runtime (if available)
  if (Puter && typeof Puter.start === "function") {
    Puter.start().then(() => console.log("Puter runtime started")).catch((e) => console.warn("Puter start error:", e));
  } else {
    console.log("Puter runtime not available in this environment; continue using HTTP bridge.");
  }
});
