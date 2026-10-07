# Schilly’s Take Out & Catering Kitchen website

A one-page static site for schillyscatering.com: plain HTML, CSS and JavaScript, no build step. Upload the folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

Every sentence on the page comes from the current schillyscatering.com. The logo and the five photos are Schilly’s own. Type is Coustard (a Clarendon that matches the logo’s ribbon lettering) and Radio Canada, chosen in a Google Fonts deep dive to avoid faces that AI-built sites overuse. The brand work follows the Generation Maine process; every stage and reason is in `brand/README.md`, and `brand/guide.html` shows the system on one page.

## What’s on the page

1. Header: logo, Take Out Menu, Catering Menu, Catering Inquiries.
2. Hero: SMOKED. HOMEMADE. MAINE., their services line and sentence, then Business Hours (with an open or closed status on Maine time), Location (Get directions) and Store Phone # (Call) as rows. The brisket photo.
3. Our Menus: a Take Out and Catering switch, a section rail that tracks your place (chips on phones), search, print. Take-out prices on dotted leaders. Catering items have + Add, which carries dishes into the inquiry.
4. A Taste of Schilly’s: three of their photos.
5. Lobster Bakes, Pig Roasts, Weddings: their text and the wedding photo.
6. Let’s Plan Your Event: their form, same fields.
7. Footer: Hungry Yet?, hours, location, phone, Instagram, Facebook.

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

- `qa/check-content.mjs` opens the page, switches menus, and fails if any visible text, alt text, label or meta tag is missing from `brand/source/` (the saved text of their site plus the approved labels). It also fails on slop and hierarchy giveaways (emojis, gradients, lift animations, eyebrows, tracked capitals, letter-spacing over 0.02em, photo captions, more than one h1, retired or AI-overused typefaces), and on Ribbon Red or Sign Yellow outside their jobs.
- `qa/check-layout.mjs` loads the page at 360, 390, 768 and 1280 px and fails on overflow, text under 14 px, text contrast under WCAG AA, control edges under 3:1 (WCAG 1.4.11), touch targets under 40 px, distorted or broken images, console errors, a first load over 600 KB, the hours below the first screen on phones, a ribbon on the web page, or a missing header inquiry link. It also checks the brand guide for overflow and stretched images.
- `qa/colorlib.py` holds the OKLCH, contrast and colorblind-simulation functions behind `brand/color/README.md`.

`brand/QA-LOG.md` records each review loop.

## Before launch

1. **Connect the form.** Their current form sends through the site builder, and the site doesn’t show an email address. Set `data-endpoint` on `<form id="inquiryForm">` in `index.html`. For FormSubmit, the form Green Falls uses: `https://formsubmit.co/ajax/<their email>`, then confirm the activation email FormSubmit sends. Until it’s set, Send shows “Not sent” with the store phone number.
2. **Send one real test inquiry** after connecting it, and confirm it arrives.
3. **Point the domain** at the new host. The page keeps their current section names as anchors (`#take-out-menu`, `#catering-menu`, `#catering-inquiries`, `#lobster-bakes`, `#pig-roasts`, `#weddings`). The old paths (`/take-out-menu`, `/catering-menu` and so on) need redirects to those anchors on the host.
4. **Test on a real iPhone.** QA ran in Chromium, not Safari on a device.
