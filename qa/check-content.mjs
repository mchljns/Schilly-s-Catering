// Gate 1: every visible word comes from schillyscatering.com (brand/source/*.txt)
// or the approved interface labels (brand/source/ui-labels.txt).
// Gate 2: slop markers in our own files.
import fs from "node:fs";
import path from "node:path";
import { ROOT, serve, chromium, norm, pages } from "./lib.mjs";

const srcDir = path.join(ROOT, "brand/source");
const OURS = new Set(["ui-labels.txt", "draft-copy.txt", "corrections.txt"]);
const readLines = (f) => fs.readFileSync(path.join(srcDir, f), "utf8").split("\n").filter((l) => l && !l.startsWith("#"));
// Corrections (typos, spacing) are applied to their text before tracing: brand/source/corrections.txt.
const corrections = readLines("corrections.txt").map((l) => l.split(" => "));
let sourceText = fs.readdirSync(srcDir).filter((f) => f.endsWith(".txt") && !OURS.has(f))
  .map((f) => fs.readFileSync(path.join(srcDir, f), "utf8")).join("\n");
for (const [a, b] of corrections) sourceText = sourceText.split(a).join(b);
// Draft copy: example lines for the spec site, pending the owner. Allowed, but counted and reported.
const drafts = readLines("draft-copy.txt").map(norm);
// Lines are joined with a space, and again with ", " (an address printed on two lines is still their text).
const corpus = norm(sourceText.replace(/\n/g, " ")) + " || " + norm(sourceText.replace(/\n/g, ", "));
const labels = fs.readFileSync(path.join(srcDir, "ui-labels.txt"), "utf8").split("\n")
  .filter((l) => l && !l.startsWith("#")).map(norm);

// Text we describe rather than quote: photo alt text and the share-card alt.
// Each must describe what is visible, with no claims. Reviewed by hand, listed here.
const DESCRIPTIONS = [
  "Smoked brisket in a pan with a thermometer reading 192 degrees",
  "Whole chickens turning on a rotisserie spit",
  "Charcuterie boards and a vegetable platter on an outdoor table",
  "Smoked salmon platter on a ring of sliced cucumber",
  "Schilly’s chef in an apron with a bride, holding a plate at a wedding",
  "Schilly’s Take Out & Catering Kitchen logo over smoked brisket",
].map(norm);

const draftSeen = new Set();
function allowed(fragment) {
  // A trimmed line keeps its full stop: "…be in touch." is their sentence, cut short.
  const f = norm(fragment).replace(/[\s•·]+$/, "").replace(/[.?!]$/, "");
  if (!f || /^[•·×*\-–—|,.:;()/]+$/.test(f)) return true;
  if (/^©?\s*\d{4}$/.test(f)) return true;
  if (corpus.includes(f) || labels.includes(f) || DESCRIPTIONS.includes(f)) return true;
  if (drafts.some((d) => d.replace(/[.?!]$/, "") === f)) { draftSeen.add(f); return true; }
  return false;
}
// A text node may join approved pieces with " · ", ": " or " • ".
function check(text) {
  const t = text.trim();
  if (allowed(t)) return true;
  return t.split(/\s+[·•]\s+|:\s+/).every(allowed);
}

