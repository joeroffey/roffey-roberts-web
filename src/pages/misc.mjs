import { html, esc, icon } from '../lib/html.mjs';
import { breadcrumbs } from '../lib/layout.mjs';
import { aurora, breadcrumb, cta, featureGrid, serviceIcons } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { services } from '../data/services.mjs';

// Towns plotted by real latitude/longitude relative to Hampshire; it's a constellation, not a map.
const towns = [
  ['Winchester', 51.0632, -1.308],
  ['Southampton', 50.9097, -1.4044, true],
  ['Portsmouth', 50.8198, -1.088],
  ['Chichester', 50.8365, -0.7792],
  ['Salisbury', 51.0688, -1.7945],
  ['Ringwood', 50.8451, -1.7903],
  ['Lymington', 50.759, -1.5419],
  ['Bournemouth', 50.7192, -1.8808],
  ['Basingstoke', 51.2665, -1.0876],
];
function coverage() {
  const lats = towns.map((t) => t[1]), lons = towns.map((t) => t[2]);
  const [la0, la1] = [Math.min(...lats), Math.max(...lats)], [lo0, lo1] = [Math.min(...lons), Math.max(...lons)];
  const pos = (la, lo) => ({ x: 10 + ((lo - lo0) / (lo1 - lo0)) * 80, y: 12 + (1 - (la - la0) / (la1 - la0)) * 72 });
  return html`
  <div class="coverage" aria-hidden="true">
    <div class="coverage-rings"><i></i><i></i><i></i><i></i></div>
    <span class="coverage-sweep"></span>
    ${towns.map(([n, la, lo, home]) => { const p = pos(la, lo); return html`<span class="town${home ? ' town-home' : ''}" style="left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}%"><i></i>${esc(n)}</span>`; })}
  </div>`;
}

