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

    $("#menuSub").textContent = m.sub;
    var intro = $("#menuIntro");
    intro.hidden = !m.intro;
    intro.textContent = m.intro || "";

    m.sections.forEach(function (sec) {
      var id = m.id + "-" + slug(sec.title);
      if (sec.group) listEl.appendChild(el("h3", { class: "menu-group" }, sec.group));
      jumpEl.appendChild(el("a", { href: "#" + id }, sec.title));

      var box = el("section", { class: "menu-sec", id: id, "aria-labelledby": id + "-h" });
      box.appendChild(el("h3", { id: id + "-h" }, sec.title));
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
        text.appendChild(el("p", { class: "item-name" }, name));
        if (detail) text.appendChild(el("p", { class: "item-detail" }, detail));
        li.appendChild(text);
        if (price) li.appendChild(el("span", { class: "item-price" }, price));
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
        f.appendChild(el("h3", null, m.closing.title));
        f.appendChild(el("p", null, m.closing.text));
        var call = el("a", { class: "btn btn-red", href: "tel:+12076938840" }, "Call");
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

  var observer;
  function watchSections() {
    if (!("IntersectionObserver" in window)) return;
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$("a", jumpEl).forEach(function (a) {
          var on = a.getAttribute("href") === "#" + e.target.id;
          a.classList.toggle("active", on);
          if (on) jumpEl.scrollLeft = a.offsetLeft - 16;
        });
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    $$(".menu-sec", listEl).forEach(function (s) { observer.observe(s); });
  }

  /* Tabs */
  var tabs = $$(".tab");
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
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      var i = (tabs.indexOf(t) + (e.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
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
