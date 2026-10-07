// Gate 1: every visible word comes from schillyscatering.com (brand/source/*.txt)
// or the approved interface labels (brand/source/ui-labels.txt).
// Gate 2: slop markers in our own files.
import fs from "node:fs";
import path from "node:path";
import { ROOT, serve, chromium, norm } from "./lib.mjs";

const srcDir = path.join(ROOT, "brand/source");
const sourceText = fs.readdirSync(srcDir).filter((f) => f.endsWith(".txt") && f !== "ui-labels.txt")
  .map((f) => fs.readFileSync(path.join(srcDir, f), "utf8")).join("\n");
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

function allowed(fragment) {
  const f = norm(fragment).replace(/[\s•·]+$/, "");
  if (!f || /^[•·×*\-–—|,.:;()]+$/.test(f)) return true;
  if (/^©?\s*\d{4}$/.test(f)) return true;
  if (corpus.includes(f) || labels.includes(f) || DESCRIPTIONS.includes(f)) return true;
  return false;
}
// A text node may join approved pieces with " · ", ": " or " • ".
function check(text) {
  const t = text.trim();
  if (allowed(t)) return true;
  return t.split(/\s+[·•]\s+|:\s+/).every(allowed);
}

const site = await serve();
const PAGE = site.url;
const browser = await (chromium()).launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(PAGE);

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
  return out;
});

let found = await collect();
await page.click("#tab-catering");
found = found.concat(await collect());
await page.fill('[name="First name"]', "x");
await browser.close();
site.close();

const failures = [];
const seen = new Set();
for (const { where, text } of found) {
  const key = where + "|" + text;
  if (seen.has(key)) continue;
  seen.add(key);
  if (where === "title" || where === "meta") {
    // Titles and meta may combine approved phrases with " · ", "&" or ". "
    if (!text.split(/\s+·\s+|\.\s+(?=[A-Z0-9(])/).every((p) => check(p) || check(p.replace(/\.$/, "")))) failures.push(`${where}: "${text}"`);
    continue;
  }
  if (!check(text)) failures.push(`${where}: "${text.trim()}"`);
}

// Slop lint on files we wrote.
const own = {
  "index.html": fs.readFileSync(path.join(ROOT, "index.html"), "utf8"),
  "assets/styles.css": fs.readFileSync(path.join(ROOT, "assets/styles.css"), "utf8"),
  "assets/app.js": fs.readFileSync(path.join(ROOT, "assets/app.js"), "utf8"),
  "brand/source/ui-labels.txt": fs.readFileSync(path.join(srcDir, "ui-labels.txt"), "utf8"),
};
const slop = [
  [/(?![©®™])\p{Extended_Pictographic}/u, "emoji", ["index.html", "assets/app.js", "brand/source/ui-labels.txt"]],
  [/gradient\(/, "CSS gradient", ["assets/styles.css", "index.html"]],
  [/translateY|scale\(/, "lift/scale hover motion", ["assets/styles.css"]],
  [/border-left:\s*[3-9]px/, "shaded left-border callout", ["assets/styles.css"]],
  [/eyebrow|kicker/i, "hero eyebrow", ["index.html", "assets/styles.css"]],
  [/—/, "em dash in our own labels", ["brand/source/ui-labels.txt", "assets/app.js"]],
  [/lorem|placeholder text|TODO|\[CONFIRM/i, "unfinished placeholder", ["index.html", "assets/app.js"]],
];
for (const [re, what, files] of slop) for (const f of files) {
  const lines = own[f].split("\n");
  lines.forEach((l, i) => { if (re.test(l) && !/^\s*(\/\/|\/\*|\*|<!--|#)/.test(l)) failures.push(`slop (${what}): ${f}:${i + 1}: ${l.trim().slice(0, 90)}`); });
}

// Brand rules (brand/README.md): Ribbon Red is for actions and money; Sign Yellow sits on Navy only.
const css = own["assets/styles.css"].replace(/\/\*[\s\S]*?\*\//g, "");
const RED_OK = /^(a|a:hover|:focus-visible|\.btn-red(:hover)?|\.nav \.nav-cta(:hover)?|\.item-price|\.add(\[aria-pressed="true"\])?|\.form \[aria-invalid="true"\]|\.picked li button)$/;
const YELLOW_OK = /^(\.site-footer :focus-visible|\.info :focus-visible|\.hero :focus-visible|\.hero h1|\.info-link|\.open-status\.is-open::before|\.btn-yellow|\.closer h2)$/;
for (const m of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
  const selectors = m[1].trim().split(/\s*,\s*/).filter((x) => x && !x.startsWith("@") && !x.startsWith(":root"));
  if (/var\(--red(-dark)?\)/.test(m[2])) selectors.filter((x) => !RED_OK.test(x)).forEach((x) => failures.push(`brand: Ribbon Red used on "${x}" (actions and money only)`));
  if (/var\(--yellow\)/.test(m[2])) selectors.filter((x) => !YELLOW_OK.test(x)).forEach((x) => failures.push(`brand: Sign Yellow used on "${x}" (Navy backgrounds only)`));
}

if (failures.length) {
  console.error(`check-content: ${failures.length} problem(s)\n  ` + failures.join("\n  "));
  process.exit(1);
}
console.log(`check-content: ok (${seen.size} text fragments traced to schillyscatering.com or approved labels; slop lint clean)`);