function about() {
  const values = [
    ['Results you can count', 'Calls, form enquiries, bookings and quotes. If we can’t show a change in the numbers that matter to you, we’ll say so.'],
    ['Speed', 'A slow website loses people before it has said anything. Every site we build is designed to feel instant on a phone.'],
    ['Plain English', 'No jargon in our proposals, our reports or on your website. If it can’t be explained simply, it isn’t understood well enough.'],
    ['Your independence', 'Your domain, code, accounts and data belong to you. We want you to stay because it’s working, not because leaving is hard.'],
    ['Security by default', 'HTTPS, security headers, email protection and two-factor sign-in aren’t extras. They’re part of doing the job properly.'],
    ['Real content', 'Real photos, real projects and real reviews. Customers can tell the difference, and so can Google.'],
  ];
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb([['Home', '/'], ['About', '/about']])}
        <h1 class="display h1 page-title" id="page-title">A small Hampshire web and IT studio, <span class="grad-text">on purpose.</span></h1>
        <p class="lede">${esc(site.name)} is a web and IT studio based in ${esc(site.base)}. We build the websites and marketing that bring businesses work, and look after the IT, security and hosting that keep them working.</p>
      </div>
    </div>
  </section>

  <section class="section" aria-labelledby="story-title">
    <div class="wrap two-col">
      <div data-reveal><h2 class="h2" id="story-title">One team, the whole job.</h2></div>
      <div class="lead-text" data-reveal>
        <p>Most of the businesses we meet already have a website and a cupboard full of IT. The website looks fine but doesn’t bring in much work, and the IT works until the day it doesn’t.</p>
        <p>Usually it’s a mix of things handled by different people: a designer who has moved on, an SEO agency sending reports nobody reads, ads run by someone else, an IT firm that only picks up when something is broken, and nobody watching security at all. Each part is someone’s job, so the whole is nobody’s.</p>
        <p><strong>So we do the whole thing.</strong> We design and build the website, get it found, run the ads, and look after the email, devices, cloud accounts, security and hosting behind it, with one small team that can see how every part affects the rest.</p>
        <p>We’re deliberately small. You deal with the person doing the work, not an account manager, and we would rather look after fewer businesses properly than rush more.</p>
      </div>
    </div>
  </section>

  <section class="section" id="${site.founder.name.split(' ')[0].toLowerCase()}" aria-labelledby="people-title">
    <div class="wrap two-col">
      <div data-reveal><h2 class="h2" id="people-title">The person behind the work.</h2></div>
      <div class="card card-pad person" data-reveal data-spot>
        ${site.founder.photo
          ? html`<img class="person-photo" src="${esc(site.founder.photo)}" alt="${esc(site.founder.name)}, ${esc(site.founder.role.toLowerCase())} of ${esc(site.name)}" width="120" height="120" loading="lazy">`
          : html`<span class="person-avatar" aria-hidden="true">${esc(site.founder.initials)}</span>`}
        <div>
          <h3 class="h3">${esc(site.founder.name)}</h3>
          <p class="person-role">${esc(site.founder.role)}, ${esc(site.name)}</p>
          <p>Joe designs and builds every site the studio ships, runs the SEO and ads, and looks after the IT, security and hosting behind them. He comes from the trades the studio serves: alongside Roffey-Roberts he looks after the websites and marketing for a renewable energy installer and a family-run industrial door company on the South Coast, which is where the studio’s focus on calls, quotes and bookings comes from.</p>
          ${site.founder.bio.map((t) => html`<p>${esc(t)}</p>`)}
          <p>If you get in touch, Joe is who replies, who you’ll speak to on the first call, and who does the work.</p>
          ${site.founder.credentials.length ? html`<ul class="person-creds pill-list" aria-label="Credentials">${site.founder.credentials.map((c) => html`<li><span>${icon.check}${esc(c)}</span></li>`)}</ul>` : ''}
          <div class="btn-row" style="margin-top:18px">
            ${site.email && html`<a class="btn btn-ghost btn-sm" href="mailto:${esc(site.email)}">${icon.mail}${esc(site.email)}</a>`}
            ${site.phone && html`<a class="btn btn-ghost btn-sm" href="tel:${esc(site.phoneHref || site.phone)}">${icon.phone}${esc(site.phone)}</a>`}
            ${site.founder.linkedin && html`<a class="btn btn-ghost btn-sm" href="${esc(site.founder.linkedin)}" rel="me noopener">LinkedIn${icon.arrowUpRight}</a>`}
            ${site.reviewUrl && html`<a class="btn btn-ghost btn-sm" href="${esc(site.reviewUrl)}" rel="noopener">${icon.star}Review us on Google</a>`}
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section rel" aria-labelledby="values-title">
    ${aurora(true)}
    <div class="wrap z">
      <div class="section-head" data-reveal>
        <h2 class="h2" id="values-title">Six things we won’t <span class="grad-text">compromise on.</span></h2>
      </div>
      ${featureGrid(values, [icon.chart, icon.bolt, icon.file, icon.key, icon.shield, icon.heart])}
    </div>
  </section>

  <section class="section" aria-labelledby="where-title">
    <div class="wrap tool-grid">
      <div class="section-head" data-reveal style="margin:0">
        <h2 class="h2" id="where-title">${esc(site.base)}, the South Coast, and <span class="grad-text">anywhere in the UK.</span></h2>
        <p class="lede">We’re based in ${esc(site.base)} and most of our clients are in and around ${esc(site.towns.slice(0, -1).join(', '))} and ${esc(site.towns.at(-1))}. We’re always happy to meet in person locally, and most projects run perfectly well over video calls, email and a shared preview link.</p>
        <div class="btn-row"><a class="btn btn-primary" href="/contact" data-press>Start a project${icon.arrowRight}</a></div>
      </div>
      <div class="card card-pad" data-reveal>${coverage()}</div>
    </div>
  </section>

  <section class="section section-tight" aria-labelledby="svc-title">
    <div class="wrap" data-reveal>
      <h2 class="h3" id="svc-title" style="margin-bottom:18px">What we do</h2>
      <div class="pill-list">${services.map((s) => html`<a href="/services/${s.slug}">${serviceIcons[s.slug]}${esc(s.name)}</a>`)}</div>
    </div>
  </section>

  ${cta({ heading: 'Let’s see if we’re a good fit.' })}
  `;
  return {
    path: '/about',
    title: 'About Us | Hampshire Web & IT Studio | Roffey-Roberts Web',
    description: 'Roffey-Roberts Web is a small Hampshire web and IT studio. Websites, marketing, cyber security, IT support and hosting, with one team doing the whole job.',
    og: 'about',
    ogTitle: 'A small studio, on purpose.',
    schema: [breadcrumbs([['Home', '/'], ['About', '/about']]), { '@type': 'AboutPage', url: `${site.url}/about`, name: 'About Roffey-Roberts Web', about: { '@id': `${site.url}/#organization` } }],
    body,
  };
}

