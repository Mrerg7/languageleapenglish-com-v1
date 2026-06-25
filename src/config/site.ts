export const SITE = {
  name: 'languageleapenglish.com',
  title: 'languageleapenglish.com | Premium Domain For Sale — English Language Mastery Brand',
  description:
    'Own languageleapenglish.com — the premium brand for English language mastery. 1.5B+ speakers, $45B+ market. High-acquisition domain perfect for business English, language platforms, corporate training & global education. Priced at $19,500.',
  url: 'https://languageleapenglish.com',
  email: 'sales@desertrich.com',
  locale: 'en_US',
  location: 'Arizona',
  googleSiteVerification: 'l9ss_Z9bsyW8fPTtmawyDfFucZw5GvZ-D4trzk_EUdE',
} as const;

export const CF_IMAGES = {
  accountHash: '-sPAUAWeA405NiWJ0SNIQA',
  heroImageId: '038061e9-3ae6-41aa-ec3d-0fb62560d300',
} as const;

export function cfImageUrl(imageId: string, variant = 'public'): string {
  return `https://imagedelivery.net/${CF_IMAGES.accountHash}/${imageId}/${variant}`;
}

export const OG_IMAGE = cfImageUrl(CF_IMAGES.heroImageId);

export const ACQUISITION_MAILTO = `mailto:${SITE.email}?subject=${encodeURIComponent('languageleapenglish.com Domain Acquisition Inquiry')}&body=${encodeURIComponent('Hello,\n\nI am interested in acquiring languageleapenglish.com.\n\nIntended use:\nBudget range:\n\nThank you.')}`;
