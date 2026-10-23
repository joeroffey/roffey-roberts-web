import { html, esc, icon } from '../lib/html.mjs';
import { faqSchema } from '../lib/layout.mjs';
import { aurora, cta, faqSection, serpCard } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { guides } from '../data/guides.mjs';
import { services } from '../data/services.mjs';
import { projects } from '../data/work.mjs';
import { areas } from '../data/areas.mjs';

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

// What each part of the job looks like the usual way, and with us. Every cell answers in words.
const compare = [
  ['Your website', 'website-design', 'A designer who has since moved on', 'Designed and built by us, then kept fast'],
  ['Getting found on Google', 'seo', 'An agency sending reports nobody reads', 'Town pages, fixes and your Business Profile, reported as calls'],
  ['Google and Meta ads', 'google-meta-ads', 'Run by someone else, measured in clicks', 'Built around enquiries, with tracking you can trust'],
  ['Email, laptops and Microsoft 365', 'it-support', 'An IT firm that picks up when it breaks', 'Set up properly, with someone to call before it breaks'],
  ['Security and backups', 'cyber-security', 'Nobody’s job', 'Audits, Cyber Essentials, email protection and tested backups'],
  ['Hosting', 'website-hosting', 'A reseller account nobody looks at', 'Fast managed hosting, monitored and updated'],
  ['Who you talk to', null, 'An account manager passing messages', 'The person doing the work'],
  ['What it costs', null, 'Hourly, with a surprise at the end', 'A fixed written quote; monthly services month to month'],
  ['Who owns it', null, 'Often, the agency', 'You: the domain, the code, the accounts, the data'],
];

// The four stages of a website project, with the share of the calendar each really takes.
const stages = [
  ['Thirty minutes', 15, 'First, a free call about your customers, what works now and what doesn’t.'],
  ['A few days', 15, 'Then a short written plan with a fixed price and a timeline.'],
  ['Four to eight weeks', 50, 'Next, design and build on a private preview link you can check on your own phone.'],
  ['Month to month', 20, 'Finally, launch, then we keep it fast, secure and bringing in work.'],
];

const guideShort = { 'how-much-does-a-website-cost-uk': 'What a website costs', 'local-seo-for-trades': 'Local SEO for trades', 'google-ads-vs-meta-ads': 'Google Ads or Meta ads first', 'cyber-essentials-explained': 'Cyber Essentials, explained' };
const scopeLine = (p) => p.scope.map((s) => services.find((x) => x.slug === s)?.short || s).join(', ');

