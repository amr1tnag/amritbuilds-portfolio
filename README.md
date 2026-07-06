# amrit.builds — portfolio

A single-screen **bento-grid** portfolio. Dark by default, light mode included. **Zero dependencies, zero build step** — pure HTML/CSS/JS.

## ✨ The board

- **Tech stack card** — grouped pill tags (frontend / backend / db & services / currently learning)
- **Profile card** — avatar, `I build ___.` typewriter line, bio, "available for work" pulse + live clock, light/dark **theme toggle** (persisted)
- **Links tiles** — GitHub, email, LinkedIn, resume (inline SVG icons, no external assets)
- **Daily tool stack** — vertical tool rail, animated *on repeat* music widget, certified shitpost corner
- **PROJECTS 作品 / EXPERIENCE 経験** — big accent tiles that open overlay panels (Esc to close)
- **Working terminal** (`❯_` pill) — `help`, `whoami`, `ls projects`, `neofetch`, `hire`… and `sudo rm -rf /` triggers **chaos mode**: every tile falls with real gravity physics, can be grabbed and thrown, undo button restores the board
- **⌘K command palette** — navigate, play the song, copy email, `sudo hire amrit`, destroy the site
- **Tap-to-play music card** — embeds the official *5-7* (Karan Aujla · Mxrci) video
- Terminal-styled **404 page**, OG social preview image, JSON-LD schema
- Floating background shapes, cursor glow, toasts, avatar easter egg, konami code (`↑↑↓↓←→←→BA`) party mode, console easter egg
- Responsive (three columns → one), respects `prefers-reduced-motion`

## 🚀 Run it

```bash
python3 -m http.server 8000
# or: npx serve .
```

Deploys as-is to **GitHub Pages**, **Vercel**, or **Netlify** — no config.

## ✏️ Make it yours

Everything editable lives in `index.html`:

| What | Where |
|---|---|
| Name / handle / bio / quote | profile card (`.tile--profile`) |
| `I build ___` words | `js/main.js` → `WORDS` |
| Tech stack pills | `.tile--stack` |
| Links | `.tile--links` (drop `resume.pdf` in the repo root for the resume tile) |
| Song + meme | `.tile--daily` |
| Projects | `#overlay-projects` — duplicate a `.proj` block |
| Experience | `#overlay-experience` timeline |
| Colors | `css/style.css` → `:root` / `[data-theme="light"]` variables |

## 🗂 Structure

```
index.html      # all content (board + overlays)
css/style.css   # design system, themes, layout
js/main.js      # theme, clock, typewriter, overlays, easter eggs
```
