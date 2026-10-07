# Type study

Round one chose Roboto Slab and Lato. Round two (below) replaced both after a Google Fonts deep dive on overuse.

## Round one

Five display faces and three body faces, set on the same lines at real sizes next to the logo: `type-study.png`. All are open-licensed and self-hostable: Roboto Slab under Apache 2.0, the rest under the SIL Open Font License.

## Display

| Face | Where it came from | Verdict |
| --- | --- | --- |
| Oswald 600 | Their current site | Clean, but a stock condensed sans. It says "website template," not "this sign" |
| Anton | Their current site | Punchy, but too tight for menu rows. "BBQ PLATES" closes up at 28 px |
| Zilla Slab 700 | Echoes the ribbon | Old-style figures: "$30" sets with a dropped 3, which reads wrong for prices |
| **Roboto Slab 800** | Echoes the ribbon | **Chosen.** Same family of letter as the ribbon’s "TAKE OUT & CATERING": bracketed slabs, wide capitals, heavy stroke. Lining figures, so prices sit level. Holds at 20 px prices and 84 px headlines |
| Alfa Slab One | Echoes the ribbon | Closest to sign-painting, but at this weight it competes with the logo and clogs at 20 px |

Roboto Slab is common. Here it gains ownability from what it sits with: the sign, the ruled section frames, the dotted leaders and the ribbon. The same thing happened with Generation Maine’s Signature direction, where no single part was ownable but the combination was.

## Body

| Face | Verdict |
| --- | --- |
| **Lato** (their current site) | **Kept.** Open, friendly, clear at 16 px on Slate. Keeps continuity with their current site |
| Source Sans 3 | Slightly narrower and cooler, no gain over Lato |
| Atkinson Hyperlegible | Most legible letterforms, but the slashed zero turns the phone number into "(2Ø7)693-884Ø" |

## Rules

1. **Roboto Slab 800** for the headline, section titles, prices and the ribbon. Weight 800 only, no other weights.
2. **Lato 400 and 700** for everything else. Buttons, tabs, nav and small labels in Lato 700, uppercase, letter-spacing 0.06em, so labels don’t compete with section titles.
3. Prices in Roboto Slab at body size or larger, Ribbon Red on light grounds, lining figures.
4. Oswald and Anton leave the site.

## Round two: Google Fonts deep dive, October 7

The client asked for faces that AI-built sites don't overuse. Roboto Slab and Lato failed that test: Roboto is the most-used web font family (Web Almanac 2024: 15.2% of desktop pages), and Lato sits in the same top tier. Specimens: `font-deep-dive.png`.

**Method.**
1. All 1,908 Google families from the Google Fonts API, via the `google-font-metadata` dataset (the API's own popularity sort is blocked on this machine).
2. Excluded three groups:
   - Web-wide most used: Roboto family, Open Sans, Noto, Montserrat, Poppins, Lato, Oswald, Raleway, Nunito, Source Sans, Merriweather, Playfair Display, Lora, Bitter, Arvo, Zilla Slab, Anton, Bebas Neue and others (Web Almanac).
   - AI defaults and the "designed" second wave the fix-it articles recommend: Inter, Inter Tight, Space Grotesk, DM Sans and DM Serif, Outfit, Manrope, Plus Jakarta Sans, Sora, Syne, Geist, Figtree, Onest, Urbanist, Lexend, Fraunces, Instrument Serif and Sans, Bricolage Grotesque, Cormorant, EB Garamond, IBM Plex, Archivo, Unbounded, Epilogue, Hanken Grotesk, Young Serif, Gloock, Public Sans, Mona Sans and others.
   - Our other clients: Generation Maine (Labrada, Commissioner, Bricolage, Hedvig) and Green Falls (Archivo, Libre Franklin), so the three brands stay distinct.
3. That left 171 serifs with bold weights and 352 sans families with 400 and 700. We shortlisted ten display slabs and ten text sans that fit a painted sign and a printed menu, and set each on the same lines next to the logo.

**Display, at heaviest weight.**

| Face | Verdict |
| --- | --- |
| **Coustard 900** | **Chosen.** A fat Clarendon, the same family of letter as the logo's ribbon capitals and its glossy "Schilly's". Sturdy lining figures for prices. Rare on the web, never an AI default |
| Rokkitt 900 | Runner-up. Punchy and narrow, but geometric, more 1970s catalog than sign |
| Hepta Slab 900 | Strong Rockwell poster feel. Heavier than the logo, competes with it |
| Montagu Slab 700 | Elegant wedge serifs, too editorial for a takeout counter |
| Epunda Slab 900, Podkova 800, Solway 800, Aleo 900 | Friendly, but plain next to the sign |
| Kameron 700 | Typewriter-thin at display sizes |
| Bowlby One SC | Fat sans poster, loses the slab link to the logo |

**Text sans.**

| Face | Verdict |
| --- | --- |
| **Radio Canada** | **Chosen.** Warm humanist shapes, open counters, compact width for two-column menus, plain figures so the phone number reads cleanly |
| Rethink Sans | Close second, rounder and wider |
| Golos Text, Wix Madefor Text, Reddit Sans, Gantari, Funnel Sans | Clean but neutral, no gain over the chosen face |
| Familjen Grotesk | Quirky "j" and "a" fight the menu text |
| Red Hat Text | Light color at 16 px on Slate |
| Mozilla Text | Slashed zero: "(2Ø7)693-884Ø" |

## Rules, round two

1. **Coustard 900** for the headline, menu section titles, prices and the ribbon. Coustard 400 is not used.
2. **Radio Canada 400 and 700** for everything else. Body 18 px, details 16 px.
3. Labels stay in sentence case or title case as Schilly's wrote them. No tracked uppercase micro-labels (see `06-hierarchy.md`).
4. Roboto Slab, Lato, Oswald and Anton leave the site.
