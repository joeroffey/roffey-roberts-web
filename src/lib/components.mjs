import { html, esc, icon } from './html.mjs';
import { serviceBySlug } from '../data/services.mjs';

export const serviceIcons = {
  'website-design': icon.layout,
  seo: icon.search,
  'digital-marketing': icon.megaphone,
  'google-meta-ads': icon.target,
  'cyber-security': icon.shield,
  'it-support': icon.laptop,
  'website-hosting': icon.server,
};

// ---------------------------------------------------------------------------
// Device mockups. Content comes from each client's live site; if a real screenshot
// exists at static/img/work/<slug>.jpg|png|webp it is used instead of the drawn mock.
// ---------------------------------------------------------------------------
function mockMarkup(p, mobile = false) {
  const m = p.mock;
  const links = html`<ul class="mk-links">${m.nav.map((n) => html`<li>${esc(n)}</li>`)}</ul>`;
  const nav = html`<div class="mk-nav"><span class="mk-logo">${esc(m.logo)}</span>${links}<span class="mk-btn ${m.dark ? 'mk-btn-light' : ''}">${esc(m.cta[0])}</span></div>`;
  const ctas = html`<div class="mk-ctas"><span class="mk-btn mk-btn-light">${esc(m.cta[0])}</span>${m.cta[1] && html`<span class="mk-btn mk-btn-line">${esc(m.cta[1])}</span>`}</div>`;

  let body = '';
  if (m.variant === 'quote') {
    body = html`
      <div class="mk-hero">
        <div>
          <p class="mk-eyebrow">${esc(m.eyebrow)}</p>
          <p class="mk-h1">${esc(m.headline)}</p>
          ${ctas}
          <ul class="mk-points">${m.points.map((pt) => html`<li>${esc(pt)}</li>`)}</ul>
        </div>
        ${mobile
          ? html`<span class="mk-photo ${m.photo}"></span>`
          : html`<div class="mk-form"><b>Request a quote</b><span class="mk-field">Service <i>Roller shutters</i></span><span class="mk-seg"><span>Emergency</span><span class="on">This week</span><span>Planning ahead</span></span><span class="mk-field">Site postcode <i>BH24</i></span><span class="mk-btn">Send request</span></div>`}
      </div>
      ${mobile ? '' : html`<ul class="mk-tiles">${m.items.map((it, i) => html`<li><span class="mk-photo ${m.photos[i % m.photos.length]}"></span><b>${esc(it)}</b></li>`)}</ul>`}`;
  } else if (m.variant === 'services') {
    body = html`
      <div class="mk-hero">
        <div><p class="mk-eyebrow">${esc(m.eyebrow)}</p><p class="mk-h1">${esc(m.headline)}</p>${ctas}</div>
        <span class="mk-photo ${m.photo}"></span>
      </div>
      <ul class="mk-tiles">${m.items.slice(0, mobile ? 2 : 3).map((it, i) => html`<li><span class="mk-photo ${m.photos[i % m.photos.length]}"></span><b>${esc(it)}</b></li>`)}</ul>`;
  } else if (m.variant === 'areas') {
    body = html`
      <div class="mk-hero">
        <div><p class="mk-h1">${esc(m.headline)}</p><p class="mk-sub">${esc(m.eyebrow)}</p>${ctas}</div>
        <span class="mk-photo ${m.photo}"></span>
      </div>
      <p class="mk-label">Areas we cover</p>
      <ul class="mk-chips">${m.items.map((it) => html`<li>${esc(it)}</li>`)}</ul>`;
  } else {
    body = html`
      <div class="mk-hero"><div><p class="mk-eyebrow">${esc(m.eyebrow)}</p><p class="mk-h1">${esc(m.headline)}</p></div></div>
      <ul class="mk-cards">${m.items.map((it, i) => html`<li><span class="mk-photo ${m.photos[i % m.photos.length]}"></span><b>${esc(it)}</b><i>Book now</i></li>`)}</ul>
      ${mobile ? '' : html`<ul class="mk-stats">${m.stats.map(([a, b]) => html`<li><b>${esc(a)}</b>${esc(b)}</li>`)}</ul>`}`;
  }
  const cls = ['mock', 'mk', mobile ? 'mk-m' : '', m.dark ? 'mk-dark' : '', m.variant === 'booking' ? 'mk-booking' : '', m.cls || ''].filter(Boolean).join(' ');
  return html`<div class="${cls}" style="--brand:${m.brand};--brand-2:${m.brand2 || m.brand}" aria-hidden="true">${nav}${body}</div>`;
}

