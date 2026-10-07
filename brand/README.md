# Schilly's brand identity

This folder sets how Schilly's looks and reads. The website follows it, the scripts in `qa/` check it, and `guide.html` shows it on one page.

Method: the Generation Maine process (platform, then measurable criteria, then a system with numbered rules, then strict QA), plus the review rules Green Falls uses on its own site. Both are linked at the end.

## 1. Platform

**What it is.** Schilly's Take Out & Catering Kitchen, 224 Roosevelt Trail, Casco, Maine. Take out, family meals and catering. Open Wednesday to Sunday, 11 am to 6 pm. Store phone (207) 693-8840.

**What it says about itself** (their words, from schillyscatering.com):
- SMOKED. HOMEMADE. MAINE.
- Slow smoked favorites, homemade comfort food & Maine hospitality.
- From Our Smoker to Your Celebration.

**Two visitors, two jobs.**

| Visitor | What they need first | Where the site answers it |
| --- | --- | --- |
| Ordering take out | Open today? Prices. Phone number. Address. | Hours band under the hero, the Take Out tab, tap-to-call, map link |
| Planning an event | What they cater, what's on the menu, how to ask | Catering tab, + Add to inquiry, the inquiry form |

**Where the identity lives.** The storefront sign style of the logo, the website, Instagram (@schillyseats), Facebook, printed menus and link previews in texts and social posts.

## 2. Criteria

Every page and every change has to pass all nine. `qa/` checks the ones marked with a script name.

1. **Their words only.** Every visible sentence comes from Schilly's own site. Interface labels come from a short approved list. (`check-content.mjs`)
2. **The logo is the brand.** Used as supplied. Never redrawn, recolored, cropped into or stretched.
3. **Take-out answer on the first screen.** On 360 and 390 px phones, the band with hours, address and phone starts on the first screen. (`check-layout.mjs`)
4. **Price in two taps or fewer.** Tapping Take Out Menu in the header puts prices on screen. (`check-layout.mjs`)
5. **Inquiry in one tap.** Catering Inquiries sits in the header at every width. (`check-layout.mjs`)
6. **Readable.** Body text 18 px, nothing under 14 px, WCAG AA contrast on every text element, touch targets 40 px or larger (48 px for buttons). (`check-layout.mjs`)
7. **Looks like the sign.** Colors come from the logo artwork only. Red marks actions and prices, yellow sits on navy. (`check-content.mjs`)
8. **No slop.** No emojis, gradients, hero eyebrows, decorative card grids, stock icons, em dashes in our own labels, invented claims, reviews, prices or FAQ answers. (`check-content.mjs`)
9. **Fast.** First load under 600 KB at every width. Images sized to their slot, WebP, lazy below the fold. (`check-layout.mjs`)

## 3. Identity system

### Logo

The logo is a painted sign: glossy yellow "Schilly's" with a red outline, a red ribbon reading "TAKE OUT & CATERING", navy script "Kitchen", on a wood plank in a navy frame. It is raster artwork. BrandCrowd's "SVG" export wraps the same PNG, so the master is `logo/schillys-logo-master.png` (1263 × 628, transparent).

Rules:
1. Use the files in `logo/` or `assets/img/logo-*.webp`. Never trace, retype or recolor it.
2. Minimum width 150 px on screens. Below that the ribbon lettering can't be read.
3. Clear space on every side equals the height of the "Kitchen" script, about one sixth of the logo height.
4. Place it on Cream, Plank or Navy. On a photo only in the link-preview card, where its own navy frame separates it.
5. Never add a drop shadow, outline or animation. The artwork already has depth.

### Color

Sampled from the logo artwork. Nothing outside this list.

| Name | Hex | Taken from | Job |
| --- | --- | --- | --- |
| Frame Navy | `#022654` | The sign's outer frame (sampled) | Headings, body text, header and footer bands |
| Ribbon Red | `#A90A04` | The ribbon (sampled #A90201) | Buttons, prices, links. Action and money only |
| Sign Yellow | `#FCDF19` | The lettering, and their current site | Accents on Navy only. Never on a light background |
| Rim Gold | `#E8A924` | The sign's rim (sampled) | Rules and focus ring on Navy only |
| Plank | `#F6E4C4` | A light tint of the wood (#F2C89B) | Alternate section band |
| Cream | `#FFF9EE` | The ribbon lettering | Page background |
| Slate | `#4A5468` | Navy, lowered | Secondary text on Cream and Plank |

Contrast, by the WCAG 2.x formula. Separately, `check-layout.mjs` measures every rendered text element at four widths.

| Pair | Ratio |
| --- | --- |
| Frame Navy on Cream | 14.2:1 |
| Frame Navy on Plank | 11.9:1 |
| Ribbon Red on Cream | 7.3:1 |
| White on Ribbon Red | 7.7:1 |
| Sign Yellow on Frame Navy | 11.2:1 |
| Rim Gold on Frame Navy | 7.2:1 |
| Slate on Cream | 7.3:1 |

Rim Gold on Cream is only 2.9:1, so it never carries meaning on light backgrounds. Focus rings are Ribbon Red on light bands and Sign Yellow on Navy.

### Type

Their current site sets headings in Oswald and body in Lato. The identity keeps both so the new site reads as the same business.

- **Oswald** 600, uppercase, letter-spacing 0.02em. Headings, section titles, tab labels, prices. Their menus are printed in capitals already.
- **Lato** 400 and 700. Body 18 px, line height 1.6. Item details 16 px. Small print 14 px, never smaller.
- Self-hosted WOFF2 (Fontsource, OFL) with `font-display: swap`.

### Shape and motion

- Corners 6 px on buttons, inputs, cards and photos. The sign has rounded corners. No pills.
- One control height: 48 px.
- Hover and focus change color only, 150 ms. No lift, no scroll reveals, no parallax.
- Photos keep their own proportions in fixed-ratio frames with `object-fit: cover`. Never stretched.

### Photography

Five photos from their current site. Use them before anything else, and never use stock food photos.

| File | What it shows | Use |
| --- | --- | --- |
| `brisket` | Smoked brisket in a pan, probe reading 192 | Hero, link preview |
| `rotisserie` | Chickens turning on a spit | Smoker and event sections |
| `grazing-table` | Platters and boards on an outdoor table | Catering |
| `salmon-platter` | Smoked salmon platter on cucumber | Catering |
| `wedding-chef` | Chef in apron with a bride, holding a plate | Weddings |

## 4. Voice

Their copy uses capitals for headings, bullets between items ("Take Out • Family Meals • Catering") and a friendly, plain tone ("HUNGRY YET?"). We don't write new marketing copy. When the site needs a label, it comes from `source/ui-labels.txt`, keeps to three words or fewer, and states the action ("Call", "Get directions", "Print menu").

## 5. Sources

- Live site text, saved October 7, 2026: `source/*.txt`
- Generation Maine brand process: github.com/mchljns/Generation-Maine (`brand/00-platform.md`, `03-pressure-test.md`, `07-family-ui-audit.md`)
- Green Falls site review rules: github.com/mchljns/Green-Falls (`CLAUDE.md`, `DESIGN-REVIEW.md`, `MOBILE-REVIEW.md`, `QA-REVIEW.md`)