const site = await serve();
const browser = await (chromium()).launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const collect = () => page.evaluate(() => {
  const out = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const n = walker.currentNode, p = n.parentElement;
    if (!n.textContent.trim() || p.closest("script,style")) continue;
    out.push({ where: p.tagName.toLowerCase() + (p.className ? "." + p.className : ""), text: n.textContent });
  }
  document.querySelectorAll("[alt],[aria-label],[placeholder],[title]").forEach((e) => {
    ["alt", "aria-label", "placeholder", "title"].forEach((a) => { if (e.getAttribute(a)) out.push({ where: "@" + a, text: e.getAttribute(a) }); });
  });
  document.querySelectorAll('meta[name="description"],meta[property^="og:"]:not([property$="url"]):not([property$="image"]):not([property$="type"]):not([property*="width"]):not([property*="height"])')
    .forEach((m) => out.push({ where: "meta", text: m.content }));
  out.push({ where: "title", text: document.title });
  // Structured data is content too: every human-readable string in JSON-LD must trace like visible text.
  document.querySelectorAll('script[type="application/ld+json"]').forEach((sc) => {
    const SKIP = /^(@id|@type|@context|url|item|logo|image|telephone|price|priceCurrency|opens|closes|inLanguage|postalCode|addressCountry|addressRegion|dayOfWeek|hasMenu|sameAs|position)$/;
    const walk = (v, k) => {
      if (Array.isArray(v)) return v.forEach((x) => walk(x, k));
      if (v && typeof v === "object") return Object.entries(v).forEach(([kk, vv]) => walk(vv, kk));
      if (typeof v !== "string" || SKIP.test(k) || /^https?:/.test(v)) return;
      out.push({ where: "jsonld." + k, text: v });
    };
    walk(JSON.parse(sc.textContent), "");
  });
  out.push({ where: "h1count", text: String(document.querySelectorAll("h1").length) });
  return out;
});

let found = [];
const urls = pages().map((p) => p.path).concat(["404.html"]);
for (const u of urls) {
  await page.goto(site.url + u);
  const got = await collect();
  const h1 = got.find((x) => x.where === "h1count");
  if (h1.text !== "1") found.push({ where: "hierarchy", text: `/${u} has ${h1.text} <h1>` });
  found = found.concat(got.filter((x) => x.where !== "h1count").map((x) => ({ ...x, page: "/" + u })));
}
await browser.close();
site.close();

