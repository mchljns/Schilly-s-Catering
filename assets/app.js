(function () {
  "use strict";

  var TZ = "America/New_York";
  var HOURS = { days: [0, 3, 4, 5, 6], open: 11, close: 18 }; // 0 = Sunday. Keep in sync with index.html.
  var PHONE_HTML = '<a href="tel:+12076938840">(207)693-8840</a>';
  var STORE_KEY = "schillys-dishes";

  var menus = window.MENUS || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text != null) n.textContent = text;
    return n;
  }
  // Capitals are reserved for Solway headings (brand/06-hierarchy.md). Text that Schilly's typed
  // in capitals but that sits at body size (rail links, platter names) is set in title case: same words.
  var KEEP = { BBQ: 1, BLT: 1, GF: 1, "GF*": 1, OR: 0 };
  var SMALL = { or: 1, and: 1, with: 1, of: 1, to: 1, a: 1, on: 1 };
  function titleCase(t) {
    // Treat as capitals when every word longer than three letters is in capitals ("BOARDS, and GRAZES").
    var caps = t.split(/\s+/).every(function (w) { return w.replace(/[^A-Za-z]/g, "").length <= 3 || w === w.toUpperCase(); });
    if (!caps) return t;
    return t.split(" ").map(function (w, i) {
      if (KEEP[w] === 1) return w;
      var l = w.toLowerCase();
      if (i > 0 && SMALL[l]) return l;
      return l.replace(/(^|[(“"&-])([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
    }).join(" ");
  }
  function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

  /* Open / closed, in Maine time */
  (function openStatus() {
    var out = $("#openStatus");
    var parts;
    try {
      parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(new Date());
    } catch (e) { return; }
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    var hour = +get("hour") + get("minute") / 60;
    var openDay = HOURS.days.indexOf(day) !== -1;
    var open = openDay && hour >= HOURS.open && hour < HOURS.close;
    var msg;
    if (open) msg = "Open now · until 6 pm";
    else if (openDay && hour < HOURS.open) msg = "Closed · opens today at 11 am";
    else if (HOURS.days.indexOf((day + 1) % 7) !== -1) msg = "Closed · opens tomorrow at 11 am";
    else msg = "Closed · opens Wednesday at 11 am";
    out.textContent = msg;
    out.classList.toggle("is-open", open);
    out.hidden = false;
  })();

  /* Menus */
  var state = { tab: "takeout", query: "", dishes: load() };
  var listEl = $("#menuList"), jumpEl = $("#menuJump"), searchEl = $("#menuSearch");

  function load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state.dishes)); } catch (e) { /* private mode */ } }

  function render() {
    var m = menus[state.tab];
    var catering = state.tab === "catering";
    listEl.textContent = "";
    jumpEl.textContent = "";
    listEl.className = catering ? "is-catering" : "is-takeout";

    $("#menuSub").textContent = m.sub;
    var intro = $("#menuIntro");
    intro.hidden = !m.intro;
    intro.textContent = m.intro || "";

    m.sections.forEach(function (sec) {
      var id = m.id + "-" + slug(sec.title);
      if (sec.group) listEl.appendChild(el("h3", { class: "menu-group" }, sec.group));
      jumpEl.appendChild(el("a", { href: "#" + id }, titleCase(sec.title)));

      var box = el("section", { class: "menu-sec", id: id, "aria-labelledby": id + "-h" });
      // Menu section titles are a capitals level: one case for the whole title.
      box.appendChild(el("h3", { id: id + "-h", class: "ruled", tabindex: "-1" }, sec.title.toUpperCase()));
      if (sec.notes) {
        var notes = el("div", { class: "sec-notes" });
        sec.notes.forEach(function (n) { notes.appendChild(el("p", null, n)); });
        box.appendChild(notes);
      }
      var ul = el("ul", { class: "items" });
      sec.items.forEach(function (it) {
        var name = it[0], price = it[1], detail = it[2];
        var li = el("li", { class: "item" });
        li.dataset.search = [name, detail, sec.title].join(" ").toLowerCase();
        var text = el("div", { class: "item-text" });
        text.appendChild(el("p", { class: "item-name" }, titleCase(name)));
        if (detail) text.appendChild(el("p", { class: "item-detail" }, detail));
        li.appendChild(text);
        if (price) {
          li.appendChild(el("span", { class: "leader", "aria-hidden": "true" }));
          li.appendChild(el("span", { class: "item-price" }, price));
        }
        if (catering) {
          li.appendChild(el("button", { type: "button", class: "add", "data-dish": name, "aria-label": "+ Add: " + name }));
        }
        ul.appendChild(li);
      });
      box.appendChild(ul);
      listEl.appendChild(box);
    });

    var foot = $("#menuFoot");
    foot.textContent = "";
    if (m.footnotes || m.closing) {
      var f = el("div", { class: "menu-foot" });
      if (m.closing) {
        if (m.closing.title) f.appendChild(el("h3", null, m.closing.title));
        f.appendChild(el("p", null, m.closing.text));
        var call = el("a", { class: "btn btn-red", href: "tel:+12076938840" }, "(207)693-8840");
        f.appendChild(call);
      }
      (m.footnotes || []).forEach(function (t) { f.appendChild(el("p", null, t)); });
      foot.appendChild(f);
    }
    filter();
    syncAdds();
    watchSections();
  }

  function filter() {
    var q = state.query, any = false;
    $$(".menu-sec", listEl).forEach(function (sec) {
      var shown = 0;
      $$(".item", sec).forEach(function (li) {
        li.hidden = !!q && li.dataset.search.indexOf(q) === -1;
        if (!li.hidden) shown++;
      });
      sec.hidden = !shown;
      var link = jumpEl.querySelector('a[href="#' + sec.id + '"]');
      if (link) link.hidden = !shown;
      if (shown) any = true;
    });
    $$(".menu-group", listEl).forEach(function (g) { g.hidden = !!q; });
    $("#menuEmpty").hidden = any;
  }
  searchEl.addEventListener("input", function () { state.query = searchEl.value.trim().toLowerCase(); filter(); });

  /* Scroll spy, rebuilt from the 21st.dev Scroll Spy pattern (ddoemonn):
     the active section is the last one whose top has passed a reading line.
     The line slides toward the bottom as the page nears its end, so short
     final sections still light up. A click holds its section until scrolling settles. */
  var spyLock = null, spyLockTimer = 0, spyFrame = 0, spyActive = "";
  function headerOffset() { return window.innerWidth >= 900 ? 136 : 64; }
  function measureSpy() {
    var secs = $$(".menu-sec", listEl).filter(function (s) { return !s.hidden; });
    if (!secs.length) return "";
    var offset = headerOffset();
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1;
    var line = offset + ratio * Math.max(0, window.innerHeight - offset - 1);
    var panel = $("#menu-panel").getBoundingClientRect();
    if (panel.bottom < offset) return secs[secs.length - 1].id;
    var current = secs[0].id;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line + 1) current = s.id; });
    return current;
  }
  function setSpy(id) {
    if (id === spyActive) return;
    spyActive = id;
    $$("a", jumpEl).forEach(function (a) {
      var on = a.getAttribute("href") === "#" + id;
      if (on) {
        a.setAttribute("aria-current", "location");
        var left = a.offsetLeft - jumpEl.offsetLeft, right = left + a.offsetWidth;
        if (left < jumpEl.scrollLeft) jumpEl.scrollLeft = left - 16;
        else if (right > jumpEl.scrollLeft + jumpEl.clientWidth) jumpEl.scrollLeft = right - jumpEl.clientWidth + 16;
      } else a.removeAttribute("aria-current");
    });
    clearTimeout(setSpy.t);
    setSpy.t = setTimeout(function () {
      var link = jumpEl.querySelector('a[aria-current]');
      $("#spyAnnounce").textContent = link ? link.textContent : "";
    }, 420);
  }
  function syncSpy() {
    if (spyFrame) return;
    spyFrame = requestAnimationFrame(function () {
      spyFrame = 0;
      var next = measureSpy();
      if (!next) return;
      if (spyLock) { if (spyLock === next) spyLock = null; return; }
      setSpy(next);
    });
  }
  window.addEventListener("scroll", syncSpy, { passive: true });
  window.addEventListener("resize", syncSpy);
  ["wheel", "touchstart"].forEach(function (t) { window.addEventListener(t, function () { spyLock = null; }, { passive: true }); });
  jumpEl.addEventListener("click", function (e) {
    var a = e.target.closest("a");
    if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    var id = a.getAttribute("href").slice(1), target = document.getElementById(id);
    if (!target) return;
    spyLock = id;
    setSpy(id);
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset() + 8, behavior: reduce ? "auto" : "smooth" });
    target.querySelector("h3").focus({ preventScroll: true });
    clearTimeout(spyLockTimer);
    spyLockTimer = setTimeout(function () { spyLock = null; syncSpy(); }, 900);
  });
  function watchSections() { spyActive = ""; syncSpy(); }

  /* Tabs */
  var tabs = $$(".seg-opt");
  function select(name, focus) {
    if (!menus[name] || name === state.tab && listEl.childNodes.length) return;
    state.tab = name;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    $("#menu-panel").setAttribute("aria-labelledby", "tab-" + name);
    render();
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { select(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {
      var keys = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
      var i;
      if (e.key === "Home") i = 0;
      else if (e.key === "End") i = tabs.length - 1;
      else if (keys[e.key]) i = (tabs.indexOf(t) + keys[e.key] + tabs.length) % tabs.length;
      else return;
      e.preventDefault();
      select(tabs[i].dataset.tab, true);
    });
  });
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-tab-link]");
    if (a) select(a.dataset.tabLink);
  });

  /* Dishes for the inquiry */
  function syncAdds() {
    $$(".add", listEl).forEach(function (b) {
      var on = state.dishes.indexOf(b.dataset.dish) !== -1;
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "Added" : "+ Add";
    });
    var list = $("#pickedList");
    list.textContent = "";
    state.dishes.forEach(function (d) {
      var li = el("li", null, d);
      li.appendChild(el("button", { type: "button", "data-dish": d, "aria-label": "Remove: " + d }, "×"));
      list.appendChild(li);
    });
    $("#picked").hidden = !state.dishes.length;
    var bar = $("#dishesBar");
    bar.hidden = !(state.tab === "catering" && state.dishes.length);
    $("#dishesBarList").textContent = state.dishes.join(" • ");
  }
  function toggle(d) {
    var i = state.dishes.indexOf(d);
    if (i === -1) state.dishes.push(d); else state.dishes.splice(i, 1);
    save();
    syncAdds();
  }
  listEl.addEventListener("click", function (e) { var b = e.target.closest(".add"); if (b) toggle(b.dataset.dish); });
  $("#pickedList").addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) toggle(b.dataset.dish); });

  /* Inquiry form: same fields as the current site. Sends JSON to data-endpoint. */
  var form = $("#inquiryForm"), statusEl = $("#formStatus"), sendBtn = $("#sendBtn");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var bad = $$("input[required], textarea[required]", form).filter(function (i) {
      var ok = i.value.trim() !== "" && i.checkValidity();
      i.setAttribute("aria-invalid", String(!ok));
      return !ok;
    });
    if (bad.length) { statusEl.textContent = ""; bad[0].focus(); return; }

    var data = {};
    $$("input, textarea", form).forEach(function (i) { if (i.name) data[i.name] = i.value.trim(); });
    if (state.dishes.length) data.Dishes = state.dishes.join(", ");
    data._subject = "Catering Inquiries";

    var endpoint = form.dataset.endpoint;
    if (!endpoint) { statusEl.innerHTML = "Not sent · " + PHONE_HTML; return; }

    sendBtn.disabled = true;
    statusEl.textContent = "Sending";
    fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { return r.json().then(function (j) { return r.ok && String(j.success) !== "false"; }); })
      .then(function (ok) {
        if (!ok) throw new Error("rejected");
        statusEl.textContent = "Sent";
        form.reset();
        state.dishes = [];
        save();
        syncAdds();
      })
      .catch(function () { statusEl.innerHTML = "Not sent · " + PHONE_HTML; })
      .then(function () { sendBtn.disabled = false; });
  });

  $$("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });
  $("#year").textContent = new Date().getFullYear();

  select(/catering/.test(location.hash) ? "catering" : "takeout");
})();
