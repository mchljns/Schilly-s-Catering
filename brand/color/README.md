# Color audit

Run October 7, 2026, on the palette from `brand/README.md` and the rendered site. Measured in OKLCH (perceptual lightness L, chroma C, hue h), with WCAG contrast and the Machado 2009 colorblind simulation. The functions are in `qa/colorlib.py`.

## The palette as color theory

| Name | Hex | L | C | h |
| --- | --- | --- | --- | --- |
| Frame Navy | `#022654` | 0.28 | 0.093 | 257 |
| Ribbon Red | `#A90A04` | 0.46 | 0.186 | 29 |
| Sign Yellow | `#FCDF19` | 0.90 | 0.183 | 99 |
| Rim Gold | `#E8A924` | 0.77 | 0.152 | 80 |
| Plank | `#F6E4C4` | 0.93 | 0.046 | 82 |
| Cream | `#FFF9EE` | 0.98 | 0.016 | 83 |
| Slate | `#4A5468` | 0.45 | 0.035 | 264 |

The logo is a primary triad, red, yellow and blue, the classic painted-sign and diner scheme. Red and yellow carry almost the same chroma (0.186 and 0.183). A triad at equal strength fights itself, so the system needs a clear order:

1. **Ground:** Cream and Plank, warm near-neutrals on the wood's hue (82 to 83). About 60% of the page.
2. **Structure:** Frame Navy for type and bands. Its hue (257) sits opposite the wood (82), so warm ground and cool type complement each other. About 17% of the page, plus the photos at about 18%.
3. **Accents:** red and yellow, about 1% between them, never at equal size side by side.

Slate shares navy's hue (264 against 257), so it reads as navy turned down, not as a stray grey.

## Findings

| # | Problem | Measure | Why it looks wrong | Fix |
| --- | --- | --- | --- | --- |
| 1 | Red button on the navy hero | 1.94:1 to navy (WCAG 1.4.11 asks 3:1 for a control's boundary). Lightness gap 0.19, hue gap 133° | Two saturated mid-dark colors far apart in hue vibrate at the edge, and the button sinks into the band. With protanopia the red becomes dark olive (#473E00) on navy | On navy, the action is Sign Yellow with navy text, 11.2:1. That's the logo's own yellow-on-navy pairing. Red stays the action color on light grounds |
| 2 | Yellow headline over a gold subtitle | Hue gap 20°, lightness gap 0.13, ΔE 14 | A near-miss: close enough to read as an attempt to match, far enough to look like a mistake. Colorblind simulation turns both into mustard | One yellow per frame. The subtitle goes to Cream. Gold stays for hairline rules on navy |
| 3 | Input, tab and chip borders | `#E6D5B3`: 1.44:1 to white, 1.16:1 to Plank | The form fields' edges disappear on Plank. Fails 1.4.11 | New token **Wood Edge** `#8F7A55` (the wood's hue, darker): 4.1:1 to white, 3.3:1 to Plank, 3.9:1 to Cream. `#E6D5B3` stays for decorative dividers only |
| 4 | Plank against Cream | ΔE 6.6, same hue | Fine. The band change reads as a change of paper, not a new color | Keep |
| 5 | Logo on navy | The sign's frame is Frame Navy exactly | The frame merges into the band and the rim gold becomes the edge. It still reads, as the brand guide shows | Allowed, but Cream and Plank are preferred |

`audit-before-after-cvd.png` shows findings 1 to 3 before and after: normal vision on top, then protanopia, then deuteranopia.

## Rules that come out of it

1. One yellow per frame, and yellow only on navy.
2. The action color depends on the ground: Ribbon Red on Cream, Plank and white; Sign Yellow on Frame Navy.
3. Every control edge meets 3:1 against what's beside it. `qa/check-layout.mjs` now checks this.
4. Red and yellow never appear side by side at similar size.
