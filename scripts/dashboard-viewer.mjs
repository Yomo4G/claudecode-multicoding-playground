// scripts/dashboard-viewer.mjs
// Dashboard Live Viewer — SSE-powered real-time dashboard.md viewer
// Node.js built-in modules only (no external dependencies)

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "node:child_process";

/* =======================
   Paths / args
======================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const DASHBOARD_PATH = path.join(ROOT_DIR, "dashboard.md");

const PORT = 3333;
const NO_OPEN = process.argv.includes("--no-open");

/* =======================
   SSE client management
======================= */
const clients = new Set();

function broadcast(data) {
  const payload = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch {
      clients.delete(res);
    }
  }
}

/* =======================
   File reading
======================= */
function readDashboard() {
  try {
    return fs.readFileSync(DASHBOARD_PATH, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

/* =======================
   File watcher with debounce + retry
======================= */
let watcher = null;
let debounceTimer = null;
let retryTimer = null;

function startWatching() {
  if (watcher) return;

  if (!fs.existsSync(DASHBOARD_PATH)) {
    console.log("[viewer] dashboard.md not found, retrying in 3s...");
    retryTimer = setTimeout(startWatching, 3000);
    return;
  }

  try {
    watcher = fs.watch(DASHBOARD_PATH, () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const content = readDashboard();
        if (content !== null) {
          broadcast({ type: "update", content });
        }
      }, 300);
    });

    watcher.on("error", () => {
      stopWatching();
      retryTimer = setTimeout(startWatching, 3000);
    });

    console.log("[viewer] Watching dashboard.md for changes");
  } catch {
    retryTimer = setTimeout(startWatching, 3000);
  }
}

function stopWatching() {
  if (watcher) {
    watcher.close();
    watcher = null;
  }
  clearTimeout(debounceTimer);
  clearTimeout(retryTimer);
}

