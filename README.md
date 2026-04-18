# GSAP Scroll Animations

A collection of scroll-driven UI animation demos built with [GSAP](https://gsap.com/) and [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/). No build tools required — open any `index.html` directly in a browser.

---

## Project Structure

```
├── pc/           # Twin-panel pinned scroll section (desktop)
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── images/   # Slide photos (1.jpg, 2.png, 3.jpg, 4.png)
│
└── mobile/       # Stacking cards scroll animation (mobile)
    ├── index.html
    ├── style.css
    └── script.js
```

---

## Demos

### PC — Twin Panel Slideshow (`pc/`)

A full-viewport pinned section with two side-by-side cards driven by scroll progress.

**Left panel**
- Gradient slides that crossfade as you scroll
- Top-left card label and top-right slide counter (e.g. `01 — 04`)
- Scroll progress nav at the bottom — step buttons with a continuous baseline, active step highlighted in white
- The nav strip slides horizontally as scroll advances

**Right panel**
- Photo slides that reveal with a smooth slide-up effect as you scroll
- Each incoming image overlaps the previous one from below with rounded top corners

**How it works**
- GSAP `ScrollTrigger` pins the section and scrubs a timeline to scroll position
- Right slides animate via `yPercent` (clip reveal), left slides crossfade via `autoAlpha`
- Progress nav shifts via GSAP `x` transform clipped inside an `overflow: hidden` container

---

### Mobile — Stacking Cards (`mobile/`)

A scroll-driven stacking card animation where cards stack on top of each other as the user scrolls down.

---

## Dependencies

Both demos load GSAP and ScrollTrigger from CDN — no installation needed.

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

---

## Usage

Just open `pc/index.html` or `mobile/index.html` in a browser. To use the PC demo in your own project:

1. Copy the `pc/` folder into your project
2. Replace the images in `pc/images/` with your own
3. Update the slide labels and content in `index.html`
4. Link `style.css` and `script.js` in your HTML
