# Changelog

All notable changes to languageleapenglish.com are documented here.

## [FEAT]: Update sale price to $49,999 — 2026-10-06

- Buy-it-now price raised from **$19,500** to **$49,999** across the whole site: `PRICE` constant (drives all CTAs, sticky bar, modals and the `Product`/`Offer` schema `price`), meta description, FAQ answer and all three `/insights/` posts.
- Single source of truth remains `src/config/site.ts` → `PRICE.formatted` / `PRICE.amount`; grep confirms zero remaining `$19,500` references.
- Deployed to Cloudflare Workers (version `61904fd8`) and verified live on all 6 pages — old price count 0, JSON-LD `"price":"49999"`.

## [FEAT]: Optimization improvements — 2026-10-06

Deployed to Cloudflare Workers (`languageleapenglish-com-v1`, version `dbc763aa`) on the free plan.

### I. Technical foundation

- **Third-party requests removed.** Font Awesome CDN (`cdnjs`, render-blocking, ~100 KB) replaced with an inline SVG `Icon` component (59 icons, zero extra requests). Google Fonts `@import` (fully render-blocking) replaced with self-hosted variable fonts.
- **Self-hosted fonts.** Inter + Space Grotesk served from `/fonts/*.woff2` (72 KB total, variable weight range), preloaded in `<head>` with `font-display: swap`.
- **Hero image optimised.** Cloudflare Images JPEG (109 KB) converted to WebP (52 KB) and self-hosted at `/hero.webp`, preloaded with `fetchpriority="high"`. `background-attachment: fixed` removed (scroll jank / repaint cost).
- **Caching.** `/_astro/*` → `max-age=31536000, immutable`; `/fonts/*` → 7 days + SWR; images → 1 day + SWR; HTML → `max-age=0, must-revalidate`.
- **Security headers** (worker, applied to every response): HSTS (`includeSubDomains; preload`), `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`, `Cross-Origin-Opener-Policy`, and a Content-Security-Policy allowing only first-party scripts/styles/images plus known analytics endpoints.
- **Structured data** (Schema.org `@graph`): `WebSite`, `WebPage`, `BreadcrumbList`, `Product` + `Offer` (price, currency, availability, price-valid-until, seller, shipping/return policy), `Organization`, `FAQPage`. Removed self-serving `AggregateRating`/`Review` (Google rich-result policy risk).
- **404 page** added (`not_found_handling = "404-page"`), returns a real 404 status with recovery links.
- **Sitemap / robots** verified: `robots.txt` → `Sitemap: https://languageleapenglish.com/sitemap.xml`, worker serves `/sitemap.xml` at 200, sitemap index now lists 5 URLs.

### II. SEO

- Title format per spec: `languageleapenglish.com | Premium Domain for Sale | LanguageLeap English`.
- Meta description rewritten to include price, availability, CTA and UVP; `meta keywords`, `theme-color`, `referrer`, `max-snippet`/`max-image-preview` robots directives added.
- Heading hierarchy fixed: single H1 (domain name), H2 per section, H3 for cards — no skipped levels (was H2 → H4/H5).
- Canonical, OG and Twitter tags retained; `og:type` now `article` on insights posts.
- Internal linking: nav, footer and in-article links to `/`, `/#stats`, `/#why`, `/#value`, `/#faq`, `/insights/` and each post.

### III. Conversion rate optimization

- **Above the fold:** domain H1, price, Buy Now + See the data + Make an offer (three price-tier CTAs).
- **Trust signals:** Escrow.com protection, 24-hour transfer, ICANN registrar push/auth code, SSL-secured inquiry, one-of-one scarcity — all stated factually.
- **Exit-intent popup** (`ExitIntent.astro`): pointer leaving the top of the viewport on desktop, upward scroll past 72 % depth on mobile, 60-second fallback; shown once per session (`sessionStorage`), never over an open dialog.
- **Sticky mobile buy bar** with price + Buy/Offer/Email, appears after 60 % of the hero, respects safe-area inset.
- **Tiered CTAs:** Buy Now (BIN), Make an Offer, Contact/Email the owner — on hero, pricing, closing, footer, FAQ and article pages.
- **FAQ section** (6 objections: availability, escrow process, instalments, trademarks, registrars, next steps) with `FAQPage` schema — doubles as SEO content and objection handling.
- **Forms:** offer form now composes a pre-filled email and shows a confirmation with a direct fallback link (previously the success state was fire-and-forget).
- **Analytics:** first-party conversion tracking (`src/lib/analytics.ts`) — `page_view`, `cta_click`, `modal_open`, `form_submit` pushed to `window.dataLayer` (GTM/GA4-compatible) and mirrored to `localStorage`.

