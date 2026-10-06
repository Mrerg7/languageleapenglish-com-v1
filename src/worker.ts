/**
 * Canonical host + path enforcement for Search Console, plus security headers
 * for every response served from static assets.
 *
 * www/http variants and Cloudflare's 307 for /index.html create redirect chains
 * that GSC reports as "Page with redirect". Collapse every alias into one 301
 * to https://languageleapenglish.com/….
 */
const CANONICAL_HOST = 'languageleapenglish.com';

const SECURITY_HEADERS: Record<string, string> = {
  'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'cross-origin-opener-policy': 'same-origin',
  'x-frame-options': 'SAMEORIGIN',
  'content-security-policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https://imagedelivery.net https://www.google-analytics.com",
    "font-src 'self' data:",
    "connect-src 'self' https://static.cloudflareinsights.com https://www.googletagmanager.com https://www.google-analytics.com",
    "form-action 'self'",
    'upgrade-insecure-requests',
  ].join('; '),
};

interface Env {
  ASSETS: { fetch(input: Request | URL | string): Promise<Response> };
}

function canonicalUrl(requestUrl: URL): URL {
  const url = new URL(requestUrl.href);
  url.protocol = 'https:';
  url.hostname = CANONICAL_HOST;
  url.port = '';

  const path = url.pathname;
  if (
    path === '/index.html' ||
    path === '/index.html/' ||
    path === '/index' ||
    path === '/index/'
  ) {
    url.pathname = '/';
  } else if (path.endsWith('/index.html')) {
    url.pathname = path.slice(0, -'index.html'.length) || '/';
  }

  return url;
}

function mustRedirect(from: URL, to: URL): boolean {
  return (
    from.protocol !== to.protocol ||
    from.hostname.toLowerCase() !== to.hostname ||
    from.pathname !== to.pathname
  );
}

function cacheControlFor(pathname: string, contentType: string): string | null {
  if (pathname.startsWith('/_astro/')) return 'public, max-age=31536000, immutable';
  if (pathname.startsWith('/fonts/')) return 'public, max-age=604800, stale-while-revalidate=86400';
  if (/\.(?:webp|svg|png|jpg|jpeg|ico|woff2)$/.test(pathname)) {
    return 'public, max-age=86400, stale-while-revalidate=604800';
  }
  if (contentType.includes('text/html')) return 'public, max-age=0, must-revalidate';
  return null;
}

function withSecurityHeaders(response: Response, pathname: string): Response {
  if (response.status === 204 || response.status === 304) return response;
  if (response.headers.get('content-security-policy')) return response;

  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(name, value);
  }

  const contentType = headers.get('content-type') || '';
  const cacheControl = cacheControlFor(pathname, contentType);
  if (cacheControl) headers.set('cache-control', cacheControl);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const dest = canonicalUrl(url);

    if (mustRedirect(url, dest)) {
      return Response.redirect(dest.toString(), 301);
    }

    // Serve /sitemap.xml at 200 (no redirect) — common crawler target.
    if (url.pathname === '/sitemap.xml') {
      const sitemap = await env.ASSETS.fetch(new URL('/sitemap-index.xml', url.origin));
      return withSecurityHeaders(sitemap, url.pathname);
    }

    const response = await env.ASSETS.fetch(request);
    return withSecurityHeaders(response, url.pathname);
  },
};
