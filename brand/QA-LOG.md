# QA log

Round one (loops 1 to 7) built the content-only site. Round two (loops 8 to 15, at the end) rebuilt it with the Generation Maine process: references, color audit, two directions, pressure test, font deep dive and hierarchy audit.

Each loop ran `npm run check` and a visual review of screenshots at 360, 390, 768 and 1280 px. A loop ends when both gates pass and the screenshots show nothing to fix.

## Inputs

- Live site text, October 7, 2026: 8 pages saved to `brand/source/`.
- Logo: BrandCrowd logo draft `ecf4e5de…`, downloaded in all four variations. The "SVG" is a PNG inside an SVG wrapper, so the master is the 1263 × 628 transparent PNG.
- Photos: 6 files from their site. One was a duplicate of the brisket photo, which leaves 5.
- Method: Generation Maine (`brand/00-platform.md`, `03-pressure-test.md`, `07-family-ui-audit.md`) and Green Falls (`CLAUDE.md`, `DESIGN-REVIEW.md`, `MOBILE-REVIEW.md`, `QA-REVIEW.md`).

## What the previous draft got wrong

The draft before this one wrote its own copy. It had an invented hero line, event card descriptions, a four-step "how catering works" section and six FAQ answers. It reworded menu descriptions, split one catering category in two, used emoji icons and gradients, put an eyebrow over the hero, and drew a made-up "S" favicon. All of it is gone. The Green Falls rules ban each of these. The content gate now fails if any of it comes back.

## Loop 1: content gate

| Found | Fix |
| --- | --- |
| Two screen-reader labels written by us ("Business Hours, Location, Store Phone #", "Menu sections") | Removed one, used their heading "OUR MENUS" for the other |
| Meta description flagged because the address joins two of their lines with a comma | Gate accepts their lines joined by a comma |
| © flagged as an emoji | Gate skips ©, ® and ™ |

Proof the gate works: we planted "Voted the best BBQ in Maine! 🔥" in the hero. The gate failed on both the claim and the emoji, then passed after removal.

## Loop 2: layout gate

| Found | Fix |
| --- | --- |
| Footer phone button 1.34:1 contrast: a footer link rule turned its text white on yellow | Footer link color no longer applies to buttons |
| "Call" link 31 px wide | 44 px minimum width |
| Tablet first load 603 KB, over budget | Added a 900 px brisket size. Now 311 KB |
| Fonts blocked when opened as a file | QA serves the folder over HTTP like a host would |

## Loop 3: visual review

| Found | Fix |
| --- | --- |
| Phone header 200 px tall: logo, then nav wrapping to two rows. Hours band below the first screen | Logo and Catering Inquiries share row one, the two menus split row two |
| Tab subtitles wrapped to five lines on phones and made the tabs uneven | Tabs show titles only. The selected menu's line shows above the search |
| "Lobster Bakes • Pig Roasts • Weddings" left "• Weddings" alone on a line | Each bullet stays with the word before it |
| Hours band 14 px below the first screen on a 360 × 740 phone | Gate tightened from "within two screens" to "on the first screen". Smaller phone headline and a wider photo crop below 380 px. Now at 613 px |

## Loop 4: brand rules

| Found | Fix |
| --- | --- |
| Section links hid under the sticky desktop header (positioned for 88 px, header is 120 px) | Offset set to the header height |
| Phone menu buttons were different widths | Equal two-column row |
| Menu subtitle and "LUNCH MENU" were red. The brand reserves red for actions and prices | Changed to Slate. Gate now fails on red or yellow outside their jobs. Tested by planting both, then removing |

## Loop 5: docs and final pass

| Found | Fix |
| --- | --- |
| Brand README said the layout script recomputes the contrast table. It measures rendered text instead | Wording corrected |
| README criteria thresholds didn't match what the scripts test | Criteria rewritten to match the gates |
| Phone logo at 128 px broke our own 150 px minimum | Phone logo set to 150 px |
| Adverbs and a passive opener in the brand doc | Rewritten |
| Catering intro sat between search and the section links on phones; Print took a full row | Intro moved up with the subtitle; Print hidden on phones |

## Loop 6: print

Rendered the print stylesheet to a Letter PDF in Chromium and reviewed the pages.

| Found | Fix |
| --- | --- |
| Take-out menu printed as one narrow column over 3 pages (the phone rule applied at paper width) | Two columns forced in print, tighter type. Now 2 pages |
| No logo on the printed menu | Logo added to the print header, reusing the cached header image |
| Address line printed above the logo | Moved under it |

## Loop 7: brand guide

| Found | Fix |
| --- | --- |
| The logo at the top of `guide.html` was stretched vertically: width set in CSS, height left at the HTML attribute. That breaks logo rule 3 | `height: auto` on images in the guide. The layout gate now also loads the guide and fails on any stretched image. Tested by removing the fix: the gate failed, then passed again |

## Final state

