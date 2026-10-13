import { readFileSync } from 'node:fs';
import { html, esc, jsonLd, icon, iconSprite } from './html.mjs';
import { site, nav } from '../data/site.mjs';
import { areas } from '../data/areas.mjs';
import { services } from '../data/services.mjs';
import { serviceIcons } from './components.mjs';

const logoPath = readFileSync(new URL('../data/logo-path.txt', import.meta.url), 'utf8').trim();
// The double-R monogram: one continuous line, so it can draw itself and carry a glint.
const logo = (cls = '') => `<svg class="logo ${cls}" viewBox="0 0 70 64" aria-hidden="true" focusable="false"><path class="logo-line" d="${logoPath}" pathLength="100" fill="none" stroke="url(#logoGrad)" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/><path class="logo-glint" d="${logoPath}" pathLength="100" fill="none" stroke="#fff" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const markSvg = logo();

const hasTracking = Object.entries(site.tracking).some(([k, v]) => k !== 'googleAdsLeadLabel' && v);

export const organization = {
  '@type': 'ProfessionalService',
  '@id': `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: `${site.url}/img/logo-512.png`,
  image: `${site.url}/img/og/home.jpg`,
  description: site.tagline,
  ...(site.email && { email: site.email }),
  ...(site.phone && { telephone: site.phoneHref || site.phone }),
  address: {
    '@type': 'PostalAddress',
    ...(site.address.locality && { addressLocality: site.address.locality }),
    addressRegion: site.address.region,
    addressCountry: site.address.country,
  },
  ...(site.address.geo && { geo: { '@type': 'GeoCoordinates', latitude: site.address.geo.lat, longitude: site.address.geo.lon } }),
  areaServed: [
    ...site.towns.map((name) => ({ '@type': 'City', name })),
    ...site.areaServed.map((name) => ({ '@type': 'AdministrativeArea', name })),
  ],
  priceRange: site.priceRange,
  founder: {
    '@type': 'Person',
    '@id': `${site.url}/about#${site.founder.name.split(' ')[0].toLowerCase()}`,
    name: site.founder.name,
    jobTitle: site.founder.role,
    worksFor: { '@id': `${site.url}/#organization` },
    url: `${site.url}/about`,
    ...(site.founder.photo && { image: `${site.url}${site.founder.photo}` }),
    ...(site.founder.linkedin && { sameAs: [site.founder.linkedin] }),
    knowsAbout: services.map((s) => s.name),
    ...(site.founder.credentials.length && {
      hasCredential: site.founder.credentials.map((name) => ({ '@type': 'EducationalOccupationalCredential', name })),
    }),
  },
  knowsAbout: services.map((s) => s.name),
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    ...(site.phone && { telephone: site.phoneHref || site.phone }),
    ...(site.email && { email: site.email }),
    areaServed: 'GB',
    availableLanguage: 'en',
  },
  ...(site.sameAs.length && { sameAs: site.sameAs }),
};

// Friendly footer labels for profile links.
function profileLabel(u) {
  const h = new URL(u).hostname.replace('www.', '');
  if (h.includes('linkedin')) return 'LinkedIn';
  if (h.includes('facebook')) return 'Facebook';
  if (h.includes('instagram')) return 'Instagram';
  if (h.includes('google') || h.includes('g.page')) return 'Google Business Profile';
  if (h.includes('company-information') || h.includes('companieshouse')) return 'Companies House';
  if (h.includes('x.com') || h.includes('twitter')) return 'X';
  if (h.includes('youtube')) return 'YouTube';
  return h;
}

export const breadcrumbs = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, path], i) => ({ '@type': 'ListItem', position: i + 1, name, item: `${site.url}${path}` })),
});

export const faqSchema = (faqs) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

const isCurrent = (path, href) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));

