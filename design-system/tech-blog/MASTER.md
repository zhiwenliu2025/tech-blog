# Tech Blog — Design System

> **Usage:** When building or editing a specific page, first check `design-system/tech-blog/pages/[page-name].md`.  
> If that file exists, its rules **override** this Master file. Otherwise, follow all rules below strictly.

---

**Project:** Tech Blog  
**Stack:** Nuxt 4 · Vue 3 · Tailwind CSS · @nuxtjs/color-mode · Heroicons · Simple Icons  
**Last Updated:** 2026-02-26

---

## 1. Color Palette

The project extends Tailwind with two custom scales. All components must use these tokens — never hardcode hex values in component files.

### Primary (Blue) — Interactive / Brand

| Token           | Hex           | Tailwind Class                          |
| --------------- | ------------- | --------------------------------------- |
| primary-50      | `#eff6ff`     | `bg-primary-50`                         |
| primary-100     | `#dbeafe`     | `bg-primary-100`                        |
| primary-200     | `#bfdbfe`     | `bg-primary-200`                        |
| primary-300     | `#93c5fd`     | `bg-primary-300`                        |
| primary-400     | `#60a5fa`     | `bg-primary-400`                        |
| **primary-500** | **`#3b82f6`** | `bg-primary-500` — Default CTA          |
| primary-600     | `#2563eb`     | `bg-primary-600` — Hover CTA            |
| primary-700     | `#1d4ed8`     | `bg-primary-700`                        |
| primary-800     | `#1e40af`     | `bg-primary-800`                        |
| primary-900     | `#1e3a8a`     | `bg-primary-900`                        |
| primary-950     | `#172554`     | `bg-primary-950` — Hero dark background |

### Dark Scale — Surfaces (dark mode only)

| Token    | Hex       | Usage              |
| -------- | --------- | ------------------ |
| dark-50  | `#18181b` | Deepest background |
| dark-100 | `#27272a` | Card background    |
| dark-200 | `#3f3f46` | Elevated surface   |
| dark-300 | `#52525b` | Borders            |
| dark-400 | `#71717a` | Muted icons        |
| dark-500 | `#a1a1aa` | Muted text         |

### Semantic Colors (Tailwind defaults — use as-is)

| Purpose             | Light              | Dark                    |
| ------------------- | ------------------ | ----------------------- |
| Page background     | `bg-white`         | `dark:bg-gray-900`      |
| Card background     | `bg-white`         | `dark:bg-gray-900`      |
| Border              | `border-gray-200`  | `dark:border-gray-800`  |
| Body text           | `text-gray-900`    | `dark:text-gray-100`    |
| Muted text          | `text-gray-600`    | `dark:text-gray-400`    |
| Subtle text         | `text-gray-500`    | `dark:text-gray-500`    |
| Interactive primary | `text-primary-600` | `dark:text-primary-400` |
| Destructive         | `text-red-600`     | `dark:text-red-400`     |

---

## 2. Typography

### Font Families

```css
/* Defined in tailwind.config.js */
font-sans: 'Inter', ui-sans-serif, system-ui
font-mono: 'JetBrains Mono', ui-monospace, monospace
```

- **Inter** — all UI text, headings, body
- **JetBrains Mono** — code blocks, inline code, tech tags

### Scale

| Role                 | Size                           | Weight  | Class                                             |
| -------------------- | ------------------------------ | ------- | ------------------------------------------------- |
| Page title (Hero H1) | `clamp(2.25rem, 5vw, 4.5rem)`  | 800     | `text-4xl sm:text-5xl xl:text-7xl font-extrabold` |
| Article H1           | `clamp(1.875rem, 5vw, 2.5rem)` | 800     | `text-[clamp(...)] font-extrabold`                |
| Article H2           | `clamp(1.5rem, 4vw, 2rem)`     | 700     | via `prose` plugin                                |
| Article H3           | `clamp(1.25rem, 3vw, 1.5rem)`  | 600     | via `prose` plugin                                |
| Card title           | `1rem`                         | 600     | `text-base font-semibold`                         |
| Body / article prose | `1.0625rem`                    | 400     | `prose`                                           |
| UI label / button    | `0.875rem`                     | 500–600 | `text-sm font-medium`                             |
| Caption / badge      | `0.75rem`                      | 500     | `text-xs font-medium`                             |
| Mono / code          | `0.875em`                      | 400–600 | `font-mono text-[0.875em]`                        |

