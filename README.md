# Schilly's Take Out & Catering Kitchen website

A fast, single-page static site (plain HTML/CSS/JS, no build step) to replace
schillyscatering.com. Open `index.html` to preview, or deploy the folder as-is to
Netlify, Vercel, GitHub Pages or any web host.

All content comes from the live site (Oct 2026): the take out menu, catering menu, hours,
address, phone and social links.

## What's on the page
- **Hero + "at a glance" strip**: hours with a live *Open now / Closed* indicator (Maine time),
  tap-for-directions address, tap-to-call phone. These are the three things take-out customers look for first.
- **Menus in one place**: Take Out and Catering tabs, search, a sticky section jump-bar.
  Take out reads like a classic menu (name … price). Catering items have **+ Add** buttons
  that collect dishes into the inquiry.
- **Events**: BBQs, corporate, weddings, lobster bakes, pig roasts. These replace the
  three "Coming soon" pages on the current site.
- **Photo gallery** (the 5 photos from the current homepage), **How catering works**, **Inquiry form**
  (same fields as the current form, plus the dishes they picked), **Hours & location**, **FAQ**.
- Phones get a sticky Call / Menu / Plan event bar. "Print this menu" prints a clean copy of the selected menu.
- SEO / AI search: Restaurant + opening hours + FAQ structured data, meta/OG tags,
  `robots.txt`, `sitemap.xml`, `llms.txt`.

## Editing
- **Menus**: `assets/menu-data.js`. Add, remove or reprice items; everything rebuilds itself.
- **Hours**: update the hours table in `index.html`, `HOURS` at the top of `assets/app.js`,
  and the JSON-LD `openingHoursSpecification`.

## Before launch
1. **Connect the inquiry form.** No email address appears on the current site, so the form
   needs somewhere to send. Easiest: create a free form at formspree.io with Schilly's email,
   then paste its URL into `data-endpoint=""` on `<form id="inquiryForm">` in `index.html`.
   Until then, the form shows the visitor a copy-able summary and the phone number, so no inquiry is lost.
2. **Photos**: they're loaded from the current site builder's image host (brandcrowd). Download
   them into `assets/` and update the `src` paths so they keep working after the switch. Also add real alt text (what's in each photo).
3. **Reviews**: the old testimonials page is gone (404). Add a few real Google/Facebook reviews; social proof matters a lot for catering.
4. **Lobster bake / pig roast / wedding menus**: add them to `menu-data.js` (or as event cards) when ready.
