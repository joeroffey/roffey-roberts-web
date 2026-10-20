/* Roffey-Roberts Web — behaviours. No dependencies. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} },
  };
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  /* ---------- Header, scroll progress ---------- */
  var progress = $('[data-progress]');
  var onScroll = function () {
    var y = window.scrollY;
    root.classList.toggle('is-scrolled', y > 24);
    if (progress) {
      var max = doc.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
    }
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  var toggle = $('[data-menu-toggle]'), menu = $('[data-mobile-menu]');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      root.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    window.matchMedia('(min-width: 1024px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal], [data-reveal-children], [data-timeline], [data-ring]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
        $$('[data-count]', en.target).forEach(countUp);
        if (en.target.hasAttribute('data-count')) countUp(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { io.observe(el); });
    // The HTML carries the real number (for crawlers and no-JS readers); reset to 0 only now, just before animating.
    $$('[data-count]').forEach(function (el) { el.textContent = '0'; if (!el.closest('[data-reveal], [data-reveal-children]')) io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.getAttribute('data-count')), start = null, dur = reduceMotion ? 0 : 1400;
    if (!dur) { el.textContent = target; return; }
    var step = function (ts) {
      if (!start) start = ts;
      var t = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * e);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------- Spotlight cards ---------- */
  if (finePointer) {
    doc.addEventListener('pointermove', function (e) {
      var card = e.target.closest && e.target.closest('[data-spot]');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ---------- Magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    $$('[data-magnet]').forEach(function (btn) {
      btn.addEventListener('pointermove', function (e) {
        var r = btn.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * 0.18, y = (e.clientY - r.top - r.height / 2) * 0.3;
        btn.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      btn.addEventListener('pointerleave', function () { btn.style.transform = ''; });
    });
  }

  /* ---------- Custom cursor ---------- */
  var dot = $('[data-cursor-dot]'), ring = $('[data-cursor-ring]');
  if (dot && ring && finePointer && !reduceMotion) {
    root.classList.add('has-cursor');
    var mx = -100, my = -100, rx = -100, ry = -100, raf;
    var label = ring.querySelector('span');
    var tick = function () {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
      ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px) translate(-50%,-50%)';
      raf = requestAnimationFrame(tick);
    };
    doc.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!raf) tick();
      var view = e.target.closest && e.target.closest('[data-cursor]');
      var link = e.target.closest && e.target.closest('a, button, label, input, select, textarea, summary');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !view && !!link);
      if (view) label.textContent = view.getAttribute('data-cursor') || 'View';
    }, { passive: true });
    doc.addEventListener('pointerleave', function () { dot.classList.add('is-hidden'); ring.classList.add('is-hidden'); });
    doc.addEventListener('pointerenter', function () { dot.classList.remove('is-hidden'); ring.classList.remove('is-hidden'); });
  }

  /* ---------- Hero scene parallax & live cards ---------- */
  var scene = $('[data-scene]');
  if (scene) {
    if (finePointer && !reduceMotion) {
      var hero = scene.closest('.hero') || scene;
      hero.addEventListener('pointermove', function (e) {
        var r = hero.getBoundingClientRect();
        scene.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5).toFixed(3));
        scene.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5).toFixed(3));
      }, { passive: true });
      hero.addEventListener('pointerleave', function () { scene.style.setProperty('--px', 0); scene.style.setProperty('--py', 0); });
    }
    var ringEl = $('[data-ring]', scene);
    if (ringEl) ringEl.style.setProperty('--off', 100 - 99);
    var lead = $('[data-lead]', scene);
    if (lead && !reduceMotion) {
      var leads = [
        ['SM', 'New enquiry: Sam, Winchester', 'Boiler replacement · via Google Ads · just now'],
        ['AP', 'New enquiry: Amira, Southampton', 'Annual service · via Google search · 2 min ago'],
        ['JT', 'New enquiry: Jo, Lymington', 'Bathroom refit quote · via Meta ad · 5 min ago'],
        ['DK', 'Callback request: Dan, Portsmouth', 'Emergency leak · tapped “Call now” · 9 min ago'],
      ];
      var li = 0;
      setInterval(function () {
        li = (li + 1) % leads.length;
        lead.classList.remove('is-swap'); void lead.offsetWidth;
        $('[data-lead-initials]', lead).textContent = leads[li][0];
        $('[data-lead-title]', lead).textContent = leads[li][1];
        $('[data-lead-text]', lead).textContent = leads[li][2];
        lead.classList.add('is-swap');
      }, 6500);
    }
  }

  /* ---------- Accordion ---------- */
  $$('[data-accordion]').forEach(function (acc) {
    acc.addEventListener('click', function (e) {
      var btn = e.target.closest('.faq-q');
      if (!btn) return;
      var item = btn.closest('.faq-item'), open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* ---------- Work filters ---------- */
  var filters = $('[data-filters]'), grid = $('[data-work-grid]');
  if (filters && grid) {
    filters.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;
      $$('[data-filter]', filters).forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
      var f = btn.getAttribute('data-filter');
      $$('[data-scope]', grid).forEach(function (card) {
        card.classList.toggle('is-hidden', f !== 'all' && card.getAttribute('data-scope').split(' ').indexOf(f) === -1);
      });
    });
  }

  /* ---------- First-touch attribution (sent only with an enquiry) ---------- */
  (function () {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
    var found = {};
    keys.forEach(function (k) { var v = params.get(k); if (v) found[k] = v.slice(0, 200); });
    if (!store.get('rrw_attr') || Object.keys(found).length) {
      var ref = doc.referrer && doc.referrer.indexOf(window.location.origin) !== 0 ? doc.referrer : '';
      store.set('rrw_attr', JSON.stringify({ landing: window.location.pathname, referrer: ref.slice(0, 300), at: new Date().toISOString(), params: found }));
    }
  })();

  /* ---------- Search listing preview ---------- */
  var preview = $('[data-preview]');
  if (preview) {
    var out = { title: $('[data-serp-title]'), desc: $('[data-serp-desc]'), name: $('[data-serp-name]'), url: $('[data-serp-url]'), initial: $('[data-serp-initial]'), cta: $('[data-preview-cta]') };
    var checks = { title: $('[data-check="title"]'), area: $('[data-check="area"]'), desc: $('[data-check="desc"]') };
    var canvas = doc.createElement('canvas'), ctx = canvas.getContext && canvas.getContext('2d');
    var measure = function (text) { if (!ctx) return text.length * 9.5; ctx.font = '20px Arial'; return ctx.measureText(text).width; };
    var clean = function (s) { return (s || '').replace(/\s+/g, ' ').trim(); };
    var cap = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
    var slugify = function (s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '') || 'yourbusiness'; };
    var setCheck = function (el, ok, text) { if (!el) return; el.classList.toggle('ok', ok); el.classList.toggle('warn', !ok); el.querySelector('span').textContent = text; };
    var TITLE_MAX = 580;
    var F = function (n) { return preview.elements.namedItem(n); };
    var render = function () {
      var business = clean(F('business').value) || 'Your Business';
      var service = clean(F('service').value) || 'What you do';
      var area = clean(F('area').value);
      var title = cap(service) + (area ? ' in ' + area : '') + ' | ' + business;
      var desc = cap(service) + (area ? ' in ' + area : '') + ' from ' + business + '. Fast response, fair prices and friendly local service. Call today or get a free quote online.';
      var width = measure(title), shown = title;
      if (width > TITLE_MAX) {
        while (shown.length > 1 && measure(shown + ' ...') > TITLE_MAX) shown = shown.slice(0, -1);
        shown = shown.replace(/\s+\S*$/, '') + ' ...';
      }
      out.title.textContent = shown;
      out.desc.textContent = desc.length > 158 ? desc.slice(0, 155).replace(/\s+\S*$/, '') + ' ...' : desc;
      out.name.textContent = business;
      out.url.textContent = slugify(business) + '.co.uk';
      out.initial.textContent = business.charAt(0).toUpperCase();
      setCheck(checks.title, width <= TITLE_MAX, width <= TITLE_MAX ? 'The title fits without being cut off.' : 'Google would cut this title short. Try a shorter service or business name.');
      setCheck(checks.area, !!area, area ? 'Your town is in the title, where local searchers look for it.' : 'Add a town or area. Local searches almost always include one.');
      setCheck(checks.desc, desc.length <= 158, desc.length <= 158 ? 'The description ends with a clear next step.' : 'The description runs long, so the call to action gets cut off.');
      if (out.cta) out.cta.setAttribute('href', '/contact?' + new URLSearchParams({ service: 'seo', business: clean(F('business').value), area: area, listing: title }).toString());
    };
    preview.addEventListener('input', render);
    preview.addEventListener('submit', function (e) { e.preventDefault(); });
    render();
  }

  /* ---------- Consent + tracking (only when IDs are configured) ----------
     The Google tag itself is in <head> (see layout.mjs) with Consent Mode
     defaulting to "denied", so it runs cookieless until the visitor accepts.
     This block handles the banner, consent updates and the Meta pixel. */
  var trackingEl = doc.getElementById('rrw-tracking'), tracking = null, pixelLoaded = false;
  if (trackingEl) { try { tracking = JSON.parse(trackingEl.textContent); } catch (e) { tracking = null; } }
  var consentState = function (v) { return { ad_storage: v, analytics_storage: v, ad_user_data: v, ad_personalization: v }; };
  if (tracking) {
    var applyConsent = function (granted) {
      if (window.gtag) window.gtag('consent', 'update', consentState(granted ? 'granted' : 'denied'));
      if (granted && tracking.metaPixel && !pixelLoaded) {
        pixelLoaded = true;
        (function (f, b, e, v, n, t, s) {
          if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
          t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        })(window, doc, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', tracking.metaPixel);
        window.fbq('track', 'PageView');
      }
    };
    var banner = $('[data-consent]'), choice = store.get('rrw_consent');
    if (choice === 'granted') applyConsent(true);
    else if (!choice && banner) banner.hidden = false;
    doc.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent-choice]');
      if (btn) {
        var value = btn.getAttribute('data-consent-choice');
        store.set('rrw_consent', value);
        if (banner) banner.hidden = true;
        if (value === 'granted') applyConsent(true);
        else if (pixelLoaded) window.location.reload();
        else applyConsent(false);
      }
      if (e.target.closest('[data-consent-open]') && banner) { banner.hidden = false; banner.querySelector('button').focus(); }
    });
  }
  var trackLead = function () {
    if (!tracking) return;
    if (window.gtag) {
      window.gtag('event', 'generate_lead', { method: 'enquiry_form' });
      if (tracking.googleAds && tracking.googleAdsLeadLabel) window.gtag('event', 'conversion', { send_to: tracking.googleAds + '/' + tracking.googleAdsLeadLabel });
    }
    if (window.fbq) window.fbq('track', 'Lead');
  };

  /* ---------- Enquiry form ---------- */
  var form = $('[data-enquiry]');
  if (form) {
    var F2 = function (n) { return form.elements.namedItem(n); };
    var params = new URLSearchParams(window.location.search);
    var pre = params.get('service');
    if (pre) { var box = form.querySelector('input[name="services"][value="' + pre.replace(/[^a-z-]/g, '') + '"]'); if (box) box.checked = true; }
    if (params.get('review')) {
      var wd = form.querySelector('input[name="services"][value="website-design"]'); if (wd) wd.checked = true;
      if (!F2('message').value) F2('message').value = 'I’d like a free review of my website.\n\n';
      setTimeout(function () { F2('website').focus(); }, 300);
    }
    if (params.get('website')) F2('website').value = params.get('website').slice(0, 300);
    if (params.get('business')) F2('business').value = params.get('business').slice(0, 160);
    if (params.get('listing') || params.get('area') || params.get('topic')) {
      var lines = [];
      if (params.get('topic')) lines.push('Interested in: ' + params.get('topic').slice(0, 80));
      if (params.get('area')) lines.push('Area: ' + params.get('area').slice(0, 60));
      if (params.get('listing')) lines.push('Search listing I drafted on your site: ' + params.get('listing').slice(0, 200));
      F2('message').value = lines.join('\n') + '\n\n';
    }
    var statusEl = $('[data-status]', form), submitBtn = $('[data-submit]', form), done = $('[data-done]');
    var showError = function (field, message) {
      field.setAttribute('aria-invalid', 'true');
      var id = field.id + '-error', err = doc.getElementById(id);
      if (!err) { err = doc.createElement('p'); err.className = 'field-error'; err.id = id; field.insertAdjacentElement('afterend', err); }
      err.textContent = message;
      var d = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (d.indexOf(id) === -1) d.push(id);
      field.setAttribute('aria-describedby', d.join(' '));
    };
    var clearError = function (field) {
      field.removeAttribute('aria-invalid');
      var err = doc.getElementById(field.id + '-error'); if (err) err.remove();
      var d = (field.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== field.id + '-error'; });
      if (d.length) field.setAttribute('aria-describedby', d.join(' ')); else field.removeAttribute('aria-describedby');
    };
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) clearError(e.target); });
    var validate = function () {
      var first = null;
      var check = function (field, ok, message) { if (ok) { clearError(field); return; } showError(field, message); if (!first) first = field; };
      check(F2('message'), F2('message').value.trim().length >= 10, 'Tell us a little about the project, even a sentence helps.');
      check(F2('name'), F2('name').value.trim().length > 0, 'Enter your name.');
      check(F2('email'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(F2('email').value.trim()), 'Enter an email address like name@example.co.uk.');
      return first;
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = ''; statusEl.classList.remove('is-error');
      var firstInvalid = validate();
      if (firstInvalid) { firstInvalid.focus(); return; }
      var data = {
        services: $$('input[name="services"]:checked', form).map(function (c) { return c.value; }),
        message: F2('message').value.trim(), budget: F2('budget').value, timeline: F2('timeline').value,
        name: F2('name').value.trim(), business: F2('business').value.trim(), email: F2('email').value.trim(),
        phone: F2('phone').value.trim(), website: F2('website').value.trim(), company_url: F2('company_url').value,
        page: window.location.pathname,
        attribution: (function () { try { return JSON.parse(store.get('rrw_attr') || 'null'); } catch (err) { return null; } })(),
      };
      submitBtn.disabled = true; submitBtn.firstChild.textContent = 'Sending…';
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.body && r.body.error ? r.body.error : 'send_failed');
          $('[data-done-text]', done).textContent = 'Thanks, ' + data.name.split(' ')[0] + '. Your enquiry is with us and we’ll reply to ' + data.email + ' within one working day.';
          form.hidden = true; done.hidden = false; done.focus();
          trackLead();
        })
        .catch(function (err) {
          statusEl.classList.add('is-error');
          statusEl.textContent = err && err.message && err.message !== 'send_failed' && err.message.length < 200 ? err.message : 'Your enquiry didn’t send. Check your connection and try again in a moment.';
          submitBtn.disabled = false; submitBtn.firstChild.textContent = 'Send enquiry';
        });
    });
  }
})();
