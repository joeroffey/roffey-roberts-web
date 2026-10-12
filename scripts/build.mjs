// Builds the static site into ./dist. Uses Node built-ins only: `node scripts/build.mjs`.
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { page } from '../src/lib/layout.mjs';
import { site } from '../src/data/site.mjs';
import * as home from '../src/pages/home.mjs';
import * as services from '../src/pages/services.mjs';
import * as work from '../src/pages/work.mjs';
import * as misc from '../src/pages/misc.mjs';
import { projects } from '../src/data/work.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'dist');
const staticDir = join(root, 'static');

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(staticDir, out, { recursive: true });

// Version CSS and JS by content so they can be cached forever.
const assetVersion = createHash('sha256')
  .update(readFileSync(join(staticDir, 'css/site.css')))
  .update(readFileSync(join(staticDir, 'js/site.js')))
  .digest('hex')
  .slice(0, 10);

// Real screenshots, when present, replace the drawn mockups: static/img/work/<slug>.{jpg,png,webp}
for (const p of projects) {
  const found = ['jpg', 'png', 'webp'].find((ext) => existsSync(join(staticDir, `img/work/${p.slug}.${ext}`)));
  if (found) p.screenshot = `/img/work/${p.slug}.${found}`;
}

const all = [...home.pages(), ...services.pages(), ...work.pages(), ...misc.pages()];

const fileFor = (path) => (path === '/' ? 'index.html' : `${path.slice(1)}.html`);

const seen = new Set();
for (const p of all) {
  if (seen.has(p.path)) throw new Error(`Duplicate path ${p.path}`);
  seen.add(p.path);
  if (p.title.length > 65) console.warn(`! Long title (${p.title.length}): ${p.path}`);
  if (p.description.length > 165) console.warn(`! Long description (${p.description.length}): ${p.path}`);
  const file = join(out, fileFor(p.path));
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page({ ...p, assetVersion }));
}

// Sitemap and robots
const today = new Date().toISOString().slice(0, 10);
const urls = all
  .filter((p) => !p.noindex && p.sitemap !== false)
  .map((p) => {
    const loc = `${site.url}${p.path === '/' ? '/' : p.path}`;
    const priority = p.path === '/' ? '1.0' : p.path.split('/').length === 2 ? '0.8' : '0.7';
    return `  <url><loc>${loc}</loc><lastmod>${today}</lastmod><priority>${priority}</priority></url>`;
  });
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);

// Page list for OG image generation (scripts/og.mjs)
writeFileSync(
  join(root, 'scripts/.pages.json'),
  JSON.stringify(all.map((p) => ({ path: p.path, og: p.og, ogTitle: p.ogTitle || null })), null, 2)
);

if (!existsSync(join(out, 'img/og/home.png'))) console.warn('! OG images missing: run `node scripts/og.mjs` locally with Playwright.');
console.log(`Built ${all.length} pages into dist/ (assets v${assetVersion})`);
