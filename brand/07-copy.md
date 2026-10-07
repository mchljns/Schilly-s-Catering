# Copy: removing the AI feel without writing new copy

The site may only use Schilly’s own words (`source/`). So the copy edit is subtractive: we cut, and we never add or reword. Every line on the page is still a stretch of their text, and `check-content` proves it.

## What made the copy read as AI-written

| Tell | Where it showed up |
| --- | --- |
| The same "From X to Y" opener, four times | "From take out favorites and family-size meals to full-service catering…", "From intimate gatherings to unforgettable celebrations…", "From Our Smoker to Your Celebration", "From family dinner to your biggest celebration…" |
| Lists of three as filler | "menu options, availability, and the details that will make it special" |
| Stock warmth | "We’d love to hear from you", "we’d love to create something for your event", "there’s a little something for everyone" |
| Rhetorical question openers | "Interested in our Lobster Bakes, Pig Roasts, or Wedding Catering?" |
| Inflated adjectives | "unforgettable celebrations", "make it special" |
| A line that repeats the headline | "Slow smoked favorites, homemade comfort food & Maine hospitality" under SMOKED. HOMEMADE. MAINE. |
| Stale notices | "MORE CATERING OPTIONS COMING SOON!", "& So much More" |

## The edits

| Where | Before (theirs) | After (still theirs, cut) |
| --- | --- | --- |
| Hero | Take Out • Family Meals • Catering / Slow smoked favorites, homemade comfort food & Maine hospitality. | Take Out • Family Meals • Catering |
| Our Menus | From take out favorites and family-size meals to full-service catering, there’s a little something for everyone at Schilly’s. | (cut: the Take Out and Catering switch says it) |
| Catering intro | From intimate gatherings to unforgettable celebrations, Schilly’s brings homemade Maine flavor to your table. | (cut) |
| Catering line | Weddings • Backyard BBQs • Corporate Events • Private Parties & So much More | Weddings • Backyard BBQs • Corporate Events • Private Parties |
| Catering close | MORE CATERING OPTIONS COMING SOON! We’re continuing to update our online catering menu. Looking for something you don’t see? Give us a call — we’d love to create something for your event. | Give us a call. [(207)693-8840] |
| A Taste of Schilly’s | From Our Smoker to Your Celebration | (cut: the photos say it) |
| Events | Interested in our Lobster Bakes, Pig Roasts, or Wedding Catering? We’d love to hear from you. Reach out today for menus, availability, and more information. | Reach out today for menus. |
| Inquiry | Tell us a little about your event and we’ll be in touch to discuss menu options, availability, and the details that will make it special. | Tell us a little about your event and we’ll be in touch. |
| Footer | From family dinner to your biggest celebration, let Schilly’s do the cooking. | Let Schilly’s do the cooking. |
| Meta description | Slow smoked favorites, homemade comfort food & Maine hospitality… | Take Out • Family Meals • Catering. 224 Roosevelt Trail, Casco, ME 04015. Wednesday - Sunday 11 am - 6pm. (207)693-8840. |

Kept as written: SMOKED. HOMEMADE. MAINE., HUNGRY YET?, every menu item and note, and the form labels. The menus are plain and specific already.

## Slop filter result, October 7

Every visible string was pulled from the rendered page (both menus, 225 strings) and checked against the stop-slop rules: adverbs, passive voice, rhetorical setups, lists of three, filler, stock warmth, em dashes, exclamations and quotables.

**Failed and fixed (by cutting):**
- "Looking for something you don’t see? Give us a call." was a rhetorical-question setup. Now "Give us a call."
- "Reach out today for menus, availability, and more information." was a list of three with a filler tail. Now "Reach out today for menus."

**Flagged and kept, with reasons:**
- **HUNGRY YET?** A question as a headline, answered by "Let Schilly’s do the cooking." It is Schilly’s most characterful line and reads as a person talking. Keep unless the owner wants it gone.
- **A TASTE OF SCHILLY’S.** A familiar phrase, but short and plain. The alternative is no heading over the photos.
- **"Platters serve approximately 10–12 people."** "Approximately" is an adverb, but it carries information: it's a serving estimate, not filler.
- **"Tell us a little about your event…"** "A little" softens, but it sounds like the owner and lowers the bar to start an inquiry.
- **Food-safety and price notices.** Legal wording, kept verbatim and exempt.
- **Menu descriptions.** Ingredient lists are inventory, not rhetorical lists of three. Exempt.

**Score (stop-slop rubric, prose lines only):** Directness 9, Rhythm 8, Trust 9, Authenticity 8, Density 9. Total 43 out of 50. The rubric's revise threshold is 35.

**Enforced:** `qa/check-content.mjs` now runs a prose filter on every visible sentence of four words or more. It fails on rhetorical setups, "From X to Y" openers, filler tails ("and more information", "so much more"), stock warmth ("we’d love", "unforgettable", "make it special", "something for everyone"), em dashes, exclamations and "coming soon". Tested by restoring both old lines: the gate failed on each, then passed.

## For the owner

These are cuts of your own sentences, not new wording. If you’d like any line back in full, it’s one edit in `index.html` or `assets/menu-data.js`. Two things only you can add, and both would do more than any copy polish: how far ahead to book catering (DoorDash catering stores state it plainly), and how people order take out (call ahead, walk in, or both).
