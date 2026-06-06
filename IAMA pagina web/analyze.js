// api/analyze.js — Función serverless (Vercel)
// La API key vive aquí, en el servidor, como variable de entorno.
// El navegador NUNCA la ve. Llama a esta función, y esta función llama a Anthropic.

export default async function handler(req, res) {
  // CORS básico (mismo origen en producción; permisivo en dev)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Falta configurar ANTHROPIC_API_KEY en el servidor" });
  }

  try {
    const { prompt } = req.body || {};
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Falta el prompt" });
    }
    // Límite defensivo de tamaño de prompt (evita abuso de costo)
    if (prompt.length > 20000) {
      return res.status(413).json({ error: "Prompt demasiado grande" });
    }

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!r.ok) {
      const errText = await r.text();
      return res.status(r.status).json({ error: "Error de Anthropic", detail: errText.slice(0, 500) });
    }

    const data = await r.json();
    const text = (data.content || []).map((b) => (b.type === "text" ? b.text : "")).join("");
    return res.status(200).json({ text, stop_reason: data.stop_reason });
  } catch (e) {
    return res.status(500).json({ error: "Error interno", detail: String(e).slice(0, 500) });
  }
}