const failures = [];
const seen = new Set();
for (const { where, text } of found) {
  const key = where + "|" + text;
  if (seen.has(key)) continue;
  seen.add(key);
  if (where === "hierarchy") { failures.push(`hierarchy: ${text}`); continue; }
  if (where === "title" || where === "meta" || where.startsWith("jsonld")) {
    // Titles and meta may combine approved phrases with " · ", "&" or ". "
    if (!check(text) && !text.split(/\s+·\s+|\.\s+(?=[A-Z0-9(])/).every((p) => check(p) || check(p.replace(/\.$/, "")))) failures.push(`${where}: "${text}"`);
    continue;
  }
  if (!check(text)) failures.push(`${where}: "${text.trim()}"`);
}

// Slop lint on files we wrote.
const own = {
  "build.mjs": fs.readFileSync(path.join(ROOT, "build.mjs"), "utf8"),
  "assets/styles.css": fs.readFileSync(path.join(ROOT, "assets/styles.css"), "utf8"),
  "assets/app.js": fs.readFileSync(path.join(ROOT, "assets/app.js"), "utf8"),
  "brand/source/ui-labels.txt": fs.readFileSync(path.join(srcDir, "ui-labels.txt"), "utf8"),
};
const slop = [
  [/(?![©®™])\p{Extended_Pictographic}/u, "emoji", ["build.mjs", "assets/app.js", "brand/source/ui-labels.txt"]],
  [/gradient\(/, "CSS gradient", ["assets/styles.css", "build.mjs"]],
  [/translateY|scale\(/, "lift/scale hover motion", ["assets/styles.css"]],
  [/border-left:\s*[3-9]px/, "shaded left-border callout", ["assets/styles.css"]],
  [/eyebrow|kicker/i, "hero eyebrow", ["build.mjs", "assets/styles.css"]],
  [/Oswald|Anton|Roboto|Lato|Inter\b|Poppins|Montserrat|Space Grotesk|Fraunces|Instrument|Playfair|DM Sans|Manrope|Outfit/, "retired or AI-overused typeface", ["build.mjs", "assets/styles.css"]],
  [/text-transform:\s*uppercase/, "tracked-capitals label (brand/06-hierarchy.md)", ["assets/styles.css"]],
  [/letter-spacing:\s*\.(0[3-9]|[1-9])/, "letter-spacing over 0.02em", ["assets/styles.css"]],
  [/<figcaption/, "photo caption", ["build.mjs"]],
  [/—/, "em dash in our own labels", ["brand/source/ui-labels.txt", "assets/app.js"]],
  [/lorem|placeholder text|TODO|\[CONFIRM/i, "unfinished placeholder", ["build.mjs", "assets/app.js"]],
];
for (const [re, what, files] of slop) for (const f of files) {
  const lines = own[f].split("\n");
  lines.forEach((l, i) => { if (re.test(l) && !/^\s*(\/\/|\/\*|\*|<!--|#)/.test(l)) failures.push(`slop (${what}): ${f}:${i + 1}: ${l.trim().slice(0, 90)}`); });
}

// Brand rules (brand/README.md): Ribbon Red is for actions and money; Sign Yellow sits on Navy only.
const css = own["assets/styles.css"].replace(/\/\*[\s\S]*?\*\//g, "");
const RED_OK = /^(a|a:hover|.* a:hover|:focus-visible|\.btn-red(:hover)?|\.ribbon|\.item-price|\.add(\[aria-pressed="true"\])?|\.form \[aria-invalid="true"\]|\.picked li button|\.search input:focus|\.form input:focus|\.form textarea:focus|\.nav a\[aria-current="page"\]:not\(\.btn\))$/;
const YELLOW_OK = /^(\.site-footer :focus-visible|\.hero :focus-visible|\.btn-yellow|\.closer h2|\.hero h1|\.hero \.fact-action)$/;
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selectors = m[1].trim().split(/\s*,\s*/).filter((x) => x && !x.startsWith("@") && !x.startsWith(":root"));
  if (/var\(--red(-dark)?\)/.test(m[2])) selectors.filter((x) => !RED_OK.test(x)).forEach((x) => failures.push(`brand: Ribbon Red used on "${x}" (actions and money only)`));
  if (/var\(--yellow\)/.test(m[2])) selectors.filter((x) => !YELLOW_OK.test(x)).forEach((x) => failures.push(`brand: Sign Yellow used on "${x}" (Navy backgrounds only)`));
}

// Prose slop filter (stop-slop rules) on every visible sentence of four words or more.
// Exempt: menu item descriptions (inventory lists) and the legally required food-safety and price notices.
const EXEMPT = /consuming raw or undercooked|prices are subject to|^prices include/i;
const PROSE_SLOP = [
  [/\?\s+\S/, "rhetorical question used as a setup"],
  [/^from\b.+\bto\b/i, "\"From X to Y\" opener"],
  [/\band more( information)?\b|so much more/i, "filler tail"],
  [/\b(we['’]d love|unforgettable|make it special|something for everyone|look no further|elevate|seamless)\b/i, "stock warmth"],
  [/—/, "em dash"],
  [/!/, "exclamation"],
  [/coming soon/i, "stale notice"],
];
const prose = new Set();
for (const { where, text } of found) {
  const t = text.trim();
  if (t.split(/\s+/).length < 4 || where.startsWith("@") || EXEMPT.test(t)) continue;
  if (/item-detail|sec-notes/.test(where)) continue;
  prose.add(t);
}
for (const t of prose) for (const [re, what] of PROSE_SLOP) if (re.test(t)) failures.push(`prose slop (${what}): "${t.slice(0, 90)}"`);

if (failures.length) {
  console.error(`check-content: ${failures.length} problem(s)\n  ` + failures.join("\n  "));
  process.exit(1);
}
console.log(`check-content: ok (${seen.size} text fragments traced to schillyscatering.com or approved labels; ${draftSeen.size} draft lines pending owner (brand/source/draft-copy.txt); slop lint clean)`);
