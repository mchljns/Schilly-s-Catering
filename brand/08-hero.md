# Hero construction

## Best practice, with sources

1. **Say what and where at once.** A headline that is a slogan needs a line that states the offer. Users judge a page within seconds, and most visits to a restaurant site last 5 to 10 seconds unless they open the menu.
2. **Hours, location, phone and menu without scrolling.** The most common restaurant-site failure is hiding these.
3. **One primary action.** One solid button in the hero. Secondary actions are links.
4. **The fold still matters.** NN/g measured an 84% difference in how people treat content above and below the fold (The Fold Manifesto). Put the decisions above it.
5. **Avoid the illusion of completeness.** Don’t end the hero on a hard edge that looks like the end of the page. Let the next section show (NN/g).
6. **No carousels.** Auto-forwarding carousels hide content and annoy users (NN/g).
7. **A real photo, not text over a busy photo.** Text set beside the image stays readable and lets the food carry the look.
8. **Load the hero first.** The hero usually holds the Largest Contentful Paint. Aim for 2.5 s or less, and use `fetchpriority="high"` on the hero image with a responsive `srcset` and a preload (web.dev).
9. **Headline as text, not an image,** so it is readable, searchable and paints before the photo.

## Schilly’s hero against the list

| # | Status | How |
| --- | --- | --- |
| 1 | Pass | SMOKED. HOMEMADE. MAINE., then "Take Out • Family Meals • Catering" in bold at lead size |
| 2 | Pass | Hours with an open or closed status, address with Get directions, phone with Call. On phones they start at 344 to 356 px down |
| 3 | Pass after this round | View Our Menu is the one solid red button. The header’s Catering Inquiries changed from solid red to an outline so the two don’t compete |
| 4 | Pass | Everything through View Our Menu sits on the first screen at 360 × 740 and 1280 × 900 |
| 5 | Pass | On phones the photo starts at the bottom of the first screen. On desktop the section rule below the hero shows the page continues |
| 6 | Pass | One photo, no slider |
| 7 | Pass | Text and photo side by side on desktop, stacked on phones |
| 8 | Pass | `fetchpriority="high"`, preload with `imagesrcset`, WebP at 640, 900 and 1200 px |
| 9 | Pass | Live text in Solway |

## Sources

- NN/g, The Fold Manifesto: https://www.nngroup.com/articles/page-fold-manifesto/
- NN/g, The Illusion of Completeness: https://www.nngroup.com/videos/illusion-completeness/
- NN/g, Scrolling and Attention: https://www.nngroup.com/articles/scrolling-and-attention/
- web.dev, Optimize Largest Contentful Paint: https://web.dev/articles/optimize-lcp
- web.dev, Fetch Priority: https://web.dev/articles/fetch-priority
- Restaurant site checklists (hours, location, phone above the fold; 5 to 10 second visits): https://bellaworksweb.com/restaurant-website-design/, https://chowly.com/resources/blogs/restaurant-website-design-7-elements-of-a-high-converting-restaurant-website/
