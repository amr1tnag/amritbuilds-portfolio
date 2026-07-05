/* ═══════════════════════════════════════════════════════════
   amrit.builds — bento edition · zero dependencies
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const EMAIL = "amritnag2005@gmail.com";
  const YT_ID = "x9RC77Oc-0Q"; // 5-7 (Music Video) — Karan Aujla, Mxrci · Rehaan Records

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
      iframe.src = `https://www.youtube-nocookie.com/embed/${YT_ID}?autoplay=1&rel=0`;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.title = "5-7 (Music Video) — Karan Aujla · Mxrci";
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
    { icon: "💻", label: "open terminal", hint: "shell", run: () => openTerm() },
    { icon: "🎉", label: "toggle party mode", hint: "fun", run: toggleParty },
    { icon: "🔐", label: "sudo hire amrit", hint: "fun", run: () => { copyEmail(); if (!document.body.classList.contains("party")) toggleParty(); setTimeout(() => document.body.classList.remove("party"), 5000); } },
    { icon: "☢", label: "destroy this site", hint: "chaos", run: () => startChaos() },
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
      else if (!termOverlay.hidden) closeTerm();
      else closeOverlays();
      return;
    }
    if (palette.hidden) return;
    if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % filtered.length; renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; renderPalette(); }
    else if (e.key === "Enter") { closePalette(); filtered[activeIdx]?.run(); }
  });

  /* ══════════════ CHAOS MODE ☢ (gravity + drag physics) ══════════════ */
  const CHAOS_SEL = ".tile--stack, .tile--profile, .tile--daily, .tile--big, .link-sq, .links-title";
  const resetBtn = $("#chaos-reset");
  let chaos = false, bodies = [], chaosRAF = null;

  const startChaos = () => {
    if (chaos) return;
    if (reducedMotion) { toast("🧘 reduced-motion is on — no chaos for you"); return; }
    chaos = true;
    closeOverlays();
    closeTerm();
    bodies = $$(CHAOS_SEL).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        el, ox: r.left, oy: r.top, x: r.left, y: r.top, w: r.width, h: r.height,
        vx: (Math.random() - 0.5) * 10, vy: -(Math.random() * 8 + 3),
        a: 0, va: (Math.random() - 0.5) * 0.09, grabbed: false,
      };
    });
    for (const b of bodies) {
      const s = b.el.style;
      s.position = "fixed"; s.left = b.x + "px"; s.top = b.y + "px";
      s.width = b.w + "px"; s.height = b.h + "px";
      s.margin = "0"; s.zIndex = 900; s.transition = "none"; s.transform = "none";
      s.cursor = "grab"; s.touchAction = "none";
    }
    document.body.classList.add("chaos");
    resetBtn.hidden = false;
    toast("☢ oh no. try throwing the wreckage around", 3500);

    const G = 0.55, BOUNCE = 0.45, AIR = 0.995;
    const step = () => {
      const H = innerHeight, W = innerWidth;
      for (const b of bodies) {
        if (!b.grabbed) {
          b.vy += G; b.vx *= AIR;
          b.x += b.vx; b.y += b.vy; b.a += b.va;
          if (b.y + b.h > H) {
            b.y = H - b.h; b.vy *= -BOUNCE; b.vx *= 0.92; b.va *= 0.7;
            if (Math.abs(b.vy) < 1.4) b.vy = 0;
          }
          if (b.x < 0) { b.x = 0; b.vx *= -BOUNCE; }
          if (b.x + b.w > W) { b.x = W - b.w; b.vx *= -BOUNCE; }
        }
        b.el.style.left = b.x + "px";
        b.el.style.top = b.y + "px";
        b.el.style.transform = `rotate(${b.a}rad)`;
      }
      chaosRAF = requestAnimationFrame(step);
    };
    chaosRAF = requestAnimationFrame(step);
  };

  const endChaos = () => {
    if (!chaos) return;
    cancelAnimationFrame(chaosRAF);
    resetBtn.hidden = true;
    for (const b of bodies) {
      const s = b.el.style;
      s.transition = "left 0.6s cubic-bezier(0.16,1,0.3,1), top 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      s.left = b.ox + "px"; s.top = b.oy + "px"; s.transform = "rotate(0rad)";
    }
    setTimeout(() => {
      for (const b of bodies) b.el.removeAttribute("style");
      bodies = [];
      chaos = false;
      document.body.classList.remove("chaos");
      toast("🧹 disaster undone. never speak of this again");
    }, 620);
  };
  resetBtn.addEventListener("click", endChaos);

  // drag & throw
  let grabbedBody = null, gdx = 0, gdy = 0, lastPX = 0, lastPY = 0, dragDist = 0;
  addEventListener("pointerdown", (e) => {
    if (!chaos) return;
    const hit = [...bodies].reverse().find((b) =>
      e.clientX >= b.x && e.clientX <= b.x + b.w && e.clientY >= b.y && e.clientY <= b.y + b.h);
    if (!hit) return;
    grabbedBody = hit;
    hit.grabbed = true;
    hit.vx = hit.vy = 0;
    gdx = e.clientX - hit.x; gdy = e.clientY - hit.y;
    lastPX = e.clientX; lastPY = e.clientY; dragDist = 0;
    hit.el.style.cursor = "grabbing";
  }, true);
  addEventListener("pointermove", (e) => {
    if (!grabbedBody) return;
    dragDist += Math.abs(e.clientX - lastPX) + Math.abs(e.clientY - lastPY);
    grabbedBody.vx = (e.clientX - lastPX) * 0.9;
    grabbedBody.vy = (e.clientY - lastPY) * 0.9;
    lastPX = e.clientX; lastPY = e.clientY;
    grabbedBody.x = e.clientX - gdx;
    grabbedBody.y = e.clientY - gdy;
  });
  addEventListener("pointerup", () => {
    if (!grabbedBody) return;
    grabbedBody.el.style.cursor = "grab";
    grabbedBody.grabbed = false;
    grabbedBody = null;
  });
  // swallow clicks after a real drag so cards don't open mid-throw
  addEventListener("click", (e) => {
    if (chaos && dragDist > 8) { e.stopPropagation(); e.preventDefault(); dragDist = 0; }
  }, true);

  /* ══════════════ TERMINAL ❯_ ══════════════ */
  const termOverlay = $("#terminal");
  const termBody = $("#term-body");
  const termInput = $("#term-input");
  const history = [];
  let histIdx = -1;

  const tPrint = (html, cls = "") => {
    const div = document.createElement("div");
    if (cls) div.className = cls;
    div.innerHTML = html;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
  };

  const openTerm = () => {
    termOverlay.hidden = false;
    if (!termBody.childElementCount) {
      tPrint(`<span class="t-dim">amritOS 2.0 LTS — guest shell</span>`);
      tPrint(`type <span class="t-ok">help</span> to see what this thing can do.\n`);
    }
    termInput.focus();
  };
  const closeTerm = () => { termOverlay.hidden = true; };

  const PROJECT_LIST = [
    ["venn", "the main quest — product in alpha (Next.js + Supabase + Expo)", "https://github.com/amr1tnag/venn-alpha"],
    ["furrlet", "dog-walking marketplace (Next.js + Prisma + Flutter)", "https://github.com/amr1tnag/furrlet"],
    ["jarvis", "Claude-powered voice assistant in Python", "https://github.com/amr1tnag/jarvis-my-personal-assistant"],
    ["the-lockedin-timer", "site-blocking focus extension", "https://github.com/amr1tnag/the-lockedin-timer"],
    ["smart-campus-navigation", "campus nav system for DY Patil", "https://github.com/amr1tnag/smart-campus-navigation"],
    ["kinesisrunclub", "run club site + admin dashboard", "https://github.com/amr1tnag/kinesisrunclub"],
  ];

  const NEOFETCH = `<span class="t-ok">   ⢀⣴⣶⣦⡀      </span><span class="t-cmd" style="font-weight:700">amrit</span>@<span class="t-ok">builds</span>
<span class="t-ok">  ⣼⣿⠋⠙⣿⣧     </span>─────────────────
<span class="t-ok">  ⣿⣿  ⣿⣿     </span><span class="t-dim">OS:</span>       amritOS 2.0 LTS
<span class="t-ok">  ⢿⣿⣤⣤⣿⡿     </span><span class="t-dim">Host:</span>     Mumbai, India 🇮🇳
<span class="t-ok">   ⠈⠛⠛⠁      </span><span class="t-dim">Kernel:</span>   CS-fundamentals v6.x
<span class="t-ok">            </span><span class="t-dim">Uptime:</span>   shipping since 2020
<span class="t-ok">            </span><span class="t-dim">Shell:</span>    bash (with vibes)
<span class="t-ok">            </span><span class="t-dim">Editor:</span>   Neovim (btw)
<span class="t-ok">            </span><span class="t-dim">Memory:</span>   97% music, 3% semicolons`;

  const COMMANDS_TERM = {
    help: () => tPrint(
`<span class="t-ok">available commands</span>
  whoami           who is this guy
  ls projects      list the goods
  open &lt;project&gt;   open a project on github
  stack            tech stack
  links            socials
  play             play 5-7 · karan aujla
  neofetch         system info, obviously
  hire             copy my email (do it)
  theme            toggle light/dark
  party            you'll see
  clear            clean up
  exit             close terminal
<span class="t-dim">  hint: real ones try 'sudo rm -rf /'</span>`),
    whoami: () => tPrint(`amrit nag — developer from india. builds fast software, strict types,\nand side projects that escape containment. currently building <span class="t-ok">venn</span>.`),
    ls: () => COMMANDS_TERM["ls projects"](),
    "ls projects": () => tPrint(PROJECT_LIST.map(([n, d]) =>
      `<span class="t-ok">${n.padEnd(26)}</span><span class="t-dim">${d}</span>`).join("\n")),
    stack: () => tPrint(
`<span class="t-dim">frontend:</span>  react · nextjs · tailwind · scss
<span class="t-dim">backend:</span>   node · express · bun · fastapi · go
<span class="t-dim">db/infra:</span>  postgres · mongo · redis · supabase · docker
<span class="t-dim">learning:</span>  rust · kubernetes · system design`),
    links: () => tPrint(
`<a class="t-link" href="https://github.com/amr1tnag" target="_blank" rel="noopener">github.com/amr1tnag</a>
<a class="t-link" href="https://www.linkedin.com/in/amrit-nag-5a8724326/" target="_blank" rel="noopener">linkedin.com/in/amrit-nag</a>
<span class="t-dim">mail:</span> amritnag2005@gmail.com`),
    play: () => { closeTerm(); openPlayer(); toast("🎧 5-7 · karan aujla"); },
    neofetch: () => tPrint(NEOFETCH),
    hire: () => { copyEmail(); tPrint(`<span class="t-ok">✓</span> email copied to clipboard. smart move.`); },
    "sudo hire amrit": () => COMMANDS_TERM.hire(),
    theme: () => { toggleTheme(); tPrint(`theme → <span class="t-ok">${root.dataset.theme}</span>`); },
    party: () => { toggleParty(); },
    clear: () => { termBody.innerHTML = ""; },
    exit: () => closeTerm(),
    "rm -rf /": () => tPrint(`<span class="t-err">rm: permission denied.</span> <span class="t-dim">(try sudo)</span>`),
    "sudo rm -rf /": async () => {
      const doom = ["deleting /projects ...", "deleting /skills ...", "deleting /self-esteem ...", "wait. no. NO—"];
      for (const line of doom) {
        tPrint(`<span class="t-warn">${line}</span>`);
        await new Promise((r) => setTimeout(r, 420));
      }
      startChaos();
    },
    konami: () => tPrint(`<span class="t-dim">↑↑↓↓←→←→BA — but you didn't hear it from me</span>`),
  };

  const runTerm = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    tPrint(cmd.replace(/</g, "&lt;"), "t-cmd");
    history.unshift(cmd);
    histIdx = -1;
    const lower = cmd.toLowerCase();
    if (COMMANDS_TERM[lower]) return void COMMANDS_TERM[lower]();
    if (lower.startsWith("open ")) {
      const name = lower.slice(5).trim();
      const p = PROJECT_LIST.find(([n]) => n.startsWith(name));
      if (p) { open(p[2], "_blank"); return void tPrint(`opening <span class="t-ok">${p[0]}</span> ↗`); }
      return void tPrint(`<span class="t-err">no project named "${name.replace(/</g, "&lt;")}"</span>`);
    }
    if (lower.startsWith("cat ")) return void tPrint(`<span class="t-dim">it's a portfolio, not a filesystem. try 'ls projects'</span>`);
    if (lower.startsWith("sudo")) return void tPrint(`<span class="t-err">visitor is not in the sudoers file. this incident will be reported.</span>`);
    tPrint(`<span class="t-err">command not found: ${lower.split(" ")[0].replace(/</g, "&lt;")}</span> <span class="t-dim">— try 'help'</span>`);
  };

  $("#open-term").addEventListener("click", openTerm);
  $("#term-close").addEventListener("click", closeTerm);
  termOverlay.addEventListener("click", (e) => {
    if (e.target === termOverlay) closeTerm();
    else termInput.focus();
  });
  termInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { runTerm(termInput.value); termInput.value = ""; }
    else if (e.key === "ArrowUp") { e.preventDefault(); if (histIdx < history.length - 1) termInput.value = history[++histIdx]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); termInput.value = histIdx > 0 ? history[--histIdx] : (histIdx = -1, ""); }
    else if (e.key === "Escape") { closeTerm(); return; }
    e.stopPropagation();
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
