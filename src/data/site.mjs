// Central site settings. Change contact details and tracking IDs here.
export const site = {
  name: 'Roffey-Roberts Web',
  shortName: 'Roffey-Roberts',
  url: 'https://www.roffey-robertsweb.co.uk',
  locale: 'en_GB',
  tagline: 'Websites, SEO, ads, cyber security, IT support and hosting for small businesses across Hampshire and the UK.',
  base: 'Hampshire',
  areaServed: ['Hampshire', 'Dorset', 'West Sussex', 'Wiltshire', 'United Kingdom'],
  towns: ['Southampton', 'Portsmouth', 'Winchester', 'Bournemouth', 'Lymington', 'Ringwood'],

  // Contact details. Leave a value empty to hide it everywhere on the site.
  email: 'info@roffey-robertsweb.co.uk',
  phone: '07741 618140',
  phoneHref: '+447741618140',

  // Who runs the studio. Shown on the About page and in structured data.
  founder: {
    name: 'Joe Roffey',
    role: 'Founder',
    initials: 'JR',
    linkedin: '', // e.g. https://www.linkedin.com/in/...
    photo: '', // e.g. '/img/joe.jpg' (put the file in static/img/; square, at least 600px)
    credentials: [], // e.g. ['Cyber Essentials certified', 'Google Ads Search certification']
    bio: [], // extra paragraphs for the About page: experience, background
  },
  // Service-area business: no street address published. Set the base town and, optionally, its coordinates.
  address: { locality: '', region: 'Hampshire', country: 'GB', geo: null /* e.g. { lat: 50.75, lon: -1.54 } */ },
  priceRange: '££',

  // Profiles for the organisation, used in the footer and in structured data (sameAs):
  // Google Business Profile, LinkedIn company page, Facebook, Instagram, Companies House.
  sameAs: [
    'https://www.google.com/maps/place/?q=place_id:ChIJ2QP5F79oimUR0mWsspSLz9I', // Google Business Profile (Maps)
    'https://share.google/eN9iDHEnqVRrYMX8C', // Google Business Profile (share link)
  ],
  // Google Business Profile "write a review" link. When set, a "Review us on Google" link appears in the footer and on About.
  reviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJ2QP5F79oimUR0mWsspSLz9I', // opens the Google review box directly

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
