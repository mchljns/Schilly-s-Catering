# Pressure test: Menu Board, signed

Direction A with B’s ribbon, built as the live page, then checked against the Refero screens in `references/` and against the eight criteria. This page records what we looked at, what we took and what changed.

## How we looked

The built page at 1280 and 390 px, next to Refero set 1 (Uber Eats store, DoorDash catering store and store sheet, Yelp business page, Google Maps results) and set 2 (The Dinner Ladies, Douze, Blue Apron, Volkshotel). The Refero search, sets and 21st.dev retrievals are documented in `references/README.md`.

## What we saw, and what changed

| What we saw | Where | Round one | Round two |
| --- | --- | --- | --- |
| Status and today’s hours on one line, then address and phone as rows with the action at the end | Yelp, Google Maps, DoorDash store sheet | A navy band of three columns under the hero, below the first screen on a 360 px phone | The three facts are rows inside the hero, under the line. Phone: they start at 420 px of 844 |
| Two order modes as a small segmented control | Uber Eats, DoorDash | Two large tab cards with subtitles that wrapped to five lines on phones | One inset track with two segments (21st.dev Segmented Control), arrow, Home and End keys |
| Section rail on desktop, chips on phones | Uber Eats, DoorDash | Chips only, an IntersectionObserver spy that never lit the last short section | Rail beside the menu on desktop, sticky chips on phones, reading-line spy (21st.dev Scroll Spy). Tested: clicking DESSERT and scrolling to the end both light DESSERT |
| One level of title wears the ruled frame | The Dinner Ladies | Every heading ruled: OUR MENUS, A TASTE OF SCHILLY’S, all section titles. A stack of banners | Only menu section titles are ruled, like a menu board. Page headings are plain slab, left-aligned over the rail layout |
| Name to price on one line | Printed menus, 21st.dev Restaurant Menu Block | Name and price at opposite ends of a row | Dotted Wood Edge leader between them |
| One loud color for the order action | The Dinner Ladies cart, DoorDash | Red on the navy hero (1.94:1) | Red only on light grounds; the hero action is a quiet navy outline; yellow lives in the footer |

## Look-alike risks

- **The Dinner Ladies** use cream, heavy capitals and double rules. Schilly’s differs in face (a slab, not a condensed sans), color (navy and red from the sign, not black and brick), and the ribbon. Keep the rules to menu sections only, so the resemblance stays a principle and not a look.
- **Smoked BBQ & Neighborhood Pub** (Windham). "SMOKED." never appears alone as a big word. It always sits in the three-part line.
- **Delivery apps.** We took their reading habits and left their chrome: no green, no rating stars, no cart.

## The rules, now measurable

1. **Ribbon:** one per page view, on Cream or Plank, Roboto Slab 800 at 15 px desktop and 14 px phone, cream text (7.7:1), notches 12 px. `check-layout` counts ribbons.
2. **Ruled frame:** menu section titles only. Two hairlines top and bottom, 3 px apart, Frame Navy.
3. **Leaders:** 2 px dotted Wood Edge, raised 5 px to sit on the baseline of the name.
4. **Facts:** three rows in the hero, label column 9.5 rem on desktop, labels hidden on phones, each action at least 44 × 44 px.
5. **Color:** red on light only, yellow on navy only, every control edge 3:1 or better. `check-content` and `check-layout` enforce both.

## Against the eight criteria

| # | Criterion | Result |
| --- | --- | --- |
| 1 | Open, call, go | Pass. Facts start at 420 px on a 390 × 844 phone and 432 px on 360 × 740 |
| 2 | Menu scans like paper | Pass. Leaders, ruled sections, price two taps away (gate tested) |
| 3 | Their words only | Pass. 317 fragments traced (gate) |
| 4 | Logo untouched | Pass |
| 5 | Color in order | Pass. Red and yellow never share a ground |
| 6 | Credible for a wedding | Pass. Catering is calm cream with one red action per row |
| 7 | Ownable on Route 302 | Pass. Ribbon, slab and sign together |
| 8 | Easy to keep | Pass. One data file, Print menu |