export function browser(p, { mobile = false } = {}) {
  const screen = p.screenshot
    ? html`<img src="${p.screenshot}" alt="${esc(p.name)} homepage, designed and built by Roffey-Roberts Web" loading="lazy" decoding="async" width="1440" height="936">`
    : mockMarkup(p, mobile);
  return html`
  <div class="browser" aria-hidden="true">
    <div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span><span class="browser-url">${icon.lock}${esc(p.domain)}</span></div>
    <div class="browser-screen">${screen}</div>
  </div>`;
}

export const phone = (p) => html`<div class="phone" aria-hidden="true"><div class="phone-screen"><span class="phone-notch"></span>${mockMarkup(p, true)}</div></div>`;

export const shot = (p) => html`
  <figure class="stack-shot">
    ${browser(p)}
    <figcaption class="sr-only">${esc(p.name)} website</figcaption>
  </figure>`;

// ---------------------------------------------------------------------------
// Service visuals for the bento grid and service page heroes.
// ---------------------------------------------------------------------------
export function serviceVisual(slug, labels) {
  switch (slug) {
    case 'website-design':
      return html`<div class="vis-window"><div class="vis-window-bar"><i></i><i></i><i></i><span class="vis-window-url"></span></div><div class="vis-window-nav"><i></i><span><i></i><i></i><i></i></span><em></em></div><div class="vis-window-body"><div class="vis-lines"><i></i><i></i><i></i><i></i></div><div class="vis-box"></div></div><div class="vis-window-tiles"><i></i><i></i><i></i></div></div>`;
    case 'seo':
      return html`<div class="vis-rank">${[28, 40, 52, 66, 82, 100].map((h) => html`<i style="--h:${h}%"></i>`)}</div><span class="vis-rank-chip">${icon.trend} Page 1</span>`;
    case 'google-meta-ads':
      return html`<div class="vis-ads">
        <div class="vis-ad vis-ad-google"><b><i>Ad</i> Heat Pump Servicing, Lymington</b><span>Book an MCS-certified engineer. Same-week slots.</span></div>
        <div class="vis-spark"><span>Cost per enquiry, falling</span><svg viewBox="0 0 90 28" fill="none" aria-hidden="true"><path d="M2 6c10 2 14 10 24 12s14-4 24 0 14 6 24 4 10-6 14-10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></div>
      </div>`;
    case 'digital-marketing':
      return html`<ul class="vis-channels"><li>${icon.mail} Email</li><li>${icon.star} <span class="stars">★★★★★</span> Reviews</li><li>${icon.users} Social</li><li>${icon.file} Landing pages</li><li>${icon.chart} Tracking</li></ul>`;
    case 'cyber-security':
      return html`<div class="vis-shield">${icon.shield}</div><ul class="vis-locks">${(labels || ['MFA', 'DMARC', 'Backups', 'Updates']).map((l) => html`<li>${esc(l)}</li>`)}</ul>`;
    case 'it-support':
      return html`<ul class="vis-channels"><li>${icon.mail} Email set up</li><li>${icon.laptop} Laptop ready</li><li>${icon.lock} 365 secured</li><li>${icon.globe} Wi-Fi sorted</li><li>${icon.phone} Someone to call</li></ul>`;
    case 'website-hosting':
      return html`<div class="vis-uptime"><div class="vis-uptime-row"><b>All systems normal</b><span>Monitored 24/7</span></div><div class="vis-ticks">${Array.from({ length: 30 }, () => '<i></i>')}</div></div><span class="vis-globe"></span>`;
    default:
      return '';
  }
}