function header(path) {
  const panel = html`
    <div class="nav-panel">
      <div class="nav-panel-inner">
        ${services.map(
          (s) => html`
          <a class="nav-item" href="/services/${s.slug}">
            <span class="icon-tile">${serviceIcons[s.slug]}</span>
            <span><b>${esc(s.name)}</b><span>${esc(s.card)}</span></span>
          </a>`
        )}
        <div class="nav-panel-foot"><span>Not sure where to start?</span><a class="link link-arrow" href="/contact">Talk to us${icon.arrowRight}</a></div>
      </div>
    </div>`;

  return html`
  <a class="skip" href="#main">Skip to content</a>
  <div class="scroll-progress" aria-hidden="true" data-progress></div>
  <header class="site-header" data-header>
    <div class="nav-pill">
      <a class="brand brand-main" href="/" aria-label="${esc(site.name)}, home">${logo("logo-draw")}<span class="brand-name">Roffey-Roberts <span>Web</span></span></a>
      <nav class="nav" aria-label="Main">
        <ul class="nav-list">
          ${nav.map(
            (item) => html`
            <li class="${item.href === '/services' ? 'has-panel' : ''}">
              <a href="${item.href}"${isCurrent(path, item.href) ? ' aria-current="page"' : ''}>${item.label}${item.href === '/services' ? icon.chevronDown : ''}</a>
              ${item.href === '/services' ? panel : ''}
            </li>`
          )}
        </ul>
      </nav>
      ${site.phone && html`<a class="btn btn-ghost btn-sm header-phone" href="tel:${esc(site.phoneHref || site.phone)}">${icon.phone}<span>${esc(site.phone)}</span></a>`}
      <a class="btn btn-primary btn-sm header-cta" href="/contact" data-magnet>Start a project${icon.arrowRight}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" data-menu-toggle>
        <span class="menu-open">${icon.menu}</span><span class="menu-close">${icon.close}</span><span class="sr-only">Menu</span>
      </button>
    </div>
  </header>
  <div class="mobile-menu" id="mobile-menu" data-mobile-menu hidden>
    <ul class="mobile-primary">
      ${nav.map((item) => html`<li><a href="${item.href}"${isCurrent(path, item.href) ? ' aria-current="page"' : ''}>${item.label}${icon.arrowUpRight}</a></li>`)}
    </ul>
    <ul class="mobile-services">
      ${services.map((s) => html`<li><a href="/services/${s.slug}">${serviceIcons[s.slug]}${esc(s.name)}</a></li>`)}
    </ul>
    <a class="btn btn-primary btn-lg" href="/contact" style="width:100%">Start a project${icon.arrowRight}</a>
    ${site.phone && html`<a class="btn btn-ghost btn-lg" href="tel:${esc(site.phoneHref || site.phone)}" style="width:100%;margin-top:10px">${icon.phone}Call ${esc(site.phone)}</a>`}
    ${site.email && html`<p class="mobile-email"><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>`}
  </div>`;
}

