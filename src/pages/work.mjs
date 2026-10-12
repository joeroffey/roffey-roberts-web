import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs } from '../lib/layout.mjs';
import { aurora, breadcrumb, browser, cta, featureGrid, serpCard, workCard, serviceIcons, tags } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { services, serviceBySlug } from '../data/services.mjs';
import { projects } from '../data/work.mjs';

function indexPage() {
  const used = services.filter((s) => projects.some((p) => p.scope.includes(s.slug)));
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb([['Home', '/'], ['Work', '/work']])}
        <span class="eyebrow">Work that works</span>
        <h1 class="display h1 page-title" id="page-title">Website design case studies <span class="grad-text">from the South Coast.</span></h1>
        <p class="lede">Websites for installers, engineers and studios along the South Coast. Each one built to be found locally and to turn visits into calls, quotes and bookings.</p>
      </div>
    </div>
  </section>
  <section class="section" style="padding-top:0" aria-label="Case studies">
    <div class="wrap">
      <div class="filters" data-filters data-reveal>
        <button class="filter" type="button" aria-pressed="true" data-filter="all">All projects</button>
        ${used.map((s) => html`<button class="filter" type="button" aria-pressed="false" data-filter="${s.slug}">${esc(s.short)}</button>`)}
      </div>
      <div class="work-grid" data-work-grid data-reveal-children>${projects.map(workCard)}</div>
    </div>
  </section>
  ${cta({ heading: 'Your business could be next.' })}
  `;
  return {
    path: '/work',
    title: 'Our Work: Website Case Studies | Roffey-Roberts Web',
    description: 'Website, SEO and hosting case studies for businesses on the South Coast, including DMC Industrial Doors, Solwat Green Energy and Revitalise Hub.',
    og: 'work',
    ogTitle: 'Work that works.',
    schema: [breadcrumbs([['Home', '/'], ['Work', '/work']])],
    body,
  };
}

function projectPage(p, i) {
  const next = projects[(i + 1) % projects.length];
  const crumbs = [['Home', '/'], ['Work', '/work'], [p.name, `/work/${p.slug}`]];
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb(crumbs)}
        <h1 class="display h1 page-title" id="page-title">${esc(p.name)}</h1>
        <p class="lede">${esc(p.summary)}</p>
        <dl class="case-meta">
          <div><dt>Sector</dt><dd>${esc(p.sector)}</dd></div>
          <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
          <div><dt>Scope</dt><dd>${esc(p.scopeLabel)}</dd></div>
          <div><dt>Live site</dt><dd><a href="${p.url}" rel="noopener" target="_blank">${esc(p.domain)}${icon.arrowUpRight}<span class="sr-only"> (opens in a new tab)</span></a></dd></div>
        </dl>
      </div>
      <div class="case-shot z" data-reveal style="--d:0.15s">${browser(p)}</div>
    </div>
  </section>

  <section class="section" aria-labelledby="brief-title">
    <div class="wrap two-col">
      <div data-reveal><span class="eyebrow">The brief</span><h2 class="h2" id="brief-title" style="margin-top:16px">What they needed</h2></div>
      <div class="lead-text" data-reveal>${p.brief.map((t) => html`<p>${esc(t)}</p>`)}</div>
    </div>
  </section>

  <section class="section rel" aria-labelledby="built-title">
    ${aurora(true)}
    <div class="wrap z">
      <div class="section-head" data-reveal>
        <span class="eyebrow">What we built</span>
        <h2 class="h2" id="built-title">Designed around how <span class="grad-text">customers choose.</span></h2>
        <div class="pill-list" style="margin-top:8px">${p.scope.map((s) => html`<a href="/services/${s}">${serviceIcons[s]}${esc(serviceBySlug[s].name)}</a>`)}</div>
      </div>
      ${featureGrid(p.built, [icon.layout, icon.pin, icon.send, icon.phone, icon.shield, icon.server])}
    </div>
  </section>

  <section class="section" aria-labelledby="search-title">
    <div class="wrap tool-grid">
      <div class="section-head" data-reveal style="margin:0">
        <span class="eyebrow">In search</span>
        <h2 class="h2" id="search-title">How it reads on Google.</h2>
        <p class="lede">The homepage title leads with the services and the area customers search for, with the brand at the end.</p>
      </div>
      <div class="card card-pad" data-reveal>${serpCard({ name: p.name, domain: p.domain, title: p.searchTitle })}</div>
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="next-title">
    <div class="wrap">
      <a class="card card-hover next-card" href="/work/${next.slug}" data-spot data-cursor="View" data-reveal>
        <div>
          <p class="next-label" id="next-title">Next case study</p>
          <p class="next-name">${esc(next.name)}</p>
          <p class="muted" style="margin-top:12px">${esc(next.sector)}</p>
          ${tags(next)}
          <p class="link link-arrow" style="margin-top:22px">Read the case study${icon.arrowRight}</p>
        </div>
        <div class="stack-shot" aria-hidden="true">${browser(next)}</div>
      </a>
    </div>
  </section>

  ${cta()}
  `;

  return {
    path: `/work/${p.slug}`,
    title: p.title,
    description: p.description,
    og: `work-${p.slug}`,
    ogTitle: p.name,
    schema: [
      {
        '@type': 'CreativeWork',
        name: `${p.name} website`,
        description: p.description,
        url: `${site.url}/work/${p.slug}`,
        creator: { '@id': `${site.url}/#organization` },
        about: { '@type': 'Organization', name: p.name, url: p.url },
        inLanguage: 'en-GB',
      },
      breadcrumbs(crumbs),
    ],
    body,
  };
}

export function pages() {
  return [indexPage(), ...projects.map(projectPage)];
}