function contact() {
  const serviceOptions = [...services.map((s) => [s.slug, s.name]), ['not-sure', 'Not sure yet']];
  const body = html`
  <section class="page-hero" style="padding-bottom:clamp(32px,4vw,48px)" aria-labelledby="page-title">
    ${aurora()}
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb([['Home', '/'], ['Contact', '/contact']])}
        <h1 class="display h1 page-title" id="page-title">Let’s start your <span class="grad-text">project.</span></h1>
        <p class="lede">Tell us a bit about your business and what you need. We reply to every enquiry within one working day, with straight advice and a clear next step.</p>
      </div>
    </div>
  </section>

  <section class="section" style="padding-top:0">
    <div class="wrap contact-grid">
      <div class="card contact-card" data-reveal>
        <form class="enquiry" action="/api/contact" method="post" novalidate data-enquiry>
          <fieldset class="field-group">
            <legend>What do you need help with?</legend>
            <div class="chips">
              ${serviceOptions.map(([value, label]) => html`<label class="chip"><input type="checkbox" name="services" value="${value}"><span>${icon.check}${esc(label)}</span></label>`)}
            </div>
          </fieldset>

          <div class="field">
            <label for="f-message">Tell us about the project</label>
            <p class="hint" id="f-message-hint">What does your business do, and what do you want to change? Links to your current site or competitors you like are helpful.</p>
            <textarea id="f-message" name="message" rows="6" required maxlength="5000" aria-describedby="f-message-hint"></textarea>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="f-budget">Rough budget <span class="opt">(optional)</span></label>
              <select id="f-budget" name="budget">
                <option value="">Choose one</option>
                <option>Under £1,000</option><option>£1,000 to £3,000</option><option>£3,000 to £7,500</option><option>£7,500 or more</option><option>Monthly service only</option><option>Not sure yet</option>
              </select>
            </div>
            <div class="field">
              <label for="f-timeline">When would you like to start? <span class="opt">(optional)</span></label>
              <select id="f-timeline" name="timeline">
                <option value="">Choose one</option>
                <option>As soon as possible</option><option>In the next 1 to 3 months</option><option>Later this year</option><option>Just exploring</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" type="text" autocomplete="name" required maxlength="120"></div>
            <div class="field"><label for="f-business">Business name <span class="opt">(optional)</span></label><input id="f-business" name="business" type="text" autocomplete="organization" maxlength="160"></div>
          </div>

          <div class="field-row">
            <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200"></div>
            <div class="field"><label for="f-phone">Phone <span class="opt">(optional)</span></label><input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="40"></div>
          </div>

          <div class="field">
            <label for="f-website">Current website <span class="opt">(optional)</span></label>
            <input id="f-website" name="website" type="text" inputmode="url" placeholder="yourbusiness.co.uk" maxlength="300">
          </div>

          <div class="hp" aria-hidden="true"><label for="f-company-url">Leave this empty</label><input id="f-company-url" name="company_url" type="text" tabindex="-1" autocomplete="off"></div>

          <div class="form-foot">
            <button class="btn btn-primary btn-lg" type="submit" data-submit data-press>Send enquiry${icon.send}</button>
            <p class="small">We’ll only use your details to reply to this enquiry. See our <a href="/privacy">privacy notice</a>.</p>
          </div>
          <div class="form-status" role="status" aria-live="polite" data-status></div>
        </form>
        <div class="enquiry-done" data-done hidden tabindex="-1">
          <span class="done-mark">${icon.check}</span>
          <h2 class="h2">Enquiry sent.</h2>
          <p class="lede" data-done-text>Thanks. Your enquiry is with us and we’ll reply within one working day.</p>
          <a class="btn btn-ghost" href="/work">Have a look at our work while you wait${icon.arrowRight}</a>
        </div>
      </div>
      <aside class="contact-aside" aria-labelledby="next-steps-title" data-reveal style="--d:0.15s">
        <div class="card card-pad">
          <h2 class="h3" id="next-steps-title" style="margin-bottom:18px">What happens next</h2>
          <ol class="mini-steps">
            <li>We read your enquiry and reply within one working day.</li>
            <li>If it’s a good fit, we book a free 30-minute call at a time that suits you.</li>
            <li>You get a short written plan with a fixed price. No obligation.</li>
          </ol>
          ${site.email || site.phone
            ? html`<div class="contact-direct">
                ${site.phone && html`<a href="tel:${esc(site.phoneHref || site.phone)}">${icon.phone}${esc(site.phone)}</a>`}
                ${site.email && html`<a href="mailto:${esc(site.email)}">${icon.mail}${esc(site.email)}</a>`}
              </div>`
            : html`<div class="contact-direct"><a href="/contact?review=1">${icon.eye}Just want a free website review? Tick “Website design” and paste your link.</a></div>`}
        </div>
      </aside>
    </div>
  </section>
  `;
  return {
    path: '/contact',
    title: 'Contact Us: Start a Project | Roffey-Roberts Web',
    description: 'Tell us about your website, marketing, cyber security, IT or hosting needs. We reply to every enquiry within one working day with straight advice.',
    og: 'contact',
    ogTitle: 'Start a project.',
    schema: [breadcrumbs([['Home', '/'], ['Contact', '/contact']]), { '@type': 'ContactPage', url: `${site.url}/contact`, name: 'Contact Roffey-Roberts Web', about: { '@id': `${site.url}/#organization` } }],
    bodyClass: 'is-contact',
    body,
  };
}

