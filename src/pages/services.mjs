import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs, faqSchema } from '../lib/layout.mjs';
import { aurora, breadcrumb, cta, faqSection, featureGrid, serviceVisual, serviceIcons, serviceCard, timeline, workCard } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { groups, services, servicesInGroup, serviceBySlug } from '../data/services.mjs';
import { projectBySlug } from '../data/work.mjs';
import { areas } from '../data/areas.mjs';
import { guidesForService } from '../data/guides.mjs';
import { guideCard } from './guides.mjs';
import { cyberGrid } from './cyber.mjs';

function servicePage(s) {
  const related = s.related.map((slug) => projectBySlug[slug]).filter(Boolean);
  const others = services.filter((o) => o.slug !== s.slug);
  const crumbs = [['Home', '/'], ['Services', '/services'], [s.name, `/services/${s.slug}`]];

  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z page-hero-grid">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb(crumbs)}
        <h1 class="display h1 page-title" id="page-title">${esc(s.h1)}</h1>
        <p class="lede">${esc(s.lede)}</p>
        <div class="btn-row">
          <a class="btn btn-primary btn-lg" href="/contact?service=${s.slug}" data-magnet>Start a project${icon.arrowRight}</a>
          ${related.length ? html`<a class="btn btn-ghost btn-lg" href="#related-work">See related work</a>` : ''}
        </div>
      </div>
      <div class="page-visual" data-reveal style="--d:0.2s">
        <div class="card" data-spot>
          <div class="service-card-head"><span class="icon-tile">${serviceIcons[s.slug]}</span><span class="tag tag-accent">${esc(groups.find((g) => g.id === s.group).line)}</span></div>
          <div class="service-visual" style="margin-top:28px">${serviceVisual(s.slug)}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="included-title">
    <div class="wrap">
      <div class="two-col" style="margin-bottom:clamp(56px,7vw,96px)">
        <div data-reveal><span class="eyebrow">Why it matters</span></div>
        <div class="lead-text" data-reveal>${s.intro.map((p) => html`<p>${esc(p)}</p>`)}<p>Most clients pair this with ${s.pairsWith.map((o, i) => html`${i ? ' and ' : ''}<a class="link-under" href="/services/${o}">${esc(serviceBySlug[o].name.toLowerCase().replace('seo', 'SEO').replace('google & meta', 'Google & Meta'))}</a>`)}.</p></div>
      </div>
      <div class="section-head" data-reveal>
        <span class="eyebrow">What’s included</span>
        <h2 class="h2" id="included-title">${esc(s.includedHeading || `What’s included in our ${s.noun}`)}</h2>
      </div>
      ${featureGrid(s.included)}
    </div>
  </section>

  ${s.slug === 'cyber-security' ? cyberGrid() : ''}

  <section class="section" aria-labelledby="how-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">How it works</span>
        <h2 class="h2" id="how-title">${esc(s.howHeading || `How our ${s.noun} works`)}</h2>
      </div>
      ${timeline(s.steps)}
    </div>
  </section>

  ${related.length
    ? html`
  <section class="section rel" id="related-work" aria-labelledby="related-title">
    ${aurora(true)}
    <div class="wrap z">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Related work</span>
        <h2 class="h2" id="related-title">Where we’ve done this before.</h2>
      </div>
      <div class="work-grid" data-reveal-children>${related.map(workCard)}</div>
    </div>
  </section>`
    : ''}

  ${guidesForService(s.slug).length
    ? html`
  <section class="section section-tight" aria-labelledby="guides-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Read first</span>
        <h2 class="h2" id="guides-title">Guides that answer the usual questions.</h2>
      </div>
      <div class="guide-grid" data-reveal-children>${guidesForService(s.slug).map(guideCard)}</div>
    </div>
  </section>`
    : ''}

  ${faqSection(s.faqs, { heading: s.faqHeading, text: 'Straight answers to the questions we hear most.' })}

  <section class="section section-tight" aria-labelledby="others-title">
    <div class="wrap" data-reveal>
      <h2 class="h3" id="others-title" style="margin-bottom:18px">Works well with</h2>
      <div class="pill-list">${others.map((o) => html`<a href="/services/${o.slug}">${serviceIcons[o.slug]}${esc(o.name)}</a>`)}</div>
      <h2 class="h3" id="areas-title" style="margin:36px 0 18px">${esc(s.name)} across the South Coast</h2>
      <div class="pill-list">${areas.map((a) => html`<a href="/web-design/${a.slug}">${icon.pin}${esc(a.name)}</a>`)}<a href="/web-design">${icon.globe}All areas</a></div>
    </div>
  </section>

  ${cta({ heading: `Let’s talk about your ${s.noun}.`, href: `/contact?service=${s.slug}` })}
  `;

  return {
    path: `/services/${s.slug}`,
    title: s.title,
    description: s.description,
    og: `service-${s.slug}`,
    ogTitle: s.h1,
    schema: [
      {
        '@type': 'Service',
        '@id': `${site.url}/services/${s.slug}#service`,
        name: s.name,
        serviceType: s.name,
        description: s.description,
        provider: { '@id': `${site.url}/#organization` },
        areaServed: site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
        url: `${site.url}/services/${s.slug}`,
      },
      breadcrumbs(crumbs),
      faqSchema(s.faqs),
    ],
    body,
  };
}

function indexPage() {
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb([['Home', '/'], ['Services', '/services']])}
        <span class="eyebrow">Seven services, one team</span>
        <h1 class="display h1 page-title" id="page-title">Websites, marketing, cyber security, <span class="grad-text">IT and hosting.</span></h1>
        <p class="lede">Everything a small business needs from its technology: the website and the marketing that bring in work, and the IT, security and hosting that keep everything running. Use one service or all seven; they’re designed to work together.</p>
        <div class="btn-row"><a class="btn btn-primary btn-lg" href="/contact" data-magnet>Start a project${icon.arrowRight}</a></div>
      </div>
    </div>
  </section>

  ${groups.map(
    (g) => html`
  <section class="section section-tight" aria-labelledby="group-${g.id}">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">${esc(g.name)}</span>
        <h2 class="h2" id="group-${g.id}">${esc(g.line)}</h2>
        <p class="lede">${esc(g.summary)}</p>
      </div>
      <div class="bento" data-reveal-children>${servicesInGroup(g.id).map((s) => serviceCard(s, g.id === 'build' ? 'b-12 b-wide' : 'b-4'))}</div>
    </div>
  </section>`
  )}

  ${cta({ heading: 'Not sure which you need?', text: 'Most people aren’t. Tell us what you want to happen, like more calls, a site you’re proud of, or fewer IT headaches, and we’ll suggest where to start.' })}
  `;

  return {
    path: '/services',
    title: 'Web, Marketing, Cyber Security & IT Services | Roffey-Roberts Web',
    description: 'Website design, SEO, digital marketing, Google and Meta ads, cyber security, IT support and managed hosting for small businesses in Hampshire and the UK.',
    og: 'services',
    ogTitle: 'Seven services. One team.',
    schema: [
      breadcrumbs([['Home', '/'], ['Services', '/services']]),
      { '@type': 'ItemList', itemListElement: services.map((s, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/services/${s.slug}`, name: s.name })) },
    ],
    body,
  };
}

export function pages() {
  return [indexPage(), ...services.map(servicePage)];
}
