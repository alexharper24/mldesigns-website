# ML Designs Construction & Woodworking — Website

Static multi-page site for [mldesignscw.com](https://mldesignscw.com). Built July 2026.
Live preview: https://alexharper24.github.io/mldesigns-website/

## Pages

- `index.html` — home
- `services.html` — five anchored service sections (#trim, #kitchens, #basements, #woodworking, #exterior)
- `work.html` — filterable project gallery (62 photos, 8 filters) with lightbox
- `about.html` — Matt's story and values
- `quote.html` — quote request form + contact info

## STILL TO DO before launch

| Item | Where | Status |
|---|---|---|
| Phone number | quote.html sidebar, all footers | "Coming soon" |
| Email address | quote.html sidebar, all footers | "Coming soon" |
| Formspree form ID | `quote.html` form action (`YOUR_FORM_ID`) | Create a form at formspree.io and paste the ID. Until then the JS shows a friendly fallback message, so the form never silently fails. First real submission triggers a Formspree confirmation email; free tier is 50 submissions/month. |
| Custom domain | GitHub Pages settings + DNS | Point `mldesignscw.com` at GitHub Pages (see Publishing below) |
| Basement photos | `services.html#basements`, home basement card | Both currently use `framing-basement-framing.jpg`. Two photos once labelled "basement" could not be verified as basements and were renamed (`interior-great-room-barn-door`, `interior-open-living-dining`). Swap a finished basement photo in once Matt confirms which projects were basements. |
| Before / after feature | not built | Six web-ready before photos sit unused in `img/work/before/`. Matt to confirm which befores pair with which afters. If built: badge on qualifying tiles plus a Before/After toggle inside the lightbox — not a drag slider, since the angles do not align. |

## Image folders

```
img/brand/          logo + icons actually used by the site
img/brand/archive/   every superseded logo and the original artwork from Matt (unused, kept on purpose)
img/photos/          hero-work.webp, matt-lapina.jpg
img/photos/source/   full-size original of Matt's portrait
img/texture/         wood-grain.jpg (CTA band background, tiled)
img/work/            the 64 project photos used across the site
img/work/before/     before photos, prepared but not yet wired in
```

Three local-only working folders are gitignored and never published:
`img/our work/`, `img/original work/` (raw camera originals, ~1.5 GB), `img/selected-for-cleanup/`.

## Brand

Palette: forest green `#213c26`, cream `#faf5e9`, wood brown `#6d3f1e`, ink `#22271f`.
Fonts: Bitter (display serif) + Inter (body) from Google Fonts. All colours are CSS
variables at the top of `style.css`, so the whole site recolours from one place.

**Logo.** The site uses Matt's existing merch mark (he has merchandise tied to it), recoloured
to the palette by replacing RGB and keeping the alpha channel, so the artwork itself is unchanged.

- Nav: `brand/logo-mark-green.png` at 54px
- Footer: `brand/logo-mark-cream.png` at 58px
- About page feature: `brand/logo-badge-web.png` (the older detailed badge)
- Favicons: `brand/favicon-16/32/48.png` — the cream mark knocked out of a green rounded tile
  with thickened strokes, because the bare line art disappears at 16px.
  `brand/apple-touch-icon.png` is full-bleed square since iOS applies its own mask.
  `brand/logo-tile-512.png` is the logo in structured data.
- Ten recolour variants (green / brown / ink / cream / two-tone, mark and lockup) are in
  `logo-variations/` at the repo root if a different treatment is ever wanted.

## Publishing

GitHub Pages, deployed from `main` branch root. `.nojekyll` is included. To use the real domain,
add a CNAME record pointing `mldesignscw.com` at `<username>.github.io`, then set the custom
domain in Pages settings. Then:

1. Google Search Console: verify the domain and submit `sitemap.xml`.
2. Create a Google Business Profile for "ML Designs Construction & Woodworking", St. John IN,
   set as a service-area business.
3. No street address is published anywhere — service area only, since the business is home-based.
