# Schilly’s Take Out & Catering Kitchen website

A static, multi-page site for schillyscatering.com. Plain HTML, CSS and JavaScript, built by one script with no dependencies.

```bash
npm run build     # writes dist/ (production) and preview/ (for opening from GitHub)
npm run check     # builds, then runs both QA gates on every page
```

Deploy the `dist/` folder to any static host (Netlify, Cloudflare Pages, Vercel, GitHub Pages). `dist/_redirects` covers Netlify and Cloudflare Pages.

Every sentence on the site comes from the current schillyscatering.com, cut but never reworded (`brand/07-copy.md`). The logo and photos are Schilly’s own. Type is Solway and Radio Canada (`brand/04-type-study.md`). The brand process, every decision and the reasons are in `brand/README.md`. The page structure for search and answer engines is in `brand/09-site-structure.md`.

## Pages

| URL | What’s on it |
| --- | --- |
| `/` | Headline, services, hours with open or closed status, location, phone, the BBQ Plates section, links to both menus, photos, events |
| `/take-out-menu/` | The full take-out menu with prices, section rail, search, print |
| `/catering-menu/` | The full catering menu with + Add (saves dishes in the browser for the inquiry form) |
| `/weddings/` | Wedding photo, catering platters and desserts, inquiry |
| `/lobster-bakes/`, `/pig-roasts/` | Their one line and the way to ask. Not indexed until Schilly’s sends menus |
| `/catering-inquiries/` | Their form, same fields |

## Files

| Path | What it is |
| --- | --- |
| `build.mjs` | Pages, layout, structured data, sitemap, robots, llms files, redirects |
| `src/data/menus.mjs` | Both menus. Paste Schilly’s wording here, never rewrite it |
| `assets/` | Styles, the browser script, fonts, images |
| `dist/` | Built site to deploy (committed) |
| `preview/` | The same pages linking with `index.html`, for opening from GitHub via raw.githack (committed) |
| `qa/` | The two gates and the color tools |
| `brand/` | Brand process, identity system, saved source text, logo files |

## Editing

| Change | File |
| --- | --- |
| Menu items or prices | `src/data/menus.mjs`, then `npm run build` |
| Hours, address, phone | `SITE` in `build.mjs`, and `HOURS` in `assets/app.js` |
| Colors, type, spacing | `assets/styles.css` tokens, matching `brand/05-identity-system.md` |
| Index Lobster Bakes or Pig Roasts | add content, set `index: true` in `PAGES` in `build.mjs` |
| New interface label | add it to `brand/source/ui-labels.txt` first |

## Checks

```bash
npm run check
```

Needs Node 18+ and Playwright with Chromium. Two gates:

- `qa/check-content.mjs` opens the page, switches menus, and fails if any visible text, alt text, label or meta tag is missing from `brand/source/` (the saved text of their site plus the approved labels). It also fails on slop and hierarchy giveaways (emojis, gradients, lift animations, eyebrows, tracked capitals, letter-spacing over 0.02em, photo captions, more than one h1, retired or AI-overused typefaces), and on Ribbon Red or Sign Yellow outside their jobs.
- `qa/check-layout.mjs` loads the page at 360, 390, 768 and 1280 px and fails on overflow, text under 14 px, text contrast under WCAG AA, control edges under 3:1 (WCAG 1.4.11), touch targets under 40 px, distorted or broken images, console errors, a first load over 600 KB, the hours below the first screen on phones, a ribbon on the web page, or a missing header inquiry link. It also checks the brand guide for overflow and stretched images.
- `qa/colorlib.py` holds the OKLCH, contrast and colorblind-simulation functions behind `brand/color/README.md`.

`brand/QA-LOG.md` records each review loop.

## Before launch

1. **Connect the form.** Their current form sends through the site builder, and the site doesn’t show an email address. Set `data-endpoint` on the form in the `inquiry` function in `build.mjs`. For FormSubmit, the form Green Falls uses: `https://formsubmit.co/ajax/<their email>`, then confirm the activation email FormSubmit sends. Until it’s set, Send shows “Not sent” with the store phone number.
2. **Send one real test inquiry** after connecting it, and confirm it arrives.
3. **Point the domain** at the new host. The page keeps their current section names as anchors (`#take-out-menu`, `#catering-menu`, `#catering-inquiries`, `#lobster-bakes`, `#pig-roasts`, `#weddings`). The old paths (`/take-out-menu`, `/catering-menu` and so on) need redirects to those anchors on the host.
4. **Test on a real iPhone.** QA ran in Chromium, not Safari on a device.
