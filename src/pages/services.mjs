import { html, esc } from '../lib/html.mjs';
import { breadcrumbs, faqSchema } from '../lib/layout.mjs';
import { breadcrumb, ctaBand, faqList, shot } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { groups, services, servicesInGroup, serviceBySlug } from '../data/services.mjs';
import { projectBySlug } from '../data/work.mjs';

function servicePage(s) {
  const related = s.related.map((slug) => projectBySlug[slug]).filter(Boolean);
  const others = services.filter((o) => o.slug !== s.slug);

  const body = html`
  <section class="page-hero s-dark" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb([['Home', '/'], ['Services', '/services'], [s.name, `/services/${s.slug}`]])}
      <h1 class="page-title" id="page-title">${esc(s.h1)}</h1>
      <div class="page-hero-foot">
        <p class="page-lede">${esc(s.lede)}</p>
        <div class="hero-actions">
          <a class="btn btn-amber" href="/contact?service=${s.slug}">Start a project</a>
          ${related.length ? html`<a class="link-light" href="#related-work">See related work</a>` : ''}
        </div>
      </div>
    </div>
  </section>

  <section class="section s-white" aria-labelledby="included-title">
    <div class="wrap">
      <div class="lead-block">
        ${s.intro.map((p) => html`<p>${esc(p)}</p>`)}
      </div>
      <h2 class="h2 included-title" id="included-title">What’s included</h2>
      <ul class="included">
        ${s.included.map(([t, d]) => html`<li><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)}
      </ul>
    </div>
  </section>

  <section class="section s-fog" aria-labelledby="how-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="how-title">How it works</h2>
      </div>
      <ol class="steps">
        ${s.steps.map(([t, d], i) => html`<li><span class="step-n" aria-hidden="true">${i + 1}</span><h3>${esc(t)}</h3><p>${esc(d)}</p></li>`)}
      </ol>
    </div>
  </section>

  ${related.length
    ? html`
  <section class="section s-dark" id="related-work" aria-labelledby="related-title">
    <div class="wrap">
      <div class="section-head section-head-split">
        <h2 class="h2" id="related-title">Related work</h2>
        <p><a class="link-light" href="/work">All case studies</a></p>
      </div>
      <div class="project-pair">
        ${related.map(
          (p) => html`
          <article class="mini-project">
            <a class="project-shot" href="/work/${p.slug}" tabindex="-1" aria-hidden="true">${shot(p)}</a>
            <p class="project-meta">${esc(p.sector)}</p>
            <h3 class="project-name"><a href="/work/${p.slug}">${esc(p.name)}</a></h3>
            <p class="project-summary">${esc(p.summary)}</p>
          </article>`
        )}
      </div>
    </div>
  </section>`
    : ''}

  ${faqList(s.faqs, { heading: s.faqHeading })}

  <section class="section s-white other-services" aria-labelledby="others-title">
    <div class="wrap">
      <h2 class="h3" id="others-title">Works well with</h2>
      <ul class="other-list">
        ${others.map((o) => html`<li><a href="/services/${o.slug}"><span>${esc(o.name)}</span><span>${esc(o.card)}</span></a></li>`)}
      </ul>
    </div>
  </section>

  ${ctaBand({ heading: `Let’s talk about your ${s.noun}.`, href: `/contact?service=${s.slug}` })}
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
      breadcrumbs([['Home', '/'], ['Services', '/services'], [s.name, `/services/${s.slug}`]]),
      faqSchema(s.faqs),
    ],
    body,
  };
}

function indexPage() {
  const body = html`
  <section class="page-hero s-dark" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb([['Home', '/'], ['Services', '/services']])}
      <h1 class="page-title" id="page-title">Six services, one studio</h1>
      <div class="page-hero-foot">
        <p class="page-lede">Everything a business website needs, from the first design to the ads that fill your diary and the security that keeps it all running. Use one service or all six; they’re designed to work together.</p>
        <div class="hero-actions"><a class="btn btn-amber" href="/contact">Start a project</a></div>
      </div>
    </div>
  </section>

  ${groups.map(
    (g, gi) => html`
  <section class="section ${gi % 2 ? 's-fog' : 's-white'} service-group" aria-labelledby="group-${g.id}">
    <div class="wrap group-grid">
      <div class="group-head">
        <h2 class="group-line" id="group-${g.id}">${esc(g.line)}</h2>
        <p>${esc(g.summary)}</p>
      </div>
      <div class="group-services">
        ${servicesInGroup(g.id).map(
          (s) => html`
          <article class="service-row">
            <h3 class="service-row-name"><a href="/services/${s.slug}">${esc(s.name)}</a></h3>
            <p>${esc(s.lede)}</p>
            <ul class="service-row-list">${s.included.slice(0, 4).map(([t]) => html`<li>${esc(t)}</li>`)}</ul>
            <a class="link-strong" href="/services/${s.slug}">More about ${esc(s.name.toLowerCase().replace('seo', 'SEO').replace('google & meta', 'Google & Meta'))}</a>
          </article>`
        )}
      </div>
    </div>
  </section>`
  )}

  ${ctaBand({ heading: 'Not sure which you need?', text: 'Most people aren’t. Tell us what you want to happen, like more calls, a site you’re not embarrassed by or fewer IT headaches, and we’ll suggest where to start.' })}
  `;

  return {
    path: '/services',
    title: 'Web Design, SEO, Ads, Security & Hosting | Roffey-Roberts Web',
    description:
      'Website design, SEO, digital marketing, Google and Meta ads, cyber security and managed hosting for small businesses in Hampshire and across the UK.',
    og: 'services',
    ogTitle: 'Six services, one studio',
    schema: [
      breadcrumbs([['Home', '/'], ['Services', '/services']]),
      {
        '@type': 'ItemList',
        itemListElement: services.map((s, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          url: `${site.url}/services/${s.slug}`,
          name: s.name,
        })),
      },
    ],
    body,
  };
}

export function pages() {
  return [indexPage(), ...services.map(servicePage)];
}

export { serviceBySlug };
