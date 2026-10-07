# Identity system: Menu Board

The client chose Concept A on October 7, 2026.

The system that came out of the platform, two directions, color audit, type study, font deep dive, pressure test and hierarchy audit. `guide.html` shows it on one page.

## Logo

Painted sign artwork: glossy yellow "Schilly’s" with a red outline, a red ribbon reading "TAKE OUT & CATERING", navy script "Kitchen", on a wood plank in a navy frame. Raster only: BrandCrowd’s "SVG" export wraps the same PNG. Master: `logo/schillys-logo-master.png` (1263 × 628, transparent).

1. Use the supplied files. Never trace, retype, recolor, crop or stretch.
2. Minimum width 150 px on screens. Below that the ribbon lettering can’t be read.
3. Clear space on every side: the height of the "Kitchen" script, about one sixth of the logo height.
4. Prefer Cream or Plank. On Frame Navy the sign’s frame merges into the ground (`color/README.md`, finding 5), so the site keeps the logo off navy. Avatars use Cream.
5. No shadow, outline or animation.

## Color

Sampled from the logo. Full audit: `color/README.md`.

| Name | Hex | Job |
| --- | --- | --- |
| Cream | `#FFF9EE` | Page ground |
| Plank | `#F6E4C4` | Alternate band, segmented control track |
| Frame Navy | `#022654` | Text, headings, selected states, footer band |
| Ribbon Red | `#A90A04` | Actions on light grounds, prices, the ribbon |
| Sign Yellow | `#FCDF19` | Footer only: headline and action on navy |
| Rim Gold | `#E8A924` | Labels and hairlines on navy |
| Slate | `#4A5468` | Secondary text |
| Wood Edge | `#8F7A55` | Control borders and dotted leaders. 3.3:1 or better on every light ground |
| Line | `#E6D5B3` | Decorative dividers only, never a control edge |

Rules:
1. Ground about 60%, navy and photos about 35%, red and yellow under 5% together.
2. Red on light grounds only. Yellow on navy only. They never share a ground.
3. One yellow per frame. Rim Gold never carries text on light grounds (2.9:1).
4. Every control edge reaches 3:1 against what is behind it (WCAG 1.4.11).

## Type

Study and Google Fonts deep dive: `04-type-study.md`. Hierarchy and case: `06-hierarchy.md`.

- **Solway 800** (OFL): headline, section titles, menu section titles, prices. A fat Clarendon that matches the logo’s ribbon capitals. Rare on the web, never an AI default.
- **Radio Canada 400 and 700** (OFL): everything else. Body 18 px, details 16 px, buttons and labels 16 to 17 px in Radio Canada 700, in the case Schilly’s wrote. No tracked capitals.
- Six sizes: display, title, menu title, lead, body, small. Self-hosted WOFF2 with `font-display: swap`.

## Devices

| Device | Built from | Rules |
| --- | --- | --- |
| **Ribbon** | The logo’s red ribbon | Notched ends, Ribbon Red with cream Solway capitals, light grounds only. For printed menus and social posts. Not on the web page: under a headline it reads as a badge (`06-hierarchy.md`) |
| **Ruled frame** | Printed menu boards (The Dinner Ladies, Refero) | Two hairlines top and bottom, 3 px apart, Frame Navy. Menu section titles only |
| **Leader** | Printed menus (21st.dev Restaurant Menu Block) | 2 px dotted Wood Edge from item name to price |
| **Fact rows** | DoorDash store sheet, Yelp, Google (Refero) | Label, value, action. Status and hours on one line |
| **Segmented control** | Uber Eats, DoorDash (Refero), 21st.dev Segmented Control | Inset Plank track, Wood Edge border, navy selection |
| **Section rail** | Uber Eats, DoorDash (Refero), 21st.dev Scroll Spy | Desktop rail, phone chips, reading-line spy, `aria-current="location"` |

## Shape and motion

- 6 px corners on buttons, inputs, photos. 9 px on the segmented track. No pills.
- One control height, 48 px. Touch targets 44 px, compact chips 40 px.
- Hover and focus change color only, 150 ms. No lifts, reveals, parallax, tilt or floating images. Smooth scrolling turns off under reduced motion.

## Photography

Schilly’s five photos, never stock: `brisket` (hero, link preview), `rotisserie`, `grazing-table`, `salmon-platter` (A Taste of Schilly’s), `wedding-chef` (events).

## Words

Schilly’s own wording, saved in `source/`. Interface labels from `source/ui-labels.txt`: three words or fewer, naming an action or a state. No invented reviews, prices, promises or FAQ answers.


## Revision, October 7, 2026: premium pass

- **Sign Yellow leaves the web page.** It stays in the logo, printed menus and social posts. On the site, navy type sits on cream and board; gold is a 1 px rule; red is the only action color. Reason: yellow-on-navy headlines read as signage, not as a premium site, and the color had nowhere to go but louder.
- **Corners.** 4 px on controls only. Photos and panels are square.
- **Frames.** The double navy frame is gone. A panel is a cream surface under a single 1 px navy rule.
- **Rhythm.** Sections no longer share one 64 px padding: the hero overlap, the big sentence (120 px above), the photo strip and the events block each set their own pace. Photos keep their own proportions.
- **Placeholders.** Generated photos are allowed only for subjects Schilly's has no photo of (lobster bakes, pig roasts, wedding spreads), tagged `data-placeholder`, listed in `brand/source/placeholders.txt`, and replaced before launch.

- **Second revision, same day.** Cream and Plank leave the web too (the client: "we're still using the cream color"); they remain print and social colors. The web ground is white, with navy type, gold and navy hairlines, red actions and one navy band mid-page. Display type is Newsreader 500 in sentence case (brand/04-type-study.md, round four); Solway is retired. The hero photo must be a wide frame: the rotisserie panorama, until Schilly's or a generated placeholder supplies a better wide shot.
