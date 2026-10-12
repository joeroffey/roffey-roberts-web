import { html, esc, icon } from '../lib/html.mjs';
import { faqSchema } from '../lib/layout.mjs';
import { aurora, cta, faqSection, serviceCard, stackCard, serpCard, timeline, browser, phone } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { services } from '../data/services.mjs';
import { projects } from '../data/work.mjs';

export const homeFaqs = [
  ['How much does a website cost?', 'Every project is different, so we quote a fixed price after a free call. The quote is itemised, in writing, and only changes if the brief does. Monthly services like SEO, ads management and hosting are a fixed monthly fee.'],
  ['How long does a new website take?', 'Most small business websites take four to eight weeks from the first call to launch. Copy and photos are usually what decides the pace, and we can help with both.'],
  ['Do you only work with businesses in Hampshire?', 'No. Most of our clients are along the South Coast, from Portsmouth to Bournemouth, but we work with businesses anywhere in the UK over video calls.'],
  ['Can you take over my existing website, SEO or ads?', 'Yes. We start with an honest audit, keep what is working, and tell you plainly what isn’t. Sometimes the answer is a few fixes rather than a rebuild.'],
  ['Who owns the website and the accounts?', 'You do. The domain, website, Google and Meta ad accounts and analytics are all set up in your name. If you ever move on, everything goes with you.'],
  ['Do I have to sign a long contract?', 'No. Projects are quoted and paid for as one-off jobs, and monthly services run month to month.'],
];

// A fictional business used only to demonstrate the kind of site we build.
const demo = {
  domain: 'harbourplumbing.co.uk',
  mock: {
    variant: 'services',
    cls: 'mk-demo',
    brand: '#0F172A',
    brand2: '#2563EB',
    photo: 'ph-demo',
    photos: ['ph-demo', 'ph-demo', 'ph-demo'],
    logo: 'Harbour',
    nav: ['Services', 'Areas', 'Reviews', 'Contact'],
    eyebrow: 'Gas Safe registered · Southampton',
    headline: 'Plumbing & heating engineers you can actually get hold of',
    cta: ['Get a quote', 'Call now'],
    items: ['Boiler installs', 'Emergency repairs', 'Bathrooms'],
  },
};

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
  [icon.key, 'You own everything.', 'Your domain, website, ad accounts and analytics are set up in your name. If you ever move on, it all goes with you.'],
  [icon.file, 'Prices are fixed.', 'Every project is quoted up front and in writing, and the price only changes if the brief does.'],
  [icon.refresh, 'No long lock-ins.', 'Monthly services run month to month. We’d rather keep clients by being worth keeping.'],
  [icon.chart, 'Reports you can read.', 'Calls, enquiries and what each one cost. Not a 40-page PDF of charts and jargon.'],
  [icon.users, 'You talk to the people doing the work.', 'No account managers passing messages. The person you speak to is the person building your site.'],
];

