// puter_integration/puter_integration.js
import fetch from "node-fetch";

const PUTER_HOST = process.env.PUTER_HOST || "https://puter.example";
const PUTER_TOKEN = process.env.PUTER_TOKEN || "";

export async function callPuterTask(taskName, payload = {}) {
  if (!PUTER_TOKEN) throw new Error("PUTER_TOKEN not set in environment");
  const resp = await fetch(`${PUTER_HOST}/api/tasks/${taskName}`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${PUTER_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Puter error: ${resp.status} ${text}`);
  }
  return await resp.json();
}
