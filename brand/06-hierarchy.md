# Text hierarchy and AI giveaways

The client approved Concept A and asked for clear hierarchy decisions, and for best practice on captions, eyebrow text and other patterns that mark a page as AI-made.

## Patterns that give a page away, and what Schilly's does instead

| Pattern | Why it reads as AI-made | Schilly's rule |
| --- | --- | --- |
| Eyebrow: a small tracked-capitals label above a headline ("OUR STORY", "WHY US") | The default section opener of generated landing pages. It repeats what the heading says | No eyebrows. Headings start sections |
| Tracked uppercase micro-labels on everything: nav, buttons, chips, field labels, fact labels | A CSS habit (`uppercase; letter-spacing: .1em; 12px`) applied site-wide, so every label looks like a badge | Labels keep the case Schilly's wrote ("View Our Menu", "Business Hours", "Store Phone #"), normal tracking, 16 to 18 px. Capitals only where their copy is in capitals |
| Heading plus a muted grey subheading under every section | The generated "section header" component, same rhythm everywhere | Their second lines are kept, but set at full text color as part of the section, not as a grey subtitle |
| Pill or ribbon badge right under the hero headline | A "tagline chip" pattern | The services line is plain text at the lead size. The ribbon is kept for printed menus and social posts, where the logo's ribbon is the reference |
| Captions under photos describing what's in them ("Our famous brisket") | Filler that restates the photo, often with invented claims | No captions. Alt text describes the photo for screen readers |
| Everything centered | Generated pages center every block | Left-aligned reading. Centering only inside the printed-menu frame (section titles and notes) |
| Too many sizes and weights | Each component sets its own | Six sizes, two weights per face, listed below |
| Icon rows, feature grids, stat counters, testimonial cards | Stock structure filled with invented proof | None. The page has their menu, their photos and their facts |
| Gradient text, glows, glass, floating images | Decoration with no job | None |

## Case

Capitals belong to the Solway levels: the headline, section titles and menu section titles, which Schilly’s already writes in capitals. Text that Schilly’s typed in capitals but that sits at body size (the section rail, platter names such as CHARCUTERIE BOARD) is set in title case. The words and their order don’t change, only the case. BBQ, BLT and GF stay capitalized.

## The scale

| Level | Face | Desktop | Phone | Used for |
| --- | --- | --- | --- | --- |
| Display | Solway 800 | 76 px, line 0.98 | 11% of the screen width: 40 px at 360, 43 px at 390 ("HOMEMADE." must fit one line) | The one headline |
| Title | Solway 800 | 36 px | 28 px | Section titles: OUR MENUS, A TASTE OF SCHILLY’S, events, LET’S PLAN YOUR EVENT, HUNGRY YET? |
| Menu title | Solway 800 | 26 px | 22 px | Menu section titles in the ruled frame |
| Lead | Radio Canada 400 | 22 px, line 1.45 | 19 px | The services line, the hero line, section second lines |
| Body | Radio Canada 400 and 700 | 18 px, line 1.6 | 17 px | Text, item names (700), facts, buttons (700), nav (700) |
| Small | Radio Canada 400 | 16 px | 16 px | Item details, field labels, notes. 14 px only for the copyright line |

Each step is about 1.25 to 1.5 times the one below it, so levels never blur. Prices sit at body size in Solway 800, Ribbon Red.

## Enforced

`qa/check-content.mjs` fails on: `text-transform: uppercase`, letter-spacing over 0.02em on body text, `<figcaption>`, eyebrow or kicker class names, and more than one `<h1>`.