export function pages() {
  const first = projects[0];
  const body = html`
  <section class="hero" aria-labelledby="hero-title">
    ${aurora()}
    <div class="wrap z ax hero-ax">
      <div class="hero-talk">
        <p class="hero-standfirst">Web design, SEO, ads, cyber security and IT support for businesses on the South Coast.</p>
        <a class="btn btn-primary btn-lg hero-action" href="/contact" data-press>Start a project${icon.arrowRight}</a>
        <p class="hero-note">A ${esc(site.base)} studio. We reply within one working day.</p>
      </div>
      <h1 class="display hero-title" id="hero-title"><span class="hero-line"><span>Websites and IT</span></span><span class="hero-line"><span>that <span class="grad-text">just work.</span></span></span></h1>
      <figure class="masthead" data-masthead>
        <div class="masthead-pic">
          ${projects.map((p, i) => html`<img src="${p.screenshot}" alt="${esc(p.name)} homepage, designed and built by Roffey-Roberts Web" width="1440" height="936" decoding="async" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} data-masthead-shot="${i}"${i ? ' class="is-off"' : ''}>`)}
        </div>
        <figcaption class="masthead-cap">
          <a href="/work/${first.slug}" data-masthead-link>
            <b data-masthead-name>${esc(first.name)}</b>
            <span data-masthead-meta>${esc(scopeLine(first))} · ${esc(first.location.split(',')[0])}</span>
          </a>
        </figcaption>
        ${projects.map((p) => html`<span hidden data-masthead-item data-name="${esc(p.name)}" data-meta="${esc(scopeLine(p))} · ${esc(p.location.split(',')[0])}" data-href="/work/${p.slug}"></span>`)}
      </figure>
    </div>
  </section>

  <section class="section" aria-labelledby="compare-title">
    <div class="wrap">
      <h2 class="h2 compare-title" id="compare-title" data-reveal>One team, the whole job.</h2>
      <div class="compare" role="table" aria-label="The usual way compared with Roffey-Roberts Web" data-reveal-children>
        <div class="compare-row compare-head" role="row"><span role="columnheader" class="compare-name"><span class="sr-only">Part of the job</span></span><span role="columnheader">The usual way</span><span role="columnheader" class="is-us">With Roffey-Roberts Web</span></div>
        ${compare.map(([name, slug, usual, us]) => html`
        <div class="compare-row" role="row">
          <span role="rowheader" class="compare-name">${slug ? html`<a href="/services/${slug}">${esc(name)}</a>` : esc(name)}</span>
          <span role="cell" data-col="The usual way">${esc(usual)}</span>
          <span role="cell" class="is-us" data-col="With us">${esc(us)}</span>
        </div>`)}
      </div>
    </div>
  </section>

  <section class="section section-mosaic" aria-labelledby="mosaic-title">
    <div class="wrap"><h2 class="h3 mosaic-title" id="mosaic-title" data-reveal>Built for the phone first.</h2></div>
    <div class="mosaic" data-reveal-children>
      ${projects.map((p) => html`<img class="mosaic-phone" src="/img/work/${p.slug}-phone.webp" alt="${esc(p.name)} website at phone width" width="780" height="1688" loading="lazy" decoding="async">`)}
      <div class="tile tile-violet"><b><span data-count="90">90</span>+</b><span>Lighthouse performance score on every site we ship, measured on a phone.</span></div>
      <div class="tile tile-cyan"><b><span data-count="24">24</span>h</b><span>The longest you’ll wait for a reply to an enquiry, on a working day.</span></div>
    </div>
    <div class="wrap ax"><p class="mosaic-cap">Four of our sites at phone width, as they are today: ${projects.map((p, i) => html`${i ? (i === projects.length - 1 ? ' and ' : ', ') : ''}<a href="/work/${p.slug}">${esc(p.name)}</a>`)}. Most of your customers will meet you this way, so it is where we start.</p></div>
  </section>

  <section class="section" aria-labelledby="names-title">
    <div class="wrap ax">
      <h2 class="h3 col-heading" id="names-title" data-reveal>Who we work with</h2>
      <div class="names" data-reveal-children>
        <div class="names-col"><p class="names-kind">Clients</p><ul>${projects.map((p) => html`<li><a href="/work/${p.slug}">${esc(p.name)}</a></li>`)}</ul></div>
        <div class="names-col"><p class="names-kind">Where</p><ul>${areas.map((a) => html`<li><a href="/web-design/${a.slug}">${esc(a.short)}</a></li>`)}<li>Ringwood</li><li>Dorset</li><li><a href="/web-design">Anywhere in the UK</a></li></ul></div>
        <div class="names-col"><p class="names-kind">Services</p><ul>${services.map((s) => html`<li><a href="/services/${s.slug}">${esc(s.short)}</a></li>`)}<li><a href="/services/cyber-security/cyber-essentials">Cyber Essentials</a></li><li><a href="/services/cyber-security/backup-and-recovery">Backups</a></li></ul></div>
        <div class="names-col"><p class="names-kind">Reading</p><ul>${guides.map((g) => html`<li><a href="/guides/${g.slug}">${esc(guideShort[g.slug] || g.h1)}</a></li>`)}</ul></div>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="stages-title">
    <div class="wrap">
      <h2 class="h2" id="stages-title" data-reveal>Four steps. Fixed price.</h2>
      <div class="stages" data-ui data-reveal-children style="--cols:${stages.map(([, g]) => `${g}fr`).join(' ')}">
        ${stages.map(([when, grow, clause], i) => html`<div class="stage stage-${i + 1}" style="--grow:${grow}"><b>${esc(when)}</b><p>${esc(clause)}</p></div>`)}
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="preview-title" data-nosnippet>
    <div class="wrap ax">
      <div class="col-side" data-reveal>
        <h2 class="h2" id="preview-title">How you look on Google</h2>
        <p class="lede">People decide which result to click in a couple of seconds, from two lines of text. Type in your details to see a draft of yours, and whether Google would cut it short.</p>
      </div>
      <div class="tool" data-reveal>
        <form class="tool-form" data-preview autocomplete="off">
          <div class="field"><label for="pv-business">Business name</label><input id="pv-business" name="business" type="text" value="${sample.business}" maxlength="60"></div>
          <div class="field"><label for="pv-service">What you do</label><input id="pv-service" name="service" type="text" value="${sample.service}" maxlength="60"></div>
          <div class="field"><label for="pv-area">Town or area</label><input id="pv-area" name="area" type="text" value="${sample.area}" maxlength="40"></div>
        </form>
        ${serpCard({ name: sample.business, domain: 'harbourplumbing.co.uk', title: sampleTitle, desc: sampleDesc })}
        <ul class="serp-checks" aria-live="polite">
          <li data-check="title" class="ok">${icon.check}<span>The title fits without being cut off.</span></li>
          <li data-check="area" class="ok">${icon.check}<span>Your town is in the title, where local searchers look for it.</span></li>
          <li data-check="desc" class="ok">${icon.check}<span>The description ends with a clear next step.</span></li>
        </ul>
        <p class="tool-note">This is the easy bit. Ranking for it takes a fast site, the right pages and a well-kept Google Business Profile. <a class="link-under" href="/services/seo">How our SEO works</a></p>
        <div class="btn-row"><a class="btn btn-primary" href="/contact?service=seo" data-preview-cta data-press>Send this to us with an enquiry${icon.arrowRight}</a></div>
      </div>
    </div>
  </section>

  ${faqSection(homeFaqs)}
  ${cta({ heading: 'Let’s make yours work.' })}
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
