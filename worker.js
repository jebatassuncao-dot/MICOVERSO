/* Servidor do assistente Batista (Cloudflare Workers — plano gratuito).
   Guarda a chave da Anthropic em segredo, fora do aplicativo.
   Variáveis no painel do Worker:
     ANTHROPIC_API_KEY  (segredo) -> sua chave sk-ant-...
     ALLOWED_ORIGIN               -> ex.: https://jebatassuncao-dot.github.io  */
export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "content-type" };
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return new Response("Use POST", { status: 405, headers: cors });
    let body;
    try { body = await request.json(); } catch { return new Response("JSON inválido", { status: 400, headers: cors }); }
    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : [];
    if (!messages.length || JSON.stringify(messages).length > 2_000_000) return new Response("Pedido inválido", { status: 400, headers: cors });
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: "claude-haiku-5-5", max_tokens: 500, system: String(body.system || "").slice(0, 4000), messages })
    });
    return new Response(await r.text(), { status: r.status, headers: { ...cors, "content-type": "application/json" } });
  }
};