### Letter Spacing

| Context               | Value                         |
| --------------------- | ----------------------------- |
| Hero / large headings | `tracking-tight` (`-0.025em`) |
| Standard headings     | `tracking-tight` (`-0.02em`)  |
| Subheadings           | `tracking-tight` (`-0.01em`)  |
| Body text             | default                       |

---

## 3. Spacing System

Tailwind's default 4px-base scale applies. Common values used across the project:

| Token                     | Value   | Common Usage                        |
| ------------------------- | ------- | ----------------------------------- |
| `gap-1`                   | 4px     | Icon-to-text gaps in badges         |
| `gap-2`                   | 8px     | Icon-to-text gaps in buttons        |
| `gap-3`                   | 12px    | Mobile button groups                |
| `gap-4`                   | 16px    | Card body padding, grid gaps        |
| `gap-6`                   | 24px    | Section-level padding               |
| `gap-8`                   | 32px    | Content column gaps                 |
| `gap-16`                  | 64px    | Hero layout gap (desktop)           |
| `px-4`                    | 16px    | Standard section horizontal padding |
| `px-6/8`                  | 24/32px | Large container padding             |
| `py-20 sm:py-28 lg:py-32` | —       | Hero vertical padding               |
| `max-w-7xl`               | 80rem   | Site-wide container max-width       |

---

## 4. Elevation & Shadow

| Level                | Value                             | Usage                |
| -------------------- | --------------------------------- | -------------------- |
| Subtle               | `shadow-sm`                       | Default card state   |
| Card hover           | `shadow-md` / `hover:shadow-lg`   | Cards on hover       |
| Primary glow         | `shadow-lg shadow-primary-500/30` | CTA buttons          |
| Primary glow (hover) | `shadow-xl shadow-primary-500/40` | CTA button hover     |
| Dropdown             | `shadow-xl`                       | User menus, popovers |
| Logo mark            | `shadow-lg shadow-primary-500/25` | Logo icon            |

---

## 5. Border Radius

| Context        | Class                                        | Value    |
| -------------- | -------------------------------------------- | -------- |
| Buttons        | `rounded-xl`                                 | 12px     |
| Cards          | `rounded-xl`                                 | 12px     |
| Input fields   | `rounded-lg` / `rounded-xl`                  | 8–12px   |
| Badges / tags  | `rounded-full` / `rounded-md` / `rounded-lg` | 4–9999px |
| Logo mark      | `rounded-xl`                                 | 12px     |
| Avatar         | `rounded-full`                               | 9999px   |
| Code blocks    | `rounded-xl`                                 | 12px     |
| Dropdown menus | `rounded-xl`                                 | 12px     |

---

## 6. Component Library

### 6.1 Buttons

Defined as Tailwind `@layer components` in `assets/css/main.css`.

#### Base class — `.btn`

```
inline-flex items-center justify-center px-4 py-2 border border-transparent
text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2
focus:ring-offset-2 transition-all duration-200 cursor-pointer
```

#### Variants

| Class            | Appearance             | Usage                    |
| ---------------- | ---------------------- | ------------------------ |
| `.btn-primary`   | Blue fill + blue glow  | Main CTA actions         |
| `.btn-secondary` | Gray fill              | Secondary actions        |
| `.btn-outline`   | White bg + gray border | Tertiary / ghost actions |
| `.btn-ghost`     | No bg / no border      | Icon buttons, nav items  |

#### Hero CTA (inline style — not `.btn`)

```
rounded-xl bg-primary-500 px-7 py-3.5 text-base font-semibold text-white
shadow-lg shadow-primary-500/30 transition-all duration-200
hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-500/40
active:translate-y-0
```

#### Ghost/Outline Hero CTA

```
rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-base
font-semibold text-white/90 backdrop-blur-sm transition-all duration-200
hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 active:translate-y-0
```

**Rules:**

- All buttons must have `cursor-pointer`
- Hover transitions: `duration-200` (200ms)
- Lift on hover: `hover:-translate-y-0.5` (only non-layout-shifting)
- Touch targets: minimum `44px × 44px` — add `.touch-optimized` class

---

### 6.2 Cards

