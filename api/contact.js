// Vercel serverless function: receives the enquiry form and emails it via Resend.
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      required  Resend API key with sending access
//   CONTACT_TO_EMAIL    required  where enquiries go (comma-separate several)
//   CONTACT_FROM_EMAIL  optional  e.g. "Roffey-Roberts Web <enquiries@roffey-robertsweb.co.uk>"
//   CONTACT_AUTOREPLY   optional  "true" to send the customer a confirmation (needs a verified domain)
import { site } from '../src/data/site.mjs';

const LIMITS = { name: 120, business: 160, email: 200, phone: 40, website: 300, message: 5000, budget: 60, timeline: 60 };
const SERVICE_NAMES = {
  'website-design': 'Website design & build',
  seo: 'SEO',
  'digital-marketing': 'Digital marketing',
  'google-meta-ads': 'Google & Meta ads',
  'cyber-security': 'Cyber security',
  'website-hosting': 'Hosting & care',
  'not-sure': 'Not sure yet',
};

const escapeHtml = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const clip = (v, n) => (typeof v === 'string' ? v.trim().slice(0, n) : '');

// Best-effort throttle per warm instance.
const hits = new Map();
function throttled(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body);
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('too_large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
};

async function resendEmail(payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    throw new Error(`resend_${r.status}: ${text.slice(0, 300)}`);
  }
  return r.json();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  if (origin && host && new URL(origin).host !== host) return send(res, 403, { error: 'Forbidden.' });

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { error: 'We couldn’t read that submission. Please try again.' });
  }

  // Honeypot: bots fill every field. Pretend it worked.
  if (body.company_url) return send(res, 200, { ok: true });

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (throttled(ip)) return send(res, 429, { error: 'That’s a lot of enquiries in a short time. Please wait a few minutes and try again.' });

  const f = Object.fromEntries(Object.entries(LIMITS).map(([k, n]) => [k, clip(body[k], n)]));
  const services = Array.isArray(body.services) ? body.services.filter((s) => SERVICE_NAMES[s]).map((s) => SERVICE_NAMES[s]) : [];

  if (f.message.length < 10 || !f.name || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) {
    return send(res, 422, { error: 'Please add your name, a valid email address and a short message.' });
  }

  const to = (process.env.CONTACT_TO_EMAIL || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!process.env.RESEND_API_KEY || !to.length) {
    console.error('Enquiry form is not configured: set RESEND_API_KEY and CONTACT_TO_EMAIL.');
    const alt = site.email ? ` Please email us at ${site.email} instead.` : ' Please try again later.';
    return send(res, 503, { error: `Our enquiry form is being set up.${alt}` });
  }

  const from = process.env.CONTACT_FROM_EMAIL || `${site.name} <onboarding@resend.dev>`;
  const a = body.attribution && typeof body.attribution === 'object' ? body.attribution : null;
  const attrRows = a
    ? [
        ['First landing page', clip(a.landing, 200)],
        ['Referrer', clip(a.referrer, 300)],
        ...Object.entries(a.params || {}).map(([k, v]) => [k, clip(String(v), 200)]),
      ].filter(([, v]) => v)
    : [];

  const rows = [
    ['Name', f.name],
    ['Business', f.business],
    ['Email', f.email],
    ['Phone', f.phone],
    ['Website', f.website],
    ['Services', services.join(', ')],
    ['Budget', f.budget],
    ['Timeline', f.timeline],
    ['Sent from', clip(body.page, 200)],
    ...attrRows,
  ].filter(([, v]) => v);

  const table = rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#4A5E62;vertical-align:top;white-space:nowrap">${escapeHtml(k)}</td><td style="padding:6px 0;color:#0B2A31">${escapeHtml(v)}</td></tr>`)
    .join('');
  const htmlBody = `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#0B2A31">
<h2 style="margin:0 0 16px;font-size:20px">New enquiry from ${escapeHtml(f.name)}${f.business ? ` (${escapeHtml(f.business)})` : ''}</h2>
<p style="margin:0 0 20px;white-space:pre-wrap;padding:16px;background:#E3EAE9;border-radius:6px">${escapeHtml(f.message)}</p>
<table style="border-collapse:collapse">${table}</table>
<p style="margin-top:24px;color:#4A5E62;font-size:13px">Reply to this email to answer ${escapeHtml(f.name)} directly.</p></div>`;
  const textBody = `New enquiry from ${f.name}\n\n${f.message}\n\n${rows.map(([k, v]) => `${k}: ${v}`).join('\n')}\n`;

  try {
    await resendEmail({
      from,
      to,
      reply_to: f.email,
      subject: `New enquiry: ${f.name}${f.business ? `, ${f.business}` : ''}${services.length ? ` (${services.join(', ')})` : ''}`.slice(0, 180),
      html: htmlBody,
      text: textBody,
    });
  } catch (err) {
    console.error('Enquiry email failed', err);
    const alt = site.email ? ` You can also email us at ${site.email}.` : '';
    return send(res, 502, { error: `Your enquiry didn’t send. Please try again in a moment.${alt}` });
  }

  if (process.env.CONTACT_AUTOREPLY === 'true') {
    const first = escapeHtml(f.name.split(' ')[0]);
    await resendEmail({
      from,
      to: [f.email],
      reply_to: to[0],
      subject: `Thanks for getting in touch, ${f.name.split(' ')[0]}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#0B2A31"><p>Hi ${first},</p><p>Thanks for your enquiry. It’s with us, and we’ll reply within one working day.</p><p>If anything comes to mind in the meantime, just reply to this email.</p><p>${escapeHtml(site.name)}<br><a href="${site.url}" style="color:#0B2A31">${site.url.replace('https://', '')}</a></p></div>`,
      text: `Hi ${f.name.split(' ')[0]},\n\nThanks for your enquiry. It’s with us, and we’ll reply within one working day.\n\nIf anything comes to mind in the meantime, just reply to this email.\n\n${site.name}\n${site.url}\n`,
    }).catch((err) => console.error('Auto-reply failed', err));
  }

  return send(res, 200, { ok: true });
}