const bentoSize = { 'website-design': 'b-7', seo: 'b-5', 'digital-marketing': 'b-5', 'google-meta-ads': 'b-4', 'cyber-security': 'b-4', 'it-support': 'b-4', 'website-hosting': 'b-12 b-wide' };

export const serviceCard = (s, size = bentoSize[s.slug]) => html`
  <a class="card card-hover service-card ${size}" href="/services/${s.slug}" data-spot>
    <div class="service-card-head"><span class="icon-tile">${serviceIcons[s.slug]}</span><span class="link-icon">${icon.arrowUpRight}</span></div>
    <h3>${esc(s.name)}</h3>
    <p>${esc(s.card)}</p>
    <div class="service-visual">${serviceVisual(s.slug)}</div>
  </a>`;

// ---------------------------------------------------------------------------
export const breadcrumb = (items) => html`
  <nav class="crumbs" aria-label="Breadcrumb">
    ${items.map(([label, href], i) =>
      i === items.length - 1
        ? html`<span aria-current="page">${esc(label)}</span>`
        : html`<a href="${href}">${esc(label)}</a>${icon.chevronDown}`
    )}
  </nav>`;

export const faqSection = (faqs, { heading = 'Questions, answered', text = 'The things people ask before they get in touch.', id = 'faq' } = {}) => html`
  <section class="section" aria-labelledby="${id}-title">
    <div class="wrap faq-grid">
      <div class="section-head" data-reveal>
        <span class="eyebrow">FAQ</span>
        <h2 class="h2" id="${id}-title">${heading}</h2>
        <p class="lede">${text}</p>
      </div>
      <div class="faq-list" data-accordion data-reveal-children>
        ${faqs.map(
          ([q, a], i) => html`
          <div class="card faq-item">
            <button class="faq-q" type="button" aria-expanded="false" aria-controls="${id}-a${i}" id="${id}-q${i}"><span>${esc(q)}</span>${icon.plus}</button>
            <div class="faq-a" id="${id}-a${i}" role="region" aria-labelledby="${id}-q${i}"><div><p>${esc(a)}</p></div></div>
          </div>`
        )}
      </div>
    </div>
  </section>`;

export const aurora = (soft = false) => html`<div class="aurora${soft ? ' aurora-soft' : ''}" aria-hidden="true"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>`;

export const cta = ({
  heading = 'Let’s build something that works.',
  text = 'Tell us about your business and what you need. We reply within one working day with straight advice and a clear next step.',
  button = 'Start a project',
  href = '/contact',
  review = true,
} = {}) => html`
  <section class="cta" aria-labelledby="cta-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z cta-inner" data-reveal>
      <h2 class="display cta-title" id="cta-title">${heading}</h2>
      <p class="lede">${text}</p>
      <div class="btn-row">
        <a class="btn btn-primary btn-lg" href="${href}">${button}${icon.arrowRight}</a>
        ${review && html`<a class="btn btn-ghost btn-lg" href="/contact?review=1">Get a free website review</a>`}
      </div>
    </div>
  </section>`;

export const timeline = (steps) => html`
  <ol class="timeline" data-timeline data-reveal-children>
    ${steps.map(([t, d], i) => html`<li class="step" style="--i:${i}"><span class="step-n" aria-hidden="true">${i + 1}</span><div class="card step-card" data-spot><h3>${esc(t)}</h3><p>${esc(d)}</p></div></li>`)}
  </ol>`;

