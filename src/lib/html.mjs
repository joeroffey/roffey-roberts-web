// Minimal HTML helpers. No dependencies.
const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

export const esc = (value = '') => String(value).replace(/[&<>"']/g, (c) => ESC[c]);

// Join arrays and drop false/null/undefined so templates can use conditionals inline.
export const html = (strings, ...values) =>
  strings.reduce((out, str, i) => {
    let v = values[i - 1];
    if (Array.isArray(v)) v = v.flat(Infinity).filter((x) => x !== false && x != null).join('');
    else if (v === false || v == null) v = '';
    return out + v + str;
  });

export const jsonLd = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`;

export const icon = {
  arrowUpRight:
    '<svg class="i" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="square"/></svg>',
  lock: '<svg class="i" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><rect x="3.5" y="7" width="9" height="6.5" rx="1" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 7V5.2a2.5 2.5 0 0 1 5 0V7" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
  plus: '<svg class="i" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 3v10M3 8h10" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>',
  check:
    '<svg class="i" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="m3.5 8.5 3 3 6-7" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
  menu: '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 8h18M3 16h18" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
  close:
    '<svg class="i" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
};
