import { createRequire } from "node:module";
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
import http from "node:http";
import fs from "node:fs";

const TYPES = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml" };
// Serve the site over HTTP the way a host would, so fonts and caching behave like production.
export const DIST = path.join(ROOT, "dist");
export const pages = () => JSON.parse(fs.readFileSync(path.join(DIST, "pages.json"), "utf8"));
// Serves dist/ by default; folder URLs resolve to index.html like a static host. "/brand/..." maps to the repo's brand folder.
export function serve(base = DIST) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const rel = decodeURIComponent(new URL(req.url, "http://x").pathname);
      const from = rel.startsWith("/brand/") ? ROOT : base;
      let file = path.join(from, rel);
      if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
      if (!file.startsWith(ROOT) || !fs.existsSync(file)) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
      fs.createReadStream(file).pipe(res);
    }).listen(0, "127.0.0.1", () => resolve({ url: `http://127.0.0.1:${server.address().port}/`, close: () => server.close() }));
  });
}

export function chromium() {
  try { return require("playwright").chromium; } catch {}
  const globalRoot = execSync("npm root -g").toString().trim();
  return require(path.join(globalRoot, "playwright")).chromium;
}

// Lowercase, straight quotes, single spaces: so "Schilly’s" == "Schilly's".
export const norm = (s) => s.replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, " ").trim().toLowerCase();
