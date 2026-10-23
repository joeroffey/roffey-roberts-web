import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs, faqSchema } from '../lib/layout.mjs';
import { aurora, breadcrumb, cta, faqSection, featureGrid, serviceIcons, workCard } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { services } from '../data/services.mjs';
import { areas } from '../data/areas.mjs';
import { projectBySlug } from '../data/work.mjs';

function areaPage(a) {
  const crumbs = [['Home', '/'], ['Areas', '/web-design'], [a.short, `/web-design/${a.slug}`]];
  const nearby = a.nearby.map((s) => projectBySlug[s]).filter(Boolean);
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb(crumbs)}
        <span class="eyebrow">${icon.pin} ${esc(a.name)}, ${esc(a.county)}</span>
        <h1 class="display h1 page-title" id="page-title">${esc(a.h1)}</h1>
        <p class="lede">${esc(a.lede)}</p>
        <div class="btn-row">
          <a class="btn btn-primary btn-lg" href="/contact?area=${encodeURIComponent(a.short)}" data-press>Start a project${icon.arrowRight}</a>
          ${site.phone && html`<a class="btn btn-ghost btn-lg" href="tel:${esc(site.phoneHref || site.phone)}">${icon.phone}${esc(site.phone)}</a>`}
        </div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="local-title">
    <div class="wrap">
      <div class="two-col" style="margin-bottom:clamp(56px,7vw,96px)">
        <div data-reveal><h2 class="h3 col-heading">Why it’s different here</h2></div>
        <div class="lead-text" data-reveal>${a.intro.map((p) => html`<p>${esc(p)}</p>`)}</div>
      </div>
      <div class="section-head" data-reveal>
        <h2 class="h2" id="local-title">Built to be found <span class="grad-text">locally.</span></h2>
      </div>
      ${featureGrid(a.local, [icon.pin, icon.search, icon.bolt])}
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="svc-title">
    <div class="wrap" data-reveal>
      <h2 class="h3" id="svc-title" style="margin-bottom:18px">Services for ${esc(a.name)} businesses</h2>
      <div class="pill-list">${services.map((s) => html`<a href="/services/${s.slug}">${serviceIcons[s.slug]}${esc(s.name)}</a>`)}</div>
    </div>
  </section>

  ${nearby.length
    ? html`
  <section class="section rel" aria-labelledby="nearby-title">
    ${aurora(true)}
    <div class="wrap z">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="nearby-title">Work we’ve done <span class="grad-text">near ${esc(a.short)}.</span></h2>
        <p class="lede">${esc(a.nearbyNote)}</p>
      </div>
      <div class="work-grid" data-reveal-children>${nearby.slice(0, 2).map(workCard)}</div>
      ${nearby.length > 2 ? html`<p class="btn-row" style="margin-top:28px"><a class="btn btn-ghost" href="/work">All case studies${icon.arrowRight}</a></p>` : ''}
    </div>
  </section>`
    : ''}

  ${faqSection(a.faqs, { heading: `${a.short} questions`, text: 'What local businesses ask before they get in touch.' })}
  ${cta({ heading: `Let’s talk about your ${a.short} business.`, href: `/contact?area=${encodeURIComponent(a.short)}` })}
  `;

  return {
    path: `/web-design/${a.slug}`,
    title: a.title,
    description: a.description,
    og: `area-${a.slug}`,
    ogTitle: a.h1,
    schema: [
      {
        '@type': 'Service',
        '@id': `${site.url}/web-design/${a.slug}#service`,
        name: `Web design in ${a.name}`,
        serviceType: 'Web design',
        description: a.description,
        provider: { '@id': `${site.url}/#organization` },
        areaServed: { '@type': 'City', name: a.name, containedInPlace: { '@type': 'AdministrativeArea', name: a.county } },
        url: `${site.url}/web-design/${a.slug}`,
      },
      breadcrumbs(crumbs),
      faqSchema(a.faqs),
    ],
    body,
  };
}

function indexPage() {
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb([['Home', '/'], ['Areas', '/web-design']])}
        <h1 class="display h1 page-title" id="page-title">Web design across Hampshire <span class="grad-text">and the South Coast.</span></h1>
        <p class="lede">We’re based in ${esc(site.base)} and work with businesses from Portsmouth to Poole, and anywhere else in the UK over a video call. These are the places we know best.</p>
      </div>
    </div>
  </section>
  <section class="section" style="padding-top:0" aria-label="Areas">
    <div class="wrap">
      <ul class="feature-grid" data-reveal-children>
        ${areas.map(
          (a) => html`
          <li class="card card-hover feature" data-spot>
            <span class="icon-tile">${icon.pin}</span>
            <h2 class="h3"><a href="/web-design/${a.slug}" class="link" style="font:inherit">${esc(a.h1)}</a></h2>
            <p>${esc(a.lede)}</p>
            <p style="margin-top:14px"><a class="link link-arrow" href="/web-design/${a.slug}">About ${esc(a.short)}${icon.arrowRight}</a></p>
          </li>`
        )}
      </ul>
    </div>
  </section>
  ${cta({ heading: 'Not on the list? We still work there.', text: 'Most projects run over video calls, email and a shared preview link, wherever you are in the UK.' })}
  `;
  return {
    path: '/web-design',
    title: 'Areas We Cover: Web Design South Coast | Roffey-Roberts Web',
    description: 'Web design, SEO and ads for businesses in Southampton, Portsmouth, Winchester, Bournemouth, Lymington and across Hampshire and the South Coast.',
    og: 'areas',
    ogTitle: 'Web design across Hampshire and the South Coast.',
    schema: [
      breadcrumbs([['Home', '/'], ['Areas', '/web-design']]),
      { '@type': 'ItemList', itemListElement: areas.map((a, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/web-design/${a.slug}`, name: a.h1 })) },
    ],
    body,
  };
}

export function pages() {
  return [indexPage(), ...areas.map(areaPage)];
}