/* =======================
   Embedded HTML page
======================= */
function getHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard Viewer</title>
<style>
  :root {
    --bg: #0d1117;
    --fg: #c9d1d9;
    --border: #30363d;
    --surface: #161b22;
    --accent: #58a6ff;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    background: var(--bg);
    color: var(--fg);
    line-height: 1.6;
  }
  #header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    padding: 8px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  #header h1 { font-size: 16px; font-weight: 600; }
  #status-dot {
    width: 10px; height: 10px;
    border-radius: 50%;
    background: #f85149;
    transition: background 0.3s;
  }
  #status-dot.connected { background: #3fb950; }
  #status-text { font-size: 12px; color: #8b949e; }
  #content {
    max-width: 960px;
    margin: 0 auto;
    padding: 24px 16px;
  }
  #waiting {
    text-align: center;
    padding: 80px 20px;
    color: #8b949e;
    font-size: 18px;
  }
  /* Markdown rendered styles */
  #content h1 { font-size: 24px; margin: 24px 0 12px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }
  #content h2 { font-size: 20px; margin: 20px 0 10px; border-bottom: 1px solid var(--border); padding-bottom: 6px; }
  #content h3 { font-size: 16px; margin: 16px 0 8px; }
  #content p { margin: 8px 0; }
  #content ul, #content ol { margin: 8px 0; padding-left: 24px; }
  #content li { margin: 4px 0; }
  #content code {
    background: var(--surface);
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }
  #content pre {
    background: var(--surface);
    padding: 12px;
    border-radius: 6px;
    overflow-x: auto;
    margin: 8px 0;
  }
  #content pre code { padding: 0; background: none; }
  #content table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  #content th, #content td {
    border: 1px solid var(--border);
    padding: 8px 12px;
    text-align: left;
    white-space: nowrap;
  }
  #content th { background: var(--surface); font-weight: 600; }
  #content blockquote {
    border-left: 3px solid var(--border);
    padding-left: 12px;
    color: #8b949e;
    margin: 8px 0;
  }
  #content hr { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  /* Status badges */
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
  }
  .badge-idle { background: #30363d; color: #8b949e; }
  .badge-working { background: #1f3a5f; color: #58a6ff; }
  .badge-blocked { background: #3d2e00; color: #d29922; }
  .badge-error { background: #3d1418; color: #f85149; }
  .badge-done { background: #1a3a1a; color: #3fb950; }
  /* Progress bar */
  .progress-bar {
    display: inline-block;
    background: var(--surface);
    border-radius: 4px;
    overflow: hidden;
    height: 14px;
    min-width: 100px;
    vertical-align: middle;
  }
  .progress-fill {
    display: block;
    height: 100%;
    background: linear-gradient(90deg, #238636, #3fb950);
    transition: width 0.3s;
  }
  /* Mobile */
  @media (max-width: 600px) {
    #content { padding: 12px 8px; }
    #content th, #content td { padding: 4px 8px; font-size: 13px; }
  }
</style>
</head>
<body>
<div id="header">
  <div id="status-dot"></div>
  <h1>Dashboard Viewer</h1>
  <span id="status-text">Connecting...</span>
</div>
<div id="content">
  <div id="waiting">Waiting for dashboard.md...</div>
</div>

<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script>
(function() {
  const contentEl = document.getElementById('content');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  let markedLoaded = typeof marked !== 'undefined';

  // Check marked availability after CDN load
  if (!markedLoaded) {
    const s = document.querySelector('script[src*="marked"]');
    if (s) {
      s.onload = () => { markedLoaded = true; };
      s.onerror = () => { markedLoaded = false; };
    }
  }

  function renderMarkdown(md) {
    // Hide AI UPDATE CONTRACT comments
    md = md.replace(/<!--[\\s\\S]*?-->/g, '');

    let html;
    if (markedLoaded && typeof marked !== 'undefined') {
      html = marked.parse(md);
    } else {
      // Fallback: preformatted
      const escaped = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      html = '<pre>' + escaped + '</pre>';
    }

    // Progress bar: convert block chars
    html = html.replace(/([░▓█]+)/g, function(match) {
      const filled = (match.replace(/░/g, '').length / match.length) * 100;
      return '<span class="progress-bar"><span class="progress-fill" style="width:' + filled + '%"></span></span>';
    });

    // Status badges
    html = html.replace(/\\b(idle)\\b/gi, '<span class="badge badge-idle">idle</span>');
    html = html.replace(/\\b(working)\\b/gi, '<span class="badge badge-working">working</span>');
    html = html.replace(/\\b(blocked)\\b/gi, '<span class="badge badge-blocked">blocked</span>');
    html = html.replace(/\\b(error)\\b/gi, '<span class="badge badge-error">error</span>');
    html = html.replace(/(?<!<[^>]*)\\b(done)\\b/gi, '<span class="badge badge-done">done</span>');

    contentEl.innerHTML = html;
  }

  // SSE with exponential backoff
  let retryDelay = 1000;
  const MAX_RETRY = 30000;

  function connect() {
    const es = new EventSource('/events');

    es.onopen = function() {
      statusDot.classList.add('connected');
      statusText.textContent = 'Connected';
      retryDelay = 1000;
    };

    es.onmessage = function(e) {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'update' && msg.content) {
          renderMarkdown(msg.content);
        } else if (msg.type === 'waiting') {
          contentEl.innerHTML = '<div id="waiting">Waiting for dashboard.md...</div>';
        }
      } catch {}
    };

    es.onerror = function() {
      es.close();
      statusDot.classList.remove('connected');
      statusText.textContent = 'Reconnecting...';
      setTimeout(function() {
        retryDelay = Math.min(retryDelay * 2, MAX_RETRY);
        connect();
      }, retryDelay);
    };
  }

  connect();
})();
</script>
</body>
</html>`;
}

/* =======================
   HTTP server
======================= */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === "/" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(getHTML());
    return;
  }

  if (url.pathname === "/events" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    clients.add(res);
    req.on("close", () => clients.delete(res));

    // Send current content immediately
    const content = readDashboard();
    if (content !== null) {
      res.write(`data: ${JSON.stringify({ type: "update", content })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ type: "waiting" })}\n\n`);
    }
    return;
  }

  if (url.pathname === "/api/dashboard" && req.method === "GET") {
    const content = readDashboard();
    if (content !== null) {
      res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8" });
      res.end(content);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("dashboard.md not found");
    }
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not Found");
});

/* =======================
   Browser auto-open
======================= */
function openBrowser(url) {
  if (NO_OPEN) return;

  const cmds = {
    darwin: "open",
    win32: "start",
  };
  const cmd = cmds[process.platform] || "xdg-open";

  exec(`${cmd} ${url}`, (err) => {
    if (err) console.log("[viewer] Could not open browser automatically");
  });
}

/* =======================
   Graceful shutdown
======================= */
function shutdown() {
  console.log("\n[viewer] Shutting down...");
  stopWatching();
  for (const res of clients) {
    try { res.end(); } catch {}
  }
  clients.clear();
  server.close(() => process.exit(0));
  // Force exit after 3s if graceful shutdown stalls
  setTimeout(() => process.exit(0), 3000);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

/* =======================
   Main
======================= */
async function main() {
  await new Promise((resolve, reject) => {
    server.listen(PORT, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });

  const url = `http://localhost:${PORT}`;
  console.log(`[viewer] Dashboard viewer running at ${url}`);

  startWatching();
  openBrowser(url);
}

main().catch((e) => {
  console.error("[viewer]", e.message ?? e);
  process.exit(1);
});
