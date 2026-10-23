// Captures homepage screenshots of the case-study sites into static/img/work/<slug>.webp (laptop, 1440 wide)
// and <slug>-phone.webp (phone, 390 wide at 2x). The build picks both up automatically.
//
// Run locally:  npm i playwright sharp && npx playwright install chromium && node scripts/screenshots.mjs
// Or on GitHub: Actions → "Refresh case study screenshots" → Run workflow (commits the result to main).
import { createRequire } from 'node:module';
import { mkdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { projects } from '../src/data/work.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(process.env.PLAYWRIGHT_REQUIRE_FROM || import.meta.url);
const { chromium } = require('playwright');
const sharp = require('sharp');

const outDir = join(root, 'static/img/work');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const shots = [
  { suffix: '', viewport: { width: 1440, height: 936 }, deviceScaleFactor: 1, isMobile: false },
  { suffix: '-phone', viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
];
for (const p of projects) for (const shotOpts of shots) {
  const { suffix, ...ctx } = shotOpts;
  const page = await browser.newPage(ctx);
  try {
    const res = await page.goto(p.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    // Dismiss cookie banners so they don't end up in the picture.
    for (const sel of ['[data-consent-choice="granted"]', 'button:has-text("Accept all")', 'button:has-text("Accept")']) {
      const b = page.locator(sel).first();
      if (await b.count()) { try { await b.click({ timeout: 1500 }); } catch {} }
    }
    // Nudge scroll-triggered animations into their final state, then return to the top.
    await page.evaluate(() => new Promise((r) => { window.scrollTo(0, 400); setTimeout(r, 300); }));
    await page.evaluate(() => new Promise((r) => { window.scrollTo(0, 0); setTimeout(r, 700); }));
    await page.evaluate(() => document.fonts.ready);
    const png = await page.screenshot();
    const file = join(outDir, `${p.slug}${suffix}.webp`);
    await sharp(png).webp({ quality: 82, effort: 6 }).toFile(file);
    console.log(`${p.slug}${suffix}: HTTP ${res && res.status()}, ${Math.round(statSync(file).size / 1024)} KB`);
  } catch (e) {
    console.error(`${p.slug}${suffix}: failed, ${e.message.split('\n')[0]}`);
    process.exitCode = 1;
  }
  await page.close();
}
await browser.close();
