# Schilly's Catering website

A fast, single-page static site (plain HTML/CSS/JS, no build step) built to replace
schillyscatering.com/catering-menu. Open `index.html` in a browser to preview, or deploy
the folder as-is to Netlify, Vercel, GitHub Pages, or any web host.

## What's on the page
- **Clear hero**: what they cook, where, and two actions (quote / menu)
- **Services**: lobster bakes, pig roasts, BBQ, weddings, corporate, emergency feeding
- **Menu**: searchable, dietary filters (GF / V / VG / DF), sticky category jump-bar,
  and **+ Add** buttons that collect dishes into the quote request
- **How booking works**: 4 steps
- **Reviews**: from the existing testimonials page
- **FAQ**: with FAQPage structured data
- **Quote form**: builds a message and opens the visitor's texting app pre-filled to
  (207) 713-1564, or copies it. No backend or form service needed.
- Sticky call/quote bar on phones, printable menu (Print button → clean 2-column menu)

SEO / AI search: LocalBusiness + FAQ JSON-LD, meta/OG tags, `robots.txt`, `sitemap.xml`, `llms.txt`.

## Editing the menu
Everything lives in `assets/menu-data.js`. Add, remove or reword items there; the menu,
filters and jump links rebuild themselves. Add `price: "$18 / person"` to show a price.

## Before launch: please confirm
The live site couldn't be fetched when this was built, so these need checking with Schilly's:
1. **Menu items** in `assets/menu-data.js` are a draft based on their advertised services.
   Replace them with the real menu, then set `MENU_IS_DRAFT = false`.
2. **Email address**: none was known. If they have one, add it to the contact card and footer.
3. **FAQ answers** (booking lead time, minimums, service styles) are reasonable defaults.
   Confirm them.
4. **Photos**: real food/event photos would help a lot. Add them to `assets/` and the hero and service cards.
5. **Reviews** are shortened from their testimonials page. Confirm the wording is OK.
