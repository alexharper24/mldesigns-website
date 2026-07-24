# ML Designs Construction & Woodworking — Website

Static multi-page site for [mldesignscw.com](https://mldesignscw.com). Built July 2026.

## Pages

- `index.html` — home
- `services.html` — five anchored service sections (#trim, #kitchens, #basements, #woodworking, #exterior)
- `work.html` — filterable project gallery with lightbox
- `about.html` — Matt's story and values
- `quote.html` — quote request form + contact info

## PLACEHOLDERS — must be replaced before launch

| Item | Where | Status |
|---|---|---|
| Project photos | all `img/ph-*.svg` files | Waiting on photos from Matt (by email). Replace each SVG with a real optimized JPG (~1200px wide, semantic name), update the `<img>` references. |
| Matt's portrait | `img/ph-matt.svg` (about page + home teaser) | Waiting on photo |
| Phone number | quote.html sidebar, all footers | "Coming soon" |
| Email address | quote.html sidebar, all footers | "Coming soon" |
| Instagram handle | quote.html sidebar | "Coming soon" |
| Formspree form ID | `quote.html` form action (`YOUR_FORM_ID`) | Create a form at formspree.io, paste the ID. The JS shows a friendly fallback message until then, so the form never silently fails. First real submission triggers a Formspree confirmation email; free tier is 50 submissions/month. |
| Hero direction | `hero-a.html` / `hero-b.html` / `hero-c.html` | Three homepage hero previews (noindex, with a bottom switcher bar). Once one is chosen, fold it into `index.html` and delete the three preview files. |

## Logo size tiers

The badge ring text is unreadable below ~100px, so the site uses a tiered system:
- **Large** (hero, about feature): full detailed badge `logo-badge-web.png` (truss, tools, veteran-owned star)
- **Meet the Builder / general lockup**: `logo-lockup-web.png` (seal + horizontal wordmark)
- **Nav, footer, favicons**: the brand **seal** `logo-seal-96.png` / `logo-seal-512.png` (ML monogram inside the "ML DESIGNS · CONSTRUCTION & WOODWORKING" ring). Business name also carried by live HTML text beside it.
- Favicons and `apple-touch-icon.png` are generated from the seal.
- Definitive source artwork (2026-07-24): `logo-badge.png` (color badge), `logo-seal.png` (seal), `logo-wordmark.png` (horizontal wordmark), `logo-badge-mono.png` (one-color badge). The earlier auto-cropped plain-ML `logo-monogram*.png` files remain in the repo but are no longer used.

## Brand

Palette sampled from the July 2026 logo package (`img/logo-badge.png` etc.):
forest green `#213c26`, cream `#fdf6e8` (page bg `#faf5e9`), wood brown `#6d3f1e`, ink `#22271f`.
Fonts: Bitter (display serif) + Inter (body), loaded from Google Fonts. All colors are CSS variables at the top of `style.css`.

`logo-*-t.png` are transparent-background versions; `logo-seal-96/512`, `favicon-*`, `apple-touch-icon` are derived crops of the seal.

## Publishing

GitHub Pages (repo → Settings → Pages → deploy from main branch root). `.nojekyll` is included. Point the `mldesignscw.com` domain via a CNAME record to `<username>.github.io` and add the custom domain in Pages settings (creates the CNAME file). Then:

1. Google Search Console: verify the domain, submit `sitemap.xml`.
2. Google Business Profile for "ML Designs Construction & Woodworking", St. John IN service area.
3. Home address is never published — service area only (address-privacy pattern).
