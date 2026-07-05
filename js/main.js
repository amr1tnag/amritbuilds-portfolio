/* ═══════════════════════════════════════════════════════════
   amrit.builds — zero dependencies, all vibes
   ═══════════════════════════════════════════════════════════ */
(() => {
  "use strict";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;

  /* ══════════════════ BOOT SEQUENCE ══════════════════ */
  const boot = $("#boot");
  const bootLog = $("#boot-log");
  const bootProgress = $("#boot-progress");
  let bootDone = false;

  const finishBoot = () => {
    if (bootDone) return;
    bootDone = true;
    sessionStorage.setItem("booted", "1");
    boot.classList.add("done");
    setTimeout(() => boot.remove(), 600);
    startHero();
  };

  const BOOT_LINES = [
    ["dim", "$ ssh visitor@amrit.builds"],
    ["", "Authenticating guest session... <span class='ok'>ok</span>"],
    ["", "Loading personality drivers...... <span class='ok'>ok</span>"],
    ["", "Mounting /projects............... <span class='ok'>ok</span>"],
    ["", "Calibrating particle field....... <span class='ok'>ok</span>"],
    ["", "Injecting caffeine............... <span class='ok'>ok</span>"],
    ["ok", "Welcome. Initializing portfolio…"],
  ];

  if (sessionStorage.getItem("booted") || reducedMotion) {
    boot.remove();
    bootDone = true;
    // startHero is called after it's defined, below
    requestAnimationFrame(() => startHero());
  } else {
    let i = 0;
    const typeLine = () => {
      if (bootDone) return;
      if (i >= BOOT_LINES.length) { setTimeout(finishBoot, 350); return; }
      const [cls, text] = BOOT_LINES[i];
      const line = document.createElement("div");
      if (cls) line.className = cls;
      line.innerHTML = text;
      bootLog.appendChild(line);
      i++;
      bootProgress.style.width = `${(i / BOOT_LINES.length) * 100}%`;
      setTimeout(typeLine, 130 + Math.random() * 160);
    };
    setTimeout(typeLine, 250);
    $("#boot-skip").addEventListener("click", finishBoot);
    addEventListener("keydown", (e) => { if (e.key === "Enter" && !bootDone) finishBoot(); }, { once: false });
  }

  /* ══════════════════ PARTICLE FIELD ══════════════════ */
  const canvas = $("#field");
  const ctx = canvas.getContext("2d");
  let W, H, particles = [], party = false;
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const target = Math.min(Math.floor((W * H) / 16000), 130);
    particles = Array.from({ length: target }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.6,
    }));
  };

  const LINK_DIST = 130;
  let hue = 160;

  const tick = () => {
    ctx.clearRect(0, 0, W, H);
    if (party) hue = (hue + 1.2) % 360;
    const color = party ? `hsl(${hue}, 100%, 60%)` : "rgba(0, 229, 160";

    for (const p of particles) {
      // mouse repulsion
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < 22500 && d2 > 0.01) {
        const d = Math.sqrt(d2);
        const f = (150 - d) / 150 * (party ? 0.9 : 0.35);
        p.vx += (dx / d) * f;
        p.vy += (dy / d) * f;
      }
      p.vx *= 0.985; p.vy *= 0.985;
      // gentle drift floor so they never fully stall
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.05;
      p.y += p.vy + Math.cos(p.x * 0.01) * 0.05;
      if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; if (p.y > H + 20) p.y = -20;
    }

    // links
    ctx.lineWidth = 0.6;
    for (let a = 0; a < particles.length; a++) {
      const pa = particles[a];
      for (let b = a + 1; b < particles.length; b++) {
        const pb = particles[b];
        const dx = pa.x - pb.x, dy = pa.y - pb.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST * LINK_DIST) {
          const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.22;
          ctx.strokeStyle = party ? `hsla(${hue}, 100%, 60%, ${alpha})` : `${color}, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }
      }
    }

    // dots
    for (const p of particles) {
      ctx.fillStyle = party ? `hsla(${hue}, 100%, 65%, 0.8)` : `${color}, 0.5)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };

  if (!reducedMotion) {
    resize();
    addEventListener("resize", resize);
    addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
    addEventListener("pointerleave", () => { mouse.x = -9999; mouse.y = -9999; });
    requestAnimationFrame(tick);
  }

  /* ══════════════════ TEXT SCRAMBLE (hero role) ══════════════════ */
  const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";
  const roles = [
    "software engineer",
    "systems tinkerer",
    "full-stack builder",
    "open-source contributor",
    "performance nerd",
    "professional bug creator",
  ];
  const scrambleEl = $("#scramble");
  let roleIdx = 0, scrambleTimer = null;

  const scrambleTo = (el, next) => {
    const prev = el.textContent;
    const len = Math.max(prev.length, next.length);
    let frame = 0;
    const queue = Array.from({ length: len }, (_, i) => ({
      from: prev[i] || "",
      to: next[i] || "",
      start: Math.floor(Math.random() * 22),
      end: Math.floor(Math.random() * 22) + 18,
    }));
    cancelAnimationFrame(scrambleTimer);
    const step = () => {
      let out = "", done = 0;
      for (const q of queue) {
        if (frame >= q.end) { done++; out += q.to; }
        else if (frame >= q.start) out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        else out += q.from;
      }
      el.textContent = out;
      frame++;
      if (done < queue.length) scrambleTimer = requestAnimationFrame(step);
    };
    step();
  };

  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;
    // stagger hero reveals
    $$(".hero .reveal").forEach((el, i) => {
      el.style.setProperty("--d", `${i * 0.12}s`);
      requestAnimationFrame(() => el.classList.add("in"));
    });
    if (!reducedMotion) {
      setInterval(() => {
        roleIdx = (roleIdx + 1) % roles.length;
        scrambleTo(scrambleEl, roles[roleIdx]);
      }, 3400);
    }
  }

  /* ══════════════════ SCROLL REVEALS ══════════════════ */
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  $$(".section .reveal, .footer .reveal").forEach((el) => io.observe(el));

  /* ══════════════════ COUNT-UP STATS ══════════════════ */
  const statIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      statIO.unobserve(e.target);
      const target = +e.target.dataset.count;
      const dur = 1400, t0 = performance.now();
      const run = (t) => {
        const p = Math.min((t - t0) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        e.target.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(run);
      };
      requestAnimationFrame(run);
    }
  }, { threshold: 0.5 });
  $$("[data-count]").forEach((el) => statIO.observe(el));

  /* ══════════════════ NAV + ACTIVE SECTION + STATUS BAR ══════════════════ */
  const nav = $("#nav");
  const sbScroll = $("#sb-scroll");
  const sbSection = $("#sb-section");
  const sections = ["about", "projects", "stack", "journey", "contact"].map((id) => $("#" + id));
  const navLinks = $$(".nav-links a");

  const onScroll = () => {
    const y = scrollY;
    nav.classList.toggle("scrolled", y > 30);
    const max = document.documentElement.scrollHeight - innerHeight;
    sbScroll.textContent = `${max > 0 ? Math.round((y / max) * 100) : 0}%`;
    let current = "hero";
    for (const s of sections) {
      if (s && s.getBoundingClientRect().top < innerHeight * 0.4) current = s.id;
    }
    sbSection.textContent = `~/${current}`;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${current}`));
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // clock
  const sbClock = $("#sb-clock");
  const tickClock = () => {
    sbClock.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };
  tickClock();
  setInterval(tickClock, 10000);

  /* ══════════════════ CUSTOM CURSOR ══════════════════ */
  if (!isTouch && !reducedMotion) {
    const dot = $(".cursor-dot"), ring = $(".cursor-ring");
    let rx = innerWidth / 2, ry = innerHeight / 2, tx = rx, ty = ry;
    addEventListener("pointermove", (e) => {
      tx = e.clientX; ty = e.clientY;
      dot.style.transform = `translate(${tx}px, ${ty}px) translate(-50%,-50%)`;
      document.body.classList.add("cursor-on");
    });
    const followRing = () => {
      rx += (tx - rx) * 0.16;
      ry += (ty - ry) * 0.16;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(followRing);
    };
    requestAnimationFrame(followRing);
    document.addEventListener("pointerover", (e) => {
      document.body.classList.toggle("cursor-hover", !!e.target.closest("a, button, [data-tilt]"));
    });
  }

  /* ══════════════════ MAGNETIC ELEMENTS ══════════════════ */
  if (!isTouch && !reducedMotion) {
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1)";
        el.style.transform = "";
        setTimeout(() => (el.style.transition = ""), 400);
      });
    });
  }

  /* ══════════════════ TILT CARDS ══════════════════ */
  if (!isTouch && !reducedMotion) {
    $$("[data-tilt]").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.transform =
          `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 7}deg) translateY(-2px)`;
        card.style.setProperty("--mx", `${px * 100}%`);
        card.style.setProperty("--my", `${py * 100}%`);
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ══════════════════ COPY EMAIL ══════════════════ */
  const EMAIL = "amritnag2005@gmail.com";
  const copyBtn = $("#copy-email");
  const copyHint = $("#copy-hint");
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copyHint.textContent = "copied ✓ — talk soon";
    } catch {
      location.href = `mailto:${EMAIL}`;
      return;
    }
    setTimeout(() => (copyHint.textContent = "click to copy"), 2200);
  };
  copyBtn.addEventListener("click", copyEmail);

  /* ══════════════════ COMMAND PALETTE ══════════════════ */
  const palette = $("#palette");
  const paletteInput = $("#palette-input");
  const paletteList = $("#palette-list");
  let activeIdx = 0, filtered = [];

  const goTo = (id) => $("#" + id)?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });

  const toggleParty = () => {
    party = !party;
    document.body.classList.toggle("party", party);
  };

  const COMMANDS = [
    { icon: "🏠", label: "go to top", hint: "nav", run: () => goTo("top") },
    { icon: "👤", label: "go to about", hint: "nav", run: () => goTo("about") },
    { icon: "🛠", label: "go to projects", hint: "nav", run: () => goTo("projects") },
    { icon: "📚", label: "go to stack", hint: "nav", run: () => goTo("stack") },
    { icon: "🗺", label: "go to journey", hint: "nav", run: () => goTo("journey") },
    { icon: "✉️", label: "go to contact", hint: "nav", run: () => goTo("contact") },
    { icon: "📋", label: "copy email address", hint: "action", run: copyEmail },
    { icon: "🐙", label: "open github", hint: "link", run: () => open("https://github.com/amr1tnag", "_blank") },
    { icon: "💼", label: "open linkedin", hint: "link", run: () => open("https://www.linkedin.com/", "_blank") },
    { icon: "🎉", label: "toggle party mode", hint: "fun", run: toggleParty },
    { icon: "🔐", label: "sudo hire amrit", hint: "fun", run: () => { goTo("contact"); if (!party) toggleParty(); setTimeout(() => { if (party) toggleParty(); }, 5000); } },
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
      : `<li class="palette-empty">no matches — command not found: ${q}</li>`;
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
    if (item) { filtered[+item.dataset.i]?.run(); closePalette(); }
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
    if (palette.hidden) return;
    if (e.key === "Escape") closePalette();
    else if (e.key === "ArrowDown") { e.preventDefault(); activeIdx = (activeIdx + 1) % filtered.length; renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIdx = (activeIdx - 1 + filtered.length) % filtered.length; renderPalette(); }
    else if (e.key === "Enter") { filtered[activeIdx]?.run(); closePalette(); }
  });

  /* ══════════════════ KONAMI CODE 🎮 ══════════════════ */
  const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
  let kIdx = 0;
  addEventListener("keydown", (e) => {
    if (!palette.hidden) return;
    kIdx = e.key === KONAMI[kIdx] ? kIdx + 1 : (e.key === KONAMI[0] ? 1 : 0);
    if (kIdx === KONAMI.length) {
      kIdx = 0;
      toggleParty();
      // give the particles a shove
      for (const p of particles) {
        p.vx += (Math.random() - 0.5) * 8;
        p.vy += (Math.random() - 0.5) * 8;
      }
    }
  });

  /* ══════════════════ CONSOLE EASTER EGG ══════════════════ */
  console.log(
    "%c❯ hey, you found the console.\n%cIf you're reading this, we should probably work together.\n→ amritnag2005@gmail.com",
    "color:#00e5a0;font-size:16px;font-weight:bold;font-family:monospace",
    "color:#9a9aa6;font-size:13px;font-family:monospace"
  );
})();
