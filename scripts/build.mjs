// Builds the static site into ./dist. Uses Node built-ins only: `node scripts/build.mjs`.
import { mkdirSync, rmSync, writeFileSync, readFileSync, cpSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { page, googleTagInline } from '../src/lib/layout.mjs';
import { site } from '../src/data/site.mjs';
import * as home from '../src/pages/home.mjs';
import * as services from '../src/pages/services.mjs';
import * as work from '../src/pages/work.mjs';
import * as misc from '../src/pages/misc.mjs';
import * as areas from '../src/pages/areas.mjs';
import * as guides from '../src/pages/guides.mjs';
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

const all = [...home.pages(), ...services.pages(), ...areas.pages(), ...work.pages(), ...guides.pages(), ...misc.pages()];

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

// Sitemap and robots. <lastmod> is tracked per page in scripts/.lastmod.json: a page's date only moves when its
// rendered content changes (asset version and footer year excluded), so it is accurate rather than the build date.
// Commit scripts/.lastmod.json after building so the deployed build agrees. No priority (Google ignores it).
const lastmodFile = join(root, 'scripts/.lastmod.json');
const lastmod = existsSync(lastmodFile) ? JSON.parse(readFileSync(lastmodFile, 'utf8')) : {};
const today = new Date().toISOString().slice(0, 10);
for (const p of all) {
  const content = page({ ...p, assetVersion: '' }).replace(/© \d{4}/, '©');
  const hash = createHash('sha256').update(content).digest('hex').slice(0, 16);
  const prev = lastmod[p.path];
  if (!prev || prev.hash !== hash) lastmod[p.path] = { hash, date: today };
}
for (const k of Object.keys(lastmod)) if (!all.some((p) => p.path === k)) delete lastmod[k];
writeFileSync(lastmodFile, JSON.stringify(lastmod, null, 1) + '\n');
const urls = all
  .filter((p) => !p.noindex && p.sitemap !== false)
  .map((p) => `  <url><loc>${site.url}${p.path === '/' ? '/' : p.path}</loc><lastmod>${lastmod[p.path].date}</lastmod></url>`);
writeFileSync(
  join(out, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
);
writeFileSync(join(out, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${site.url}/sitemap.xml\n`);

// llms.txt: a plain-text guide to the site for AI search engines.
writeFileSync(
  join(out, 'llms.txt'),
  [
    `# ${site.name}`,
    '',
    `> ${site.tagline} Based in ${site.base}, UK, working across the South Coast and the rest of the UK.`,
    '',
    `Contact: ${site.email}${site.phone ? ` · ${site.phone}` : ''}`,
    `Founder: ${site.founder.name}`,
    '',
    '## Pages',
    ...all.filter((p) => !p.noindex && p.sitemap !== false).map((p) => `- [${p.title.replace(' | Roffey-Roberts Web', '')}](${site.url}${p.path === '/' ? '/' : p.path}): ${p.description}`),
    '',
  ].join('\n')
);

// Page list for OG image generation (scripts/og.mjs)
writeFileSync(
  join(root, 'scripts/.pages.json'),
  JSON.stringify(all.map((p) => ({ path: p.path, og: p.og, ogTitle: p.ogTitle || null })), null, 2)
);

if (!existsSync(join(out, 'img/og/home.jpg'))) console.warn('! OG images missing: run `node scripts/og.mjs` locally with Playwright.');

// The inline Google tag must be allowed by the CSP in vercel.json, or browsers will block it.
const inline = googleTagInline();
if (inline) {
  const hash = `sha256-${createHash('sha256').update(inline).digest('base64')}`;
  if (!readFileSync(join(root, 'vercel.json'), 'utf8').includes(hash)) console.warn(`! CSP: add '${hash}' to script-src in vercel.json (the inline Google tag changed).`);
}
console.log(`Built ${all.length} pages into dist/ (assets v${assetVersion})`);
