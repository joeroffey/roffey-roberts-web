import { html, esc } from '../lib/html.mjs';
import { faqSchema } from '../lib/layout.mjs';
import { ctaBand, faqList, shot } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { groups, servicesInGroup } from '../data/services.mjs';
import { projects } from '../data/work.mjs';

export const homeFaqs = [
  ['How much does a website cost?', 'Every project is different, so we quote a fixed price after a free call. The quote is itemised, in writing, and only changes if the brief does. Monthly services like SEO, ads management and hosting are a fixed monthly fee.'],
  ['How long does a new website take?', 'Most small business websites take four to eight weeks from the first call to launch. Copy and photos are usually what decides the pace, and we can help with both.'],
  ['Do you only work with businesses in Hampshire?', 'No. Most of our clients are along the South Coast, from Portsmouth to Bournemouth, but we work with businesses anywhere in the UK over video calls.'],
  ['Can you take over my existing website, SEO or ads?', 'Yes. We start with an honest audit, keep what is working, and tell you plainly what isn’t. Sometimes the answer is a few fixes rather than a rebuild.'],
  ['Who owns the website and the accounts?', 'You do. The domain, website, Google and Meta ad accounts and analytics are all set up in your name. If you ever move on, everything goes with you.'],
  ['Do I have to sign a long contract?', 'No. Projects are quoted and paid for as one-off jobs, and monthly services run month to month.'],
];

const heroRows = [
  ['Built properly.', [['website-design', 'Website design & build']]],
  ['Found first.', [['seo', 'SEO'], ['digital-marketing', 'marketing'], ['google-meta-ads', 'Google & Meta ads']]],
  ['Kept safe.', [['cyber-security', 'Cyber security'], ['website-hosting', 'hosting & care']]],
];

const sample = { business: 'Harbour Plumbing', service: 'Emergency plumber', area: 'Southampton' };
const sampleTitle = `${sample.service} in ${sample.area} | ${sample.business}`;
const sampleDesc = `${sample.service} in ${sample.area} from ${sample.business}. Fast response, fair prices and friendly local service. Call today or get a free quote online.`;

