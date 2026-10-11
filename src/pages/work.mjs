import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs } from '../lib/layout.mjs';
import { breadcrumb, ctaBand, projectRow, serviceLinks, shot } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { projects } from '../data/work.mjs';

function indexPage() {
  const body = html`
  <section class="page-hero s-dark page-hero-tight" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb([['Home', '/'], ['Work', '/work']])}
      <h1 class="page-title" id="page-title">Work</h1>
      <div class="page-hero-foot">
        <p class="page-lede">Websites for installers, engineers and studios along the South Coast. Each one built to be found locally and to turn visits into calls, quotes and bookings.</p>
      </div>
    </div>
  </section>
  <section class="section s-dark work-list" aria-label="Case studies">
    <div class="wrap projects">
      ${projects.map((p, i) => projectRow(p, i, { headingLevel: 2 }))}
    </div>
  </section>
  ${ctaBand({ heading: 'Your business could be next.' })}
  `;
  return {
    path: '/work',
    title: 'Our Work: Website Case Studies | Roffey-Roberts Web',
    description:
      'Website, SEO and hosting case studies for businesses on the South Coast, including DMC Industrial Doors, Solwat Green Energy and Revitalise Hub.',
    og: 'work',
    ogTitle: 'Recent work',
    schema: [breadcrumbs([['Home', '/'], ['Work', '/work']])],
    body,
  };
}

function projectPage(p, i) {
  const next = projects[(i + 1) % projects.length];
  const crumbs = [['Home', '/'], ['Work', '/work'], [p.name, `/work/${p.slug}`]];
  const body = html`
  <section class="page-hero s-dark case-hero" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb(crumbs)}
      <h1 class="page-title" id="page-title">${esc(p.name)}</h1>
      <div class="page-hero-foot">
        <p class="page-lede">${esc(p.summary)}</p>
        <dl class="case-meta">
          <div><dt>Sector</dt><dd>${esc(p.sector)}</dd></div>
          <div><dt>Location</dt><dd>${esc(p.location)}</dd></div>
          <div><dt>Scope</dt><dd>${serviceLinks(p.scope)}</dd></div>
          <div><dt>Live site</dt><dd><a href="${p.url}" rel="noopener" target="_blank">${esc(p.domain)}${icon.arrowUpRight}<span class="sr-only"> (opens in a new tab)</span></a></dd></div>
        </dl>
      </div>
    </div>
    <div class="wrap case-shot">${shot(p, { eager: true })}</div>
  </section>

  <section class="section s-white" aria-labelledby="brief-title">
    <div class="wrap case-brief">
      <h2 class="h2" id="brief-title">The brief</h2>
      <div class="lead-block lead-block-tight">${p.brief.map((t) => html`<p>${esc(t)}</p>`)}</div>
    </div>
  </section>

  <section class="section s-fog" aria-labelledby="built-title">
    <div class="wrap">
      <h2 class="h2 included-title" id="built-title">What we built</h2>
      <ul class="included">
        ${p.built.map(([t, d]) => html`<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)}
      </ul>
    </div>
  </section>

  <section class="section s-white" aria-labelledby="search-title">
    <div class="wrap case-search">
      <div>
        <h2 class="h2" id="search-title">How it reads in search</h2>
        <p>The homepage title leads with the services and the area customers search for, with the brand at the end.</p>
      </div>
      <div class="serp serp-static">
        <div class="serp-site">
          <span class="serp-fav" aria-hidden="true">${esc(p.name[0])}</span>
          <span class="serp-source"><span>${esc(p.name)}</span><span>${esc(p.domain)}</span></span>
        </div>
        <p class="serp-title">${esc(p.searchTitle)}</p>
      </div>
    </div>
  </section>

  <section class="section s-dark next-project" aria-labelledby="next-title">
    <div class="wrap next-grid">
      <div>
        <p class="next-label" id="next-title">Next case study</p>
        <p class="next-name"><a href="/work/${next.slug}">${esc(next.name)}</a></p>
        <p class="next-sector">${esc(next.sector)}</p>
      </div>
      <a class="project-shot" href="/work/${next.slug}" tabindex="-1" aria-hidden="true">${shot(next)}</a>
    </div>
  </section>

  ${ctaBand()}
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