### IV. Mobile-friendliness

- Collapsible navigation menu with hamburger toggle, `aria-expanded`/`aria-controls`, closes on link tap, Escape and resize.
- Tap targets raised to 48 px (`min-h-12`) across buttons, links, inputs and summary rows.
- Modals are viewport-fitting and scrollable at 360 px / 390 px widths; body scroll locked while open.
- Verified: no horizontal scrolling at 360 px and 390 px, 16 px base text, viewport meta present.

### V. Domain authority / content

- New content hub at `/insights/` plus three long-form posts (content collection with schema-validated frontmatter):
  1. *How to Value a Premium Domain Name (2026 Framework)*
  2. *Why English-Learning Domains Are a Strong Brand Investment*
  3. *How to Buy a Domain Name Safely with Escrow.com*
- Each post: breadcrumb nav, article JSON-LD, related-post links, featured-listing CTA back to the sale page.
- Ready for weekly publishing — drop a Markdown file in `src/content/blog/` and it appears on the index, sitemap and related blocks.

### VI. Design

- Scroll-reveal animations (IntersectionObserver, `.js`-gated so content is visible without JavaScript) with `prefers-reduced-motion` support.
- Focus-visible outlines, skip-to-content link, `::selection` styling, smooth anchor scrolling with scroll offset for the sticky header.
- Stat counters rewritten (data-driven `data-target`/`data-decimals`/`data-suffix`) — fixed a bug that rendered "20%%".

### VII. Pre-deployment validation

| Check | Result |
| --- | --- |
| `astro check` (TypeScript strict) | 0 errors, 0 warnings |
| W3C HTML5 validator (nu) on all 6 pages | 0 messages |
| Lighthouse (mobile, live production) | **Performance 100 / Accessibility 100 / Best Practices 100 / SEO 100** |
| Core Web Vitals (live) | FCP 1.0 s, LCP 1.7 s, CLS 0, TBT 0 ms |
| Playwright QA (desktop + 390 px + 360 px) | 24/25 checks pass (2 documented WCAG 2.5.8 exceptions: visually-hidden skip link measured unfocused, inline text link) |
| CTA / modal / form / menu interaction test | pass, no console or page errors |
| Internal link crawl | all 200 |
| Cross-browser runtime | Chromium verified (Firefox/WebKit binaries unavailable locally) |

### Deployment

1. Production snapshot saved (`backup/pre-optimization-2026-10-06` branch + live HTML copy).
2. Changes built and validated locally (`npm run check && npm run build`).
3. Deployed with `npm run deploy` (build + `wrangler deploy`) to Cloudflare Workers free plan.
4. Post-deploy verified: www → 301, `/index.html` → 301, `/sitemap.xml` 200, `/robots.txt` 200, `/insights/` 200, unknown paths → 404, Brotli on, security + cache headers present, live Lighthouse re-run 100/100/100/100.

### Outstanding (manual / out of scope)

- **Submit the updated sitemap** to Google Search Console (`https://languageleapenglish.com/sitemap.xml`) and request re-crawling of the homepage.
- **Backlink outreach** (DA 40+ tech/business publications, guest posts, digital PR) — relationship work, not code.
- **Search with filters / portfolio category pages** — not applicable to a single-domain listing; revisit if the site becomes a multi-domain marketplace.
- **Dark/light mode toggle** — evaluated and deferred: the design is intentionally dark-brand, and a partial theme would risk regressions with no conversion benefit. Revisit with a token-based palette if a light theme is required.
- **Provider analytics token** — first-party `dataLayer` tracking is live; add a Cloudflare Web Analytics or GA4 token to `BaseLayout` when available (CSP already permits both).
