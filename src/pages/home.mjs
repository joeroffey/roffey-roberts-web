import { html, esc, icon } from '../lib/html.mjs';
import { faqSchema } from '../lib/layout.mjs';
import { aurora, cta, faqSection, serviceCard, stackCard, serpCard, timeline, testimonialSection } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { testimonials } from '../data/testimonials.mjs';
import { guides } from '../data/guides.mjs';
import { guideCard } from './guides.mjs';
import { services } from '../data/services.mjs';
import { projects } from '../data/work.mjs';

export const homeFaqs = [
  ['How much does a website cost?', 'Every project is different, so we quote a fixed price after a free call. The quote is itemised, in writing, and only changes if the brief does. Monthly services like SEO, ads management and hosting are a fixed monthly fee.'],
  ['How long does a new website take?', 'Most small business websites take four to eight weeks from the first call to launch. Copy and photos are usually what decides the pace, and we can help with both.'],
  ['Do you only work with businesses in Hampshire?', 'No. Most of our clients are along the South Coast, from Portsmouth to Bournemouth, but we work with businesses anywhere in the UK over video calls.'],
  ['Can you take over my existing website, SEO, ads or IT?', 'Yes. We start with an honest audit, keep what is working, and tell you plainly what isn’t. Sometimes the answer is a few fixes rather than a rebuild.'],
  ['Who owns the website and the accounts?', 'You do. The domain, website, Google and Meta ad accounts and analytics are all set up in your name. If you ever move on, everything goes with you.'],
  ['Do I have to sign a long contract?', 'No. Projects are quoted and paid for as one-off jobs, and monthly services run month to month.'],
];

const sample = { business: 'Harbour Plumbing', service: 'Emergency plumber', area: 'Southampton' };
const sampleTitle = `${sample.service} in ${sample.area} | ${sample.business}`;
const sampleDesc = `${sample.service} in ${sample.area} from ${sample.business}. Fast response, fair prices and friendly local service. Call today or get a free quote online.`;

const standards = [
  ['90', '+', 'Lighthouse performance score on every site we ship. Fast on a phone, not just on a laptop.'],
  ['24', 'h', 'The longest you’ll wait for a reply to an enquiry, on a working day.'],
  ['100', '%', 'Yours. Your domain, your code, your ad accounts, your data. No lock-in.'],
  ['0', '', 'Templates. Every site is designed for the business it belongs to and built by hand.'],
];

const steps = [
  ['A free call', 'Thirty minutes on the phone or a video call. We ask about your customers, what’s working now and what isn’t.'],
  ['A fixed quote', 'A short written plan with a fixed price and a timeline. No hourly billing, no surprises at the end.'],
  ['Design and build', 'You see the design early, then watch the site take shape on a private preview link you can check on your own phone.'],
  ['Launch, then look after', 'We handle the switchover and the tracking, then keep your site fast, secure and working hard for you.'],
];

const promises = [
  [icon.key, 'You own everything.', 'Your domain, website, Microsoft 365, ad accounts and analytics are set up in your name. If you ever move on, it all goes with you.'],
  [icon.file, 'Prices are fixed.', 'Every project is quoted up front and in writing, and the price only changes if the brief does.'],
  [icon.refresh, 'No long lock-ins.', 'Monthly services run month to month. We’d rather keep clients by being worth keeping.'],
  [icon.chart, 'Reports you can read.', 'Calls, enquiries and what each one cost. Not a 40-page PDF of charts and jargon.'],
  [icon.users, 'You talk to the people doing the work.', 'No account managers passing messages. The person you speak to is the person building your site and looking after your IT.'],
];