| Class          | Description                                                  |
| -------------- | ------------------------------------------------------------ |
| `.card`        | Base: white bg, rounded-xl, border-gray-200, shadow-sm       |
| `.card-hover`  | `.card` + hover shadow + hover border-primary-200            |
| `.card-header` | `px-5 py-4 border-b border-gray-100`                         |
| `.card-body`   | `px-5 py-4`                                                  |
| `.card-footer` | `px-5 py-4 bg-gray-50 border-t border-gray-100 rounded-b-xl` |

Blog post cards additionally use hover state:

```
transition-all duration-200 hover:shadow-md hover:border-primary-200
dark:hover:border-primary-900
```

---

### 6.3 Form Controls

| Class            | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| `.form-input`    | Text input — px-4 py-2.5, rounded-lg, focus ring primary-500/30 |
| `.form-textarea` | `.form-input` + `resize-vertical`                               |
| `.select-input`  | Custom select — rounded-xl, left icon slot, right arrow slot    |

**Input focus state:** `focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500`  
**Mobile rule:** All inputs use `font-size: 16px` to prevent iOS zoom.

---

### 6.4 Navigation

#### Header (`.AppHeader`)

- Sticky, `z-50`, `backdrop-blur-md`, `bg-white/95 dark:bg-gray-900/95`
- Height: `h-14 sm:h-16 lg:h-17`
- Container: `max-w-7xl mx-auto px-3 sm:px-4`

#### Nav links (desktop)

```
px-3 py-2 text-sm font-medium text-gray-600 hover:text-primary-600
transition-colors rounded-md
```

Active underline: absolute `h-0.5 bg-primary-600 scale-x-0 → group-hover:scale-x-100 duration-300`

#### Nav links (mobile)

```
touch-optimized flex items-center gap-3 rounded-xl px-4 py-3
text-base font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900
```

Active: `bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400`

---

### 6.5 Badges & Tags

| Class            | Appearance                                                               | Usage                      |
| ---------------- | ------------------------------------------------------------------------ | -------------------------- |
| `.badge`         | Base: `inline-flex gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium` | Wrapper only               |
| `.badge-primary` | Blue bg + blue text                                                      | Featured / primary labels  |
| `.badge-gray`    | Gray bg + gray text                                                      | Neutral / category labels  |
| `.tag`           | `px-2.5 py-1 rounded-md bg-gray-100 hover:bg-primary-100`                | Blog topic tags, clickable |

---

### 6.6 Sidebar Widgets

| Class                    | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `.sidebar-widget`        | `.card overflow-hidden`                                       |
| `.sidebar-widget-header` | `flex justify-between px-4 py-3 border-b border-gray-100`     |
| `.sidebar-widget-title`  | `flex items-center gap-2 text-sm font-semibold text-gray-900` |
| `.sidebar-widget-body`   | `p-4`                                                         |

---

### 6.7 Callout Blocks

Used inside article content. All callouts use `.callout` base + a variant:

```
.callout: rounded-xl border-l-4 p-4 my-6 shadow-sm transition-all duration-200
```

| Class              | Border              | Background                              |
| ------------------ | ------------------- | --------------------------------------- |
| `.callout-info`    | `border-blue-500`   | `bg-blue-50/80 dark:bg-blue-950/50`     |
| `.callout-warning` | `border-yellow-500` | `bg-yellow-50/80 dark:bg-yellow-950/50` |
| `.callout-error`   | `border-red-500`    | `bg-red-50/80 dark:bg-red-950/50`       |
| `.callout-success` | `border-green-500`  | `bg-green-50/80 dark:bg-green-950/50`   |
| `.callout-tip`     | `border-purple-500` | `bg-purple-50/80 dark:bg-purple-950/50` |

---

### 6.8 Toast Notifications

Component: `components/Toast.vue`  
Position: Fixed, top of screen  
Variants: success / error / warning / info  
Dismiss: Auto (3s) or manual close

---

## 7. Dark Mode

**Implementation:** `@nuxtjs/color-mode` with `darkMode: 'class'` in Tailwind.  
**Toggle:** Via `AppHeader` sun/moon icon button.  
**Persistence:** User preference stored by nuxt color-mode plugin.

### Rules

- Every `bg-white` must have a `dark:bg-gray-900` pair
- Every `text-gray-900` must have a `dark:text-gray-100` pair
- Every `border-gray-200` must have a `dark:border-gray-800` pair
- Primary text in dark mode: `dark:text-primary-400` (not 500 — 500 lacks contrast on dark bg)
- Glass effects: `bg-white/80 dark:bg-gray-900/80`

