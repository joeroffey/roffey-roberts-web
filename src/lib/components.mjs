import { html, esc, icon } from './html.mjs';
import { serviceBySlug } from '../data/services.mjs';

// ---------------------------------------------------------------------------
// Browser-framed illustrations of client sites, drawn in HTML so they stay sharp
// at any size. Content (nav, headlines, calls to action) comes from the live sites.
// ---------------------------------------------------------------------------
function mockInner(p) {
  const m = p.mock;
  const nav = html`<ul class="m-nav">${m.nav.map((n) => html`<li>${esc(n)}</li>`)}</ul>`;

  if (m.variant === 'quote') {
    return html`
      <div class="m-bar m-bar-dark"><span class="m-logo">${esc(m.logo)}</span>${nav}<span class="m-btn m-btn-light">${esc(m.cta[0])}</span></div>
      <div class="m-hero m-hero-quote">
        <div class="m-copy">
          <p class="m-eyebrow">${esc(m.eyebrow)}</p>
          <p class="m-h1">${esc(m.headline)}</p>
          <div class="m-ctas"><span class="m-btn m-btn-light">${esc(m.cta[0])}</span><span class="m-btn m-btn-line">${esc(m.cta[1])}</span></div>
          <ul class="m-points">${m.points.map((pt) => html`<li>${esc(pt)}</li>`)}</ul>
        </div>
        <div class="m-form">
          <p class="m-form-title">Request a quote</p>
          <span class="m-field">Service <i>Roller shutters</i></span>
          <span class="m-label">How urgent is it?</span>
          <span class="m-seg"><b>Emergency</b><b class="on">This week</b><b>Planning ahead</b></span>
          <span class="m-field">Site postcode <i>BH24</i></span>
          <span class="m-drop">Add photos, up to 6</span>
          <span class="m-btn m-btn-brand">Send request</span>
        </div>
      </div>`;
  }

  if (m.variant === 'services') {
    return html`
      <div class="m-bar"><span class="m-logo m-logo-brand">${esc(m.logo)}</span>${nav}<span class="m-btn m-btn-brand">${esc(m.cta[0])}</span></div>
      <div class="m-hero m-hero-band">
        <p class="m-eyebrow">${esc(m.eyebrow)}</p>
        <p class="m-h1">${esc(m.headline)}</p>
        <div class="m-ctas"><span class="m-btn m-btn-light">${esc(m.cta[0])}</span><span class="m-btn m-btn-line">${esc(m.cta[1])}</span></div>
      </div>
      <ul class="m-tiles">${m.items.map((it, i) => html`<li><span class="m-photo m-photo-${i % 3}"></span><b>${esc(it)}</b></li>`)}</ul>`;
  }

  if (m.variant === 'areas') {
    return html`
      <div class="m-bar m-bar-dark"><span class="m-logo">${esc(m.logo)}</span>${nav}<span class="m-btn m-btn-light">${esc(m.cta[0])}</span></div>
      <div class="m-hero m-hero-split">
        <div class="m-copy">
          <p class="m-h1">${esc(m.headline)}</p>
          <p class="m-sub">${esc(m.eyebrow)}.</p>
          <div class="m-ctas"><span class="m-btn m-btn-light">${esc(m.cta[0])}</span><span class="m-btn m-btn-line">${esc(m.cta[1])}</span></div>
        </div>
        <span class="m-photo m-photo-1 m-photo-tall"></span>
      </div>
      <div class="m-areas"><p class="m-label">Areas we cover</p><ul>${m.items.map((it) => html`<li>${esc(it)}</li>`)}</ul></div>`;
  }

  // booking
  return html`
    <div class="m-bar m-bar-dark"><span class="m-logo m-logo-thin">${esc(m.logo)}</span>${nav}<span class="m-btn m-btn-ice">${esc(m.cta[0])}</span></div>
    <div class="m-hero m-hero-booking">
      <p class="m-eyebrow">${esc(m.eyebrow)}</p>
      <p class="m-h1">${esc(m.headline)}</p>
    </div>
    <ul class="m-cards">${m.items.map((it, i) => html`<li><span class="m-photo m-photo-${i + 3}"></span><b>${esc(it)}</b><i>Book now</i></li>`)}</ul>
    <ul class="m-stats">${m.stats.map(([a, b]) => html`<li><b>${esc(a)}</b>${esc(b)}</li>`)}</ul>`;
}