export function pages() {
  const body = html`
  <section class="hero" aria-labelledby="hero-title">
    ${aurora()}
    <div class="grid-bg" aria-hidden="true"></div>
    <div class="wrap z hero-grid">
      <div class="hero-copy" data-reveal-children>
        <span class="eyebrow eyebrow-live">${esc(site.base)} web studio · Now booking new projects</span>
        <h1 class="display hero-title" id="hero-title">Websites that <span class="grad-text">win you work.</span><span class="h1-sub">Web design, SEO and ads for businesses in Hampshire and across the UK.</span></h1>
        <p class="lede hero-lede">We build your website by hand, get it found on Google, run the ads that fill your diary, and keep the whole thing secure and online. One studio, the whole job.</p>
        <div class="btn-row">
          <a class="btn btn-primary btn-lg" href="/contact" data-magnet>Start a project${icon.arrowRight}</a>
          <a class="btn btn-ghost btn-lg" href="/work" data-magnet>See our work</a>
        </div>
        <div class="hero-trust">
          <span>Recent work for</span>
          <ul>${projects.map((p) => html`<li><a href="/work/${p.slug}">${esc(p.name)}</a></li>`)}</ul>
        </div>
      </div>
      <div class="hero-scene" data-scene aria-hidden="true" data-nosnippet>
        <span class="scene-glow"></span>
        <span class="scene-label">Example site</span>
        <div class="scene-window">${browser(demo)}</div>
        <div class="scene-phone">${phone(demo)}</div>
        <div class="float float-card float-perf">
          <span class="ring" data-ring style="--off:1"><svg viewBox="0 0 36 36"><circle class="track" cx="18" cy="18" r="15.9"/><circle class="bar" cx="18" cy="18" r="15.9"/></svg><b>99</b></span>
          <span><b>Performance</b><small>Lighthouse, mobile</small></span>
        </div>
        <div class="float float-card float-secure">
          <span class="mini-shield">${icon.shield}</span>
          <span><b>Secured</b><small>SSL · backups · monitoring</small></span>
          <span class="status-dot"></span>
        </div>
        <div class="float float-card float-lead" data-lead>
          <span class="avatar" data-lead-initials>SM</span>
          <span><b data-lead-title>New enquiry: Sam, Winchester</b><small data-lead-text>Boiler replacement · via Google Ads · just now</small></span>
        </div>
      </div>
    </div>
  </section>

  <div class="marquee" aria-hidden="true">
    <div class="marquee-track">
      ${[0, 1].map(() => html`<ul>${['Website design', 'SEO', 'Google Ads', 'Meta Ads', 'Digital marketing', 'Cyber security', 'Hosting & care', 'Landing pages', 'Google Business Profile', 'Email protection'].map((t) => html`<li>${icon.sparkle}${t}</li>`)}</ul>`)}
    </div>
  </div>

  <section class="section" aria-labelledby="services-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">What we do</span>
        <h2 class="h2" id="services-title">Everything your website needs, <span class="grad-text">under one roof.</span></h2>
        <p class="lede">Most businesses juggle a designer, an SEO agency, someone for the ads and an IT person. We do all six parts, so nothing falls through the gaps and every part pulls in the same direction.</p>
      </div>
      <div class="bento" data-reveal-children>
        ${services.map((s) => serviceCard(s))}
      </div>
    </div>
  </section>

  <section class="section section-tight" aria-label="Our standards">
    <div class="wrap">
      <div class="stats" data-reveal-children>
        ${standards.map(([n, suffix, text]) => html`<div class="card stat" data-spot><b><span data-count="${n}">${n}</span>${suffix}</b><span>${esc(text)}</span></div>`)}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="work-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Recent work</span>
        <h2 class="h2" id="work-title">Built for installers, engineers and studios <span class="grad-text">along the South Coast.</span></h2>
        <p class="lede">Websites that have to earn their keep: found locally, fast on a phone, and built to turn visits into calls, quotes and bookings.</p>
      </div>
      <div class="stack">
        ${projects.map(stackCard)}
      </div>
      <p class="btn-row" style="margin-top:40px"><a class="btn btn-ghost" href="/work">All case studies${icon.arrowRight}</a></p>
    </div>
  </section>

  <section class="section rel" aria-labelledby="preview-title" data-nosnippet>
    ${aurora(true)}
    <div class="wrap z">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Try it</span>
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
      <div class="section-head" data-reveal>
        <span class="eyebrow">How it works</span>
        <h2 class="h2" id="process-title">Four steps. Fixed price. <span class="grad-text">No surprises.</span></h2>
        <p class="lede">You’ll always know what’s happening, what it costs and what comes next.</p>
      </div>
      ${timeline(steps)}
    </div>
  </section>

  <section class="section" aria-labelledby="promises-title">
    <div class="wrap">
      <div class="section-head" data-reveal>
        <span class="eyebrow">Straight talk</span>
        <h2 class="h2" id="promises-title">The small print, in large print.</h2>
      </div>
      <ul class="promises" data-reveal-children>
        ${promises.map(([ic, t, d], i) => html`<li class="card promise${i === promises.length - 1 ? ' promise-wide' : ''}" data-spot><span class="icon-tile">${ic}</span><div><b>${esc(t)}</b><p>${esc(d)}</p></div></li>`)}
      </ul>
    </div>
  </section>

  ${faqSection(homeFaqs)}
  ${cta()}
  `;

  return [
    {
      path: '/',
      title: 'Web Design, SEO & Ads in Hampshire | Roffey-Roberts Web',
      description:
        'Hampshire web studio for businesses that need their website to bring in work: custom web design, SEO, Google and Meta ads, cyber security and hosting.',
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