---

## 8. Visual Effects

### Hero Section

- Background: `bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900`
- Dot grid overlay: `radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px)` at `30px 30px`
- Glow orbs: `blur-3xl` circles in `bg-primary-600/15` and `bg-indigo-600/15`
- Bottom fade: `bg-gradient-to-t from-slate-900/60 to-transparent`

### Glass Effect — `.glass`

```
bg-white/80 dark:bg-gray-900/80 backdrop-blur-md
border border-white/20 dark:border-gray-700/50
```

### Gradients

- `.text-gradient`: `bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent`
- `.text-gradient-dark`: `from-gray-900 to-gray-600 dark:from-white dark:to-gray-300`
- Logo/button: `bg-gradient-to-br from-primary-500 to-primary-600`

### Dot Grid Background — `.bg-dot-grid`

```css
background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
background-size: 24px 24px;
```

### Reading Progress Bar — `.reading-progress`

```
fixed top-0 left-0 z-[60] h-0.5
bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600
transition-all duration-100 ease-out
```

---

## 9. Animation

| Class                 | Keyframe                              | Usage                     |
| --------------------- | ------------------------------------- | ------------------------- |
| `.animate-fade-in`    | opacity 0→1, 0.4s                     | Page load overlays        |
| `.animate-fade-in-up` | opacity 0→1 + translateY 16px→0, 0.5s | Cards, sections           |
| `animate-ping`        | Tailwind built-in                     | Live/status indicator dot |

**Transition standard:** `transition-all duration-200` (or `duration-300` for menus)

**Vue `<Transition>` standard (menus/dropdowns):**

```
enter: ease-out duration-200 / opacity-0 scale-95 → opacity-100 scale-100
leave: ease-in duration-150 / opacity-100 scale-100 → opacity-0 scale-95
```

**Rule:** Always respect `prefers-reduced-motion`. Animations must degrade gracefully.

---

## 10. Article / Prose Typography

Configured via `@tailwindcss/typography` plugin. Apply with class `prose dark:prose-invert`.

### Key Overrides

| Element           | Light Mode                  | Dark Mode                   |
| ----------------- | --------------------------- | --------------------------- |
| Body text         | `rgb(55 65 81)` gray-700    | `rgb(209 213 219)` gray-300 |
| H1–H4             | `rgb(17 24 39)` gray-900    | `rgb(243 244 246)` gray-100 |
| Links             | `#3b82f6` (primary-500)     | `#60a5fa` (primary-400)     |
| List markers      | `#3b82f6`                   | `#60a5fa`                   |
| Blockquote border | `#3b82f6`                   | `#60a5fa`                   |
| Blockquote bg     | `rgb(239 246 255)` blue-50  | `rgb(30 41 59)` slate-800   |
| Inline code text  | `rgb(220 38 38)` red-600    | `rgb(252 165 165)` red-300  |
| Inline code bg    | `rgb(254 242 242)` red-50   | `rgb(69 26 26)`             |
| Code block bg     | `rgb(13 17 23)`             | same                        |
| H2 border-bottom  | `rgb(229 231 235)` gray-200 | `rgb(55 65 81)` gray-700    |

### Code Highlighting

Library: **highlight.js** with `github-dark` theme  
Imported via: `@import 'highlight.js/styles/github-dark.css'`

---

## 11. Layout & Responsive Grid

### Breakpoints (Tailwind defaults)

| Breakpoint | Width   | Usage                                     |
| ---------- | ------- | ----------------------------------------- |
| `sm`       | ≥640px  | Two-column buttons, larger padding        |
| `md`       | ≥768px  | Image grids expand, some desktop patterns |
| `lg`       | ≥1024px | Desktop nav shows, hero goes side-by-side |
| `xl`       | ≥1280px | Wider hero card (w-96)                    |

### Standard Container