export function shot(p, { eager = false } = {}) {
  return html`
  <figure class="shot" style="--brand:${p.mock.brand}">
    <div class="shot-bar" aria-hidden="true"><span class="shot-url">${icon.lock}${esc(p.domain)}</span></div>
    <div class="shot-screen" aria-hidden="true"><div class="mock mock-${p.mock.variant}">${mockInner(p)}</div></div>
    <figcaption class="sr-only">Illustration of the ${esc(p.name)} website${eager ? '' : ''}</figcaption>
  </figure>`;
}

// ---------------------------------------------------------------------------
export const breadcrumb = (items) => html`
  <nav class="crumbs" aria-label="Breadcrumb">
    <ol>
      ${items.map(([label, href], i) =>
        i === items.length - 1
          ? html`<li><span aria-current="page">${esc(label)}</span></li>`
          : html`<li><a href="${href}">${esc(label)}</a></li>`
      )}
    </ol>
  </nav>`;

export const faqList = (faqs, { heading = 'Questions people ask', id = 'faq' } = {}) => html`
  <section class="section s-white" aria-labelledby="${id}-title">
    <div class="wrap faq">
      <h2 class="h2" id="${id}-title">${heading}</h2>
      <div class="faq-list">
        ${faqs.map(
          ([q, a]) => html`
          <details class="faq-item">
            <summary><span>${esc(q)}</span>${icon.plus}</summary>
            <div class="faq-answer"><p>${esc(a)}</p></div>
          </details>`
        )}
      </div>
    </div>
  </section>`;

export const ctaBand = ({
  heading = 'Got something in mind?',
  text = 'Tell us what you need. We’ll reply within one working day with straight advice, even if that’s “you don’t need us yet”.',
  button = 'Start a project',
  href = '/contact',
} = {}) => html`
  <section class="section s-amber cta-band" aria-labelledby="cta-title">
    <div class="wrap cta-inner">
      <h2 class="cta-title" id="cta-title">${heading}</h2>
      <div class="cta-side">
        <p>${text}</p>
        <a class="btn btn-dark" href="${href}">${button}</a>
      </div>
    </div>
  </section>`;

export const projectRow = (p, i, { headingLevel = 3 } = {}) => {
  const h = `h${headingLevel}`;
  return html`
  <article class="project${i % 2 ? ' project-flip' : ''}">
    <a class="project-shot" href="/work/${p.slug}" tabindex="-1" aria-hidden="true">${shot(p)}</a>
    <div class="project-text">
      <p class="project-meta">${esc(p.sector)}, ${esc(p.location.split(',')[0])}</p>
      <${h} class="project-name"><a href="/work/${p.slug}">${esc(p.name)}</a></${h}>
      <p class="project-summary">${esc(p.summary)}</p>
      <p class="project-scope"><span>Scope</span> ${esc(p.scopeLabel)}</p>
      <p class="project-links">
        <a class="link-strong" href="/work/${p.slug}">Read the case study</a>
        <a class="link-quiet" href="${p.url}" rel="noopener" target="_blank">Visit the live site${icon.arrowUpRight}<span class="sr-only"> (opens in a new tab)</span></a>
      </p>
    </div>
  </article>`;
};

export const serviceLinks = (slugs) =>
  slugs
    .map((s) => serviceBySlug[s])
    .filter(Boolean)
    .map((s) => html`<a href="/services/${s.slug}">${esc(s.name)}</a>`)
    .join(', ');
