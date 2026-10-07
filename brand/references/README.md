# References: Refero screens and 21st.dev components

Pulled October 7, 2026. We borrow principles and behaviour. We don't copy any brand's look, and we don't install components: 21st.dev code is React and Tailwind, and this site is plain HTML with no build step, so patterns are rebuilt in the site's own code.

## Refero

Search ran against Refero's web index (22 food queries, then site-by-site). Refero is mostly software and retail. Out of 434 indexed sites, 32 relate to food, and none are small takeout or catering kitchens. So the sets lean on the two places Schilly's customers already read menus and hours (delivery apps and local listings) and on small food brands with a voice.

**Set 1, ordering and local listings** (`refero-set1-ordering.jpg`): Uber Eats store page, DoorDash catering store (Wise Son's Deli Catering), DoorDash store info sheet (The Melt), Yelp business page, Tripadvisor restaurant page, Google Maps local results, Starbucks home and menu item.

**Set 2, small food brands** (`refero-set2-food-brands.jpg`): The Dinner Ladies (home and dinner boxes), Douze (contact form), Blue Apron (meal kits), Kitchen Stories, Volkshotel (directions page).

| What we saw | Where | What Schilly's does with it |
| --- | --- | --- |
| Open state and today's hours on one line: "Closed 11:00 AM - 9:00 PM", "Open · Closes 8PM" | Yelp, Google Maps | One status line under Business Hours: "Open now · until 6 pm" or "Closed · opens …" |
| Store info as a short list of rows: address, open state, website, phone, each with its action at the row's end | DoorDash store sheet | Hours, Location and Phone become three rows, each with one action (Get directions, Call) on the right |
| Lead time stated plainly in store info ("Min 36 hrs order ahead") | DoorDash catering store | Noted. Schilly's site states no lead time, so we add none. Flag for the owner |
| Two order modes as a small segmented control (Delivery · Pickup) | Uber Eats, DoorDash, Yelp | Take Out and Catering as a two-segment control on an inset track, not two big cards |
| Menu sections in a sticky left rail on desktop, chips on phones | Uber Eats, DoorDash | Desktop: section rail beside the menu. Phones: chip row under the header |
| Section titles framed by hairline rules, heavy condensed capitals, boxed category tabs on a warm cream ground | The Dinner Ladies | Menu section headings between two rules, like a printed menu board |
| One loud color reserved for the cart and buttons | The Dinner Ladies, DoorDash | Ribbon Red stays for actions and prices only |
| A calm form of outlined fields, one column, generous height | Douze | Inquiry form keeps outlined 48 px fields, labels above |
| Signage photography and label tags carry the identity | Volkshotel | Schilly's photos carry the page. No illustration, no stock |

**Kept out:** star ratings and review counts (Schilly's has none on its site), promo banners, carts, delivery fees, map embeds (heavy, and a link does the job), mascots and hand lettering beyond the logo itself.

## 21st.dev

Searched: restaurant menu with prices, opening hours and location card, sticky category navigation, segmented control, inquiry form, photo gallery, restaurant hero, footer. Previews are on cdn.21st.dev, which this machine can't reach, so we judged components by their code and descriptions. The free tier allows two code retrievals a day.

| Component | Taken | Left |
| --- | --- | --- |
| **Scroll Spy** (ddoemonn), code retrieved | Active section decided by a reading line that slides toward the bottom as you near the page end, so short last sections still light up. Its demo calls this "the one every hand-rolled spy forgets to light", and our previous IntersectionObserver version had exactly that bug. Click sets the section and holds it until the scroll settles. Active chip scrolls into view with `block: nearest`. `aria-current="location"` on the active link | Spring-animated sliding pill (needs Motion/React). We change color only |
| **Segmented Control** (ddoemonn), code retrieved | Inset track holding equal-width segments, filled selection, arrow keys plus Home and End, roving tabindex | Sliding thumb animation and masked label layer |
| **Restaurant Menu Block** (olewandowski1), description only, code locked by quota | Dotted leader line from dish name to price, the printed-menu convention | Course groupings that Schilly's menu doesn't have |
| Contact Form (kevingirelli) | Pending, success and error states inside the form | Card wrapper |
| Footer With Newsletter (balick) | An operational status indicator in the footer, reused as the open or closed line | Newsletter form, oversized wordmark |
| Floating Food Hero, Location Card (3D tilt), Expanded Map, 3D Parallax Gallery, Masonry Lightbox | Nothing | Floating or tilting images, parallax, and lightboxes are decoration. They add JavaScript and motion and don't help anyone order |

## Round 2 (October 7, 2026): premium patterns against blockiness

The first build read as blocky: every section a rectangle inside the 1200 px container, one 6 px radius everywhere, one 64 px spacing value, a filled navy hero with yellow type. This round rebuilt the home page from these patterns (metadata and descriptions; 21st.dev code quota was spent, previews are blocked here; Refero serves only an app shell to this machine).

| Pattern | Source | Rebuilt as |
| --- | --- | --- |
| Editorial image hero, panel overlapping a full-bleed photo | 21st.dev hero-07 and hero-05 (felipemenezes098), hero-carousel (crafterui) | Brisket photo at 100 vw × 70 vh; a cream panel overlaps its lower-left by 136 px with the navy headline, services line and one red button. Gold is a 1 px rule on the panel. Yellow is retired from the web page |
| Facts as one ruled line | logo-cloud-16 (ln-dev7), DoorDash store sheet | Hours with live status, address with Get directions, phone, between a navy rule and a hairline |
| Prices as typographic objects | menu-1 (olewandowski1), editorial-testimonial (jatin-yadav05) | Home menu prices in Solway at up to 2 rem, `$` as a small superscript; items split by hairlines; 7/4 column split with a 1 px navy column rule |
| One big typographic moment | cta69 (ziegfiroyt) | Their own line "Slow smoked favorites, homemade comfort food & Maine hospitality." at up to 4.25 rem under a gold rule, 120 px of air above |
| Horizontal photo strip at natural proportions | motion-scroll-horizontal, horizontal-scroll-gallery (strip only, no pinning) | Photos keep their own shapes, scroll sideways, bleed to both edges, snap; themed scrollbar |
| Two offset images | hero-04 editorial collage (felipemenezes098) | Events block: 12-column grid, the chef photo spans 7 columns, a second photo overlaps from column 6 when a placeholder exists, the three event names as a ruled list |
| Large wordmark footer | footer-with-suite (scrollxui), large-name-footer (arihantcodes) | "SCHILLY’S" in Solway up to 15 rem, cropped by the page's bottom edge, muted blue on navy (3.3:1) |

Refused this round: marquee/ticker (motion for its own sake), parallax, pinned scroll, carousels, gradient overlays on photos, wood or paper textures from CSS noise, kicker labels, section numbers, same-size cards.
