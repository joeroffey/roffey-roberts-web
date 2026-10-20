import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs, faqSchema } from '../lib/layout.mjs';
import { aurora, breadcrumb, cta, cyberCard, faqSection, featureGrid, serviceVisual, timeline } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { cyberServices } from '../data/cyber.mjs';
import { serviceBySlug } from '../data/services.mjs';
import { guideBySlug } from '../data/guides.mjs';
import { guideCard } from './guides.mjs';

const parent = serviceBySlug['cyber-security'];
// Lower-case a service name for use mid-sentence, keeping brand names intact.
const lc = (n) => (/^(Cyber Essentials|Microsoft|Google)/.test(n) ? n : n[0].toLowerCase() + n.slice(1));

// Pages for each specialist cyber security service: /services/cyber-security/<slug>
function cyberPage(c) {
  const crumbs = [['Home', '/'], ['Services', '/services'], [parent.name, '/services/cyber-security'], [c.name, `/services/cyber-security/${c.slug}`]];
  const others = cyberServices.filter((o) => o.slug !== c.slug);
  const guide = c.guide ? guideBySlug[c.guide] : null;
  const contactHref = `/contact?service=cyber-security&topic=${encodeURIComponent(c.name)}`;

  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z page-hero-grid">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb(crumbs)}
        <h1 class="display h1 page-title" id="page-title">${esc(c.h1)}</h1>
        <p class="lede">${esc(c.lede)}</p>
        <div class="btn-row">
          <a class="btn btn-primary btn-lg" href="${contactHref}" data-magnet>Talk to us${icon.arrowRight}</a>
          <a class="btn btn-ghost btn-lg" href="/services/cyber-security">All cyber security services</a>
        </div>
      </div>
      <div class="page-visual" data-reveal style="--d:0.2s">
        <div class="card" data-spot>
          <div class="service-card-head"><span class="icon-tile">${icon[c.icon] || icon.shield}</span><span class="tag tag-accent">Cyber security</span></div>
          <div class="service-visual" style="margin-top:28px">${serviceVisual('cyber-security', c.visLabels)}</div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="included-title">
    <div class="wrap">
      <div class="two-col" style="margin-bottom:clamp(56px,7vw,96px)">
        <div data-reveal><span class="eyebrow">Why it matters</span></div>
        <div class="lead-text" data-reveal>${c.intro.map((p) => html`<p>${esc(p)}</p>`)}</div>
      </div>
      <div class="section-head" data-reveal>
        <span class="eyebrow">What’s included</span>
        <h2 class="h2" id="included-title">What’s included in ${esc(lc(c.name))}.</h2>
      </div>
      ${featureGrid(c.included)}
    </div>
  </section>

  <section class="section" aria-labelledby="how-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">How it works</span>
        <h2 class="h2" id="how-title">How ${esc(lc(c.name))} works.</h2>
      </div>
      ${timeline(c.steps)}
    </div>
  </section>

  ${guide
    ? html`
  <section class="section section-tight" aria-labelledby="guide-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Read first</span>
        <h2 class="h2" id="guide-title">The guide to go with it.</h2>
      </div>
      <div class="guide-grid" data-reveal-children>${guideCard(guide)}</div>
    </div>
  </section>`
    : ''}

  ${faqSection(c.faqs, { heading: `${c.short} questions`, text: 'Straight answers to the questions we hear most.' })}

  <section class="section section-tight" aria-labelledby="others-title">
    <div class="wrap" data-reveal>
      <h2 class="h3" id="others-title" style="margin-bottom:18px">Other cyber security services</h2>
      <div class="pill-list">${others.map((o) => html`<a href="/services/cyber-security/${o.slug}">${icon[o.icon] || icon.shield}${esc(o.name)}</a>`)}<a href="/services/cyber-security">${icon.shield}Overview</a></div>
    </div>
  </section>

  ${cta({ heading: `Let’s talk about ${lc(c.short)}.`, href: contactHref })}
  `;

  return {
    path: `/services/cyber-security/${c.slug}`,
    title: c.title,
    description: c.description,
    og: `cyber-${c.slug}`,
    ogTitle: c.h1,
    schema: [
      {
        '@type': 'Service',
        '@id': `${site.url}/services/cyber-security/${c.slug}#service`,
        name: c.name,
        serviceType: c.name,
        category: 'Cyber security',
        description: c.description,
        provider: { '@id': `${site.url}/#organization` },
        isRelatedTo: { '@id': `${site.url}/services/cyber-security#service` },
        areaServed: site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
        url: `${site.url}/services/cyber-security/${c.slug}`,
      },
      breadcrumbs(crumbs),
      faqSchema(c.faqs),
    ],
    body,
  };
}

// The grid of specialist services, shown on the main cyber security page.
export const cyberGrid = () => html`
  <section class="section section-tight" aria-labelledby="cyber-services-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Eight services</span>
        <h2 class="h2" id="cyber-services-title">Pick what you need, or <span class="grad-text">let us audit first.</span></h2>
        <p class="lede">Most businesses start with an audit and work down the list. Each service also stands on its own.</p>
      </div>
      <div class="guide-grid" data-reveal-children>${cyberServices.map(cyberCard)}</div>
    </div>
  </section>`;

export function pages() {
  return cyberServices.map(cyberPage);
}
