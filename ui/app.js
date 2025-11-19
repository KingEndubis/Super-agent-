// ui/app.js
const chat = document.getElementById("chat");
const query = document.getElementById("query");
const micBtn = document.getElementById("mic");
const sendBtn = document.getElementById("send");
const autoTTS = document.getElementById("auto-tts");

function addMessage(text, cls="bot") {
  const el = document.createElement("div");
  el.className = "msg " + cls;
  el.innerText = text;
  chat.appendChild(el);
  chat.scrollTop = chat.scrollHeight;
}

async function callBackend(agent="boss", task="ask", data={}) {
  try {
    const resp = await fetch("/api/run", {
      method: "POST",
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ agent, task, data })
    });
    const j = await resp.json();
    return j;
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

sendBtn.onclick = async () => {
  const q = query.value.trim();
  if (!q) return;
  addMessage(q, "user");
  query.value = "";
  addMessage("Thinking...", "bot");
  const resp = await callBackend("boss", q, { raw: q });
  // replace last "Thinking..." with result
  chat.lastChild.remove();
  if (resp.ok) {
    let out = resp.result;
    if (typeof out === "object") out = JSON.stringify(out, null, 2);
    addMessage(out, "bot");
    if (autoTTS.checked) speak(out);
  } else {
    addMessage("Error: " + (resp.error || "unknown"), "bot");
  }
};

let recognition;
if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onresult = (ev) => {
    const txt = ev.results[0][0].transcript;
    query.value = txt;
  };
  recognition.onend = () => micBtn.classList.remove("active");
}

micBtn.onclick = () => {
  if (!recognition) {
    alert("SpeechRecognition not supported in your browser.");
    return;
  }
  micBtn.classList.add("active");
  recognition.start();
};

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(typeof text === "string" ? text : JSON.stringify(text));
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}
