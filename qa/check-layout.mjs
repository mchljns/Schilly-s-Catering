// Gate 3: layout, readability, contrast, first-screen info and weight at four widths.
import fs from "node:fs";
import path from "node:path";
import { ROOT, serve, chromium, pages } from "./lib.mjs";

const SHOTS = process.env.SHOTS || "";
const widths = [[360, 740], [390, 844], [768, 1024], [1280, 900]];
const failures = [];
const notes = [];
const site = await serve();
const PAGE = site.url;
const browser = await (chromium()).launch();

const URLS = pages().map((p) => p.path).concat(["404.html"]);
for (const u of URLS) for (const [w, h] of widths) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, reducedMotion: "reduce" });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  const bytes = { first: 0 };
  page.on("response", async (r) => { try { const b = await r.body(); bytes.first += b.length; } catch {} });
  await page.goto(PAGE + u, { waitUntil: "load" });
  await page.waitForTimeout(300);
  const firstScreenKB = Math.round(bytes.first / 1024);

  const r = await page.evaluate(() => {
    const out = { overflow: document.documentElement.scrollWidth > innerWidth, small: [], targets: [], contrast: [], distorted: [], broken: [] };
    const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); const [r, g, b] = m.slice(0, 3).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return { L: 0.2126 * r + 0.7152 * g + 0.0722 * b, a: m[3] ?? 1 }; };
    const bgOf = (el) => { for (let e = el; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; const x = lum(c); if (x.a > 0.5) return x.L; } return 1; };
    const visible = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && b.width > 0 && b.height > 0 && !e.closest("[hidden]"); };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const seen = new Set();
    while (walker.nextNode()) {
      const p = walker.currentNode.parentElement;
      if (!walker.currentNode.textContent.trim() || seen.has(p) || !visible(p) || p.closest(".visually-hidden,.skip-link")) continue;
      seen.add(p);
      const s = getComputedStyle(p);
      const size = parseFloat(s.fontSize);
      if (size < 14) out.small.push(`${p.tagName}.${p.className} ${size}px "${p.textContent.trim().slice(0, 30)}"`);
      const fg = lum(s.color).L, bg = bgOf(p);
      const ratio = (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
      const large = size >= 24 || (size >= 18.66 && +s.fontWeight >= 600);
      if (ratio < (large ? 3 : 4.5)) out.contrast.push(`${ratio.toFixed(2)}:1 ${p.tagName}.${p.className} "${p.textContent.trim().slice(0, 30)}"`);
    }
    document.querySelectorAll("a, button, input, textarea, [role=tab]").forEach((e) => {
      if (!visible(e) || e.closest(".skip-link")) return;
      const b = e.getBoundingClientRect();
      const inline = e.tagName === "A" && getComputedStyle(e).display === "inline" && e.closest("p");
      if (!inline && (b.height < 40 || b.width < 40)) out.targets.push(`${e.tagName}.${e.className} ${Math.round(b.width)}x${Math.round(b.height)} "${(e.textContent || e.name || "").trim().slice(0, 24)}"`);
    });
    document.querySelectorAll("img").forEach((img) => {
      if (!img.complete || !img.naturalWidth) { if (img.loading !== "lazy") out.broken.push(img.currentSrc || img.src); return; }
      const s = getComputedStyle(img); const b = img.getBoundingClientRect();
      if (s.objectFit !== "cover" && b.width && Math.abs(b.width / b.height - img.naturalWidth / img.naturalHeight) > 0.02) out.distorted.push(img.src.split("/").pop());
    });
    // Non-text contrast (WCAG 1.4.11): every control's edge must reach 3:1 against what is behind it.
    out.edges = [];
    const parentBg = (el) => { for (let e = el.parentElement; e; e = e.parentElement) { const c = getComputedStyle(e).backgroundColor; const x = lum(c); if (x.a > 0.5) return x.L; } return 1; };
    const ratioOf = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    document.querySelectorAll("button, a.btn, input, textarea, .seg, .spy a, .nav a").forEach((e) => {
      if (!visible(e) || e.closest(".skip-link")) return;
      const s = getComputedStyle(e);
      const behind = parentBg(e);
      const bw = parseFloat(s.borderTopWidth);
      const bg = lum(s.backgroundColor);
      let r;
      if (bw >= 1 && lum(s.borderTopColor).a > 0.5) r = Math.max(ratioOf(lum(s.borderTopColor).L, behind), bg.a > 0.5 ? ratioOf(bg.L, behind) : 0);
      else if (bg.a > 0.5) r = ratioOf(bg.L, behind);
      else return; // borderless, transparent: a text link, judged by text contrast
      if (r < 3) out.edges.push(`${r.toFixed(2)}:1 ${e.tagName}.${e.className} "${(e.textContent || e.name || "").trim().slice(0, 24)}"`);
    });
    out.ribbons = document.querySelectorAll(".ribbon").length;
    const inView = (sel) => { const e = document.querySelector(sel); if (!e) return false; const b = e.getBoundingClientRect(); return b.top < innerHeight * 3 && b.bottom > 0; };
    const facts = document.querySelector(".facts");
    out.firstScreen = { hours: facts ? facts.getBoundingClientRect().top : -1, vh: innerHeight };
    out.inquiryInHeader = [...document.querySelectorAll('.site-header a[href*="catering-inquiries"]')].some(visible);
    return out;
  });

  // Price within two taps (home only): tap Take Out Menu in the header, then at most one section link.
  let priceTaps = null;
  if (u === "") {
    const takeout = (await page.$$('.site-header a[href*="take-out-menu"]'));
    for (const a of takeout) { if (await a.isVisible()) { await Promise.all([page.waitForLoadState("load"), a.click()]); break; } }
    await page.waitForTimeout(300);
    const onScreen = () => page.evaluate(() => [...document.querySelectorAll(".item-price")].some((p) => { const b = p.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight; }));
    if (await onScreen()) priceTaps = 1;
    else { await page.click("#menuJump a"); await page.waitForTimeout(400); if (await onScreen()) priceTaps = 2; }
    await page.goto(PAGE + u, { waitUntil: "load" });
  }

  // Lazy images: scroll the page so they load, then check none are broken.
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); } });
  await page.waitForTimeout(300);
  const broken = await page.evaluate(() => [...document.querySelectorAll("img")].filter((i) => !i.naturalWidth && i.getBoundingClientRect().width > 0).map((i) => i.src.split("/").pop()));
  if (SHOTS) {
    await page.evaluate(() => scrollTo(0, 0));
    const name = (u.replace(/\/$/, "").replace(".html", "") || "home");
    await page.screenshot({ path: path.join(SHOTS, `${name}-w${w}-full.png`), fullPage: true });
    await page.screenshot({ path: path.join(SHOTS, `${name}-w${w}-top.png`) });
  }
  await page.close();

  const tag = `[/${u} ${w}px]`;
  if (r.overflow) failures.push(`${tag} horizontal overflow`);
  r.small.forEach((x) => failures.push(`${tag} text under 14px: ${x}`));
  r.contrast.forEach((x) => failures.push(`${tag} contrast: ${x}`));
  r.targets.forEach((x) => failures.push(`${tag} touch target under 40px: ${x}`));
  r.edges.forEach((x) => failures.push(`${tag} control edge under 3:1: ${x}`));
  if (r.ribbons > 0) failures.push(`${tag} ${r.ribbons} ribbon(s) on the web page (ribbon is for print and social only, brand/06-hierarchy.md)`);
  r.distorted.forEach((x) => failures.push(`${tag} distorted image: ${x}`));
  broken.forEach((x) => failures.push(`${tag} broken image: ${x}`));
  errors.forEach((x) => failures.push(`${tag} console: ${x}`));
  if (!r.inquiryInHeader) failures.push(`${tag} no inquiry link in header`);
  if (u === "" && !priceTaps) failures.push(`${tag} no price on screen within two taps of Take Out Menu`);
  if (u === "" && w <= 390 && r.firstScreen.hours > r.firstScreen.vh - 60) failures.push(`${tag} hours band starts at ${Math.round(r.firstScreen.hours)}px, below the first screen (${r.firstScreen.vh}px)`);
  if (firstScreenKB > 600) failures.push(`${tag} first load ${firstScreenKB} KB (budget 600)`);
  if (u === "") notes.push(`${tag} first load ${firstScreenKB} KB, hours at ${Math.round(r.firstScreen.hours)}px of ${r.firstScreen.vh}, price in ${priceTaps} tap(s)`);
  else if (w === 390) notes.push(`${tag} first load ${firstScreenKB} KB`);
}
// The brand guide must follow its own rules too: no overflow, no stretched logo.
for (const w of [390, 1280]) {
  const page = await browser.newPage({ viewport: { width: w, height: 900 } });
  await page.goto(PAGE + "brand/guide.html");
  await page.waitForTimeout(300);
  const g = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    distorted: [...document.images].filter((i) => { const r = i.getBoundingClientRect(); return i.naturalWidth && r.width && getComputedStyle(i).objectFit !== "cover" && Math.abs(r.width / r.height - i.naturalWidth / i.naturalHeight) > 0.02; }).map((i) => i.src.split("/").pop()),
  }));
  if (g.overflow) failures.push(`[guide ${w}px] horizontal overflow`);
  g.distorted.forEach((x) => failures.push(`[guide ${w}px] distorted image: ${x}`));
  await page.close();
}
await browser.close();
site.close();

console.log(notes.join("\n"));
if (failures.length) { console.error(`check-layout: ${failures.length} problem(s)\n  ` + failures.join("\n  ")); process.exit(1); }
console.log(`check-layout: ok (${URLS.length} pages × 360, 390, 768, 1280 px: no overflow, text >= 14px, AA contrast, control edges 3:1, targets >= 40px, images intact, price within 2 taps)`);
