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
// The browser frame around a real screenshot of a client site (static/img/work/<slug>.webp).
// ---------------------------------------------------------------------------
export function browser(p) {
  const screen = html`<img src="${p.screenshot}" alt="${esc(p.name)} homepage, designed and built by Roffey-Roberts Web" loading="lazy" decoding="async" width="1440" height="936">`;
  return html`
  <div class="browser" data-ui aria-hidden="true">
    <div class="browser-bar"><span class="browser-url">${esc(p.domain)}</span></div>
    <div class="browser-screen">${screen}</div>
  </div>`;
}

export const shot = (p) => html`
  <figure class="stack-shot">
    ${browser(p)}
    ${p.phoneShot && html`<img class="shot-phone" src="${p.phoneShot}" alt="${esc(p.name)} website at phone width" width="780" height="1688" loading="lazy" decoding="async">`}
    <figcaption class="sr-only">${esc(p.name)} website, on a laptop and a phone</figcaption>
  </figure>`;


export const serviceCard = (s) => html`
  <a class="card card-hover service-card" href="/services/${s.slug}" data-press>
    <div class="service-card-head"><h3>${esc(s.name)}</h3><span class="link-icon">${icon.arrowUpRight}</span></div>
    <p>${esc(s.card)}</p>
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

export const faqSection = (faqs, { heading = 'Questions, answered', id = 'faq' } = {}) => html`
  <section class="section" aria-labelledby="${id}-title">
    <div class="wrap ax">
      <h2 class="h3 col-heading" id="${id}-title" data-reveal>${esc(heading)}</h2>
      <div class="faq-text" data-reveal>
        ${faqs.map(([q, a]) => html`<p><b>${esc(q)}</b> ${esc(a)}</p>`)}
      </div>
    </div>
  </section>`;

export const aurora = (soft = false) => html`<div class="aurora${soft ? ' aurora-soft' : ''}" aria-hidden="true"><span class="a1"></span><span class="a2"></span><span class="a3"></span></div>`;

export const cta = ({
  heading = 'Let’s make yours work.',
  text = 'Tell us about your business and what you need. We reply within one working day with straight advice and a clear next step.',
  button = 'Start a project',
  href = '/contact',
} = {}) => html`
  <section class="cta" aria-labelledby="cta-title">
    <div class="wrap cta-inner" data-reveal>
      <h2 class="display cta-title" id="cta-title">${heading}</h2>
      <div class="cta-foot">
        <p>${text}</p>
        <a class="btn btn-primary btn-lg" href="${href}" data-press>${button}${icon.arrowRight}</a>
      </div>
    </div>
  </section>`;

export const timeline = (steps) => html`
  <ol class="steps-list" data-reveal-children>
    ${steps.map(([t, d]) => html`<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)}
  </ol>`;

export const featureGrid = (items) => html`
  <ul class="feature-grid" data-reveal-children>
    ${items.map(([t, d]) => html`<li class="card feature"><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)}
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
  <article class="stack-card" style="--i:${i}" data-scope="${p.scope.join(' ')}">
    <div class="stack-text">
      <h3><a href="/work/${p.slug}">${esc(p.name)}</a></h3>
      <p class="stack-sector">${esc(p.sector)}, ${esc(p.location.split(',')[0])}</p>
      <p>${esc(p.summary)}</p>
      ${tags(p)}
      <div class="stack-links">
        <a class="link link-under" href="/work/${p.slug}">Read the case study</a>
        <a class="link link-under muted" href="${p.url}" rel="noopener" target="_blank">Visit site<span class="sr-only"> (opens in a new tab)</span></a>
      </div>
    </div>
    <a class="project-shot" href="/work/${p.slug}" tabindex="-1" aria-hidden="true" data-cursor="View">${shot(p)}</a>
  </article>`;

export const serpCard = ({ name, domain, title, desc = '' }) => html`
  <div class="serp" data-serp data-ui>
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
