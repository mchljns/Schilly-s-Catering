(function () {
  "use strict";

  var PHONE_SMS = "+12077131564";
  var STORE_KEY = "schillys-picked";

  var menu = window.MENU || [];
  var tags = window.TAGS || {};
  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  var listEl = $("#menuList");
  var jumpEl = $("#menuJump");
  var filtersEl = $("#menuFilters");
  var searchEl = $("#menuSearch");
  var emptyEl = $("#menuEmpty");

  var state = { query: "", filters: new Set(), picked: loadPicked() };

  function loadPicked() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; }
  }
  function savePicked() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state.picked)); } catch (e) { /* storage unavailable */ }
  }

  function el(tag, attrs, text) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    if (text != null) node.textContent = text;
    return node;
  }

  /* ---------- Build menu ---------- */
  if (window.MENU_IS_DRAFT) $("#draftNote").hidden = false;

  ["gf", "v", "vg", "df"].forEach(function (key) {
    if (!tags[key]) return;
    var b = el("button", { type: "button", class: "chip", "aria-pressed": "false", "data-tag": key }, tags[key].label);
    filtersEl.appendChild(b);
  });

  menu.forEach(function (cat) {
    jumpEl.appendChild(el("a", { href: "#cat-" + cat.id }, cat.title));

    var section = el("section", { class: "menu-cat", id: "cat-" + cat.id, "aria-labelledby": "h-" + cat.id });
    section.appendChild(el("h3", { id: "h-" + cat.id }, cat.title));
    if (cat.blurb) section.appendChild(el("p", null, cat.blurb));

    var ul = el("ul", { class: "items" });
    cat.items.forEach(function (item) {
      var li = el("li", { class: "item" });
      li.dataset.search = (item.name + " " + (item.desc || "") + " " + cat.title).toLowerCase();
      li.dataset.tags = (item.tags || []).join(" ");

      li.appendChild(el("p", { class: "item-name" }, item.name));
      if (item.desc) li.appendChild(el("p", { class: "item-desc" }, item.desc));

      var meta = el("div", { class: "item-meta" });
      if (item.price) meta.appendChild(el("span", { class: "item-price" }, item.price));
      if (item.unit) meta.appendChild(el("span", { class: "item-unit" }, item.unit));
      (item.tags || []).forEach(function (t) {
        if (!tags[t]) return;
        var tg = el("span", { class: "tag" + (t === "popular" ? " tag-popular" : ""), title: tags[t].label }, t === "popular" ? "★ " + tags[t].label : tags[t].short);
        if (t !== "popular") tg.setAttribute("aria-label", tags[t].label);
        meta.appendChild(tg);
      });
      li.appendChild(meta);

      var add = el("button", { type: "button", class: "add-btn", "data-name": item.name, "aria-label": "Add " + item.name + " to quote" });
      li.appendChild(add);
      ul.appendChild(li);
    });
    section.appendChild(ul);
    listEl.appendChild(section);
  });

  /* ---------- Filtering ---------- */
  function applyFilters() {
    var q = state.query;
    var any = false;
    listEl.querySelectorAll(".menu-cat").forEach(function (cat) {
      var shown = 0;
      cat.querySelectorAll(".item").forEach(function (li) {
        var itemTags = li.dataset.tags.split(" ");
        var okQ = !q || li.dataset.search.indexOf(q) !== -1;
        var okF = Array.from(state.filters).every(function (f) {
          // vegan dishes also count as vegetarian
          return itemTags.indexOf(f) !== -1 || (f === "v" && itemTags.indexOf("vg") !== -1);
        });
        li.hidden = !(okQ && okF);
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
    applyFilters();
  });
  filtersEl.addEventListener("click", function (e) {
    var b = e.target.closest(".chip");
    if (!b) return;
    var on = b.getAttribute("aria-pressed") !== "true";
    b.setAttribute("aria-pressed", String(on));
    state.filters[on ? "add" : "delete"](b.dataset.tag);
    applyFilters();
  });

  /* ---------- Active category in jump bar ---------- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        jumpEl.querySelectorAll("a").forEach(function (a) {
          var active = a.getAttribute("href") === "#" + en.target.id;
          a.classList.toggle("active", active);
          if (active) jumpEl.scrollLeft = a.offsetLeft - 16;
        });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    listEl.querySelectorAll(".menu-cat").forEach(function (c) { io.observe(c); });
  }

  /* ---------- Picked dishes (quote builder) ---------- */
  var pickedList = $("#pickedList");
  var pickedEmpty = $("#pickedEmpty");
  var barCount = $("#barCount");
  var toast = $("#toast");
  var toastTimer;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toast.classList.remove("show"); }, 1800);
  }

  function renderPicked() {
    listEl.querySelectorAll(".add-btn").forEach(function (b) {
      var on = state.picked.indexOf(b.dataset.name) !== -1;
      b.setAttribute("aria-pressed", String(on));
      b.textContent = on ? "✓ Added" : "+ Add";
    });
    pickedList.textContent = "";
    state.picked.forEach(function (name) {
      var li = el("li", null, name);
      var rm = el("button", { type: "button", "aria-label": "Remove " + name, "data-name": name }, "×");
      li.appendChild(rm);
      pickedList.appendChild(li);
    });
    pickedEmpty.hidden = state.picked.length > 0;
    barCount.hidden = state.picked.length === 0;
    barCount.textContent = state.picked.length;
  }

  function toggle(name) {
    var i = state.picked.indexOf(name);
    if (i === -1) { state.picked.push(name); showToast("Added " + name + " to your quote"); }
    else { state.picked.splice(i, 1); showToast("Removed " + name); }
    savePicked();
    renderPicked();
  }

  listEl.addEventListener("click", function (e) {
    var b = e.target.closest(".add-btn");
    if (b) toggle(b.dataset.name);
  });
  pickedList.addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (b) toggle(b.dataset.name);
  });
  renderPicked();

  /* ---------- Quote form ---------- */
  var form = $("#quoteForm");
  var errEl = $("#formError");

  function buildMessage() {
    var f = form.elements;
    var lines = ["Catering quote request (from website)"];
    var add = function (label, v) { if (v && String(v).trim()) lines.push(label + ": " + String(v).trim()); };
    add("Name", f.name.value);
    add("Phone", f.phone.value);
    add("Event", f.type.value);
    add("Date", f.date.value);
    add("Guests", f.guests.value);
    add("Where", f.where.value);
    if (state.picked.length) add("Interested in", state.picked.join(", "));
    add("Notes", f.notes.value);
    return lines.join("\n");
  }

  function validate() {
    var missing = [];
    ["name", "phone"].forEach(function (n) {
      var input = form.elements[n];
      var bad = !input.value.trim();
      input.setAttribute("aria-invalid", String(bad));
      if (bad) missing.push(input.closest("label").firstChild.textContent.trim());
    });
    errEl.hidden = !missing.length;
    if (missing.length) {
      errEl.textContent = "Please add your " + missing.join(" and ").toLowerCase() + " so we can get back to you.";
      form.elements[missing.length && !form.elements.name.value.trim() ? "name" : "phone"].focus();
    }
    return !missing.length;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) return;
    // iOS uses "&body=", Android "?body="; "?&body=" works on both.
    window.location.href = "sms:" + PHONE_SMS + "?&body=" + encodeURIComponent(buildMessage());
  });

  $("#copyBtn").addEventListener("click", function () {
    if (!validate()) return;
    var text = buildMessage();
    var done = function () { showToast("Copied. Paste it into a text or email"); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { window.prompt("Copy your request:", text); });
    } else {
      window.prompt("Copy your request:", text);
    }
  });

  /* ---------- Misc ---------- */
  document.querySelectorAll("[data-print]").forEach(function (b) {
    b.addEventListener("click", function () { window.print(); });
  });
  $("#year").textContent = new Date().getFullYear();
})();
