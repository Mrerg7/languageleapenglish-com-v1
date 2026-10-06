export const SITE = {
  name: 'languageleapenglish.com',
  brand: 'LanguageLeap English',
  title: 'languageleapenglish.com | Premium Domain for Sale | LanguageLeap English',
  description:
    'languageleapenglish.com is for sale at $19,500 USD — a premium exact-match .com for English language learning, business English and global education brands. Escrow-protected transfer in 24 hours. Enquire today.',
  keywords: [
    'buy .com domains',
    'domain marketplace',
    'languageleapenglish.com for sale',
    'premium domain names',
    'investment domains',
    'english learning domain for sale',
    'education domain names',
    'business english domain',
    'buy premium domain',
    'escrow domain transfer',
  ],
  url: 'https://languageleapenglish.com/',
  email: 'sales@desertrich.com',
  locale: 'en_US',
  location: 'Arizona',
  googleSiteVerification: 'l9ss_Z9bsyW8fPTtmawyDfFucZw5GvZ-D4trzk_EUdE',
} as const;

/** Buy-it-now price for the domain, formatted at call sites. */
export const PRICE = {
  amount: 19500,
  currency: 'USD',
  formatted: '$19,500',
} as const;

/** Build a canonical URL that always uses the apex HTTPS host and trailing slashes. */
export function canonicalUrl(pathname: string): string {
  const normalizedPath =
    pathname === '/' || pathname === '' || pathname === '/index/' || pathname === '/index.html'
      ? '/'
      : pathname.endsWith('/')
        ? pathname
        : `${pathname}/`;

  return new URL(normalizedPath, SITE.url).href;
}

export const CF_IMAGES = {
  accountHash: '-sPAUAWeA405NiWJ0SNIQA',
  heroImageId: '038061e9-3ae6-41aa-ec3d-0fb62560d300',
} as const;

export function cfImageUrl(imageId: string, variant = 'public'): string {
  return `https://imagedelivery.net/${CF_IMAGES.accountHash}/${imageId}/${variant}`;
}

export const OG_IMAGE = cfImageUrl(CF_IMAGES.heroImageId);

export const ACQUISITION_MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent('languageleapenglish.com Domain Acquisition Inquiry')}&body=${encodeURIComponent('Hello,\n\nI am interested in acquiring languageleapenglish.com.\n\nIntended use:\nBudget range:\n\nThank you.')}`;
