# amrit.builds — portfolio

A fast, dark, terminal-flavored engineering portfolio. **Zero dependencies, zero build step** — pure HTML/CSS/JS.

## ✨ Features

- **Boot sequence** intro (skippable, shows once per session)
- **Interactive particle constellation** background that reacts to your mouse
- **⌘K command palette** — navigate, copy email, `sudo hire amrit`
- **Text-scramble** rotating role in the hero
- **3D tilt cards** with cursor-tracking glow for projects
- **Editor-style status bar** — live section, scroll %, clock
- **Custom cursor** with magnetic buttons (desktop only)
- **Konami code** (`↑↑↓↓←→←→BA`) → party mode 🎉
- Console easter egg, animated stats panel, marquee stack strip
- Respects `prefers-reduced-motion`, responsive down to mobile

## 🚀 Run it

Any static server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Deploy to **GitHub Pages** (Settings → Pages → deploy from branch), **Vercel**, or **Netlify** — no config needed.

## ✏️ Make it yours

Everything editable lives in `index.html`:

| What | Where |
|---|---|
| Name, roles, blurb | `.hero` section (roles list is in `js/main.js` → `roles`) |
| About text + stats | `#about` (`data-count` attrs drive the count-up numbers) |
| Projects | `#projects` — duplicate a `<article class="card">` block |
| Skills | `#stack` (marquee + columns) |
| Timeline | `#journey` |
| Email / socials | `#contact` + `EMAIL` const in `js/main.js` + palette links |
| Colors | `css/style.css` → `:root` variables (`--accent` is the money) |

## 🗂 Structure

```
index.html      # all content
css/style.css   # design system (CSS variables at the top)
js/main.js      # boot, particles, palette, tilt, easter eggs
```