export function pages() {
  const [featured, ...rest] = projects;
  const body = html`
  <section class="hero s-dark" aria-labelledby="hero-title">
    <div class="wrap hero-grid">
      <h1 class="hero-title" id="hero-title">
        ${heroRows.map(
          ([line, notes]) => html`
          <span class="hero-row">
            <span class="hero-line">${line}</span>
            <span class="hero-leader" aria-hidden="true"></span>
            <span class="hero-note">${notes.map(([slug, label], i) => html`${i ? (i === notes.length - 1 ? ' and ' : ', ') : ''}<a href="/services/${slug}">${esc(label)}</a>`)}</span>
          </span>`
        )}
      </h1>
      <div class="hero-foot">
        <p class="hero-lede">We’re a ${esc(site.base)} web design, SEO and digital marketing studio for businesses that need their website to bring in work. We design and build it by hand, get it found, run the ads that fill your diary, and keep the whole thing secure and online.</p>
        <div class="hero-actions">
          <a class="btn btn-amber" href="/contact">Start a project</a>
          <a class="link-light" href="/work">See our work</a>
        </div>
      </div>
    </div>
    <div class="wrap hero-proof">
      <p>Recent work for</p>
      <ul>${projects.map((p) => html`<li><a href="/work/${p.slug}">${esc(p.name)}</a></li>`)}</ul>
    </div>
  </section>

  <section class="section s-fog preview" aria-labelledby="preview-title">
    <div class="wrap preview-grid">
      <div class="preview-intro">
        <h2 class="h2" id="preview-title">How does your business look on Google?</h2>
        <p>People decide which result to click in a couple of seconds, from two lines of text. Type in your details to see a draft of yours, and whether Google would cut it short.</p>
        <form class="preview-form" data-preview autocomplete="off">
          <div class="field">
            <label for="pv-business">Business name</label>
            <input id="pv-business" name="business" type="text" value="${sample.business}" maxlength="60">
          </div>
          <div class="field">
            <label for="pv-service">What you do</label>
            <input id="pv-service" name="service" type="text" value="${sample.service}" maxlength="60">
          </div>
          <div class="field">
            <label for="pv-area">Town or area</label>
            <input id="pv-area" name="area" type="text" value="${sample.area}" maxlength="40">
          </div>
        </form>
      </div>
      <div class="preview-out">
        <div class="serp" data-serp>
          <div class="serp-site">
            <span class="serp-fav" data-serp-initial aria-hidden="true">H</span>
            <span class="serp-source"><span data-serp-name>${sample.business}</span><span data-serp-url>harbourplumbing.co.uk</span></span>
          </div>
          <p class="serp-title" data-serp-title>${sampleTitle}</p>
          <p class="serp-desc" data-serp-desc>${sampleDesc}</p>
        </div>
        <ul class="serp-checks" aria-live="polite">
          <li data-check="title" class="ok">${'<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'}<span>The title fits without being cut off.</span></li>
          <li data-check="area" class="ok">${'<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'}<span>Your town is in the title, where local searchers look for it.</span></li>
          <li data-check="desc" class="ok">${'<svg class="i" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>'}<span>The description ends with a clear next step.</span></li>
        </ul>
        <p class="preview-note">This is the easy bit. Ranking for it takes a fast site, the right pages and a well-kept Google Business Profile. <a href="/services/seo">How our SEO works</a></p>
        <a class="btn btn-dark" href="/contact?service=seo" data-preview-cta>Send this to us with an enquiry</a>
      </div>
    </div>
  </section>

  <section class="section s-white" aria-labelledby="services-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="services-title">One studio for the whole job</h2>
        <p>Most small businesses juggle a web designer, an SEO agency, someone for the ads and an IT person, then spend their time passing messages between them. We do all six, so nothing falls through the gaps.</p>
      </div>
      <div class="pillars">
        ${groups.map(
          (g) => html`
          <div class="pillar">
            <h3 class="pillar-name">${g.name}</h3>
            <p class="pillar-summary">${esc(g.summary)}</p>
            <ul class="pillar-services">
              ${servicesInGroup(g.id).map(
                (s) => html`
                <li>
                  <a href="/services/${s.slug}">
                    <span class="ps-name">${esc(s.name)}</span>
                    <span class="ps-desc">${esc(s.card)}</span>
                  </a>
                </li>`
              )}
            </ul>
          </div>`
        )}
      </div>
    </div>
  </section>

  <section class="section s-dark" aria-labelledby="work-title">
    <div class="wrap">
      <div class="section-head section-head-split">
        <h2 class="h2" id="work-title">Recent work</h2>
        <p>Installers, engineers and studios along the South Coast, with websites that have to earn their keep. <a class="link-light" href="/work">All case studies</a></p>
      </div>
      <article class="feature-project">
        <a class="project-shot" href="/work/${featured.slug}" tabindex="-1" aria-hidden="true">${shot(featured)}</a>
        <div class="project-text">
          <p class="project-meta">${esc(featured.sector)}, ${esc(featured.location.split(',')[0])}</p>
          <h3 class="project-name"><a href="/work/${featured.slug}">${esc(featured.name)}</a></h3>
          <p class="project-summary">${esc(featured.summary)}</p>
          <p class="project-scope"><span>Scope</span> ${esc(featured.scopeLabel)}</p>
        </div>
      </article>
      <div class="project-trio">
        ${rest.map(
          (p) => html`
          <article class="mini-project">
            <a class="project-shot" href="/work/${p.slug}" tabindex="-1" aria-hidden="true">${shot(p)}</a>
            <p class="project-meta">${esc(p.sector)}</p>
            <h3 class="project-name"><a href="/work/${p.slug}">${esc(p.name)}</a></h3>
            <p class="project-scope"><span>Scope</span> ${esc(p.scopeLabel)}</p>
          </article>`
        )}
      </div>
    </div>
  </section>

  <section class="section s-white" aria-labelledby="process-title">
    <div class="wrap">
      <div class="section-head">
        <h2 class="h2" id="process-title">How a project runs</h2>
        <p>Four steps, a fixed price and no surprises. You’ll always know what’s happening and what comes next.</p>
      </div>
      <ol class="steps">
        <li><span class="step-n" aria-hidden="true">1</span><h3>A free call</h3><p>Thirty minutes on the phone or a video call. We ask about your customers, what’s working now and what isn’t.</p></li>
        <li><span class="step-n" aria-hidden="true">2</span><h3>A fixed quote</h3><p>A short written plan with a fixed price and a timeline. No hourly billing, no surprises at the end.</p></li>
        <li><span class="step-n" aria-hidden="true">3</span><h3>Design and build</h3><p>You see the design early, then watch the site take shape on a private preview link you can check on your own phone.</p></li>
        <li><span class="step-n" aria-hidden="true">4</span><h3>Launch, then look after</h3><p>We handle the switchover and the tracking, then keep your site fast, secure and working hard for you.</p></li>
      </ol>
    </div>
  </section>

  <section class="section s-fog" aria-labelledby="promises-title">
    <div class="wrap">
      <h2 class="h2" id="promises-title">The small print, in large print</h2>
      <dl class="promises">
        <div><dt>You own everything.</dt><dd>Your domain, website, ad accounts and analytics are set up in your name. If you ever move on, it all goes with you.</dd></div>
        <div><dt>Prices are fixed.</dt><dd>Every project is quoted up front and in writing, and the price only changes if the brief does.</dd></div>
        <div><dt>No long lock-ins.</dt><dd>Monthly services run month to month. We’d rather keep clients by being worth keeping.</dd></div>
        <div><dt>Reports you can read.</dt><dd>Calls, enquiries and what each one cost. Not a 40-page PDF of charts and jargon.</dd></div>
        <div><dt>You talk to the people doing the work.</dt><dd>No account managers passing messages. The person you speak to is the person building your site.</dd></div>
      </dl>
    </div>
  </section>

  ${faqList(homeFaqs)}
  ${ctaBand()}
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
        {
          '@type': 'WebSite',
          '@id': `${site.url}/#website`,
          url: site.url,
          name: site.name,
          publisher: { '@id': `${site.url}/#organization` },
          inLanguage: 'en-GB',
        },
        faqSchema(homeFaqs),
      ],
      body,
    },
  ];
}
