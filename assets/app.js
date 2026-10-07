/* Schilly's: small enhancements on top of pages that are already complete HTML (build.mjs).
   Everything here is optional: with JavaScript off, every page still shows its menu, hours and links. */
(function () {
  "use strict";

  var TZ = "America/New_York";
  var HOURS = { days: [0, 3, 4, 5, 6], open: 11, close: 18 }; // 0 = Sunday. Keep in sync with SITE in build.mjs.
  var PHONE_HTML = '<a href="tel:+12076938840">(207) 693-8840</a>';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Phone and tablet navigation: the menu opens in the page flow, not over it. */
  var toggle = $(".nav-toggle"), nav = $("#site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("nav-open", open);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { toggle.click(); toggle.focus(); }
    });
  }

  /* Open or closed, in Maine time */
  (function openStatus() {
    var outs = $$(".open-status");
    if (!outs.length) return;
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
    outs.forEach(function (o) { o.textContent = msg; o.classList.toggle("is-open", open); o.hidden = false; });
  })();

  /* Menu search */
  var listEl = $("#menuList"), searchEl = $("#menuSearch"), jumpEl = $("#menuJump");
  if (listEl && searchEl) {
    searchEl.addEventListener("input", function () {
      var q = searchEl.value.trim().toLowerCase(), any = false;
      $$(".menu-sec", listEl).forEach(function (sec) {
        var shown = 0;
        $$(".item", sec).forEach(function (li) {
          li.hidden = !!q && li.dataset.search.indexOf(q) === -1;
          if (!li.hidden) shown++;
        });
        sec.hidden = !shown;
        var link = jumpEl && jumpEl.querySelector('a[href="#' + sec.id + '"]');
        if (link) link.hidden = !shown;
        if (shown) any = true;
      });
      $$(".menu-group", listEl).forEach(function (g) { g.hidden = !!q; });
      $("#menuEmpty").hidden = any;
      syncSpy();
    });
  }

  /* Scroll spy, rebuilt from the 21st.dev Scroll Spy pattern (ddoemonn):
     the active section is the last one whose top has passed a fixed reading line a third of the way
     down the screen. At the true end of the page the last section lights. A click holds its section
     until scrolling settles (scrollend where supported, a timer elsewhere). */
  var spyLock = null, spyLockTimer = 0, spyFrame = 0, spyActive = "";
  function headerOffset() { return window.innerWidth >= 1100 ? 136 : 24; }
  function measureSpy() {
    var secs = listEl ? $$(".menu-sec", listEl).filter(function (s) { return !s.hidden; }) : [];
    if (!secs.length) return "";
    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (max > 0 && window.scrollY >= max - 2) return secs[secs.length - 1].id;
    var line = headerOffset() + window.innerHeight * 0.33;
    var current = secs[0].id;
    secs.forEach(function (s) { if (s.getBoundingClientRect().top <= line + 1) current = s.id; });
    return current;
  }
  function setSpy(id) {
    if (!jumpEl || id === spyActive) return;
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
      var link = jumpEl.querySelector("a[aria-current]");
      var out = $("#spyAnnounce");
      if (out) out.textContent = link ? link.textContent : "";
    }, 420);
  }
  function syncSpy() {
    if (!jumpEl || spyFrame) return;
    spyFrame = requestAnimationFrame(function () {
      spyFrame = 0;
      var next = measureSpy();
      if (!next) return;
      if (spyLock) { if (spyLock === next) spyLock = null; return; }
      setSpy(next);
    });
  }
  if (jumpEl) {
    window.addEventListener("scroll", syncSpy, { passive: true });
    window.addEventListener("resize", syncSpy);
    ["wheel", "touchstart"].forEach(function (t) { window.addEventListener(t, function () { spyLock = null; }, { passive: true }); });
    window.addEventListener("scrollend", function () { if (spyLock) { spyLock = null; clearTimeout(spyLockTimer); syncSpy(); } });
    jumpEl.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      var id = a.getAttribute("href").slice(1), target = document.getElementById(id);
      if (!target) return;
      spyLock = id;
      setSpy(id);
      history.replaceState(null, "", "#" + id);
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - headerOffset() + 8, behavior: reduce ? "auto" : "smooth" });
      var h = target.querySelector("h2");
      if (h) h.focus({ preventScroll: true });
      clearTimeout(spyLockTimer);
      spyLockTimer = setTimeout(function () { spyLock = null; syncSpy(); }, "onscrollend" in window ? 2500 : 900);
    });
    syncSpy();
  }

  /* Inquiry form: same fields as the current site. Sends JSON to data-endpoint. */
  var form = $("#inquiryForm");
  if (form) {
    var statusEl = $("#formStatus"), sendBtn = $("#sendBtn");
    var dateEl = form.querySelector('input[type="date"]');
    if (dateEl) dateEl.min = new Date().toISOString().slice(0, 10);
    var fields = $$("input[required], textarea[required]", form);
    fields.forEach(function (i, n) {
      var msg = document.createElement("p");
      msg.className = "field-error"; msg.id = "err-" + n;
      i.setAttribute("aria-describedby", msg.id);
      i.parentNode.appendChild(msg);
      i.addEventListener("input", function () { if (i.getAttribute("aria-invalid") === "true" && i.value.trim() && i.checkValidity()) { i.setAttribute("aria-invalid", "false"); msg.textContent = ""; } });
    });
    function problem(i) {
      if (!i.value.trim()) return "Required";
      if (i.checkValidity()) return "";
      if (i.type === "email") return "Check this email";
      if (i.type === "tel") return "Check this number";
      if (i.type === "date") return "Check this date";
      return "Check this entry";
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = fields.filter(function (i) {
        var p = problem(i);
        i.setAttribute("aria-invalid", String(!!p));
        document.getElementById(i.getAttribute("aria-describedby")).textContent = p;
        return !!p;
      });
      statusEl.classList.toggle("is-error", !!bad.length);
      if (bad.length) { statusEl.textContent = "Fill in the marked fields"; bad[0].focus(); return; }
      var data = {};
      $$("input, textarea", form).forEach(function (i) { if (i.name) data[i.name] = i.value.trim(); });
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
        })
        .catch(function () { statusEl.innerHTML = "Not sent · " + PHONE_HTML; })
        .then(function () { sendBtn.disabled = false; });
    });
  }

  $$("[data-print]").forEach(function (b) { b.addEventListener("click", function () { window.print(); }); });
  $$(".year").forEach(function (y) { y.textContent = new Date().getFullYear(); });
})();
