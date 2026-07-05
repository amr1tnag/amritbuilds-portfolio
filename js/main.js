/* ═══════════════════════════════════════════════════════════
   amrit.builds — bento edition · zero dependencies
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL = "amritnag2005@gmail.com";
  const TRACK_ID = "6PRFDCNAMLeSZimkPGrKMG"; // 5-7 — Karan Aujla, Mxrci

  /* ══════════════ TOAST ══════════════ */
  const toastEl = $("#toast");
  let toastTimer;
  const toast = (msg, ms = 2400) => {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), ms);
  };

  /* ══════════════ THEME ══════════════ */
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  const toggleTheme = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  };
  $("#theme-toggle").addEventListener("click", toggleTheme);

  /* ══════════════ LIVE CLOCK ══════════════ */
  const clock = $("#clock");
  const tickClock = () => {
    const d = new Date();
    const date = d.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" });
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    clock.textContent = `${date}, ${time}`;
  };
  tickClock();
  setInterval(tickClock, 1000);

  /* ══════════════ "I build ___." TYPEWRITER ══════════════ */
  const WORDS = ["systems", "interfaces", "dev tools", "fast things", "side quests"];
  const wordEl = $("#build-word");
  let wIdx = 0;

  const typeWord = async () => {
    const next = WORDS[(wIdx = (wIdx + 1) % WORDS.length)];
    const curr = wordEl.textContent;
    for (let i = curr.length; i >= 0; i--) {
      wordEl.textContent = curr.slice(0, i);
      await new Promise((r) => setTimeout(r, 38));
    }
    for (let i = 1; i <= next.length; i++) {
      wordEl.textContent = next.slice(0, i);
      await new Promise((r) => setTimeout(r, 62));
    }
  };
  if (!reducedMotion) setInterval(typeWord, 3600);

  /* ══════════════ MUSIC PLAYER (5-7 · Karan Aujla) ══════════════ */
  const musicCard = $("#music-card");
  const musicPlayer = $(".music-player");
  let playerLoaded = false;

  const openPlayer = () => {
    if (musicCard.classList.contains("playing")) return;
    if (!playerLoaded) {
      playerLoaded = true;
      const iframe = document.createElement("iframe");
      iframe.src = `https://open.spotify.com/embed/track/${TRACK_ID}?utm_source=generator&theme=0`;
      iframe.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
      iframe.loading = "lazy";
      iframe.title = "5-7 — Karan Aujla on Spotify";
      musicPlayer.appendChild(iframe);
    }
    musicPlayer.hidden = false;
    musicCard.classList.add("playing");
  };
  const closePlayer = (e) => {
    e?.stopPropagation();
    musicCard.classList.remove("playing");
    musicPlayer.hidden = true;
  };

  musicCard.addEventListener("click", openPlayer);
  musicCard.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPlayer(); }
  });
  $("#music-close").addEventListener("click", closePlayer);

  /* ══════════════ OVERLAYS ══════════════ */
  const overlays = {
    projects: $("#overlay-projects"),
    experience: $("#overlay-experience"),
  };
  let lastFocus = null;

  const openOverlay = (which) => {
    lastFocus = document.activeElement;
    overlays[which].hidden = false;
    document.body.style.overflow = "hidden";
    overlays[which].querySelector(".overlay-close").focus();
  };
  const closeOverlays = () => {
    for (const o of Object.values(overlays)) o.hidden = true;
    document.body.style.overflow = "";
    lastFocus?.focus();
  };

  $("#open-projects").addEventListener("click", () => openOverlay("projects"));
  $("#open-experience").addEventListener("click", () => openOverlay("experience"));
  $$("[data-close]").forEach((b) => b.addEventListener("click", closeOverlays));
  for (const o of Object.values(overlays)) {
    o.addEventListener("click", (e) => { if (e.target === o) closeOverlays(); });
  }

  /* ══════════════ CURSOR GLOW ══════════════ */
  if (!matchMedia("(hover: none)").matches && !reducedMotion) {
    $$("[data-glow]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
      });
    });
  }

  /* ══════════════ TILE TILT (big tiles) ══════════════ */
  if (!matchMedia("(hover: none)").matches && !reducedMotion) {
    $$(".tile--big").forEach((tile) => {
      tile.addEventListener("pointermove", (e) => {
        const r = tile.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transform = `translateY(-4px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg)`;
      });
      tile.addEventListener("pointerleave", () => { tile.style.transform = ""; });
    });
  }

  /* ══════════════ COPY EMAIL ══════════════ */
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      toast(`📋 ${EMAIL} copied — talk soon`);
    } catch {
      location.href = `mailto:${EMAIL}`;
    }
  };
  $(".link-sq--mail").addEventListener("click", (e) => {
    e.preventDefault();
    copyEmail();
  });

  /* ══════════════ AVATAR EGG ══════════════ */
  const avatar = $("#avatar");
  let pats = 0;
  const PAT_LINES = ["👋 sup", "🫡 at your service", "☕ need coffee", "🚀 shipping...", "🎧 vibing to 5-7"];
  avatar.addEventListener("click", () => {
    avatar.classList.remove("spin");
    void avatar.offsetWidth; // restart animation
    avatar.classList.add("spin");
    toast(PAT_LINES[pats++ % PAT_LINES.length], 1600);
  });

  /* ══════════════ PARTY MODE ══════════════ */
  const toggleParty = () => {
    const on = document.body.classList.toggle("party");
    toast(on ? "🎉 party mode: ON" : "😴 party mode: off", 1800);
  };

  /* ══════════════ COMMAND PALETTE ══════════════ */
  const palette = $("#palette");
  const paletteInput = $("#palette-input");
  const paletteList = $("#palette-list");
  let activeIdx = 0, filtered = [];

  const COMMANDS = [
    { icon: "🛠", label: "open projects", hint: "view", run: () => openOverlay("projects") },
    { icon: "🧭", label: "open experience", hint: "view", run: () => openOverlay("experience") },
    { icon: "🎧", label: "play 5-7 · karan aujla", hint: "music", run: openPlayer },
    { icon: "🌓", label: "toggle theme", hint: "ui", run: toggleTheme },
    { icon: "📋", label: "copy email address", hint: "action", run: copyEmail },
    { icon: "🐙", label: "open github", hint: "link", run: () => open("https://github.com/amr1tnag", "_blank") },
    { icon: "💼", label: "open linkedin", hint: "link", run: () => open("https://www.linkedin.com/in/amrit-nag-5a8724326/", "_blank") },
    { icon: "📄", label: "open resume", hint: "link", run: () => open("resume.pdf", "_blank") },
    { icon: "🎉", label: "toggle party mode", hint: "fun", run: toggleParty },
    { icon: "🔐", label: "sudo hire amrit", hint: "fun", run: () => { copyEmail(); if (!document.body.classList.contains("party")) toggleParty(); setTimeout(() => document.body.classList.remove("party"), 5000); } },
  ];

  const renderPalette = () => {
    const q = paletteInput.value.trim().toLowerCase();
    filtered = COMMANDS.filter((c) => c.label.includes(q) || c.hint.includes(q));
    activeIdx = Math.min(activeIdx, Math.max(filtered.length - 1, 0));
    paletteList.innerHTML = filtered.length
      ? filtered.map((c, i) => `
        <li class="palette-item ${i === activeIdx ? "active" : ""}" data-i="${i}" role="option" aria-selected="${i === activeIdx}">
          <span class="pi-icon">${c.icon}</span>${c.label}<span class="pi-hint">${c.hint}</span>
        </li>`).join("")
      : `<li class="palette-empty">command not found: ${q.replace(/[<>&]/g, "")}</li>`;
  };

  const openPalette = () => {
    palette.hidden = false;
    paletteInput.value = "";
    activeIdx = 0;
    renderPalette();
    paletteInput.focus();
  };
  const closePalette = () => { palette.hidden = true; };

  $("#open-palette").addEventListener("click", openPalette);
  paletteInput.addEventListener("input", () => { activeIdx = 0; renderPalette(); });
  palette.addEventListener("click", (e) => {
    if (e.target === palette) closePalette();
    const item = e.target.closest(".palette-item");
    if (item) { closePalette(); filtered[+item.dataset.i]?.run(); }
  });
  paletteList.addEventListener("pointermove", (e) => {
    const item = e.target.closest(".palette-item");
    if (item && +item.dataset.i !== activeIdx) { activeIdx = +item.dataset.i; renderPalette(); }
  });

  addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      palette.hidden ? openPalette() : closePalette();
      return;
    }
    if (e.key === "Escape") {
      if (!palette.hidden) closePalette();
      else closeOverlays();
      return;
    }
    if (palette.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % filtered.length; renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; renderPalette(); }
    else if (e.key === "Enter") { closePalette(); filtered[activeIdx]?.run(); }
  });

  /* ══════════════ KONAMI → PARTY 🎮 ══════════════ */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  addEventListener("keydown", (e) => {
    if (!palette.hidden) return;
    kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) { kIdx = 0; toggleParty(); }
  });

  /* ══════════════ CONSOLE EGG ══════════════ */
  console.log(
    "%c{ } hey, you found the console.\n%cIf you're reading this, we should probably work together.\n→ amritnag2005@gmail.com  (or press ⌘K on the page)",
    "color:#00e5a0;font-size:16px;font-weight:bold;font-family:monospace",
    "color:#a3a1ad;font-size:13px;font-family:monospace"
  );
})();
