(function () {
  "use strict";

  var STORE_KEY = "schillys-picked";
  var TZ = "America/New_York";
  // Open days (0 = Sunday) and hours, 24h clock. Keep in sync with the hours table.
  var HOURS = { days: [0, 3, 4, 5, 6], open: 11, close: 18 };

  var menus = window.MENUS || {};
  var tags = window.TAGS || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }

  function loadPicked() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function savePicked() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.picked)); } catch (e) { /* storage unavailable */ }
  }

  var state = { tab: "takeout", query: "", picked: loadPicked() };

  var listEl = $("#menuList");
  var jumpEl = $("#menuJump");
  var searchEl = $("#menuSearch");
  var emptyEl = $("#menuEmpty");
  var panel = $("#panel");

  /* ---------- Open / closed status ---------- */
  function nowInMaine() {
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: TZ, weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    var get = function (t) { return (parts.find(function (p) { return p.type === t; }) || {}).value; };
    var day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day: day, hour: (+get("hour")) % 24 + (+get("minute")) / 60 };
  }

  function renderOpenStatus() {
    var out = $("#openStatus");
    var n;
    try { n = nowInMaine(); } catch (e) { return; }
    var openToday = HOURS.days.indexOf(n.day) !== -1;
    var isOpen = openToday && n.hour >= HOURS.open && n.hour < HOURS.close;
    var msg;
    if (isOpen) {
      msg = "Open now · until 6pm";
    } else if (openToday && n.hour < HOURS.open) {
      msg = "Closed · opens today at 11am";
    } else {
      var names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var d = n.day;
      for (var i = 1; i <= 7; i++) { d = (n.day + i) % 7; if (HOURS.days.indexOf(d) !== -1) break; }
      msg = "Closed · opens " + (i === 1 ? "tomorrow" : names[d]) + " at 11am";
    }
    out.textContent = msg;
    out.classList.toggle("is-open", isOpen);
    out.hidden = false;
    var row = $('.hours tr[data-day="' + n.day + '"]');
    if (row) row.classList.add("today");
  }
  renderOpenStatus();

  /* ---------- Menu rendering ---------- */
  function renderMenu() {
    var m = menus[state.tab];
    if (!m) return;
    var catering = state.tab === "catering";
    $("#menuIntro").textContent = m.intro || "";
    listEl.textContent = "";
    jumpEl.textContent = "";
    listEl.classList.toggle("is-takeout", !catering);

    m.categories.forEach(function (cat) {
      jumpEl.appendChild(el("a", { href: "#cat-" + cat.id }, cat.title));

      var section = el("section", { class: "menu-cat", id: "cat-" + cat.id, "aria-labelledby": "h-" + cat.id });
      section.appendChild(el("h3", { id: "h-" + cat.id }, cat.title));
      if (cat.blurb) section.appendChild(el("p", { class: "cat-blurb" }, cat.blurb));

      var ul = el("ul", { class: "items" });
      cat.items.forEach(function (item) {
        var li = el("li", { class: "item" });
        li.dataset.search = [item.name, item.desc, item.note, cat.title].join(" ").toLowerCase();

        var main = el("div", { class: "item-main" });
        var nameRow = el("p", { class: "item-name" });
        nameRow.appendChild(el("span", null, item.name));
        (item.tags || []).forEach(function (t) {
          if (tags[t]) nameRow.appendChild(el("span", { class: "tag", title: tags[t].label }, tags[t].short));
        });
        main.appendChild(nameRow);
        if (item.desc) main.appendChild(el("p", { class: "item-desc" }, item.desc));
        if (item.note) main.appendChild(el("p", { class: "item-note" }, item.note));
        li.appendChild(main);

        if (item.price) li.appendChild(el("span", { class: "item-price" }, item.price));

        if (catering) {
          var key = cat.title + ": " + item.name;
          li.appendChild(el("button", { type: "button", class: "add-btn", "data-key": key, "data-name": item.name, "aria-label": "Add " + item.name + " to your inquiry" }));
        }
        ul.appendChild(li);
      });
      section.appendChild(ul);
      listEl.appendChild(section);
    });

    var foot = $("#menuFoot");
    foot.textContent = "";
    (m.footnotes || []).forEach(function (f) { foot.appendChild(el("li", null, f)); });

    applySearch();
    syncAddButtons();
    observeCategories();
  }

  function applySearch() {
    var q = state.query;
    var any = false;
    $$(".menu-cat", listEl).forEach(function (cat) {
      var shown = 0;
      $$(".item", cat).forEach(function (li) {
        li.hidden = !!q && li.dataset.search.indexOf(q) === -1;
        if (!li.hidden) shown++;
      });
      cat.hidden = shown === 0;
      var link = jumpEl.querySelector('a[href="#' + cat.id + '"]');
      if (link) link.hidden = shown === 0;
      if (shown) any = true;
    });
    emptyEl.hidden = any;
  }

  searchEl.addEventListener("input", function () {
    state.query = searchEl.value.trim().toLowerCase();
    applySearch();
  });

  /* ---------- Tabs ---------- */
  var tabs = $$(".tab");
  function selectTab(name, focus) {
    if (!menus[name]) return;
    state.tab = name;
    tabs.forEach(function (t) {
      var on = t.dataset.tab === name;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panel.setAttribute("aria-labelledby", "tab-" + name);
    renderMenu();
  }
  tabs.forEach(function (t) {
    t.addEventListener("click", function () { selectTab(t.dataset.tab); });
    t.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var i = tabs.indexOf(t) + (e.key === "ArrowRight" ? 1 : -1);
      selectTab(tabs[(i + tabs.length) % tabs.length].dataset.tab, true);
    });
  });
  // Any link like <a data-tab-link="catering"> switches the menu tab before scrolling.
  document.addEventListener("click", function (e) {
    var a = e.target.closest("[data-tab-link]");
    if (a) selectTab(a.dataset.tabLink);
  });

  /* ---------- Active section in jump bar ---------- */
  var io = null;
  function observeCategories() {
    if (!("IntersectionObserver" in window)) return;
    if (io) io.disconnect();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        $$("a", jumpEl).forEach(function (a) {
          var active = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("active", active);
          if (active) jumpEl.scrollLeft = a.offsetLeft - 16;
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    $$(".menu-cat", listEl).forEach(function (c) { io.observe(c); });
  }

  /* ---------- Picked dishes (inquiry builder) ---------- */
  var pickedList = $("#pickedList");
  var toast = $("#toast");
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  function syncAddButtons() {
    $$(".add-btn", listEl).forEach(function (b) {
      var on = state.picked.indexOf(b.dataset.key) !== -1;
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ Added" : "+ Add";
    });
  }

  function renderPicked() {
    syncAddButtons();
    pickedList.textContent = "";
    state.picked.forEach(function (key) {
      var li = el("li", null, key.split(": ").pop());
      li.title = key;
      li.appendChild(el("button", { type: "button", "aria-label": "Remove " + key, "data-key": key }, "×"));
      pickedList.appendChild(li);
    });
    $("#pickedEmpty").hidden = state.picked.length > 0;
    var count = $("#barCount");
    count.hidden = state.picked.length === 0;
    count.textContent = state.picked.length;
  }

  function toggle(key, name) {
    var i = state.picked.indexOf(key);
    if (i === -1) { state.picked.push(key); showToast("Added " + name + " to your inquiry"); }
    else { state.picked.splice(i, 1); showToast("Removed " + name); }
    savePicked();
    renderPicked();
  }

  listEl.addEventListener("click", function (e) {
    var b = e.target.closest(".add-btn");
    if (b) toggle(b.dataset.key, b.dataset.name);
  });
  pickedList.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) toggle(b.dataset.key, b.dataset.key.split(": ").pop());
  });

  /* ---------- Inquiry form ---------- */
  var form = $("#inquiryForm");
  var errEl = $("#formError");
  var sendBtn = $("#sendBtn");

  function fieldLabel(input) {
    return input.closest("label").firstChild.textContent.trim().toLowerCase();
  }

  function validate() {
    var bad = [];
    $$("input[required]", form).forEach(function (input) {
      var ok = input.value.trim() !== "" && input.checkValidity();
      input.setAttribute("aria-invalid", String(!ok));
      if (!ok) bad.push(input);
    });
    errEl.hidden = !bad.length;
    if (bad.length) {
      errEl.textContent = "Please check: " + bad.map(fieldLabel).join(", ") + ".";
      bad[0].focus();
    }
    return !bad.length;
  }

  function collect() {
    var data = {};
    $$("input[name], textarea[name]", form).forEach(function (i) { data[i.name] = i.value.trim(); });
    data.dishes = state.picked.join("; ");
    return data;
  }

  function asText(d) {
    var lines = ["Catering inquiry"];
    var add = function (label, v) { if (v) lines.push(label + ": " + v); };
    add("Name", (d.first_name + " " + d.last_name).trim());
    add("Email", d.email);
    add("Phone", d.phone);
    add("Event date", d.event_date);
    add("Guests", d.guest_count);
    add("Location", d.event_location);
    add("Interested in", state.picked.join(", "));
    add("Details", d.message);
    return lines.join("\n");
  }

  function showPanel(id) {
    $("#formActions").hidden = true;
    var p = $(id);
    p.hidden = false;
    p.focus();
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    var data = collect();
    var endpoint = form.dataset.endpoint;

    if (!endpoint) {
      $("#fallbackText").value = asText(data);
      showPanel("#formFallback");
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = "Sending…";
    fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    }).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      state.picked = [];
      savePicked();
      renderPicked();
      showPanel("#formDone");
    }).catch(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send inquiry";
      $("#fallbackText").value = asText(data);
      showPanel("#formFallback");
    });
  });

  $("#copyBtn").addEventListener("click", function () {
    var ta = $("#fallbackText");
    var done = function () { showToast("Copied"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(ta.value).then(done, function () { ta.select(); });
    } else {
      ta.select();
    }
  });

  /* ---------- Misc ---------- */
  $$("[data-print]").forEach(function (b) {
    b.addEventListener("click", function () { window.print(); });
  });
  $$("#gallery img").forEach(function (img) {
    img.addEventListener("error", function () { img.remove(); });
  });
  $("#year").textContent = new Date().getFullYear();

  selectTab(location.hash === "#catering" ? "catering" : "takeout");
  renderPicked();
})();
