/* ===== Erasmatch+ — app logic ===== */
(function () {
  "use strict";

  const state = {
    age: null,
    country: null,
    interests: new Set(),
    deck: [],      // queue of opportunities to swipe
    saved: [],     // liked opportunities
  };

  const $ = (sel) => document.querySelector(sel);
  const gradClass = (n) => "g" + (((n - 1) % 6) + 1);

  /* ---------- Onboarding setup ---------- */
  function populateCountries() {
    const sel = $("#country");
    COUNTRIES.slice().sort().forEach((c) => {
      const o = document.createElement("option");
      o.value = c; o.textContent = c;
      sel.appendChild(o);
    });
  }

  function buildInterestChips() {
    const wrap = $("#interest-chips");
    INTERESTS.forEach((label) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = label;
      chip.addEventListener("click", () => {
        chip.classList.toggle("active");
        if (state.interests.has(label)) state.interests.delete(label);
        else state.interests.add(label);
      });
      wrap.appendChild(chip);
    });
  }

  /* ---------- Matching ---------- */
  function ageEligible(op) {
    const a = state.age;
    return a >= op.minAge && a <= op.maxAge;
  }

  function matchScore(op) {
    // soft score: interest overlap + slight boost if hosted in user's country
    let score = 0;
    op.tags.forEach((t) => { if (state.interests.has(t)) score += 2; });
    if (op.country === state.country) score += 1;
    return score;
  }

  function buildDeck() {
    let pool = OPPORTUNITIES.filter(ageEligible);
    // If age filter is too strict and leaves nothing, fall back to all.
    if (pool.length === 0) pool = OPPORTUNITIES.slice();
    // Sort by match score desc, keep stable-ish variety
    pool = pool
      .map((op) => ({ op, s: matchScore(op), r: Math.random() }))
      .sort((a, b) => b.s - a.s || b.r - a.r)
      .map((x) => x.op);
    state.deck = pool;
  }

  /* ---------- Screen navigation ---------- */
  function show(screenId) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    $("#" + screenId).classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateProfilePill() {
    const flag = COUNTRY_FLAG[state.country] || "📍";
    $("#profile-pill").textContent = `${flag} ${state.country} · ${state.age} y/o · ${state.deck.length} matches`;
  }

  /* ---------- Card rendering ---------- */
  function metaTagsHTML(op) {
    const isMatch = matchScore(op) >= 2;
    return `
      <div class="card-meta">
        <span class="meta-tag">🗓️ ${op.dates}</span>
        <span class="meta-tag">⏳ ${op.duration}</span>
        <span class="meta-tag funded">💶 Funded</span>
        ${isMatch ? `<span class="meta-tag match">⭐ Great match</span>` : ``}
      </div>`;
  }

  function cardHTML(op) {
    return `
      <div class="stamp stamp-like">SAVE</div>
      <div class="stamp stamp-nope">PASS</div>
      <div class="card-hero ${gradClass(op.gradient)}">
        <span class="type-badge">${op.type}</span>
        <span class="hero-location">${op.flag} ${op.country} <span class="city">· ${op.city}</span></span>
        <span class="card-hero-emoji">${op.emoji}</span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${op.title}</h3>
        ${metaTagsHTML(op)}
        <p class="card-summary">${op.summary}</p>
        <div class="card-tags">${op.tags.map((t) => `<span class="itag">#${t}</span>`).join("")}</div>
      </div>`;
  }

  function renderDeck() {
    const deck = $("#deck");
    deck.innerHTML = "";
    if (state.deck.length === 0) {
      $("#deck-empty").hidden = false;
      $("#swipe-actions").style.visibility = "hidden";
      return;
    }
    $("#deck-empty").hidden = true;
    $("#swipe-actions").style.visibility = "visible";

    // Render up to 4 cards, topmost last in DOM so it's on top.
    const visible = state.deck.slice(0, 4);
    visible.forEach((op, i) => {
      const depth = visible.length - 1 - i; // 0 = top
      const el = document.createElement("article");
      el.className = "card";
      el.dataset.id = op.id;
      el.dataset.depth = depth;
      el.innerHTML = cardHTML(op);
      if (depth === 0) attachDrag(el, op);
      deck.appendChild(el);
    });
  }

  /* ---------- Swipe / drag ---------- */
  function attachDrag(card, op) {
    let startX = 0, startY = 0, dx = 0, dy = 0, dragging = false;

    const onDown = (e) => {
      dragging = true;
      card.classList.add("dragging");
      const p = point(e);
      startX = p.x; startY = p.y;
      document.addEventListener("pointermove", onMove);
      document.addEventListener("pointerup", onUp);
    };
    const onMove = (e) => {
      if (!dragging) return;
      const p = point(e);
      dx = p.x - startX; dy = p.y - startY;
      const rot = dx / 18;
      card.style.transform = `translate(${dx}px, ${dy}px) rotate(${rot}deg)`;
      const ratio = Math.min(Math.abs(dx) / 120, 1);
      card.querySelector(".stamp-like").style.opacity = dx > 0 ? ratio : 0;
      card.querySelector(".stamp-nope").style.opacity = dx < 0 ? ratio : 0;
    };
    const onUp = () => {
      dragging = false;
      card.classList.remove("dragging");
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      if (Math.abs(dx) > 110) {
        commitSwipe(dx > 0 ? "like" : "nope");
      } else {
        card.style.transform = "";
        card.querySelector(".stamp-like").style.opacity = 0;
        card.querySelector(".stamp-nope").style.opacity = 0;
      }
      dx = 0; dy = 0;
    };
    card.addEventListener("pointerdown", onDown);
  }

  function point(e) {
    if (e.touches && e.touches[0]) return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    return { x: e.clientX, y: e.clientY };
  }

  let swiping = false;
  function commitSwipe(dir) {
    if (swiping) return;
    const top = $('.card[data-depth="0"]');
    if (!top) return;
    swiping = true;
    const op = state.deck[0];

    const flyX = dir === "like" ? window.innerWidth : -window.innerWidth;
    const rot = dir === "like" ? 24 : -24;
    top.classList.add("animating");
    top.style.transform = `translate(${flyX}px, -40px) rotate(${rot}deg)`;
    top.style.opacity = "0";

    if (dir === "like") {
      top.querySelector(".stamp-like").style.opacity = 1;
      saveOpportunity(op);
    } else {
      top.querySelector(".stamp-nope").style.opacity = 1;
    }

    setTimeout(() => {
      state.deck.shift();
      swiping = false;
      renderDeck();
    }, 320);
  }

  function saveOpportunity(op) {
    if (!state.saved.find((s) => s.id === op.id)) {
      state.saved.push(op);
      updateLikesBadge();
      toast(`💛 Saved “${op.title}”`);
    }
  }

  /* ---------- Saved list ---------- */
  function updateLikesBadge() {
    const badge = $("#likes-badge");
    if (state.saved.length > 0) { badge.hidden = false; badge.textContent = state.saved.length; }
    else badge.hidden = true;
  }

  function renderLikes() {
    const list = $("#likes-list");
    list.innerHTML = "";
    if (state.saved.length === 0) {
      $("#likes-empty").style.display = "block";
      return;
    }
    $("#likes-empty").style.display = "none";
    state.saved.forEach((op) => {
      const item = document.createElement("div");
      item.className = "like-item";
      item.innerHTML = `
        <div class="like-thumb ${gradClass(op.gradient)}">${op.emoji}</div>
        <div class="like-info">
          <h4>${op.title}</h4>
          <p>${op.flag} ${op.country} · ${op.type} · ${op.dates}</p>
        </div>
        <button class="like-apply" data-apply="${op.id}">Apply</button>
        <button class="like-remove" data-remove="${op.id}" aria-label="Remove">&times;</button>`;
      list.appendChild(item);
    });
  }

  /* ---------- Detail modal ---------- */
  function openModal(op) {
    const isMatch = matchScore(op) >= 2;
    $("#modal-body").innerHTML = `
      <div class="modal-hero ${gradClass(op.gradient)}">${op.emoji}</div>
      <div class="modal-content">
        <span class="type-badge">${op.type}</span>
        <h3>${op.title}</h3>
        <p class="modal-loc">${op.flag} ${op.country} · ${op.city}</p>
        ${isMatch ? `<p class="meta-tag match" style="display:inline-flex">⭐ Great match for your interests</p>` : ``}
        <p class="card-summary">${op.summary}</p>

        <div class="modal-section-title">At a glance</div>
        <div class="modal-grid">
          <div class="modal-stat"><span>Dates</span><strong>${op.dates}</strong></div>
          <div class="modal-stat"><span>Duration</span><strong>${op.duration}</strong></div>
          <div class="modal-stat"><span>Eligible age</span><strong>${op.minAge}–${op.maxAge}</strong></div>
          <div class="modal-stat"><span>Spots left</span><strong>${op.spots}</strong></div>
        </div>

        <div class="modal-section-title">What's included</div>
        <ul class="perk-list">
          ${op.perks.map((p) => `<li>${p}</li>`).join("")}
        </ul>

        <div class="modal-section-title">Funding</div>
        <p class="card-summary">${op.funding}</p>

        <button class="modal-apply" data-apply="${op.id}">Apply now</button>
        <p class="modal-note">Mockup — applications are not really submitted.</p>
      </div>`;
    $("#modal").hidden = false;
  }
  function closeModal() { $("#modal").hidden = true; }

  /* ---------- Toast ---------- */
  let toastTimer = null;
  function toast(msg) {
    let t = $("#toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "toast"; t.className = "toast";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    requestAnimationFrame(() => t.classList.add("show"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- Events ---------- */
  function bindEvents() {
    // Profile form submit
    $("#profile-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const ageInput = $("#age");
      const countrySel = $("#country");
      const age = parseInt(ageInput.value, 10);
      let ok = true;

      if (!age || age < 13 || age > 35) { ageInput.classList.add("invalid"); ok = false; }
      else ageInput.classList.remove("invalid");

      if (!countrySel.value) { countrySel.classList.add("invalid"); ok = false; }
      else countrySel.classList.remove("invalid");

      if (!ok) { toast("Please enter a valid age (13–35) and country"); return; }

      state.age = age;
      state.country = countrySel.value;
      buildDeck();
      updateProfilePill();
      renderDeck();
      show("swipe");
    });

    // Action buttons
    $("#btn-nope").addEventListener("click", () => commitSwipe("nope"));
    $("#btn-like").addEventListener("click", () => commitSwipe("like"));
    $("#btn-info").addEventListener("click", () => {
      if (state.deck[0]) openModal(state.deck[0]);
    });

    // Navigation
    $("#back-to-profile").addEventListener("click", () => show("onboarding"));
    $("#show-likes").addEventListener("click", () => { renderLikes(); show("likes"); });
    $("#back-to-swipe").addEventListener("click", () => show("swipe"));
    $("#restart-deck").addEventListener("click", () => { buildDeck(); updateProfilePill(); renderDeck(); });

    // Modal close
    $("#modal").addEventListener("click", (e) => {
      if (e.target.hasAttribute("data-close")) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
      if ($("#swipe").classList.contains("active") && !swiping) {
        if (e.key === "ArrowLeft") commitSwipe("nope");
        if (e.key === "ArrowRight") commitSwipe("like");
      }
    });

    // Delegated apply / remove (modal + likes list)
    document.addEventListener("click", (e) => {
      const applyBtn = e.target.closest("[data-apply]");
      if (applyBtn) {
        const op = OPPORTUNITIES.find((o) => o.id === applyBtn.getAttribute("data-apply"));
        if (op) { saveOpportunity(op); closeModal(); toast(`🚀 Application started for “${op.title}”`); }
        return;
      }
      const rmBtn = e.target.closest("[data-remove]");
      if (rmBtn) {
        const id = rmBtn.getAttribute("data-remove");
        state.saved = state.saved.filter((o) => o.id !== id);
        updateLikesBadge();
        renderLikes();
      }
    });
  }

  /* ---------- Country flag lookup ---------- */
  const COUNTRY_FLAG = {
    "Austria":"🇦🇹","Belgium":"🇧🇪","Bulgaria":"🇧🇬","Croatia":"🇭🇷","Cyprus":"🇨🇾","Czechia":"🇨🇿",
    "Denmark":"🇩🇰","Estonia":"🇪🇪","Finland":"🇫🇮","France":"🇫🇷","Germany":"🇩🇪","Greece":"🇬🇷",
    "Hungary":"🇭🇺","Iceland":"🇮🇸","Ireland":"🇮🇪","Italy":"🇮🇹","Latvia":"🇱🇻","Lithuania":"🇱🇹",
    "Luxembourg":"🇱🇺","Malta":"🇲🇹","Netherlands":"🇳🇱","North Macedonia":"🇲🇰","Norway":"🇳🇴",
    "Poland":"🇵🇱","Portugal":"🇵🇹","Romania":"🇷🇴","Serbia":"🇷🇸","Slovakia":"🇸🇰","Slovenia":"🇸🇮",
    "Spain":"🇪🇸","Sweden":"🇸🇪","Türkiye":"🇹🇷","Albania":"🇦🇱","Armenia":"🇦🇲","Georgia":"🇬🇪",
    "Moldova":"🇲🇩","Ukraine":"🇺🇦"
  };
  window.COUNTRY_FLAG = COUNTRY_FLAG;

  /* ---------- Init ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    populateCountries();
    buildInterestChips();
    bindEvents();
  });
})();
