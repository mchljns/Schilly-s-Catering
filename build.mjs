// Builds the static site into dist/ (production, clean URLs) and preview/ (index.html links,
// for opening straight from GitHub through raw.githack). No dependencies.
//
//   node build.mjs
//
// Every visible word comes from brand/source/ (Schilly's own site) or brand/source/ui-labels.txt.
// qa/check-content.mjs enforces that on every page listed in dist/pages.json.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { MENUS } from "./src/data/menus.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const SITE = {
  name: "Schilly’s Take Out & Catering Kitchen",
  url: "https://schillyscatering.com",
  phone: "(207) 693-8840",
  tel: "+12076938840",
  street: "224 Roosevelt Trail",
  town: "Casco, ME 04015",
  days: "Wednesday – Sunday",
  time: "11 am – 6 pm",
  maps: "https://www.google.com/maps/search/?api=1&query=224+Roosevelt+Trail+Casco+ME+04015",
  instagram: "https://www.instagram.com/schillyseats",
  facebook: "https://www.facebook.com/share/1DnxQNy3wD/",
  updated: new Date().toISOString().slice(0, 10),
};
const ID = SITE.url + "/#restaurant";

/* ---------- draft copy ----------
   Example copy written for the spec site where Schilly's own site has none. Every line is listed in
   brand/source/draft-copy.txt and carries data-draft in the HTML, so the owner can confirm or replace it.
   Facts in here (lead times, service area, what goes in a lobster bake) are assumptions until confirmed. */
const DRAFT = {
  homeDesc: "BBQ take out, family meals and catering in Casco, Maine. Smoked brisket, pulled pork and pulled chicken with homemade sides, Wednesday to Sunday.",
  events: "Lobster bakes, whole pig roasts and wedding spreads, cooked by the same kitchen that smokes our brisket every day. Tell us the date and the headcount and we’ll plan the menu with you.",
  takeout: "Call ahead and we’ll have it ready when you get here, or stop in and order.",
  catering: "Pick from the menu below, then tell us the date, the place and about how many people. We’ll put together a quote and walk through the details with you.",
  lobster: [
    "A Maine lobster bake for your backyard, camp or company outing: lobsters, steamers, corn on the cob and red potatoes, cooked together and served hot.",
    "Tell us where you’re hosting and how many you’re feeding. We’ll build the menu around the bake, with sides and dessert from our kitchen.",
  ],
  pig: [
    "A whole pig, slow roasted until it pulls apart, served with the sides people already drive to Casco for: white cheddar mac & cheese, BBQ beans, coleslaw and cornbread.",
    "Good for graduation parties, family reunions, company cookouts and anything else with a long guest list.",
  ],
  weddings: [
    "Wedding catering from the same kitchen that smokes our brisket every day. Start with grazing boards and platters at cocktail hour, sit down to a smoked BBQ dinner, and finish with Maine blueberry cake.",
    "We cater rehearsal dinners and receptions around Sebago Lake and the Lakes Region.",
  ],
  faq: [
    ["How far ahead should I book?", "Two to four weeks is usually enough for a party or an office lunch. For summer weekends and weddings, book as early as you can."],
    ["How many people does a platter feed?", "Platters serve approximately 10–12 people."],
    ["Where do you cater?", "We’re on Roosevelt Trail in Casco and cater events around Sebago Lake and the Lakes Region."],
    ["Do you deliver and set up?", "Drop-off, buffet setup and full service can all be arranged. Tell us what you need in your inquiry."],
    ["Do you have gluten-free or vegan options?", "Yes. The Black Bean Burger is gluten-free and vegan, and most salads and platters can be adjusted. Ask when you inquire."],
  ],
};
const draft = (t, tag = "p", cls = "") => `<${tag}${cls ? ` class="${cls}"` : ""} data-draft>${esc(t)}</${tag}>`;


