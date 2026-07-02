/* Vercel serverless proxy for the resident concierge.
   The portal (index.html) POSTs a Messages API body to /api/ask; this function
   forwards it to Anthropic with the key held server-side. The key comes from
   the project's environment (the Vercel Anthropic integration provisions
   ANTHROPIC_API_KEY automatically; otherwise set it in Project Settings →
   Environment Variables). The key never appears in the page source.

   Raw HTTP on purpose: this repo is deliberately zero-dependency (no
   package.json, no build step), and the function is a pass-through with cost
   clamps, not application logic.

   Abuse clamps: the endpoint is reachable by anyone with the portal URL, so
   the server - not the client - decides the model and caps spend per call. */

const MODEL = "claude-opus-4-8";
const MAX_TOKENS_CAP = 1024;
const MAX_TURNS = 24;            // conversation turns per request
const MAX_CHARS = 24000;         // total request-body character budget

export default async function handler(req, res) {
  // CORS: lets you test a locally opened index.html against the deployed
  // function. Same-origin production traffic doesn't need it.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: "ANTHROPIC_API_KEY is not configured on the Vercel project" });

  const b = req.body || {};
  const messages = Array.isArray(b.messages) ? b.messages.slice(-MAX_TURNS) : null;
  const system = typeof b.system === "string" ? b.system : "";
  if (!messages || !messages.length) return res.status(400).json({ error: "messages required" });
  if (JSON.stringify(messages).length + system.length > MAX_CHARS) {
    return res.status(413).json({ error: "request too large" });
  }

  // Server decides the expensive knobs - clients can't raise them.
  const payload = {
    model: MODEL,
    max_tokens: Math.min(Number(b.max_tokens) || MAX_TOKENS_CAP, MAX_TOKENS_CAP),
    thinking: { type: "adaptive" },
    system,
    messages,
  };

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "anthropic-version": "2023-06-01",
      "x-api-key": key,
    },
    body: JSON.stringify(payload),
  });
  const data = await r.json();
  return res.status(r.status).json(data);
}
