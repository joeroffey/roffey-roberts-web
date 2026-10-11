// Local preview server: serves dist/ with clean URLs and runs api/contact.js.
// FAKE_SEND=1 node scripts/serve.mjs  → pretends emails send, so the form can be tested offline.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(fileURLToPath(new URL('..', import.meta.url)), 'dist');
const port = Number(process.env.PORT || 4321);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json', '.json': 'application/json' };

if (process.env.FAKE_SEND) {
  process.env.RESEND_API_KEY ||= 'fake';
  process.env.CONTACT_TO_EMAIL ||= 'test@example.com';
  const realFetch = globalThis.fetch;
  globalThis.fetch = async (url, opts) => {
    if (String(url).startsWith('https://api.resend.com')) {
      console.log('[fake send]', JSON.parse(opts.body).subject);
      return new Response(JSON.stringify({ id: 'fake' }), { status: 200 });
    }
    return realFetch(url, opts);
  };
}
const { default: contact } = await import('../api/contact.js');

async function file(path) {
  try { const s = await stat(path); if (s.isFile()) return path; } catch {}
  return null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/contact') return contact(req, res);
  const clean = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, '');
  const candidates = clean === '/' ? ['index.html'] : [clean, `${clean}.html`, join(clean, 'index.html')];
  let found = null;
  for (const c of candidates) { found = await file(join(root, c)); if (found) break; }
  const status = found ? 200 : 404;
  found ||= join(root, '404.html');
  res.writeHead(status, { 'Content-Type': types[extname(found)] || 'application/octet-stream' });
  res.end(await readFile(found));
}).listen(port, () => console.log(`Preview on http://localhost:${port}`));
