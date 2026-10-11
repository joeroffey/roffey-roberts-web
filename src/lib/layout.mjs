import { readFileSync } from 'node:fs';
import { html, esc, jsonLd, icon } from './html.mjs';
import { site, nav } from '../data/site.mjs';
import { groups, servicesInGroup, services } from '../data/services.mjs';

const markSvg = readFileSync(new URL('../../static/favicon.svg', import.meta.url), 'utf8')
  .replace('<svg ', '<svg class="mark" aria-hidden="true" focusable="false" ');

const hasTracking = Object.entries(site.tracking).some(([k, v]) => k !== 'googleAdsLeadLabel' && v);

export const organization = {
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/img/logo-512.png`,
  image: `${site.url}/img/og/home.png`,
  description: site.tagline,
  areaServed: site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
  knowsAbout: services.map((s) => s.name),
  ...(site.email && { email: site.email }),
  ...(site.phone && { telephone: site.phone }),
  ...(site.sameAs.length && { sameAs: site.sameAs }),
};

export const breadcrumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name,
    item: `${site.url}${path}`,
  })),
});

export const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
});

const isCurrent = (path, href) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

function header(path) {
  const panel = html`
    <div class="nav-panel" role="group" aria-label="Services">
      <div class="nav-panel-inner">
        ${groups.map(
          (g) => html`
            <div class="nav-group">
              <p class="nav-group-name">${g.name}</p>
              <ul>
                ${servicesInGroup(g.id).map(
                  (s) => html`<li><a href="/services/${s.slug}">${esc(s.name)}</a></li>`
                )}
              </ul>
            </div>`
        )}
        <a class="nav-panel-all" href="/services">All services</a>
      </div>
    </div>`;

  return html`
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header" data-header>
    <div class="wrap header-inner">
      <a class="brand" href="/" aria-label="${esc(site.name)}, home">${markSvg}<span class="brand-name">Roffey-Roberts <span>Web</span></span></a>
      <nav class="nav" aria-label="Main">
        <ul class="nav-list">
          ${nav.map(
            (item) => html`
              <li class="${item.href === '/services' ? 'has-panel' : ''}">
                <a href="${item.href}"${isCurrent(path, item.href) ? ' aria-current="page"' : ''}>${item.label}</a>
                ${item.href === '/services' ? panel : ''}
              </li>`
          )}
        </ul>
      </nav>
      <a class="btn btn-amber btn-sm header-cta" href="/contact">Start a project</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="menu-open">${icon.menu}</span><span class="menu-close">${icon.close}</span>
        <span class="sr-only">Menu</span>
      </button>
    </div>
    <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
      <div class="wrap">
        <ul class="mobile-primary">
          ${nav.map((item) => html`<li><a href="${item.href}"${isCurrent(path, item.href) ? ' aria-current="page"' : ''}>${item.label}</a></li>`)}
        </ul>
        <ul class="mobile-services">
          ${services.map((s) => html`<li><a href="/services/${s.slug}">${esc(s.name)}</a></li>`)}
        </ul>
        <a class="btn btn-amber btn-block" href="/contact">Start a project</a>
      </div>
    </div>
  </header>`;
}

function footer() {
  const year = new Date().getFullYear();
  return html`
  <footer class="site-footer">
    <div class="wrap">
      <div class="footer-top">
        <p class="footer-statement" aria-hidden="true">Built properly.<br />Found first.<br />Kept safe.</p>
        <p class="footer-where">Based in ${esc(site.base)}. Working with businesses across the South Coast and the rest of the UK.</p>
      </div>
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/" aria-label="${esc(site.name)}, home">${markSvg}<span class="brand-name">Roffey-Roberts <span>Web</span></span></a>
          <p>A ${esc(site.base)} web studio. Websites, SEO, marketing, ads, security and hosting for businesses across the South Coast and the UK.</p>
        </div>
        <nav class="footer-col" aria-label="Services">
          <p class="footer-head">Services</p>
          <ul>${services.map((s) => html`<li><a href="/services/${s.slug}">${esc(s.name)}</a></li>`)}</ul>
        </nav>
        <nav class="footer-col" aria-label="Studio">
          <p class="footer-head">Studio</p>
          <ul>
            <li><a href="/work">Work</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy</a></li>
          </ul>
        </nav>
        <div class="footer-col">
          <p class="footer-head">Get in touch</p>
          <ul>
            ${site.email && html`<li><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></li>`}
            ${site.phone && html`<li><a href="tel:${esc(site.phoneHref || site.phone)}">${esc(site.phone)}</a></li>`}
            <li><a href="/contact">Send an enquiry</a></li>
            ${site.sameAs.map((u) => html`<li><a href="${esc(u)}" rel="me noopener">${esc(new URL(u).hostname.replace('www.', ''))}</a></li>`)}
          </ul>
        </div>
      </div>
      <div class="footer-base">
        <p>© ${year} ${esc(site.name)}</p>
        <p>
          <a href="/privacy">Privacy</a>
          ${hasTracking && html`<button type="button" class="link-button" data-consent-open>Cookie settings</button>`}
        </p>
      </div>
    </div>
  </footer>`;
}

function consentBanner() {
  if (!hasTracking) return '';
  return html`
  <div class="consent" data-consent hidden>
    <div class="consent-inner">
      <p>We’d like to use cookies to measure visits and the results of our ads. Nothing is set unless you agree. <a href="/privacy#cookies">More about cookies</a></p>
      <div class="consent-actions">
        <button type="button" class="btn btn-ghost btn-sm" data-consent-choice="denied">Reject</button>
        <button type="button" class="btn btn-amber btn-sm" data-consent-choice="granted">Accept</button>
      </div>
    </div>
  </div>`;
}

export function page({ path, title, description, body, schema = [], og = 'home', noindex = false, bodyClass = '', assetVersion = '' }) {
  const canonical = `${site.url}${path === '/' ? '/' : path}`;
  const ogImage = `${site.url}/img/og/${og}.png`;
  const graph = { '@context': 'https://schema.org', '@graph': [organization, ...schema] };
  const v = assetVersion ? `?v=${assetVersion}` : '';
  const trackingConfig = hasTracking
    ? `<script type="application/json" id="rrw-tracking">${JSON.stringify(site.tracking).replace(/</g, '\\u003c')}</script>`
    : '';

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:locale" content="${site.locale}">
<meta property="og:url" content="${canonical}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0B2A31">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css${v}">
<script src="/js/site.js${v}" defer></script>
${trackingConfig}
${jsonLd(graph)}
</head>
<body class="${esc(bodyClass)}">
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${consentBanner()}
</body>
</html>
`;
}
