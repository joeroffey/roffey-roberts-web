/* Roffey-Roberts Web: small, dependency-free behaviours. */
(function () {
  'use strict';

  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} },
  };

  /* ---------- Header ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.hidden = !open;
      document.documentElement.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') { setMenu(false); toggle.focus(); }
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    window.matchMedia('(min-width: 1000px)').addEventListener('change', function (e) { if (e.matches) setMenu(false); });
  }

  /* ---------- First-touch attribution (sent only with an enquiry) ---------- */
  (function captureAttribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid'];
    var found = {};
    keys.forEach(function (k) { var v = params.get(k); if (v) found[k] = v.slice(0, 200); });
    var existing = store.get('rrw_attr');
    if (!existing || Object.keys(found).length) {
      var ref = document.referrer && document.referrer.indexOf(window.location.origin) !== 0 ? document.referrer : '';
      store.set('rrw_attr', JSON.stringify({
        landing: window.location.pathname,
        referrer: ref.slice(0, 300),
        at: new Date().toISOString(),
        params: found,
      }));
    }
  })();

  /* ---------- Search listing preview ---------- */
  var preview = document.querySelector('[data-preview]');
  if (preview) {
    var out = {
      title: document.querySelector('[data-serp-title]'),
      desc: document.querySelector('[data-serp-desc]'),
      name: document.querySelector('[data-serp-name]'),
      url: document.querySelector('[data-serp-url]'),
      initial: document.querySelector('[data-serp-initial]'),
      cta: document.querySelector('[data-preview-cta]'),
    };
    var checks = {
      title: document.querySelector('[data-check="title"]'),
      area: document.querySelector('[data-check="area"]'),
      desc: document.querySelector('[data-check="desc"]'),
    };
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext && canvas.getContext('2d');
    var measure = function (text) {
      if (!ctx) return text.length * 9.5;
      ctx.font = '20px Arial';
      return ctx.measureText(text).width;
    };
    var clean = function (s) { return (s || '').replace(/\s+/g, ' ').trim(); };
    var cap = function (s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; };
    var slugify = function (s) { return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '') || 'yourbusiness'; };
    var setCheck = function (el, ok, text) {
      if (!el) return;
      el.classList.toggle('ok', ok);
      el.classList.toggle('warn', !ok);
      el.querySelector('span').textContent = text;
    };
    var TITLE_MAX = 580; // approximate pixel width Google shows before truncating

    var render = function () {
      var business = clean(preview.business.value) || 'Your Business';
      var service = clean(preview.service.value) || 'What you do';
      var area = clean(preview.area.value);
      var title = cap(service) + (area ? ' in ' + area : '') + ' | ' + business;
      var desc = cap(service) + (area ? ' in ' + area : '') + ' from ' + business +
        '. Fast response, fair prices and friendly local service. Call today or get a free quote online.';

      var width = measure(title);
      var shownTitle = title;
      if (width > TITLE_MAX) {
        while (shownTitle.length > 1 && measure(shownTitle + ' ...') > TITLE_MAX) shownTitle = shownTitle.slice(0, -1);
        shownTitle = shownTitle.replace(/\s+\S*$/, '') + ' ...';
      }
      out.title.textContent = shownTitle;
      out.desc.textContent = desc.length > 158 ? desc.slice(0, 155).replace(/\s+\S*$/, '') + ' ...' : desc;
      out.name.textContent = business;
      out.url.textContent = slugify(business) + '.co.uk';
      out.initial.textContent = business.charAt(0).toUpperCase();

      setCheck(checks.title, width <= TITLE_MAX, width <= TITLE_MAX
        ? 'The title fits without being cut off.'
        : 'Google would cut this title short. Try a shorter service or business name.');
      setCheck(checks.area, !!area, area
        ? 'Your town is in the title, where local searchers look for it.'
        : 'Add a town or area. Local searches almost always include one.');
      setCheck(checks.desc, desc.length <= 158, desc.length <= 158
        ? 'The description ends with a clear next step.'
        : 'The description runs long, so the call to action gets cut off.');

      if (out.cta) {
        var q = new URLSearchParams({ service: 'seo', business: clean(preview.business.value), area: area, listing: title });
        out.cta.setAttribute('href', '/contact?' + q.toString());
      }
    };
    preview.addEventListener('input', render);
    preview.addEventListener('submit', function (e) { e.preventDefault(); });
    render();
  }

  /* ---------- Tracking (only present when IDs are configured) ---------- */
  var trackingEl = document.getElementById('rrw-tracking');
  var tracking = null;
  if (trackingEl) {
    try { tracking = JSON.parse(trackingEl.textContent); } catch (e) { tracking = null; }
  }
  var loadScript = function (src) { var s = document.createElement('script'); s.async = true; s.src = src; document.head.appendChild(s); };
  var trackingLoaded = false;

  if (tracking) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', wait_for_update: 500 });

    var startTracking = function () {
      if (trackingLoaded) return;
      trackingLoaded = true;
      window.gtag('consent', 'update', { ad_storage: 'granted', analytics_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
      var gid = tracking.ga4 || tracking.googleAds;
      if (gid) {
        loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gid));
        window.gtag('js', new Date());
        if (tracking.ga4) window.gtag('config', tracking.ga4);
        if (tracking.googleAds) window.gtag('config', tracking.googleAds);
      }
      if (tracking.metaPixel) {
        /* Meta pixel base code */
        (function (f, b, e, v, n, t, s) {
          if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); };
          if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = [];
          t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', tracking.metaPixel);
        window.fbq('track', 'PageView');
      }
    };

    var banner = document.querySelector('[data-consent]');
    var choice = store.get('rrw_consent');
    if (choice === 'granted') startTracking();
    else if (!choice && banner) banner.hidden = false;

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent-choice]');
      if (btn) {
        var value = btn.getAttribute('data-consent-choice');
        store.set('rrw_consent', value);
        if (banner) banner.hidden = true;
        if (value === 'granted') startTracking();
        else if (trackingLoaded) window.location.reload();
      }
      if (e.target.closest('[data-consent-open]') && banner) { banner.hidden = false; banner.querySelector('button').focus(); }
    });
  }

  var trackLead = function () {
    if (!tracking || !trackingLoaded) return;
    if (window.gtag) {
      window.gtag('event', 'generate_lead', { method: 'enquiry_form' });
      if (tracking.googleAds && tracking.googleAdsLeadLabel) window.gtag('event', 'conversion', { send_to: tracking.googleAds + '/' + tracking.googleAdsLeadLabel });
    }
    if (window.fbq) window.fbq('track', 'Lead');
  };

  /* ---------- Enquiry form ---------- */
  var form = document.querySelector('[data-enquiry]');
  if (form) {
    var F = function (n) { return form.elements.namedItem(n); };
    var params = new URLSearchParams(window.location.search);
    var pre = params.get('service');
    if (pre) {
      var box = form.querySelector('input[name="services"][value="' + pre.replace(/[^a-z-]/g, '') + '"]');
      if (box) box.checked = true;
    }
    if (params.get('business')) F('business').value = params.get('business').slice(0, 160);
    if (params.get('listing') || params.get('area')) {
      var lines = [];
      if (params.get('area')) lines.push('Area: ' + params.get('area').slice(0, 60));
      if (params.get('listing')) lines.push('Search listing I drafted on your site: ' + params.get('listing').slice(0, 200));
      F('message').value = lines.join('\n') + '\n\n';
    }

    var statusEl = form.querySelector('[data-status]');
    var submitBtn = form.querySelector('[data-submit]');
    var done = document.querySelector('[data-done]');

    var showError = function (field, message) {
      field.setAttribute('aria-invalid', 'true');
      var id = field.id + '-error';
      var err = document.getElementById(id);
      if (!err) {
        err = document.createElement('p');
        err.className = 'field-error';
        err.id = id;
        field.insertAdjacentElement('afterend', err);
      }
      err.textContent = message;
      var describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
      if (describedBy.indexOf(id) === -1) describedBy.push(id);
      field.setAttribute('aria-describedby', describedBy.join(' '));
    };
    var clearError = function (field) {
      field.removeAttribute('aria-invalid');
      var err = document.getElementById(field.id + '-error');
      if (err) err.remove();
      var describedBy = (field.getAttribute('aria-describedby') || '').split(' ').filter(function (x) { return x && x !== field.id + '-error'; });
      if (describedBy.length) field.setAttribute('aria-describedby', describedBy.join(' ')); else field.removeAttribute('aria-describedby');
    };
    form.addEventListener('input', function (e) { if (e.target.getAttribute('aria-invalid')) clearError(e.target); });

    var validate = function () {
      var first = null;
      var check = function (field, ok, message) {
        if (ok) { clearError(field); return; }
        showError(field, message);
        if (!first) first = field;
      };
      check(F('message'), F('message').value.trim().length >= 10, 'Tell us a little about the project, even a sentence helps.');
      check(F('name'), F('name').value.trim().length > 0, 'Enter your name.');
      check(F('email'), /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(F('email').value.trim()), 'Enter an email address like name@example.co.uk.');
      return first;
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      statusEl.textContent = '';
      statusEl.classList.remove('is-error');
      var firstInvalid = validate();
      if (firstInvalid) { firstInvalid.focus(); return; }

      var data = {
        services: Array.prototype.map.call(form.querySelectorAll('input[name="services"]:checked'), function (c) { return c.value; }),
        message: F('message').value.trim(),
        budget: F('budget').value,
        timeline: F('timeline').value,
        name: F('name').value.trim(),
        business: F('business').value.trim(),
        email: F('email').value.trim(),
        phone: F('phone').value.trim(),
        website: F('website').value.trim(),
        company_url: F('company_url').value,
        page: window.location.pathname,
        attribution: (function () { try { return JSON.parse(store.get('rrw_attr') || 'null'); } catch (err) { return null; } })(),
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';

      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (res) { return res.json().catch(function () { return {}; }).then(function (body) { return { ok: res.ok, body: body }; }); })
        .then(function (r) {
          if (!r.ok) throw new Error(r.body && r.body.error ? r.body.error : 'send_failed');
          var first = data.name.split(' ')[0];
          done.querySelector('[data-done-text]').textContent = 'Thanks, ' + first + '. Your enquiry is with us and we’ll reply to ' + data.email + ' within one working day.';
          form.hidden = true;
          done.hidden = false;
          done.focus();
          trackLead();
        })
        .catch(function (err) {
          statusEl.classList.add('is-error');
          statusEl.textContent = err && err.message && err.message !== 'send_failed' && err.message.length < 200
            ? err.message
            : 'Your enquiry didn’t send. Check your connection and try again in a moment.';
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send enquiry';
        });
    });
  }
})();
