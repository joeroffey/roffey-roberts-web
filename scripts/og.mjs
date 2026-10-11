// Generates social share images (1200×630) and app icons into static/img/.
// Run locally after `node scripts/build.mjs`: needs Playwright with Chromium installed
// (`npm i -g playwright && npx playwright install chromium`).
import { readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(process.env.PLAYWRIGHT_REQUIRE_FROM || import.meta.url);
const { chromium } = require('playwright');

const pages = JSON.parse(readFileSync(join(root, 'scripts/.pages.json'), 'utf8'));
const font = `data:font/woff2;base64,${readFileSync(join(root, 'static/fonts/archivo-var.woff2')).toString('base64')}`;
const mark = readFileSync(join(root, 'static/favicon.svg'), 'utf8');
const markInverse = mark.replace('fill="#0B2A31"', 'fill="#FFB020"').replace('fill="#FFB020" d=', 'fill="#0B2A31" d=');

const base = `
  @font-face { font-family: A; src: url(${font}) format("woff2"); font-weight: 300 900; font-stretch: 75% 125%; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0B2A31; color: #F8FAF9; font-family: A; }`;

const card = (title, isHome) => `<!doctype html><html><head><style>${base}
  .wrap { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font-size: 28px; font-weight: 780; font-stretch: 120%; letter-spacing: -0.01em; }
  .brand span { font-weight: 400; font-stretch: 100%; color: #9FB5B7; }
  .brand svg { width: 52px; height: 52px; }
  h1 { margin-top: auto; font-size: ${isHome ? 104 : title.length > 22 ? 92 : 112}px; font-weight: 820; font-stretch: 125%; line-height: 0.95; letter-spacing: -0.038em; max-width: 1050px; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: 44px; padding-top: 22px; border-top: 2px solid rgba(227,234,233,.18); font-size: 24px; color: #9FB5B7; }
  .foot b { color: #FFB020; font-weight: 650; }
</style></head><body><div class="wrap">
  <div class="brand">${markInverse}<div>Roffey-Roberts <span>Web</span></div></div>
  <h1>${title}</h1>
  <div class="foot"><span>Websites, SEO, ads, security and hosting</span><b>roffey-robertsweb.co.uk</b></div>
</div></body></html>`;

const icon = (size, padded) => `<!doctype html><html><head><style>* { margin: 0 } body { width: ${size}px; height: ${size}px; background: ${padded ? '#0B2A31' : 'transparent'}; }
svg { width: ${size}px; height: ${size}px; display: block; }</style></head><body>${padded ? mark.replace('rx="10"', 'rx="0"') : mark}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
mkdirSync(join(root, 'static/img/og'), { recursive: true });

const done = new Set();
for (const p of pages) {
  if (done.has(p.og)) continue;
  done.add(p.og);
  const isHome = p.og === 'home';
  const title = isHome ? 'Built properly.<br>Found first.<br>Kept safe.' : (p.ogTitle || '').replace(/&/g, '&amp;');
  if (!title) continue;
  await page.setContent(card(title, isHome), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, `static/img/og/${p.og}.png`) });
  console.log('og', p.og);
}

for (const [file, size, padded] of [['favicon-32.png', 32, false], ['apple-touch-icon.png', 180, true], ['img/icon-192.png', 192, true], ['img/icon-512.png', 512, true], ['img/logo-512.png', 512, false]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(icon(size, padded), { waitUntil: 'load' });
  await page.screenshot({ path: join(root, 'static', file), omitBackground: !padded });
  console.log('icon', file);
}
await browser.close();
