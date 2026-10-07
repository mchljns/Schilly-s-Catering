# Two directions

Both directions use only the logo’s parts and Schilly’s own words. They differ in how much of the sign the page wears. Both were built on the same seven mockups: desktop first screen, phone first screen, take-out menu, catering platters with + Add, link preview, Instagram post and avatar. Side by side: `directions.html`, `directions/sheet-wide.png`, `directions/sheet-small.png`. Source: `directions/mockups.html`.

## A. Menu Board

The page is a printed menu. Cream paper and navy type. Section titles sit between double hairline rules, the way The Dinner Ladies frame theirs (Refero set 2). Names run to prices along dotted leaders (21st.dev Restaurant Menu Block). Hours, location and phone are rows with the action at the end of the row (DoorDash store info, Refero set 1). Take Out and Catering form a segmented control on an inset track (21st.dev Segmented Control). The logo is the only loud thing.

## B. Roadside Sign

The page wears the sign. Navy hero with the yellow headline and a yellow button. Section labels are red ribbons with notched ends, cut from the logo’s ribbon. Menu cards sit on a Plank band. Prices turn yellow on navy.

## Against the eight criteria

| # | Criterion | A. Menu Board | B. Roadside Sign |
| --- | --- | --- | --- |
| 1 | Open, call, go on a phone | Pass. Hours, address and phone rows start 294 px down | Pass, barely. The info rows start 622 px down on an 844 px screen, under the photo |
| 2 | Menu scans like paper | Pass. Dotted leaders tie each name to its price | Partial. Rows work, but long gaps between name and price on desktop |
| 3 | Their words only | Pass | Pass |
| 4 | Logo untouched | Pass. Holds on cream at 110 and 32 px | Partial. On the navy avatar the sign’s navy frame dissolves, and at 32 px it reads as a yellow smudge |
| 5 | Color in order | Pass. Accents under 2% | Fail. The red ribbon sits on navy at 1.94:1, the vibrating edge from color finding 1. Red ribbon and yellow headline stack at similar size |
| 6 | Credible for a wedding | Pass | Partial. Loud for a couple reading the catering menu |
| 7 | Ownable on Route 302 | Partial. Rules and leaders are common menu language. Without the logo it could be any menu board | Pass. The ribbon is unmistakably this sign |
| 8 | Easy to keep | Pass | Pass |

## Recommendation: A, signed with B’s ribbon

A passes seven and is partial on one. B fails color and is partial on three. B’s one strength is ownability, and it comes from the ribbon. So the ribbon moves into A under three rules:

1. **Light grounds only.** Red on Cream or Plank is 7.3:1 at the edge, and cream text on red is 7.7:1. Never red on navy.
2. **Once per screen.** It marks one thing: the services line under the headline, the selected menu’s name, or a printed menu’s title. Section headings keep A’s ruled frame.
3. **Never next to yellow at similar size.** Yellow stays on navy (footer closer, share card), red stays on light.

That makes A partial on nothing: it keeps the menu-board reading and gains the sign’s one ownable device. The pressure test (`03-pressure-test.md`) checks this combined version against the Refero screens.

To choose B instead, the color rules would need an exception for red on navy, and the avatar would need a cream ground.

## Decision, October 7, 2026

The client chose Concept A and asked for clearer text hierarchy and fewer AI giveaways. Two changes followed. The ribbon left the web page: under the headline it read as a badge, a common generated pattern. Ownability now comes from Coustard, a Clarendon that matches the logo (`04-type-study.md`, round two). See `06-hierarchy.md`.