function privacy() {
  const updated = '12 October 2026';
  const contactLine = site.email ? html`email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : html`use our <a href="/contact">contact form</a>`;
  const body = html`
  <section class="page-hero" aria-labelledby="page-title">
    ${aurora()}
    <div class="wrap z">
      <div class="page-hero-copy" data-reveal-children>
        ${breadcrumb([['Home', '/'], ['Privacy', '/privacy']])}
        <h1 class="display h1 page-title" id="page-title">Privacy notice</h1>
        <p class="lede">How we collect, use and look after your information. Last updated ${updated}.</p>
      </div>
    </div>
  </section>
  <section class="section" style="padding-top:0">
    <div class="wrap prose">
      <h2>Who we are</h2>
      <p>${esc(site.name)} (“we”, “us”) is responsible for the personal information collected through this website. If you have any questions about this notice or your information, ${contactLine}.</p>
      <h2>What we collect</h2>
      <p>When you send an enquiry, we collect the details you give us: your name, email address, and optionally your phone number, business name, website, budget, timeline and message. We also record which page you first arrived on and, if you came from an advert or campaign link, the campaign details in that link. This helps us understand which of our marketing works.</p>
      <p>Our hosting provider keeps short-lived technical logs, such as IP addresses and browser types, to keep the site secure and running.</p>
      <h2>How we use it</h2>
      <p>We use your enquiry details to reply to you, discuss your project and, if you become a client, to provide our services. Our lawful basis is our legitimate interest in responding to enquiries, or taking steps at your request before entering into a contract.</p>
      <p>We don’t sell your information, and we don’t add you to a mailing list without your permission.</p>
      <h2>Who we share it with</h2>
      <p>We use a small number of trusted providers to run this website: Vercel, which hosts the site, and Resend, which delivers enquiry emails to us. They process data on our behalf and only as we instruct. Some providers may process data outside the UK, under safeguards such as the UK International Data Transfer Agreement or adequacy regulations.</p>
      <h2>How long we keep it</h2>
      <p>We keep enquiries for up to two years, then delete them, unless you become a client, in which case we keep records for as long as we’re required to for legal and accounting purposes.</p>
      <h2 id="cookies">Cookies</h2>
      <p>This website doesn’t set any cookies unless you agree to them. If we use analytics or advertising tools, such as Google Analytics, Google Ads or the Meta pixel, we’ll ask for your consent first, and you can change your mind at any time using the cookie settings link at the bottom of every page.</p>
      <p>We store a small note in your browser of the page you arrived on and any campaign details, so we can include them with your enquiry. This isn’t sent anywhere unless you submit the form.</p>
      <h2>Your rights</h2>
      <p>You have the right to ask for a copy of your information, to have it corrected or deleted, to object to or restrict how we use it, and to have it moved to another provider. To make a request, ${contactLine}.</p>
      <p>If you’re unhappy with how we’ve handled your information, you can complain to the Information Commissioner’s Office at <a href="https://ico.org.uk" rel="noopener">ico.org.uk</a>.</p>
    </div>
  </section>
  `;
  return {
    path: '/privacy',
    title: 'Privacy Notice | Roffey-Roberts Web',
    description: 'How Roffey-Roberts Web collects, uses and looks after your personal information, and how we use cookies.',
    og: 'privacy',
    ogTitle: 'Privacy & cookies',
    schema: [breadcrumbs([['Home', '/'], ['Privacy', '/privacy']])],
    body,
  };
}

function notFound() {
  const body = html`
  <section class="page-hero notfound" aria-labelledby="page-title">
    ${aurora()}
    <div class="wrap z">
      <div class="page-hero-copy">
        <h1 class="display h1 page-title" id="page-title">This page isn’t <span class="grad-text">here.</span></h1>
        <p class="lede">The link may be old, or the address may have a typo. Try one of these instead.</p>
        <div class="pill-list">
          <a href="/">${icon.arrowRight}Home</a><a href="/services">${icon.layout}Services</a><a href="/work">${icon.eye}Work</a><a href="/contact">${icon.send}Start a project</a>
        </div>
      </div>
    </div>
  </section>`;
  return { path: '/404', title: 'Page not found | Roffey-Roberts Web', description: 'The page you were looking for could not be found.', og: 'home', noindex: true, sitemap: false, body };
}

export function pages() {
  return [about(), contact(), privacy(), notFound()];
}
