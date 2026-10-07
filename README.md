# Schilly’s Take Out & Catering Kitchen website

A one-page static site for schillyscatering.com: plain HTML, CSS and JavaScript, no build step. Upload the folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

Every sentence on the page comes from the current schillyscatering.com. The logo, the five photos and the two typefaces are Schilly’s own. The brand identity, with the reasons behind each choice, is in `brand/README.md`. `brand/guide.html` shows it visually.

## What’s on the page

1. Header: logo, Take Out Menu, Catering Menu, Catering Inquiries.
2. Hero: SMOKED. HOMEMADE. MAINE., their line, View Our Menu, the brisket photo.
3. Business Hours, Location and Store Phone #, with an open or closed indicator on Maine time, a directions link and tap to call.
4. Our Menus: Take Out and Catering tabs, search, section links that stay on screen, print. Catering items have + Add, which carries dishes into the inquiry.
5. A Taste of Schilly’s: three of their photos.
6. Lobster Bakes, Pig Roasts, Weddings: their text and the wedding photo.
7. Let’s Plan Your Event: their form, same fields.
8. Footer: Hungry Yet?, hours, location, phone, Instagram, Facebook.

## Editing

| Change | File |
| --- | --- |
| Menu items or prices | `assets/menu-data.js` (paste their wording, don’t rewrite it) |
| Hours | `index.html` (two places), `HOURS` in `assets/app.js`, JSON-LD in `index.html` |
| Colors, type, spacing | `assets/styles.css` tokens, matching `brand/README.md` |
| New interface label | add it to `brand/source/ui-labels.txt` first |

## Checks

```bash
npm run check
```

Needs Node 18+ and Playwright with Chromium. Two gates:

- `qa/check-content.mjs` opens the page in a browser, switches tabs, and fails if any visible text, alt text, label or meta tag is missing from `brand/source/` (the saved text of their site plus the approved labels). It also fails on emojis, gradients, lift animations, left-border callouts, hero eyebrows, placeholders, and on Ribbon Red or Sign Yellow outside their brand jobs.
- `qa/check-layout.mjs` loads the page at 360, 390, 768 and 1280 px and fails on horizontal overflow, text under 14 px, contrast under WCAG AA, touch targets under 40 px, distorted or broken images, console errors, a first load over 600 KB, an hours band below the first screen on phones, or a missing header inquiry link.

`brand/QA-LOG.md` records each review loop.

## Before launch

1. **Connect the form.** Their current form sends through the site builder, and the site doesn’t show an email address. Set `data-endpoint` on `<form id="inquiryForm">` in `index.html`. For FormSubmit, the form Green Falls uses: `https://formsubmit.co/ajax/<their email>`, then confirm the activation email FormSubmit sends. Until it’s set, Send shows “Not sent” with the store phone number.
2. **Send one real test inquiry** after connecting it, and confirm it arrives.
3. **Point the domain** at the new host. The page keeps their current section names as anchors (`#take-out-menu`, `#catering-menu`, `#catering-inquiries`, `#lobster-bakes`, `#pig-roasts`, `#weddings`). The old paths (`/take-out-menu`, `/catering-menu` and so on) need redirects to those anchors on the host.
4. **Test on a real iPhone.** QA ran in Chromium, not Safari on a device.
