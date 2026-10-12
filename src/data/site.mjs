// Central site settings. Change contact details and tracking IDs here.
export const site = {
  name: 'Roffey-Roberts Web',
  shortName: 'Roffey-Roberts',
  url: 'https://www.roffey-robertsweb.co.uk',
  locale: 'en_GB',
  tagline: 'Websites, SEO, ads, security and hosting for businesses that need their website to bring in work.',
  base: 'Hampshire',
  areaServed: ['Hampshire', 'Dorset', 'West Sussex', 'Wiltshire', 'United Kingdom'],
  towns: ['Southampton', 'Portsmouth', 'Winchester', 'Bournemouth', 'Lymington', 'Ringwood'],

  // Contact details. Leave a value empty to hide it everywhere on the site.
  email: 'info@roffey-robertsweb.co.uk',
  phone: '07741 618140',
  phoneHref: '+447741618140',

  // Who runs the studio. Shown on the About page and in structured data.
  founder: { name: 'Joe Roffey', role: 'Founder', initials: 'JR', linkedin: '' },
  // Service-area business: region and country only, no street address published.
  address: { locality: '', region: 'Hampshire', country: 'GB' },
  priceRange: '££',

  // Social profiles, used in the footer and in structured data.
  sameAs: [],

  // Search Console "HTML tag" verification: paste the content value of the meta tag Google gives you.
  verification: { google: '' },

  // Tracking IDs. Leave empty and no tracking code or cookie banner is added.
  // When any ID is set, a consent banner appears and nothing loads until a visitor accepts.
  tracking: {
    ga4: 'G-39ZYSMS4PT',
    googleAds: '', // e.g. AW-XXXXXXXXX
    googleAdsLeadLabel: '', // conversion label for form submissions, e.g. AbCdEfGh123
    metaPixel: '', // e.g. 123456789012345
  },
};

export const nav = [
  { label: 'Services', href: '/services' },
  { label: 'Work', href: '/work' },
  { label: 'Areas', href: '/web-design' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
