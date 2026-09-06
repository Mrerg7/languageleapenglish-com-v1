/**
 * Canonical host + path enforcement for Search Console.
 *
 * www/http variants and Cloudflare's 307 for /index.html create redirect
 * chains that GSC reports as "Page with redirect". Collapse every alias into
 * one 301 to https://languageleapenglish.com/….
 */
const CANONICAL_HOST = 'languageleapenglish.com';

interface Env {
  ASSETS: Fetcher;
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const dest = canonicalUrl(url);

    if (mustRedirect(url, dest)) {
      return Response.redirect(dest.toString(), 301);
    }

    // Serve /sitemap.xml at 200 (no redirect) — common crawler target.
    if (url.pathname === '/sitemap.xml') {
      return env.ASSETS.fetch(new URL('/sitemap-index.xml', url.origin));
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
