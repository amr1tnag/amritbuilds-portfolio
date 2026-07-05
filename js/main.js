/* ═══════════════════════════════════════════════════════════
   amrit.builds — bento edition · zero dependencies
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ══════════════ THEME ══════════════ */
  const root = document.documentElement;
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
  $("#theme-toggle").addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", root.dataset.theme);
  });

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
    // erase
    for (let i = curr.length; i >= 0; i--) {
      wordEl.textContent = curr.slice(0, i);
      await new Promise((r) => setTimeout(r, 38));
    }
    // type
    for (let i = 1; i <= next.length; i++) {
      wordEl.textContent = next.slice(0, i);
      await new Promise((r) => setTimeout(r, 62));
    }
  };
  if (!reducedMotion) setInterval(typeWord, 3600);

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
  addEventListener("keydown", (e) => { if (e.key === "Escape") closeOverlays(); });

  /* ══════════════ TILE GLOW-TILT (subtle) ══════════════ */
  if (!matchMedia("(hover: none)").matches && !reducedMotion) {
    $$(".tile--big").forEach((tile) => {
      tile.addEventListener("pointermove", (e) => {
        const r = tile.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transform = `translateY(-4px) rotateX(${-py * 4}deg) rotateY(${px * 4}deg)`;
        tile.style.perspective = "600px";
      });
      tile.addEventListener("pointerleave", () => { tile.style.transform = ""; });
    });
  }

  /* ══════════════ KONAMI → PARTY 🎮 ══════════════ */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  addEventListener("keydown", (e) => {
    kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      document.body.classList.toggle("party");
    }
  });

  /* ══════════════ CONSOLE EGG ══════════════ */
  console.log(
    "%c{ } hey, you found the console.\n%cIf you're reading this, we should probably work together.\n→ amritnag2005@gmail.com",
    "color:#00e5a0;font-size:16px;font-weight:bold;font-family:monospace",
    "color:#a3a1ad;font-size:13px;font-family:monospace"
  );
})();
