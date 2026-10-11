import { html, esc } from '../lib/html.mjs';
import { breadcrumbs } from '../lib/layout.mjs';
import { breadcrumb, ctaBand } from '../lib/components.mjs';
import { site } from '../data/site.mjs';
import { services } from '../data/services.mjs';

function about() {
  const body = html`
  <section class="page-hero s-dark" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb([['Home', '/'], ['About', '/about']])}
      <h1 class="page-title" id="page-title">A small studio, on purpose</h1>
      <div class="page-hero-foot">
        <p class="page-lede">${esc(site.name)} is a web studio based in ${esc(site.base)}. We build websites for businesses that depend on them, and then make sure they’re found and kept safe.</p>
      </div>
    </div>
  </section>

  <section class="section s-white" aria-labelledby="story-title">
    <div class="wrap about-grid">
      <h2 class="h2" id="story-title">Why we work this way</h2>
      <div class="lead-block lead-block-tight">
        <p>Most of the businesses we meet already have a website. It looks fine. It just doesn’t bring in much work, and nobody can quite say why.</p>
        <p>Usually it’s a mix of things handled by different people: a designer who has moved on, an SEO agency sending reports nobody reads, ads run by someone else, and nobody watching security at all. Each part is someone’s job, so the whole is nobody’s.</p>
        <p>So we do the whole thing. We design and build the website, get it found, run the ads, and keep it secure and online, with one small team that can see how every part affects the rest.</p>
        <p>We’re deliberately small. You deal with the people designing and building your site, not an account manager, and we would rather do fewer projects properly than rush more.</p>
      </div>
    </div>
  </section>

  <section class="section s-fog" aria-labelledby="believe-title">
    <div class="wrap">
      <h2 class="h2" id="believe-title">What we care about</h2>
      <ul class="included">
        <li><h3>Results you can count</h3><p>Calls, form enquiries, bookings and quotes. If we can’t show a change in the numbers that matter to you, we’ll say so.</p></li>
        <li><h3>Speed</h3><p>A slow website loses people before it has said anything. Every site we build is designed to feel instant on a phone.</p></li>
        <li><h3>Plain English</h3><p>No jargon in our proposals, our reports or on your website. If it can’t be explained simply, it isn’t understood well enough.</p></li>
        <li><h3>Your independence</h3><p>Your domain, code, accounts and data belong to you. We want you to stay because it’s working, not because leaving is hard.</p></li>
        <li><h3>Security by default</h3><p>HTTPS, security headers, email protection and two-factor sign-in aren’t extras. They’re part of doing the job properly.</p></li>
        <li><h3>Real content</h3><p>Real photos, real projects and real reviews. Customers can tell the difference, and so can Google.</p></li>
      </ul>
    </div>
  </section>

  <section class="section s-white" aria-labelledby="where-title">
    <div class="wrap about-grid">
      <h2 class="h2" id="where-title">Where we work</h2>
      <div class="lead-block lead-block-tight">
        <p>We’re based in ${esc(site.base)} and most of our clients are along the South Coast, in and around ${esc(site.towns.slice(0, -1).join(', '))} and ${esc(site.towns.at(-1))}. We’re always happy to meet in person locally.</p>
        <p>We also work with businesses anywhere in the UK. Most projects run perfectly well over video calls, email and a shared preview link.</p>
      </div>
    </div>
  </section>

  ${ctaBand({ heading: 'Let’s see if we’re a good fit.' })}
  `;
  return {
    path: '/about',
    title: 'About Us | Hampshire Web Design Studio | Roffey-Roberts Web',
    description:
      'Roffey-Roberts Web is a small Hampshire web studio. We design and build websites, get them found and keep them secure, with one team doing the whole job.',
    og: 'about',
    ogTitle: 'A small studio, on purpose',
    schema: [
      breadcrumbs([['Home', '/'], ['About', '/about']]),
      { '@type': 'AboutPage', url: `${site.url}/about`, name: 'About Roffey-Roberts Web', about: { '@id': `${site.url}/#organization` } },
    ],
    body,
  };
}