```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Image Grid Utilities

| Class           | Columns                            |
| --------------- | ---------------------------------- |
| `.image-grid-2` | 1 col → 2 cols (sm)                |
| `.image-grid-3` | 1 col → 2 cols (sm) → 3 cols (md)  |
| `.image-grid-4` | 2 cols → 3 cols (sm) → 4 cols (md) |

### Video Container

`.video-container` — 16:9 ratio `padding-bottom: 56.25%`, `rounded-xl`

---

## 12. Icons

**Library:** Heroicons (`@iconify-json/heroicons`) + Simple Icons (`@iconify-json/simple-icons`)  
**Component:** `<Icon name="i-heroicons-*" />` or `<Icon name="i-simple-icons-*" />`  
**Standard size:** `h-4 w-4` (small), `h-5 w-5` (default), `h-6 w-6` (large)

**Rules:**

- Never use emoji as UI icons
- Always use consistent icon set (Heroicons for UI, Simple Icons for brand logos)
- All icon-only buttons must have `aria-label`

---

## 13. Mobile & Touch

### Touch Targets

**Minimum:** 44px × 44px — use `.touch-optimized` utility class

```css
.touch-optimized {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  min-height: 44px;
  min-width: 44px;
  cursor: pointer;
}
```

### Mobile Scroll Utilities

| Class               | Usage                                 |
| ------------------- | ------------------------------------- |
| `.swipe-horizontal` | Horizontal scroll containers (snap)   |
| `.swipeable`        | Gesture-enabled elements              |
| `.mobile-scroll`    | `-webkit-overflow-scrolling: touch`   |
| `.scroll-container` | Smooth scroll with overscroll-contain |

### Safe Area

| Class               | Usage                           |
| ------------------- | ------------------------------- |
| `.safe-area-top`    | Notch padding for fixed headers |
| `.safe-area-bottom` | Home bar padding                |

### Input Rule

All inputs use `font-size: 16px` on mobile to prevent iOS auto-zoom.

---

## 14. Scrollbar

```css
.scrollbar-thin {
  scrollbar-width: thin;
  scrollbar-color: rgb(203 213 225) transparent; /* light */
}
/* dark: rgb(71 85 105) transparent */
/* thumb width: 5px */
```

Apply to any scrollable container that should have a styled scrollbar.

---

## 15. Z-Index Scale

| Layer            | Value    | Usage                        |
| ---------------- | -------- | ---------------------------- |
| Reading progress | `z-[60]` | Progress bar (always on top) |
| Header           | `z-50`   | Sticky header                |
| Dropdown menus   | `z-50`   | User menu, popovers          |
| Modals           | `z-50`   | Search modal, dialogs        |
| Overlays         | `z-40`   | Modal backdrops              |
| Toast            | Auto     | Via `Toast.vue`              |

---

## 16. Anti-Patterns — Do NOT Use

| Pattern                                        | Why                              |
| ---------------------------------------------- | -------------------------------- |
| Emoji as UI icons                              | Use SVG (Heroicons/Simple Icons) |
| `scale` on hover for cards                     | Causes layout shift              |
| `bg-white/10` glass in light mode              | Too transparent, invisible       |
| `text-gray-400` for body text in light mode    | Fails WCAG 4.5:1                 |
| `border-white/10` in light mode                | Invisible border                 |
| Hardcoded hex colors in Vue templates          | Use Tailwind tokens              |
| Inputs without `font-size: 16px` on mobile     | Triggers iOS zoom                |
| Focusable elements without visible focus state | Fails keyboard accessibility     |
| Missing `aria-label` on icon-only buttons      | Inaccessible                     |
| No `dark:` variant on colored surfaces         | Broken dark mode                 |

---

## 17. Pre-Delivery Checklist

### Visual

- [ ] No emojis used as icons (SVG only)
- [ ] All icons from Heroicons or Simple Icons
- [ ] Brand logos verified against Simple Icons
- [ ] Hover states don't cause layout shift (no `scale`)

### Interaction

- [ ] All clickable elements have `cursor-pointer`
- [ ] Hover states provide clear visual feedback
- [ ] Transitions are 150–300ms
- [ ] Focus states visible (ring or outline)

### Dark Mode

- [ ] Every color class has a `dark:` pair
- [ ] Light mode glass (`bg-white/80+`) visible
- [ ] Borders visible in both modes (`border-gray-200 dark:border-gray-800`)
- [ ] Test both modes before delivery

### Layout

- [ ] Container uses `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] No content hidden behind fixed header
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility

- [ ] All images have `alt` text
- [ ] Form inputs have associated labels
- [ ] Icon-only buttons have `aria-label`
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets ≥ 44×44px on mobile
