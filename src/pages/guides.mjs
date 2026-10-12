import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs, faqSchema } from '../lib/layout.mjs';
import { aurora, breadcrumb, cta, faqSection, serviceIcons } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { guides } from '../data/guides.mjs';
import { serviceBySlug } from '../data/services.mjs';

const slugify = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const fmtDate = (iso) => new Date(iso + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

function block(b) {
  const [type, a, c] = b;
  if (type === 'h2') return html`<h2 id="${slugify(a)}">${esc(a)}</h2>`;
  if (type === 'p') return html`<p>${esc(a)}</p>`;
  if (type === 'ul') return html`<ul>${a.map((li) => html`<li>${esc(li)}</li>`)}</ul>`;
  if (type === 'note') return html`<p class="prose-note">${esc(a)}</p>`;
  if (type === 'table')
    return html`<div class="table-wrap"><table><thead><tr>${a.map((h) => html`<th scope="col">${esc(h)}</th>`)}</tr></thead><tbody>${c.map((row) => html`<tr>${row.map((cell, i) => (i === 0 ? html`<th scope="row">${esc(cell)}</th>` : html`<td>${esc(cell)}</td>`))}</tr>`)}</tbody></table></div>`;
  return '';
}

export const guideCard = (g) => html`
  <a class="card card-hover guide-card" href="/guides/${g.slug}" data-spot data-cursor="Read">
    <span class="guide-meta">${g.readMinutes} min read · Updated ${esc(fmtDate(g.updated))}</span>
    <h3 class="h3">${esc(g.h1)}</h3>
    <p class="muted">${esc(g.description)}</p>
    <span class="link link-arrow">Read the guide${icon.arrowRight}</span>
  </a>`;

function guidePage(g) {
  const crumbs = [['Home', '/'], ['Guides', '/guides'], [g.h1, `/guides/${g.slug}`]];
  const headings = g.body.filter((b) => b[0] === 'h2').map((b) => b[1]);
  const related = g.services.map((s) => serviceBySlug[s]).filter(Boolean);
  const others = guides.filter((o) => o.slug !== g.slug).slice(0, 3);

  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb(crumbs)}
        <h1 class="display h1 page-title article-title" id="page-title">${esc(g.h1)}</h1>
        <p class="lede">${esc(g.lede)}</p>
        <p class="guide-meta">By <a class="link-under" href="/about#${site.founder.name.split(' ')[0].toLowerCase()}">${esc(site.founder.name)}</a> · ${g.readMinutes} min read · Updated <time datetime="${g.updated}">${esc(fmtDate(g.updated))}</time></p>
      </div>
    </div>
  </section>

  <section class="section section-tight" aria-label="Guide">
    <div class="wrap article-grid">
      <aside class="article-aside">
        <nav class="toc card card-pad" aria-labelledby="toc-title" data-reveal>
          <p class="footer-head" id="toc-title">In this guide</p>
          <ol>${headings.map((h) => html`<li><a href="#${slugify(h)}">${esc(h)}</a></li>`)}</ol>
        </nav>
        ${related.length
          ? html`<div class="card card-pad" data-reveal data-spot>
          <p class="footer-head">Related services</p>
          <div class="pill-list" style="margin-top:14px">${related.map((s) => html`<a href="/services/${s.slug}">${serviceIcons[s.slug]}${esc(s.name)}</a>`)}</div>
        </div>`
          : ''}
      </aside>
      <article class="prose" data-reveal>
        ${g.body.map(block)}
        ${g.sources && g.sources.length
          ? html`<h2 id="sources">Sources</h2><ul class="prose-sources">${g.sources.map(([t, u]) => html`<li><a href="${esc(u)}" rel="noopener">${esc(t)}</a></li>`)}</ul>`
          : ''}
      </article>
    </div>
  </section>

  ${faqSection(g.faqs, { heading: 'Common questions', text: 'Short answers to the questions that usually follow this one.' })}

  <section class="section section-tight" aria-labelledby="more-title">
    <div class="wrap">
      <h2 class="h3" id="more-title" style="margin-bottom:18px">More guides</h2>
      <div class="guide-grid" data-reveal-children>${others.map(guideCard)}</div>
    </div>
  </section>

  ${cta({ heading: 'Want a straight answer for your business?', text: 'Tell us what you are trying to do and we will say what we would do in your position, with a fixed quote if you want one.' })}
  `;

  return {
    path: `/guides/${g.slug}`,
    title: g.title,
    description: g.description,
    og: `guide-${g.slug}`,
    ogTitle: g.h1,
    schema: [
      {
        '@type': 'Article',
        '@id': `${site.url}/guides/${g.slug}#article`,
        headline: g.h1,
        description: g.description,
        inLanguage: 'en-GB',
        datePublished: g.updated,
        dateModified: g.updated,
        author: { '@id': `${site.url}/about#${site.founder.name.split(' ')[0].toLowerCase()}` },
        publisher: { '@id': `${site.url}/#organization` },
        image: `${site.url}/img/og/guide-${g.slug}.jpg`,
        mainEntityOfPage: `${site.url}/guides/${g.slug}`,
        about: g.services.map((s) => ({ '@id': `${site.url}/services/${s}#service` })),
      },
      breadcrumbs(crumbs),
      faqSchema(g.faqs),
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
        ${breadcrumb([['Home', '/'], ['Guides', '/guides']])}
        <span class="eyebrow">Guides</span>
        <h1 class="display h1 page-title" id="page-title">Plain answers to the questions <span class="grad-text">before you hire anyone.</span></h1>
        <p class="lede">What things cost, how local search actually works, which ads to run first and what Cyber Essentials involves. Written from the work we do for businesses on the South Coast, with no sales pitch in the way.</p>
      </div>
    </div>
  </section>

  <section class="section section-tight" aria-label="All guides">
    <div class="wrap">
      <div class="guide-grid" data-reveal-children>${guides.map(guideCard)}</div>
    </div>
  </section>

  ${cta({ heading: 'Got a question these don’t answer?', text: 'Ask it. We reply to every enquiry personally, usually the same working day.' })}
  `;

  return {
    path: '/guides',
    title: 'Small Business Web Guides | Roffey-Roberts Web',
    description: 'Plain-English guides for small businesses: what a website costs in the UK, local SEO for trades, Google Ads vs Meta ads, and Cyber Essentials explained.',
    og: 'guides',
    ogTitle: 'Guides for small businesses',
    schema: [
      breadcrumbs([['Home', '/'], ['Guides', '/guides']]),
      { '@type': 'ItemList', itemListElement: guides.map((g, i) => ({ '@type': 'ListItem', position: i + 1, url: `${site.url}/guides/${g.slug}`, name: g.h1 })) },
    ],
    body,
  };
}

export function pages() {
  return [indexPage(), ...guides.map(guidePage)];
}