function footer() {
  const year = new Date().getFullYear();
  return html`
  <footer class="site-footer">
    <div class="wrap">
      <p class="footer-word" aria-hidden="true">Roffey-Roberts</p>
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/" aria-label="${esc(site.name)}, home">${markSvg}<span class="brand-name">Roffey-Roberts <span>Web</span></span></a>
          <p>A ${esc(site.base)} web studio. Websites, SEO, marketing, ads, security and hosting for businesses across the South Coast and the UK.</p>
          <a class="btn btn-ghost btn-sm" href="/contact" style="justify-self:start">Start a project${icon.arrowRight}</a>
        </div>
        <nav class="footer-col" aria-label="Services">
          <p class="footer-head">Services</p>
          <ul>${services.map((s) => html`<li><a href="/services/${s.slug}">${esc(s.name)}</a></li>`)}</ul>
        </nav>
        <nav class="footer-col" aria-label="Areas">
          <p class="footer-head">Areas</p>
          <ul>
            ${areas.map((a) => html`<li><a href="/web-design/${a.slug}">Web design ${esc(a.short)}</a></li>`)}
            <li><a href="/web-design">All areas</a></li>
          </ul>
        </nav>
        <nav class="footer-col" aria-label="Studio">
          <p class="footer-head">Studio</p>
          <ul>
            <li><a href="/work">Work</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/guides">Guides</a></li>
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
            <li><a href="/contact?review=1">Free website review</a></li>
            ${site.reviewUrl && html`<li><a href="${esc(site.reviewUrl)}" rel="noopener">Review us on Google</a></li>`}
            ${site.sameAs.filter((u, i, arr) => arr.findIndex((o) => profileLabel(o) === profileLabel(u)) === i).map((u) => html`<li><a href="${esc(u)}" rel="me noopener">${esc(profileLabel(u))}</a></li>`)}
          </ul>
        </div>
      </div>
      <div class="footer-base">
        <p>© ${year} ${esc(site.name)}. ${esc(site.base)}, UK.${site.phone && html` <a href="tel:${esc(site.phoneHref || site.phone)}">${esc(site.phone)}</a>`}</p>
        <p><a href="/privacy">Privacy</a>${hasTracking && html`<button type="button" data-consent-open>Cookie settings</button>`}<a href="/sitemap.xml">Sitemap</a></p>
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
        <button type="button" class="btn btn-primary btn-sm" data-consent-choice="granted">Accept</button>
      </div>
    </div>
  </div>`;
}

// The Google tag, as Google supplies it, with Consent Mode v2 in front of it.
// It loads on every page so Google can detect it, but in the default "denied"
// state it sets no cookies; the banner in site.js upgrades consent to "granted".
// The inline script's SHA-256 must appear in the Content-Security-Policy in vercel.json.
export function googleTagInline() {
  const ids = [site.tracking.ga4, site.tracking.googleAds].filter(Boolean);
  if (!ids.length) return '';
  return `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {'ad_storage':'denied','analytics_storage':'denied','ad_user_data':'denied','ad_personalization':'denied','wait_for_update':500});
  try{if(localStorage.getItem('rrw_consent')==='granted')gtag('consent','update',{'ad_storage':'granted','analytics_storage':'granted','ad_user_data':'granted','ad_personalization':'granted'})}catch(e){}
  gtag('js', new Date());

${ids.map((id) => `  gtag('config', '${id}');`).join('\n')}
`;
}

function googleTag() {
  const inline = googleTagInline();
  if (!inline) return '';
  const id = site.tracking.ga4 || site.tracking.googleAds;
  return `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>${inline}</script>
`;
}

export function page({ path, title, description, body, schema = [], og = 'home', noindex = false, bodyClass = '', assetVersion = '' }) {
  const canonical = `${site.url}${path === '/' ? '/' : path}`;
  const ogImage = `${site.url}/img/og/${og}.jpg`;
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
${googleTag()}<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${site.verification.google ? `<meta name="google-site-verification" content="${esc(site.verification.google)}">\n` : ''}<link rel="canonical" href="${canonical}">
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
<meta name="theme-color" content="#07080D">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-96.png" sizes="96x96" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/fonts/bricolage.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css${v}">
<script>document.documentElement.classList.add('js')</script>
<script src="/js/site.js${v}" defer></script>
${trackingConfig}
${jsonLd(graph)}
</head>
<body class="${esc(bodyClass)}">
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7C6CFF"/><stop offset="1" stop-color="#2EC5FF"/></linearGradient><linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B49CFF"/><stop offset=".5" stop-color="#7C6CFF"/><stop offset="1" stop-color="#2EC5FF"/></linearGradient>${iconSprite()}</defs></svg>
${header(path)}
<main id="main" tabindex="-1">
${body}
</main>
${footer()}
${consentBanner()}
<div class="cursor" aria-hidden="true" data-cursor-dot></div>
<div class="cursor-ring" aria-hidden="true" data-cursor-ring><span>View</span></div>
</body>
</html>
`;
}
