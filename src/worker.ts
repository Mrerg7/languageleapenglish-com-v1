interface Env {
  ASSETS: Fetcher;
}

const APEX_HOST = 'languageleapenglish.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.hostname === `www.${APEX_HOST}`) {
      url.hostname = APEX_HOST;
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    if (url.protocol === 'http:' && url.hostname === APEX_HOST) {
      url.protocol = 'https:';
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