export function pages() {
  const body = html`
  <section class="hero" aria-labelledby="hero-title">
    ${aurora()}
    <div class="wrap z hero-grid">
      <div class="hero-copy" data-reveal-children>
        <h1 class="display hero-title" id="hero-title">Websites and IT that <span class="grad-text">just work.</span><span class="h1-sub">Web design, SEO, ads, cyber security and IT support in ${esc(site.base)}.</span></h1>
        <p class="lede hero-lede">We build your website, get it found and run the ads that fill your diary. Then we look after the email, laptops, security and backups behind it. One team, the whole job.</p>
        <div class="btn-row">
          <a class="btn btn-primary btn-lg" href="/contact" data-press>Start a project${icon.arrowRight}</a>
          <a class="btn btn-ghost btn-lg" href="/work" data-press>See our work</a>
        </div>
        <p class="hero-note">Now booking new projects. We reply within one working day.</p>
      </div>
      <figure class="showcase" data-showcase>
        <div class="showcase-frame">
          <div class="browser" data-ui>
            <div class="browser-bar"><span class="browser-dots"><i></i><i></i><i></i></span><span class="browser-url">${icon.lock}<span data-showcase-url>${esc(projects[0].domain)}</span></span></div>
            <div class="browser-screen">
              ${projects.map((p, i) => html`<img src="${p.screenshot}" alt="${esc(p.name)} homepage, designed and built by Roffey-Roberts Web" width="1440" height="936" decoding="async" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} data-showcase-shot="${i}"${i ? ' class="is-off"' : ''}>`)}
            </div>
          </div>
        </div>
        <figcaption class="showcase-cap">
          <nav class="showcase-tabs" aria-label="Recent client websites">
            ${projects.map((p, i) => html`<a class="showcase-tab" href="/work/${p.slug}" ${i === 0 ? 'aria-current="true" ' : ''}data-showcase-tab="${i}" data-domain="${esc(p.domain)}" data-meta="${esc(p.sector)}, ${esc(p.location.split(',')[0])}"><span>${esc(p.name)}</span></a>`)}
          </nav>
          <p class="showcase-meta"><span data-showcase-meta>${esc(projects[0].sector)}, ${esc(projects[0].location.split(',')[0])}</span> <a class="link link-arrow" href="/work/${projects[0].slug}" data-showcase-link>Read the case study${icon.arrowRight}</a></p>
        </figcaption>
      </figure>
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      ${[0, 1].map(() => html`<ul>${['Website design', 'SEO', 'Google Ads', 'Meta Ads', 'Digital marketing', 'Cyber security', 'Cyber Essentials', 'IT support', 'Microsoft 365', 'Hosting & care', 'Google Business Profile', 'Backups', 'Staff training'].map((t) => html`<li>${t}</li>`)}</ul>`)}
    </div>
  </div>

  <section class="section" aria-labelledby="services-title">
    <div class="wrap">
      <div class="section-head section-head-split" data-reveal>
        <h2 class="h2" id="services-title">Your website, marketing and IT, under one roof.</h2>
        <p class="lede">Most businesses juggle a designer, an SEO agency, someone for the ads and an IT person who only appears when something breaks. We do all seven parts, so nothing falls through the gaps.</p>
      </div>
      <div class="bento" data-reveal-children>
        ${services.map((s) => serviceCard(s))}
      </div>
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="standards-title">
    <div class="wrap">
      <h2 class="h3 standards-title" id="standards-title" data-reveal>The standards every project ships with</h2>
      <div class="stats" data-reveal-children>
        ${standards.map(([n, suffix, text]) => html`<div class="stat"><b><span data-count="${n}">${n}</span>${suffix}</b><span>${esc(text)}</span></div>`)}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="work-title">
    <div class="wrap">
      <div class="section-head section-head-split" data-reveal>
        <h2 class="h2" id="work-title">Built for firms along the South Coast.</h2>
        <p class="lede">Installers, engineers and studios in Ringwood and Lymington. Websites that have to earn their keep: found locally, fast on a phone, and built to turn visits into calls and bookings.</p>
      </div>
      <div class="stack">
        ${projects.map(stackCard)}
      </div>
      <p class="btn-row stack-more"><a class="btn btn-ghost" href="/work" data-press>All case studies${icon.arrowRight}</a></p>
    </div>
  </section>

  ${testimonialSection(testimonials)}

  <section class="section section-band" aria-labelledby="preview-title" data-nosnippet>
    <div class="wrap">
      <div class="section-head section-head-split" data-reveal>
        <h2 class="h2" id="preview-title">How does your business look on Google?</h2>
        <p class="lede">People decide which result to click in a couple of seconds, from two lines of text. Type in your details to see a draft of yours, and whether Google would cut it short.</p>
      </div>
      <div class="tool-grid" data-reveal>
        <form class="card card-pad tool-form" data-preview autocomplete="off">
          <div class="field"><label for="pv-business">Business name</label><input id="pv-business" name="business" type="text" value="${sample.business}" maxlength="60"></div>
          <div class="field"><label for="pv-service">What you do</label><input id="pv-service" name="service" type="text" value="${sample.service}" maxlength="60"></div>
          <div class="field"><label for="pv-area">Town or area</label><input id="pv-area" name="area" type="text" value="${sample.area}" maxlength="40"></div>
          <p class="tool-note">This is the easy bit. Ranking for it takes a fast site, the right pages and a well-kept Google Business Profile. <a class="link-under" href="/services/seo">How our SEO works</a></p>
        </form>
        <div class="card card-pad serp-panel">
          ${serpCard({ name: sample.business, domain: 'harbourplumbing.co.uk', title: sampleTitle, desc: sampleDesc })}
          <ul class="serp-checks" aria-live="polite">
            <li data-check="title" class="ok">${icon.check}<span>The title fits without being cut off.</span></li>
            <li data-check="area" class="ok">${icon.check}<span>Your town is in the title, where local searchers look for it.</span></li>
            <li data-check="desc" class="ok">${icon.check}<span>The description ends with a clear next step.</span></li>
          </ul>
          <div class="btn-row"><a class="btn btn-primary" href="/contact?service=seo" data-preview-cta>Send this to us with an enquiry${icon.arrowRight}</a></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="process-title">
    <div class="wrap">
      <div class="section-head section-head-split" data-reveal>
        <h2 class="h2" id="process-title">Four steps. Fixed price. No surprises.</h2>
        <p class="lede">You’ll always know what’s happening, what it costs and what comes next.</p>
      </div>
      ${timeline(steps)}
    </div>
  </section>

  <section class="section section-band" aria-labelledby="promises-title">
    <div class="wrap promises-grid">
      <div class="promises-head" data-reveal>
        <h2 class="h2" id="promises-title">The small print, in large print.</h2>
        <p class="lede">Five things we put in writing on every job, so you know exactly where you stand.</p>
      </div>
      <ul class="promises" data-reveal-children>
        ${promises.map(([, t, d]) => html`<li class="promise"><b>${esc(t)}</b><p>${esc(d)}</p></li>`)}
      </ul>
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="guides-title">
    <div class="wrap">
      <div class="section-head section-head-split" data-reveal>
        <h2 class="h2" id="guides-title">Read before you hire anyone.</h2>
        <p class="lede">What things cost, how local search works, which ads to run first and what Cyber Essentials involves.</p>
      </div>
      <div class="guide-grid" data-reveal-children>${guides.map(guideCard)}</div>
      <p style="margin-top:22px"><a class="link link-arrow" href="/guides">All guides${icon.arrowRight}</a></p>
    </div>
  </section>

  ${faqSection(homeFaqs)}
  ${cta()}
  `;

  return [
    {
      path: '/',
      title: 'Web Design, Marketing & IT Support Hampshire | Roffey-Roberts Web',
      description:
        'Hampshire web and IT studio for small businesses: web design, SEO, Google and Meta ads, cyber security, IT support and hosting, all from one team.',
      og: 'home',
      bodyClass: 'is-home',
      schema: [
        { '@type': 'WebSite', '@id': `${site.url}/#website`, url: site.url, name: site.name, publisher: { '@id': `${site.url}/#organization` }, inLanguage: 'en-GB' },
        faqSchema(homeFaqs),
      ],
      body,
    },
  ];
}