/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Capitals belong to Solway headings (brand/06-hierarchy.md). Body-size text that Schilly's typed
// in capitals is set in title case: same words, same order.
const KEEP = new Set(["BBQ", "BLT", "GF", "GF*", "OR"]);
const SMALL = new Set(["or", "and", "with", "of", "to", "a", "on"]);
function titleCase(t) {
  const caps = t.split(/\s+/).every((w) => w.replace(/[^A-Za-z]/g, "").length <= 3 || w === w.toUpperCase());
  if (!caps) return t;
  return t.split(" ").map((w, i) => {
    if (KEEP.has(w) && w !== "OR") return w;
    const l = w.toLowerCase();
    if (i > 0 && SMALL.has(l)) return l;
    return l.replace(/(^|[(“"&-])([a-z])/g, (m, a, b) => a + b.toUpperCase());
  }).join(" ");
}
const price = (p) => (p && /^\$\d/.test(p) ? p.replace("$", "") + ".00" : null);

/* ---------- pages ---------- */
// path: URL path without leading slash ("" is home). index: false keeps a page out of search
// until Schilly's publishes real content for it (thin pages hurt the whole site).
const PAGES = [
  { key: "home", path: "", label: "Home", title: `${SITE.name} · Casco, ME`, h1: "SMOKED. HOMEMADE. MAINE.",
    desc: DRAFT.homeDesc, index: true, priority: "1.0" },
  { key: "takeout", path: "take-out-menu/", label: "Take Out Menu", title: `Take Out Kitchen Menu · ${SITE.name} · Casco, ME`, h1: "TAKE OUT KITCHEN MENU",
    desc: "BBQ Plates • White Cheddar Mac & Cheese • Family Size Portions • Sandwiches • Specialty Beef Hot Dogs • Sides • Dessert. Prices include Maine State Sales Tax.", index: true, priority: "0.9" },
  { key: "catering", path: "catering-menu/", label: "Catering Menu", title: `Catering Menu · ${SITE.name} · Casco, ME`, h1: "CATERING MENU",
    desc: "Weddings • Backyard BBQs • Corporate Events • Private Parties. Boxed Lunch • Elevated Boxed Lunches • Boxed Salads • Soups & Crock Favorites • Desserts • Party Platters, Boards & Grazes.", index: true, priority: "0.9" },
  { key: "weddings", path: "weddings/", label: "Weddings", title: `Weddings · ${SITE.name} · Casco, ME`, h1: "WEDDINGS",
    desc: DRAFT.weddings[0], index: true, priority: "0.8" },
  { key: "lobster", path: "lobster-bakes/", label: "Lobster Bakes", title: `Lobster Bakes · ${SITE.name} · Casco, ME`, h1: "LOBSTER BAKES",
    desc: DRAFT.lobster[0], index: true, priority: "0.7" },
  { key: "pig", path: "pig-roasts/", label: "Pig Roasts", title: `Pig Roasts · ${SITE.name} · Casco, ME`, h1: "PIG ROASTS",
    desc: DRAFT.pig[0], index: true, priority: "0.7" },
  { key: "inquiry", path: "catering-inquiries/", label: "Catering Inquiries", title: `Catering Inquiries · ${SITE.name} · Casco, ME`, h1: "LET’S PLAN YOUR EVENT",
    desc: `Catering Inquiries. Tell us a little about your event and we’ll be in touch. ${SITE.phone}.`, index: true, priority: "0.8" },
];
const NAV = ["takeout", "catering", "weddings", "lobster", "pig"];
const byKey = Object.fromEntries(PAGES.map((p) => [p.key, p]));

/* ---------- build context: link and asset paths per output mode ---------- */
function ctx(page, mode) {
  const depth = page.path ? page.path.split("/").filter(Boolean).length : 0;
  const up = "../".repeat(depth);
  const link = (key, hash = "") => {
    const p = byKey[key].path;
    const target = mode === "preview" ? up + p + "index.html" : (up + p) || "./";
    return target + hash;
  };
  const asset = (f) => (mode === "preview" ? "../".repeat(depth + 1) + "dist/assets/" + f : up + "assets/" + f);
  return { page, mode, link, asset, canonical: SITE.url + "/" + page.path };
}

/* ---------- shared pieces ---------- */
const logoImg = (c, extra = "") =>
  `<img src="${c.asset("img/logo-240.webp")}" srcset="${c.asset("img/logo-240.webp")} 240w, ${c.asset("img/logo-480.webp")} 480w" sizes="(min-width: 900px) 200px, 150px" width="240" height="119" alt="${esc(SITE.name)}"${extra}>`;

function header(c) {
  const cur = (k) => (c.page.key === k ? ' aria-current="page"' : "");
  const links = NAV.map((k) => `<a href="${c.link(k)}"${cur(k)}>${byKey[k].label}</a>`).join("\n          ");
  return `<header class="site-header">
    <div class="wrap header-inner">
      <a class="logo" href="${c.link("home")}">${logoImg(c)}</a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav class="nav" id="site-nav" aria-label="Main">
          ${links}
          <a class="btn btn-quiet nav-cta" href="${c.link("inquiry")}"${cur("inquiry")}>Catering Inquiries</a>
      </nav>
      <div class="quick" aria-label="Main">
        <a href="${c.link("takeout")}"${cur("takeout")}>Take Out Menu</a>
        <a href="${c.link("inquiry")}"${cur("inquiry")}>Catering Inquiries</a>
      </div>
    </div>
  </header>`;
}

const facts = (c, opts = {}) => `<dl class="facts${opts.compact ? " facts-compact" : ""}">
            <div class="fact">
              <dt>Business Hours</dt>
              <dd><span class="fact-main">${SITE.days} · ${SITE.time}</span><span class="open-status" hidden></span></dd>
            </div>
            <div class="fact">
              <dt>Location</dt>
              <dd><span class="fact-main">${SITE.street}<br>${SITE.town}</span><a class="fact-action" href="${esc(SITE.maps)}">Get directions</a></dd>
            </div>
            <div class="fact">
              <dt>Store Phone #</dt>
              <dd><a class="fact-main" href="tel:${SITE.tel}">${SITE.phone}</a><a class="fact-action" href="tel:${SITE.tel}">Call</a></dd>
            </div>
          </dl>`;

function footer(c) {
  const formPage = ["inquiry", "lobster", "pig", "weddings"].includes(c.page.key);
  return `<footer class="site-footer">
    <div class="wrap">
      ${formPage ? "" : `<div class="closer">
        <h2>Hungry yet?</h2>
        <p>Let Schilly’s do the cooking.</p>
        <a class="btn btn-cream" href="tel:${SITE.tel}">${SITE.phone}</a>
      </div>`}
      <div class="footer-grid">
        <div>
          <h2 class="f-label">Business Hours</h2>
          <p>${SITE.days}<br>${SITE.time}</p>
        </div>
        <div>
          <h2 class="f-label">Location</h2>
          <p>${SITE.street}<br>${SITE.town}</p>
        </div>
        <div>
          <h2 class="f-label">Store Phone #</h2>
          <p><a href="tel:${SITE.tel}">${SITE.phone}</a></p>
        </div>
        <nav class="footer-nav" aria-label="Footer">
          ${NAV.map((k) => `<a href="${c.link(k)}">${byKey[k].label}</a>`).join("\n          ")}
          <a href="${c.link("inquiry")}">Catering Inquiries</a>
          <a href="${SITE.instagram}">Instagram</a>
          <a href="${SITE.facebook}">Facebook</a>
        </nav>
      </div>
      <p class="copyright">© <span class="year">2026</span> ${SITE.name}.</p>
    </div>
    <div class="footer-sign" aria-hidden="true"><img src="${c.asset("img/logo-960.webp")}" width="960" height="477" alt="" loading="lazy" decoding="async"></div>
  </footer>`;
}

/* ---------- menus ---------- */
function menuSection(menu, sec, catering) {
  const id = menu.id + "-" + slug(sec.title);
  const notes = sec.notes ? `<div class="sec-notes">${sec.notes.map((n) => `<p>${esc(n)}</p>`).join("")}</div>` : "";
  const items = sec.items.map(([name, p, detail]) => {
    const search = esc([name, detail, sec.title].filter(Boolean).join(" ").toLowerCase());
    const priceHtml = p ? `<span class="leader" aria-hidden="true"></span><span class="item-price">${esc(p)}</span>` : "";
    return `<li class="item" data-search="${search}"><div class="item-text"><p class="item-name">${esc(titleCase(name))}</p>${detail ? `<p class="item-detail">${esc(detail)}</p>` : ""}</div>${priceHtml}</li>`;
  }).join("\n");
  const group = sec.group ? `<p class="menu-group">${esc(titleCase(sec.group))}</p>` : "";
  return `${group}<section class="menu-sec" id="${id}" aria-labelledby="${id}-h">
<h2 class="ruled" id="${id}-h" tabindex="-1">${esc(titleCase(sec.title))}</h2>${notes}
<ul class="items">
${items}
</ul></section>`;
}

function fullMenu(c, menu, catering) {
  const spy = menu.sections.map((s) => `<a href="#${menu.id}-${slug(s.title)}">${esc(titleCase(s.title))}</a>`).join("\n");
  const switcher = `<div class="seg" role="navigation" aria-label="OUR MENUS">
              <a class="seg-opt" href="${c.link("takeout")}"${catering ? "" : ' aria-current="page"'}>Take Out &amp; Family Meals</a>
              <a class="seg-opt" href="${c.link("catering")}"${catering ? ' aria-current="page"' : ""}>Catering Menu</a>
            </div>`;
  const foot = [];
  if (menu.closing) foot.push(`<p>${esc(menu.closing.text)}</p><a class="btn btn-red" href="tel:${SITE.tel}">${SITE.phone}</a>`);
  (menu.footnotes || []).forEach((t) => foot.push(`<p>${esc(t)}</p>`));
  return `<div class="menu-layout">
          <aside class="menu-side">
            ${switcher}
            <nav class="spy" id="menuJump" aria-label="${esc(menu.title)}">
${spy}
            </nav>
            <label class="search">
              <span class="visually-hidden">Search the menu</span>
              <input id="menuSearch" type="search" placeholder="Search the menu" autocomplete="off">
            </label>
            <button class="btn btn-quiet print-btn" type="button" data-print>Print menu</button>
            <figure class="rail-photo">${catering ? PHOTO.grazing(c) : PHOTO.smoker(c, "250px")}</figure>
          </aside>
          <div class="menu-panel" id="menu-panel">
            <div id="menuList" class="${catering ? "is-catering" : "is-takeout"}">
${menu.sections.map((s) => menuSection(menu, s, catering)).join("\n")}
            </div>
            <p class="menu-empty" id="menuEmpty" hidden>No matches</p>
            <div class="menu-foot">${foot.join("")}</div>
          </div>
        </div>`;
}

/* ---------- structured data ---------- */
function restaurantLD() {
  return {
    "@type": "Restaurant", "@id": ID, name: SITE.name, url: SITE.url + "/",
    logo: SITE.url + "/assets/img/logo-960.webp", image: SITE.url + "/assets/img/og-image.jpg",
    telephone: "+1-207-693-8840", slogan: "SMOKED. HOMEMADE. MAINE.",
    address: { "@type": "PostalAddress", streetAddress: SITE.street, addressLocality: "Casco", addressRegion: "ME", postalCode: "04015", addressCountry: "US" },
    openingHoursSpecification: [{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], opens: "11:00", closes: "18:00" }],
    servesCuisine: ["BBQ"],
    hasMenu: [SITE.url + "/take-out-menu/", SITE.url + "/catering-menu/"],
    sameAs: [SITE.instagram, SITE.facebook],
  };
}
function menuLD(menu, url) {
  return {
    "@type": "Menu", "@id": url + "#menu", name: menu.title, url, inLanguage: "en-US",
    hasMenuSection: menu.sections.map((s) => ({
      "@type": "MenuSection", name: s.title, ...(s.notes ? { description: s.notes.join(" ") } : {}),
      hasMenuItem: s.items.map(([name, p, detail]) => ({
        "@type": "MenuItem", name,
        ...(detail ? { description: detail } : {}),
        ...(price(p) ? { offers: { "@type": "Offer", price: price(p), priceCurrency: "USD" } } : {}),
      })),
    })),
  };
}
function ld(c) {
  const graph = [];
  if (c.page.key === "home") graph.push(restaurantLD());
  else {
    graph.push({ "@type": "Restaurant", "@id": ID, name: SITE.name, url: SITE.url + "/" });
    graph.push({ "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE.url + "/" },
      { "@type": "ListItem", position: 2, name: c.page.label, item: c.canonical },
    ] });
  }
  if (c.page.key === "takeout") graph.push(menuLD(MENUS.takeout, c.canonical));
  if (c.page.key === "catering") graph.push(menuLD(MENUS.catering, c.canonical));
  if (["weddings", "lobster", "pig"].includes(c.page.key)) {
    const name = { weddings: "Wedding Catering", lobster: "Lobster Bakes", pig: "Pig Roasts" }[c.page.key];
    graph.push({ "@type": "Service", name, serviceType: name, provider: { "@id": ID }, url: c.canonical });
  }
  if (c.page.key === "inquiry") graph.push({ "@type": "ContactPage", name: "Catering Inquiries", url: c.canonical, about: { "@id": ID } });
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 1);
}

/* ---------- page bodies ---------- */
const PHOTO = {
  smoker: (c, sizes = "100vw") => `<img loading="lazy" decoding="async" src="${c.asset("img/smoker-1600.webp")}" srcset="${c.asset("img/smoker-800.webp")} 800w, ${c.asset("img/smoker-1600.webp")} 1600w" sizes="${sizes}" width="1600" height="800" alt="Two spits of chickens turning inside the smoker">`,
  brisket: (c, attrs = "") => `<img src="${c.asset("img/brisket-640.webp")}" srcset="${c.asset("img/brisket-640.webp")} 640w, ${c.asset("img/brisket-900.webp")} 900w, ${c.asset("img/brisket-1200.webp")} 1200w" sizes="(min-width: 900px) 52vw, 100vw" width="1200" height="1600" alt="Smoked brisket in a pan with a thermometer reading 192 degrees"${attrs}>`,
  wedding: (c) => `<img loading="lazy" decoding="async" src="${c.asset("img/wedding-chef-832.webp")}" srcset="${c.asset("img/wedding-chef-640.webp")} 640w, ${c.asset("img/wedding-chef-832.webp")} 832w" sizes="(min-width: 900px) 45vw, 100vw" width="832" height="554" alt="Schilly’s chef in an apron with a bride, holding a plate at a wedding">`,
  rotisserie: (c, attrs = ' loading="lazy" decoding="async"') => `<img${attrs} src="${c.asset("img/rotisserie-1200.webp")}" srcset="${c.asset("img/rotisserie-640.webp")} 640w, ${c.asset("img/rotisserie-1200.webp")} 1200w" sizes="100vw" width="1200" height="481" alt="Whole chickens turning on a rotisserie spit">`,
  grazing: (c) => `<img loading="lazy" decoding="async" src="${c.asset("img/grazing-table-640.webp")}" srcset="${c.asset("img/grazing-table-640.webp")} 640w, ${c.asset("img/grazing-table-1086.webp")} 1086w" sizes="(min-width: 900px) 25vw, 60vw" width="1086" height="1448" alt="Charcuterie boards and a vegetable platter on an outdoor table">`,
  salmon: (c) => `<img loading="lazy" decoding="async" src="${c.asset("img/salmon-platter-640.webp")}" srcset="${c.asset("img/salmon-platter-640.webp")} 640w, ${c.asset("img/salmon-platter-1200.webp")} 1200w" sizes="(min-width: 900px) 25vw, 60vw" width="1200" height="1600" alt="Smoked salmon platter on a ring of sliced cucumber">`,
  taste: (c) => `<div class="photos">
          <img class="p-wide" loading="lazy" decoding="async" src="${c.asset("img/rotisserie-1200.webp")}" srcset="${c.asset("img/rotisserie-640.webp")} 640w, ${c.asset("img/rotisserie-1200.webp")} 1200w" sizes="(min-width: 900px) 66vw, 100vw" width="1200" height="481" alt="Whole chickens turning on a rotisserie spit">
          <img class="p-tall" loading="lazy" decoding="async" src="${c.asset("img/grazing-table-640.webp")}" srcset="${c.asset("img/grazing-table-640.webp")} 640w, ${c.asset("img/grazing-table-1086.webp")} 1086w" sizes="(min-width: 900px) 33vw, 50vw" width="1086" height="1448" alt="Charcuterie boards and a vegetable platter on an outdoor table">
          <img class="p-tall" loading="lazy" decoding="async" src="${c.asset("img/salmon-platter-640.webp")}" srcset="${c.asset("img/salmon-platter-640.webp")} 640w, ${c.asset("img/salmon-platter-1200.webp")} 1200w" sizes="(min-width: 900px) 33vw, 50vw" width="1200" height="1600" alt="Smoked salmon platter on a ring of sliced cucumber">
        </div>`,
};

function pageHead(c, lead, more = "") {
  return `<section class="page-head">
      <div class="wrap">
        <h1>${esc(titleCase(c.page.h1))}</h1>
        ${lead ? `<p class="lead">${lead}</p>` : ""}
        ${more}
      </div>
    </section>`;
}

/* Placeholder photos (generated, not Schilly's): used only when the file exists in assets/img, tagged data-placeholder. */
const PLACEHOLDERS = {
  lobster: ["placeholder-lobster-bake", "Lobster bake on kraft paper: lobsters, steamers, corn and potatoes (placeholder photo)", 1536, 1024],
  pig: ["placeholder-pig-roast", "Whole roasted pig on a tray under an event tent (placeholder photo)", 1536, 1024],
  weddings: ["placeholder-wedding-buffet", "Barn wedding buffet with platters of brisket and pulled pork (placeholder photo)", 1536, 1024],
};
function placeholder(c, key, extra = "") {
  const ph = PLACEHOLDERS[key];
  if (!ph || !fs.existsSync(path.join(ROOT, "assets/img", ph[0] + "-1200.webp"))) return "";
  const [n, alt, w, h] = ph;
  return `<img data-placeholder loading="lazy" decoding="async" src="${c.asset(`img/${n}-1200.webp`)}" srcset="${c.asset(`img/${n}-640.webp`)} 640w, ${c.asset(`img/${n}-1200.webp`)} 1200w" sizes="(min-width: 900px) 50vw, 100vw" width="${w}" height="${h}" alt="${esc(alt)}"${extra}>`;
}

function home(c) {
  const bbq = MENUS.takeout.sections[0];
  const fam = MENUS.takeout.sections[2];
  const priceRow = ([name, p]) => `<li><span class="pl-name">${esc(titleCase(name))}</span><span class="pl-price"><sup>$</sup>${esc(p.replace("$", ""))}</span></li>`;
  return `<section class="hero" aria-labelledby="hero-title">
      <div class="wrap hero-grid">
        <div class="hero-copy">
          <h1 id="hero-title">Smoked. Homemade. Maine.</h1>
          <p class="hero-lede">Take Out • Family Meals • Catering</p>
          <a class="btn btn-red hero-cta" href="${c.link("takeout")}">Take Out Menu</a>
          <dl class="facts-line">
            <div><dt>Business Hours</dt><dd>${SITE.days} · ${SITE.time} <span class="open-status" hidden></span></dd></div>
            <div><dt>Location</dt><dd>${SITE.street}, ${SITE.town} <a href="${esc(SITE.maps)}">Get directions</a></dd></div>
            <div><dt>Store Phone #</dt><dd><a href="tel:${SITE.tel}">${SITE.phone}</a></dd></div>
          </dl>
        </div>
        <figure class="hero-photo">${PHOTO.brisket(c, ' fetchpriority="high"')}</figure>
      </div>
    </section>

    <section class="menus-home" aria-labelledby="menus-title">
      <div class="wrap menus-grid">
        <div class="menus-takeout">
          <h2 id="menus-title">Take Out &amp; Family Meals</h2>
          <p class="menus-sub">Smoked favorites • Homemade sides • Family-size portions</p>
          <h3>${esc(titleCase(bbq.title))}</h3>
          <p class="menus-note">${esc(bbq.notes[0])}</p>
          <ul class="price-list">${bbq.items.map(priceRow).join("")}</ul>
          <h3>${esc(titleCase(fam.title))} <span class="menus-note-inline">${esc(fam.notes[0])}</span></h3>
          <ul class="price-list">${fam.items.map(priceRow).join("")}</ul>
          <a class="btn btn-red" href="${c.link("takeout")}">Take Out Menu</a>
        </div>
        <div class="menus-catering">
          <h2>Catering Menu</h2>
          <p class="menus-sub">Weddings • Backyard BBQs • Corporate Events • Private Parties</p>
          <ol class="cat-list">${MENUS.catering.sections.map((s) => `<li><a href="${c.link("catering", "#" + MENUS.catering.id + "-" + slug(s.title))}">${esc(titleCase(s.title))}</a></li>`).join("")}</ol>
          <a class="btn btn-quiet" href="${c.link("catering")}">Catering Menu</a>
        </div>
      </div>
    </section>

    <section class="statement" aria-label="A TASTE OF SCHILLY’S">
      <div class="wrap">
        <p>Slow smoked favorites, homemade comfort food &amp; Maine hospitality.</p>
      </div>
    </section>

    <section class="collage-wrap" aria-labelledby="taste-title">
      <div class="wrap">
        <h2 id="taste-title">A Taste of Schilly’s</h2>
        <div class="collage">
          <figure class="col-a">${PHOTO.rotisserie(c)}</figure>
          <figure class="col-b">${PHOTO.grazing(c)}</figure>
          <figure class="col-c">${PHOTO.salmon(c)}</figure>
          <figure class="col-d">${PHOTO.smoker(c, "(min-width: 900px) 58vw, 100vw")}</figure>
        </div>
      </div>
    </section>

    <section class="events" aria-labelledby="events-title">
      <div class="wrap events-grid">
        <figure class="ev-photo ev-photo-a">${PHOTO.wedding(c)}</figure>
        <div class="ev-text">
          <h2 id="events-title" class="visually-hidden">LOBSTER BAKES • PIG ROASTS • WEDDINGS</h2>
          <ul class="event-rows">
            ${EVENTS.map((k) => `<li><a href="${c.link(k)}">${byKey[k].label}</a></li>`).join("\n            ")}
          </ul>
          ${draft(DRAFT.events, "p", "events-note")}
          <a class="btn btn-red" href="${c.link("inquiry")}">Catering Inquiries</a>
        </div>
      </div>
    </section>`;
}

const menuPage = (c, menu, catering) => `${pageHead(c, esc(menu.sub), draft(catering ? DRAFT.catering : DRAFT.takeout, "p", "page-note"))}
    <section class="menus" aria-label="${esc(menu.title)}">
      <div class="wrap">
        <img class="print-logo" src="${c.asset("img/logo-240.webp")}" width="240" height="119" alt="">
        ${fullMenu(c, menu, catering)}
      </div>
    </section>
    ${catering ? faq(c) : ""}`;

const faq = (c) => `<section class="faq" aria-labelledby="faq-title">
      <div class="wrap narrow-menu">
        <div class="sheet">
          <h2 id="faq-title" class="ruled">Planning an Event</h2>
          <dl class="faq-list">
            ${DRAFT.faq.map(([q, a]) => `<div>${draft(q, "dt")}${draft(a, "dd")}</div>`).join("\n            ")}
          </dl>
          <a class="btn btn-red" href="${c.link("inquiry")}">Catering Inquiries</a>
        </div>
      </div>
    </section>`;

const EVENTS = ["lobster", "pig", "weddings"];

/* Lobster Bakes, Pig Roasts and Weddings. The live site has no menus for these yet ("Reach out today
   for menus"), so each page is built around the inquiry form instead of invented detail. */
function eventPage(c, extra) {
  const others = EVENTS.filter((k) => k !== c.page.key).map((k) => `<li><a href="${c.link(k)}">${byKey[k].label}</a></li>`).join("");
  const side = `<aside class="event-side">
          ${facts(c, { compact: true })}
          <ul class="event-rows small">${others}</ul>
        </aside>`;
  const form = `<section class="inquiry" aria-labelledby="ev-form">
      <div class="wrap inquiry-grid">
        <div class="sheet form-sheet">
          <h2 id="ev-form" class="ruled">Let’s Plan Your Event</h2>
          <p class="sheet-sub">Tell us a little about your event and we’ll be in touch.</p>
          ${inquiryForm(c, byKey[c.page.key].label)}
        </div>
        ${extra.photo ? "" : side}
      </div>
    </section>`;
  const photo = extra.photo ? `<section class="event-body">
      <div class="wrap event-grid">
        <figure class="event-main">${extra.photo}</figure>
        ${side}
      </div>
    </section>` : "";
  return `${pageHead(c, "", (DRAFT[c.page.key] || []).map((t) => draft(t, "p", "page-note")).join(""))}
    ${photo}
    ${extra.after || ""}
    ${form}`;
}

function weddings(c) {
  const secs = MENUS.catering.sections.filter((s) => /PLATTERS|DESSERTS/.test(s.title));
  return eventPage(c, {
    photo: PHOTO.wedding(c),
    after: `<section class="menus" aria-labelledby="wed-menu">
      <div class="wrap narrow-menu">
        <div class="sheet">
          <h2 id="wed-menu" class="ruled">Catering Menu</h2>
          <p class="sheet-sub">Weddings • Backyard BBQs • Corporate Events • Private Parties</p>
          <div class="is-catering">${secs.map((s) => menuSection(MENUS.catering, s, true)).join("\n")}</div>
          <a class="btn btn-quiet" href="${c.link("catering")}">Catering Menu</a>
        </div>
      </div>
    </section>`,
  });
}

const inquiryForm = (c, event = "") => `<!-- Set data-endpoint to the form handler (e.g. https://formsubmit.co/ajax/<email>) before launch. See README. -->
        <form id="inquiryForm" class="form" novalidate data-endpoint="">${event ? `
          <input type="hidden" name="Event type" value="${esc(event)}">` : ""}
          <div class="row">
            <label>First name*<input name="First name" required autocomplete="given-name"></label>
            <label>Last name*<input name="Last name" required autocomplete="family-name"></label>
          </div>
          <div class="row">
            <label>Email address*<input name="Email address" type="email" required autocomplete="email"></label>
            <label>Phone number*<input name="Phone number" type="tel" required autocomplete="tel"></label>
          </div>
          <label>Event Location*<input name="Event Location" required></label>
          <div class="row">
            <label>Event Date*<input name="Event Date" type="date" required></label>
            <label>Estimated Guest Count*<input name="Estimated Guest Count" type="number" min="1" inputmode="numeric" required></label>
          </div>
          <label>Message*<textarea name="Message" rows="5" required></textarea></label>
          <p class="form-req">* Required</p>
          <div class="form-foot">
            <button class="btn btn-red" type="submit" id="sendBtn">Send</button>
            <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
          </div>
        </form>`;

function inquiry(c) {
  return `${pageHead(c, "Tell us a little about your event and we’ll be in touch.")}
    <section class="inquiry">
      <div class="wrap inquiry-grid">
        <div class="sheet form-sheet">${inquiryForm(c)}</div>
        <aside>${facts(c, { compact: true })}<figure class="aside-photo">${PHOTO.rotisserie(c)}</figure></aside>
      </div>
    </section>`;
}

const BODY = {
  home, inquiry, weddings,
  takeout: (c) => menuPage(c, MENUS.takeout, false),
  catering: (c) => menuPage(c, MENUS.catering, true),
  lobster: (c) => eventPage(c, { photo: placeholder(c, "lobster") }),
  pig: (c) => eventPage(c, { photo: placeholder(c, "pig") }),
};

/* ---------- document ---------- */
function doc(c) {
  const p = c.page;
  const preloadHero = p.key === "home"
    ? `<link rel="preload" as="image" href="${c.asset("img/brisket-900.webp")}" imagesrcset="${c.asset("img/brisket-640.webp")} 640w, ${c.asset("img/brisket-900.webp")} 900w, ${c.asset("img/brisket-1200.webp")} 1200w" imagesizes="(min-width: 900px) 52vw, 100vw">`
    : "";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${esc(p.title)}</title>
  <meta name="description" content="${esc(p.desc)}">
  ${p.index ? "" : '<meta name="robots" content="noindex, follow">'}
  <link rel="canonical" href="${c.canonical}">
  <meta name="theme-color" content="#022654">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(SITE.name)}">
  <meta property="og:title" content="${esc(p.h1 === "SMOKED. HOMEMADE. MAINE." ? p.h1 : p.label)}">
  <meta property="og:description" content="${esc(p.desc)}">
  <meta property="og:url" content="${c.canonical}">
  <meta property="og:image" content="${SITE.url}/assets/img/og-image.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(SITE.name)} logo over smoked brisket">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${c.asset("img/icon-32.png")}" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${c.asset("img/icon-180.png")}">
  <link rel="preload" href="${c.asset("fonts/newsreader-500.woff2")}" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="${c.asset("fonts/radio-canada-400.woff2")}" as="font" type="font/woff2" crossorigin>
  ${preloadHero}
  <link rel="stylesheet" href="${c.asset("styles.css")}">
  <script>document.documentElement.classList.add("js")</script>
  <script type="application/ld+json">
${ld(c)}
  </script>
</head>
<body class="page-${p.key}">
  <a class="skip-link" href="#main">Skip to content</a>
  ${header(c)}
  <main id="main">
    ${BODY[p.key](c)}
  </main>
  ${footer(c)}
  <p class="visually-hidden" id="spyAnnounce" aria-live="polite"></p>
  <script src="${c.asset("app.js")}"></script>
</body>
</html>
`;
}

/* ---------- extra files ---------- */
function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PAGES.filter((p) => p.index).map((p) => `  <url><loc>${SITE.url}/${p.path}</loc><lastmod>${SITE.updated}</lastmod><priority>${p.priority}</priority></url>`).join("\n")}
</urlset>
`;
}
const robots = () => `User-agent: *\nAllow: /\n\nSitemap: ${SITE.url}/sitemap.xml\n`;
function llms() {
  return `# ${SITE.name}

> SMOKED. HOMEMADE. MAINE. Take Out • Family Meals • Catering.

- Location: ${SITE.street}, ${SITE.town}
- Business Hours: ${SITE.days}, ${SITE.time}
- Store Phone #: ${SITE.phone}
- Instagram: ${SITE.instagram}
- Facebook: ${SITE.facebook}

## Pages
- [Take Out Kitchen Menu](${SITE.url}/take-out-menu/): ${MENUS.takeout.sections.map((s) => titleCase(s.title)).join(", ")}. Prices include Maine State Sales Tax.
- [Catering Menu](${SITE.url}/catering-menu/): ${MENUS.catering.sections.map((s) => titleCase(s.title)).join(", ")}.
- [Weddings](${SITE.url}/weddings/)
- [Lobster Bakes](${SITE.url}/lobster-bakes/)
- [Pig Roasts](${SITE.url}/pig-roasts/)
- [Catering Inquiries](${SITE.url}/catering-inquiries/)

## Full menus
- [llms-full.txt](${SITE.url}/llms-full.txt): both menus with every item and price
`;
}
function llmsFull() {
  const out = [`# ${SITE.name}: menus`, "", `${SITE.street}, ${SITE.town} · ${SITE.days} ${SITE.time} · ${SITE.phone}`, ""];
  for (const m of [MENUS.takeout, MENUS.catering]) {
    out.push(`## ${titleCase(m.title)}`, "", m.sub, "");
    for (const s of m.sections) {
      out.push(`### ${titleCase(s.title)}`);
      (s.notes || []).forEach((n) => out.push(n));
      out.push("");
      s.items.forEach(([n, p, d]) => out.push(`- ${n}${p ? `: ${p}` : ""}${d ? ` (${d})` : ""}`));
      out.push("");
    }
    (m.footnotes || []).forEach((f) => out.push(f));
    out.push("");
  }
  return out.join("\n");
}
// Netlify and Cloudflare Pages read _redirects. Old paths from the current site keep their links.
const redirects = () => `/home  /  301
/menus  /  301
/what-they-are-saying  /  301
/take-out-menu  /take-out-menu/  301
/catering-menu  /catering-menu/  301
/catering-inquiries  /catering-inquiries/  301
/lobster-bakes  /lobster-bakes/  301
/pig-roasts  /pig-roasts/  301
/weddings  /weddings/  301
`;
function notFound(mode) {
  const c = ctx({ key: "notfound", path: "", label: "Page not found" }, mode);
  // A 404 lives at the root but is served at any depth, so it uses root-absolute paths in production.
  const abs = (s) => (mode === "preview" ? s : s.replace(/(href|src)="(?:\.\.\/)*(assets\/[^"]+)"/g, '$1="/$2"').replace(/href="\.\/"/g, 'href="/"').replace(/href="((?:take-out|catering|weddings|lobster|pig)[^"]*)"/g, 'href="/$1"'));
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Page not found · ${esc(SITE.name)}</title><meta name="robots" content="noindex">
<link rel="stylesheet" href="${c.asset("styles.css")}"><script>document.documentElement.classList.add("js")</script></head>
<body class="page-notfound">
  ${header(c)}
  <main id="main"><section class="page-head"><div class="wrap"><h1>Page not found</h1><p class="lead"><a href="${c.link("takeout")}">Take Out Menu</a> · <a href="${c.link("catering")}">Catering Menu</a></p></div></section></main>
  ${footer(c)}
  <script src="${c.asset("app.js")}"></script>
</body></html>
`;
  return abs(html);
}

/* ---------- write ---------- */
function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const f of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, f.name), d = path.join(dst, f.name);
    if (f.isDirectory()) copyDir(s, d); else fs.copyFileSync(s, d);
  }
}
function write(file, text) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, text); }

for (const mode of ["dist", "preview"]) {
  const out = path.join(ROOT, mode);
  fs.rmSync(out, { recursive: true, force: true });
  for (const p of PAGES) write(path.join(out, p.path, "index.html"), doc(ctx(p, mode)));
  write(path.join(out, "404.html"), notFound(mode));
  if (mode === "dist") {
    copyDir(path.join(ROOT, "assets"), path.join(out, "assets"));
    write(path.join(out, "sitemap.xml"), sitemap());
    write(path.join(out, "robots.txt"), robots());
    write(path.join(out, "llms.txt"), llms());
    write(path.join(out, "llms-full.txt"), llmsFull());
    write(path.join(out, "_redirects"), redirects());
    write(path.join(out, "pages.json"), JSON.stringify(PAGES.map((p) => ({ key: p.key, path: p.path, index: p.index })), null, 1));
  }
}
console.log(`built ${PAGES.length} pages + 404 into dist/ and preview/`);