export const featureGrid = (items, icons = []) => html`
  <ul class="feature-grid" data-reveal-children>
    ${items.map(([t, d], i) => html`<li class="card feature" data-spot><span class="icon-tile">${icons[i] || icon.check}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)}
  </ul>`;

export const tags = (p) => html`<div class="tags">${p.scope.map((s) => html`<span class="tag">${esc(serviceBySlug[s]?.short || s)}</span>`)}</div>`;

export const workCard = (p) => html`
  <a class="card card-hover work-card" href="/work/${p.slug}" data-spot data-scope="${p.scope.join(' ')}" data-cursor="View">
    ${shot(p)}
    <div class="work-card-body">
      ${tags(p)}
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.summary)}</p>
    </div>
  </a>`;

export const stackCard = (p, i) => html`
  <article class="stack-card" style="--i:${i}">
    <div class="stack-text">
      <div class="tags"><span class="tag tag-accent">${esc(p.sector)}</span><span class="tag">${esc(p.location.split(',')[0])}</span></div>
      <h3><a href="/work/${p.slug}">${esc(p.name)}</a></h3>
      <p>${esc(p.summary)}</p>
      ${tags(p)}
      <div class="stack-links">
        <a class="link link-arrow" href="/work/${p.slug}">Read the case study${icon.arrowRight}</a>
        <a class="link muted" href="${p.url}" rel="noopener" target="_blank">Visit site${icon.arrowUpRight}<span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
    <a class="project-shot" href="/work/${p.slug}" tabindex="-1" aria-hidden="true" data-cursor="View">${shot(p)}</a>
  </article>`;

export const serpCard = ({ name, domain, title, desc = '' }) => html`
  <div class="serp" data-serp>
    <div class="serp-site">
      <span class="serp-fav" data-serp-initial aria-hidden="true">${esc(name[0])}</span>
      <span class="serp-source"><span data-serp-name>${esc(name)}</span><span data-serp-url>${esc(domain)}</span></span>
    </div>
    <p class="serp-title" data-serp-title>${esc(title)}</p>
    ${desc && html`<p class="serp-desc" data-serp-desc>${esc(desc)}</p>`}
  </div>`;

// Testimonials: a row of quote cards. Renders nothing when the list is empty.
export const testimonialSection = (items, { heading = 'What clients say', eyebrow = 'In their words' } = {}) =>
  items.length
    ? html`
  <section class="section section-tight" aria-labelledby="testimonials-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${esc(eyebrow)}</span>
        <h2 class="h2" id="testimonials-title">${esc(heading)}</h2>
      </div>
      <div class="quote-grid" data-reveal-children>
        ${items.map(
          (t) => html`
        <figure class="card card-pad quote" data-spot>
          <blockquote><p>${esc(t.quote)}</p></blockquote>
          <figcaption><b>${esc(t.name)}</b>${t.role && html`<span>${esc(t.role)}</span>`}${t.source === 'google' && html`<span class="quote-source">${icon.star}Google review</span>`}</figcaption>
        </figure>`
        )}
      </div>
    </div>
  </section>`
    : '';

// Results: measured outcomes for a case study. Renders nothing when there are none.
export const resultsBlock = (results) =>
  results.length
    ? html`
  <section class="section section-tight" aria-labelledby="results-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Results</span>
        <h2 class="h2" id="results-title">What changed.</h2>
      </div>
      <div class="stats" data-reveal-children>
        ${results.map(([n, text]) => html`<div class="card stat" data-spot><b>${esc(n)}</b><span>${esc(text)}</span></div>`)}
      </div>
    </div>
  </section>`
    : '';

// Card for a specialist cyber security service (under /services/cyber-security/).
export const cyberCard = (c) => html`
  <a class="card card-hover guide-card" href="/services/cyber-security/${c.slug}" data-spot data-cursor="View">
    <span class="icon-tile">${icon[c.icon] || icon.shield}</span>
    <h3 class="h3">${esc(c.name)}</h3>
    <p class="muted">${esc(c.card)}</p>
    <span class="link link-arrow">Find out more${icon.arrowRight}</span>
  </a>`;
