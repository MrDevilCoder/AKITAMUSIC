/**
 * ╔══════════════════════════════════════════════════╗
 * ║   AKITAMUSIC — Cloudflare Uptime Ping Worker    ║
 * ║   Pings your Render URL every 5 minutes to      ║
 * ║   prevent the free tier from sleeping.          ║
 * ╚══════════════════════════════════════════════════╝
 *
 * HOW TO DEPLOY:
 * 1. Go to https://workers.cloudflare.com/
 * 2. Create a new Worker
 * 3. Paste this entire file into the editor
 * 4. Add an Environment Variable: RENDER_URL = your Render service URL
 *    e.g. https://akitamusic-bot.onrender.com
 * 5. Go to "Triggers" → "Cron Triggers" → Add:  *\/5 * * * *   (every 5 minutes)
 * 6. Deploy ✅
 */

export default {
  // Called on HTTP request (manual ping test)
  async fetch(request, env) {
    const url = env.RENDER_URL;
    if (!url) {
      return new Response("❌ RENDER_URL env var not set", { status: 500 });
    }

    const result = await pingBot(url);
    const body = JSON.stringify(result, null, 2);
    return new Response(body, {
      headers: { "Content-Type": "application/json" },
      status: result.ok ? 200 : 500,
    });
  },

  // Called on cron schedule (every 5 minutes)
  async scheduled(event, env, ctx) {
    const url = env.RENDER_URL;
    if (!url) {
      console.error("RENDER_URL not set — skipping ping");
      return;
    }
    const result = await pingBot(url);
    console.log(`[${new Date().toISOString()}] Ping → ${result.status} (${result.ms}ms)`);
  },
};

async function pingBot(baseUrl) {
  const start = Date.now();
  try {
    const res = await fetch(`${baseUrl}/`, {
      method: "GET",
      headers: { "User-Agent": "Cloudflare-Uptime-Worker/1.0" },
      signal: AbortSignal.timeout(10000), // 10s timeout
    });
    const ms = Date.now() - start;
    return {
      ok: res.ok,
      status: res.status,
      ms,
      url: baseUrl,
      time: new Date().toISOString(),
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      ms: Date.now() - start,
      url: baseUrl,
      error: err.message,
      time: new Date().toISOString(),
    };
  }
}
