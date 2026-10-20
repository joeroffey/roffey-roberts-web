// Generates social share images (1200×630) and app icons into static/img/.
// Run locally after `node scripts/build.mjs`: needs Playwright with Chromium installed
// (`npm i -g playwright && npx playwright install chromium`).
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(process.env.PLAYWRIGHT_REQUIRE_FROM || import.meta.url);
const { chromium } = require('playwright');

const pages = JSON.parse(readFileSync(join(root, 'scripts/.pages.json'), 'utf8'));
const font = `data:font/woff2;base64,${readFileSync(join(root, 'static/fonts/bricolage.woff2')).toString('base64')}`;
const font2 = `data:font/woff2;base64,${readFileSync(join(root, 'static/fonts/inter.woff2')).toString('base64')}`;
const mark = readFileSync(join(root, 'static/favicon.svg'), 'utf8');
const markInverse = readFileSync(join(root, 'static/logo.svg'), 'utf8');

const base = `
  @font-face { font-family: A; src: url(${font}) format("woff2"); font-weight: 400 800; }
  @font-face { font-family: B; src: url(${font2}) format("woff2"); font-weight: 300 700; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #07080D; color: #F3F5FA; font-family: B; position: relative; }
  .glow { position: absolute; border-radius: 50%; }
  .g1 { width: 900px; height: 900px; left: -300px; top: -450px; background: radial-gradient(circle, rgba(124,108,255,.5), rgba(124,108,255,0) 60%); }
  .g2 { width: 800px; height: 800px; right: -250px; top: -200px; background: radial-gradient(circle, rgba(46,197,255,.38), rgba(46,197,255,0) 60%); }
  .dots { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.2px); background-size: 28px 28px; -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 30%, #000 20%, transparent 70%); }`;

const card = (title, isHome) => `<!doctype html><html><head><style>${base}
  .wrap { position: relative; height: 100%; padding: 64px 72px; display: flex; flex-direction: column; }
  .brand { display: flex; align-items: center; gap: 16px; font-family: A; font-size: 30px; font-weight: 700; letter-spacing: -0.02em; }
  .brand span { color: #7D8699; font-weight: 600; }
  .brand svg { width: 60px; height: auto; filter: drop-shadow(0 0 14px rgba(124,108,255,.5)); }
  h1 { margin-top: auto; font-family: A; font-size: ${isHome ? 108 : title.length > 22 ? 90 : 112}px; font-weight: 700; line-height: 0.96; letter-spacing: -0.035em; max-width: 1060px; }
  .grad { background: linear-gradient(90deg, #B49CFF 0%, #7C6CFF 40%, #2EC5FF 100%); -webkit-background-clip: text; color: transparent; }
  .foot { display: flex; justify-content: space-between; align-items: baseline; margin-top: 44px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.14); font-size: 23px; color: #9AA3B8; }
  .foot b { color: #fff; font-weight: 600; }
</style></head><body><span class="glow g1"></span><span class="glow g2"></span><span class="dots"></span><div class="wrap">
  <div class="brand">${markInverse}<div>Roffey-Roberts <span>Web</span></div></div>
  <h1>${title}</h1>
  <div class="foot"><span>Websites, marketing, cyber security, IT and hosting</span><b>roffey-robertsweb.co.uk</b></div>
</div></body></html>`;

const icon = (size, padded) => `<!doctype html><html><head><style>* { margin: 0 } body { width: ${size}px; height: ${size}px; background: ${padded ? '#07080D' : 'transparent'}; }
svg { width: ${size}px; height: ${size}px; display: block; }</style></head><body>${padded ? mark.replace('rx="16"', 'rx="0"') : mark}</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
mkdirSync(join(root, 'static/img/og'), { recursive: true });

const done = new Set();
for (const p of pages) {
  if (done.has(p.og)) continue;
  done.add(p.og);
  const isHome = p.og === 'home';
  const title = isHome ? 'Websites and IT that<br><span class="grad">just work.</span>' : (p.ogTitle || '').replace(/&/g, '&amp;').replace(/<span class="grad-text">/g, '<span class="grad">');
  if (!title) continue;
  await page.setContent(card(title, isHome), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, `static/img/og/${p.og}.jpg`), type: 'jpeg', quality: 84 });
  console.log('og', p.og);
}

// favicon-96.png is a multiple of 48px, which Google requires for the icon it shows in search results.
for (const [file, size, padded] of [['favicon-96.png', 96, false], ['apple-touch-icon.png', 180, true], ['img/icon-192.png', 192, true], ['img/icon-512.png', 512, true], ['img/logo-512.png', 512, false]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(icon(size, padded), { waitUntil: 'load' });
  await page.screenshot({ path: join(root, 'static', file), omitBackground: !padded });
  console.log('icon', file);
}

// favicon.ico: 16, 32 and 48px PNG frames packed in the ICO container (valid in every modern browser and for Google).
const frames = [];
for (const size of [16, 32, 48]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(icon(size, false), { waitUntil: 'load' });
  frames.push([size, await page.screenshot({ omitBackground: true })]);
}
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(frames.length, 4);
const dir = [], data = [];
let offset = 6 + 16 * frames.length;
for (const [size, png] of frames) {
  const e = Buffer.alloc(16);
  e.writeUInt8(size === 256 ? 0 : size, 0); e.writeUInt8(size === 256 ? 0 : size, 1); e.writeUInt8(0, 2); e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6); e.writeUInt32LE(png.length, 8); e.writeUInt32LE(offset, 12);
  dir.push(e); data.push(png); offset += png.length;
}
writeFileSync(join(root, 'static/favicon.ico'), Buffer.concat([header, ...dir, ...data]));
console.log('icon favicon.ico');
await browser.close();