function contact() {
  const serviceOptions = [...services.map((s) => [s.slug, s.name]), ['not-sure', 'Not sure yet']];
  const body = html`
  <section class="page-hero s-dark page-hero-tight" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb([['Home', '/'], ['Contact', '/contact']])}
      <h1 class="page-title" id="page-title">Start a project</h1>
      <div class="page-hero-foot">
        <p class="page-lede">Tell us a bit about your business and what you need. We reply to every enquiry within one working day, with straight advice and a clear next step.</p>
      </div>
    </div>
  </section>

  <section class="section s-white contact-section">
    <div class="wrap contact-grid">
      <div class="contact-main">
        <form class="enquiry" action="/api/contact" method="post" novalidate data-enquiry>
          <fieldset class="field-group">
            <legend>What do you need help with?</legend>
            <div class="chips">
              ${serviceOptions.map(
                ([value, label]) => html`<label class="chip"><input type="checkbox" name="services" value="${value}"><span>${esc(label)}</span></label>`
              )}
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
                <option>Under £1,000</option>
                <option>£1,000 to £3,000</option>
                <option>£3,000 to £7,500</option>
                <option>£7,500 or more</option>
                <option>Monthly service only</option>
                <option>Not sure yet</option>
              </select>
            </div>
            <div class="field">
              <label for="f-timeline">When would you like to start? <span class="opt">(optional)</span></label>
              <select id="f-timeline" name="timeline">
                <option value="">Choose one</option>
                <option>As soon as possible</option>
                <option>In the next 1 to 3 months</option>
                <option>Later this year</option>
                <option>Just exploring</option>
              </select>
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="f-name">Your name</label>
              <input id="f-name" name="name" type="text" autocomplete="name" required maxlength="120">
            </div>
            <div class="field">
              <label for="f-business">Business name <span class="opt">(optional)</span></label>
              <input id="f-business" name="business" type="text" autocomplete="organization" maxlength="160">
            </div>
          </div>

          <div class="field-row">
            <div class="field">
              <label for="f-email">Email</label>
              <input id="f-email" name="email" type="email" autocomplete="email" required maxlength="200">
            </div>
            <div class="field">
              <label for="f-phone">Phone <span class="opt">(optional)</span></label>
              <input id="f-phone" name="phone" type="tel" autocomplete="tel" maxlength="40">
            </div>
          </div>

          <div class="field">
            <label for="f-website">Current website <span class="opt">(optional)</span></label>
            <input id="f-website" name="website" type="text" inputmode="url" placeholder="yourbusiness.co.uk" maxlength="300">
          </div>

          <div class="hp" aria-hidden="true">
            <label for="f-company-url">Leave this empty</label>
            <input id="f-company-url" name="company_url" type="text" tabindex="-1" autocomplete="off">
          </div>
          <input type="hidden" name="attribution" value="" data-attribution>

          <div class="form-foot">
            <button class="btn btn-amber" type="submit" data-submit>Send enquiry</button>
            <p class="small">We’ll only use your details to reply to this enquiry. See our <a href="/privacy">privacy notice</a>.</p>
          </div>
          <div class="form-status" role="status" aria-live="polite" data-status></div>
        </form>
        <div class="enquiry-done" data-done hidden tabindex="-1">
          <h2 class="h2">Enquiry sent</h2>
          <p data-done-text>Thanks. Your enquiry is with us and we’ll reply within one working day.</p>
          <p><a class="link-strong" href="/work">Have a look at our work while you wait</a></p>
        </div>
      </div>
      <aside class="contact-aside" aria-labelledby="next-steps-title">
        <h2 class="h3" id="next-steps-title">What happens next</h2>
        <ol class="mini-steps">
          <li>We read your enquiry and reply within one working day.</li>
          <li>If it’s a good fit, we book a free 30-minute call at a time that suits you.</li>
          <li>You get a short written plan with a fixed price. No obligation.</li>
        </ol>
        ${site.email || site.phone
          ? html`<div class="contact-direct">
              <h2 class="h3">Rather talk directly?</h2>
              ${site.phone && html`<p><a class="link-strong" href="tel:${esc(site.phoneHref || site.phone)}">${esc(site.phone)}</a></p>`}
              ${site.email && html`<p><a class="link-strong" href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>`}
            </div>`
          : ''}
      </aside>
    </div>
  </section>
  `;
  return {
    path: '/contact',
    title: 'Contact Us: Start a Project | Roffey-Roberts Web',
    description:
      'Tell us about your website, SEO, ads, security or hosting project. We reply to every enquiry within one working day with straight advice.',
    og: 'contact',
    ogTitle: 'Start a project',
    schema: [
      breadcrumbs([['Home', '/'], ['Contact', '/contact']]),
      { '@type': 'ContactPage', url: `${site.url}/contact`, name: 'Contact Roffey-Roberts Web', about: { '@id': `${site.url}/#organization` } },
    ],
    bodyClass: 'is-contact',
    body,
  };
}

function privacy() {
  const updated = '11 October 2026';
  const contactLine = site.email
    ? html`email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>`
    : html`use our <a href="/contact">contact form</a>`;
  const body = html`
  <section class="page-hero s-dark page-hero-tight" aria-labelledby="page-title">
    <div class="wrap">
      ${breadcrumb([['Home', '/'], ['Privacy', '/privacy']])}
      <h1 class="page-title" id="page-title">Privacy notice</h1>
      <div class="page-hero-foot"><p class="page-lede">How we collect, use and look after your information. Last updated ${updated}.</p></div>
    </div>
  </section>
  <section class="section s-white">
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
    og: 'home',
    schema: [breadcrumbs([['Home', '/'], ['Privacy', '/privacy']])],
    body,
  };
}

function notFound() {
  const body = html`
  <section class="page-hero s-dark notfound" aria-labelledby="page-title">
    <div class="wrap">
      <h1 class="page-title" id="page-title">This page isn’t here.</h1>
      <div class="page-hero-foot">
        <p class="page-lede">The link may be old, or the address may have a typo. Try one of these instead.</p>
        <ul class="notfound-links">
          <li><a class="link-light" href="/">Home</a></li>
          <li><a class="link-light" href="/services">Services</a></li>
          <li><a class="link-light" href="/work">Work</a></li>
          <li><a class="link-light" href="/contact">Start a project</a></li>
        </ul>
      </div>
    </div>
  </section>`;
  return {
    path: '/404',
    title: 'Page not found | Roffey-Roberts Web',
    description: 'The page you were looking for could not be found.',
    og: 'home',
    noindex: true,
    sitemap: false,
    body,
  };
}

export function pages() {
  return [about(), contact(), privacy(), notFound()];
}
