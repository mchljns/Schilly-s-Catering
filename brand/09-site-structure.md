# Site structure for search and answer engines

The single page became seven pages, one for each part of the business, on the same URLs the current site uses. Built by `build.mjs` into `dist/`.

## Pages

| URL | H1 | Indexed | Structured data | What it answers |
| --- | --- | --- | --- | --- |
| `/` | SMOKED. HOMEMADE. MAINE. | Yes | Restaurant (address, hours, phone, menus, Instagram, Facebook) | Who, where, when, how to call |
| `/take-out-menu/` | TAKE OUT KITCHEN MENU | Yes | Menu: 8 sections, 41 items, all with USD prices | "How much is a BBQ plate at Schilly's?" |
| `/catering-menu/` | CATERING MENU | Yes | Menu: 6 sections, 59 items | "Does Schilly's cater boxed lunches?" |
| `/weddings/` | WEDDINGS | Yes | Service: Wedding Catering | Wedding photo, platters and desserts from their catering menu, inquiry |
| `/catering-inquiries/` | LET’S PLAN YOUR EVENT | Yes | ContactPage | The inquiry form |
| `/lobster-bakes/` | LOBSTER BAKES | No (`noindex, follow`) | Service | Their one line and the way to ask |
| `/pig-roasts/` | PIG ROASTS | No (`noindex, follow`) | Service | Same |

Every page has a unique title and description, a canonical URL, Open Graph tags, breadcrumbs (visible and as BreadcrumbList) and the same hours, address and phone. Name, address and phone must match the Google Business Profile exactly: `224 Roosevelt Trail, Casco, ME 04015` and `(207)693-8840`.

## Decisions

1. **Menus are HTML, not JavaScript.** The single page drew menus in the browser, so crawlers that don't run scripts saw no items. Now every item and price is in the page source and in the Menu structured data.
2. **Same URLs as today.** `/take-out-menu`, `/catering-menu`, `/catering-inquiries`, `/lobster-bakes`, `/pig-roasts` and `/weddings` keep any links and rankings they have. `_redirects` adds the trailing slash, and sends `/home`, `/menus` and the dead `/what-they-are-saying` to the home page.
3. **Thin pages stay out of the index.** Lobster Bakes and Pig Roasts have one sentence each on Schilly’s site. Indexing near-empty pages can weigh on the whole site, so they are `noindex, follow` and left out of the sitemap. When Schilly’s sends those menus, set `index: true` for the page in `build.mjs` and add the content. Nothing else changes.
4. **Weddings is indexed.** It has their wedding photo and the catering sections that suit a wedding, labeled as the catering menu, so the page claims nothing their menu doesn't.
5. **No invented FAQ.** FAQ markup would help answer engines, but the questions and answers would be new copy. Add it when Schilly’s answers real questions (catering lead time, how to order take out).
6. **AEO files.** `llms.txt` summarizes the business and links every page. `llms-full.txt` has both menus with every item and price in plain text.
7. **Structured data is checked like copy.** `check-content` reads every human-readable string in the JSON-LD and traces it to Schilly’s site. That's how "Barbecue" became "BBQ", their word.

## What would help search most from here

1. Lobster bake and pig roast menus (unlocks two pages).
2. The same hours, address and phone on the Google Business Profile, Facebook and Instagram.
3. A short answer to "how far ahead should I book catering?" and "how do I order take out?" These become visible FAQ content with FAQPage markup.
4. Photos from Instagram, with descriptions, for each page.