- `check-content`: 317 text fragments, all traced to schillyscatering.com or the 31 approved labels. Slop and brand lint clean.
- `check-layout`: passes at 360, 390, 768 and 1280 px. First load 226 to 443 KB depending on width. Hours band at 624 px of 740 on the smallest phone.
- Form tested: required-field validation, + Add carrying dishes into the form, the "Not sent" state with no endpoint. A real send is not tested, because no endpoint exists yet.

## Not verified

- Delivery of a real inquiry (needs their email and a FormSubmit activation).
- Safari on a physical iPhone, including safe areas.
- Printing from Safari and Firefox. The PDF check used Chromium.

---

# Round two

## Loop 8: color audit
Measured in OKLCH with colorblind simulation (`color/README.md`). Found the red button on the navy hero at 1.94:1 (fails WCAG 1.4.11, vibrates, turns olive under protanopia), a yellow and gold near-miss in the hero, and control borders at 1.44:1. Added Wood Edge `#8F7A55` for control borders, moved the yellow action to navy-only, and added a control-edge check to `check-layout`. Tested by reverting borders to the old color: 65 failures, then 0.

## Loop 9: build of Concept A, first gate run
Labels at 12.8 to 13.6 px, desktop rail links 36 px tall, a 26 px phone link target, and a `translateY` the lint flagged. All fixed.

## Loop 10: scroll spy
The rebuilt reading-line spy (21st.dev Scroll Spy pattern) lights the short last section. Tested: clicking DESSERT and scrolling to the end of the menu both mark DESSERT at 1280 and 390 px. The old IntersectionObserver version never did.

## Loop 11: pressure test against Refero
Every heading had the ruled frame, so the page read as a stack of banners. The centered OUR MENUS header didn't line up with the menu column. Rules are now on menu section titles only, and page headings are left-aligned (`03-pressure-test.md`).

## Loop 12: client feedback, font deep dive
Roboto Slab and Lato are among the most used web fonts. Screened all 1,908 Google families, excluded web-wide favorites, AI defaults and the faces our other clients use, then set 20 candidates (`04-type-study.md`). Chose Coustard 900 and Radio Canada.

## Loop 13: hierarchy and AI giveaways
Removed tracked uppercase micro-labels, the badge under the headline, and muted grey subheadings. Set a six-step scale. Added lints for uppercase transforms, letter-spacing, captions, eyebrows, more than one h1 and AI-overused faces (`06-hierarchy.md`). Coustard is wide, so "HOMEMADE." overflowed a 360 px phone. The display size now scales with screen width.

## Loop 14: case and alignment
Platter names and rail links in capitals at body size were noisy, so they're now title case (same words). "PARTY PLATTERS, BOARDS, and GRAZES" mixed case at display size, so menu section titles are now one case. "Get directions" dropped under the address, so actions now sit in a fixed right column. The address breaks after the street, as on their site. The events title was the only mixed-case title and now matches the rest.

## Loop 15: print and guide
Print renders 2 Letter pages in the new faces, with logo, ruled sections and leaders. The brand guide passes the overflow and stretched-image checks.

## Final state, round two
- `check-content`: 318 fragments traced, slop, hierarchy and brand lints clean.
- `check-layout`: passes at 360, 390, 768 and 1280 px, including control edges. Hours rows start at 399 to 415 px on phones.

## Still open
- **Social photos.** Instagram and Facebook page hosts are refused by the network policy, though their image CDNs are allowed. Without the pages there's no list of photos to fetch.
- Inquiry delivery, Safari on an iPhone, and printing from Safari and Firefox are unverified.

---

# Round three

## Loop 16: client picks Solway, copy and hero
- Swapped Coustard 900 for Solway 800, the client's pick from the deep-dive sheet.
- Copy edited by cutting only (`07-copy.md`). The four "From X to Y" openers, stock warmth lines, a rhetorical question and a stale "coming soon" are gone. The content gate accepts a trimmed sentence that keeps its full stop: 312 fragments, all traced.
- Hero checked against best practice (`08-hero.md`). One primary action: View Our Menu is solid red, and the header's Catering Inquiries became an outline. View Our Menu now shows on phones too.
- Gates pass at all four widths. Hours rows start at 344 px (360 × 740) and 356 px (390 × 844).

## Loop 17: multi-page site
- Split into seven pages on the current site's URLs, built by `build.mjs`. Menus are rendered to HTML with Menu structured data (41 priced take-out items, 59 catering items).
- `check-content` now crawls all pages plus the 404, and traces JSON-LD strings too. It caught "Barbecue" (now "BBQ", their word) and an unapproved "/" separator. 518 fragments traced.
- `check-layout` now runs 8 pages × 4 widths. It caught 34 px event links inside a heading (now a list of 44 px links), a 19 px breadcrumb link, and a 404 page that overflowed on phones (missing the header script). Price is within one tap of the header at 390 px and wider, and two taps at 360.
- Visual review: the menu pages repeated the sub line. Removed.
- Link check: no broken internal links in `dist/` or `preview/`. Fonts load in both.
