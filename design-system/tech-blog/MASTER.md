# Tech Blog — Design System

```
stack: Nuxt 4 · Vue 3 · Tailwind CSS · @nuxtjs/color-mode
icons: @iconify-json/heroicons + @iconify-json/simple-icons
fonts: Inter (UI) · JetBrains Mono (code)
theme: light + dark, class-based
updated: 2026-02-26
```

> **Hierarchy rule:** When building a specific page, check `design-system/tech-blog/pages/[page].md` first.  
> If it exists, those rules **override** this file. Otherwise, follow everything here.

---

## Table of Contents

1. [Design Language](#1-design-language)
2. [Color Tokens](#2-color-tokens)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Elevation & Borders](#5-elevation--borders)
6. [Component Library](#6-component-library)
7. [Signature Patterns](#7-signature-patterns)
8. [Dark Mode](#8-dark-mode)
9. [Animation & Motion](#9-animation--motion)
10. [Article / Prose](#10-article--prose)
11. [Icons](#11-icons)
12. [Mobile & Touch](#12-mobile--touch)
13. [Anti-Patterns](#13-anti-patterns)
14. [Pre-Delivery Checklist](#14-pre-delivery-checklist)

---

## 1. Design Language

This blog uses a **dual-tone architecture**: a dramatic dark hero zone and a clean light content zone. The contrast is intentional — it signals "entering the technical world" on load, then settles into a readable, neutral body.

```
┌──────────────────────────────────────────┐
│  HEADER  bg-white/95 · sticky · z-50     │  ← glass, adapts to mode
├──────────────────────────────────────────┤
│                                          │
│  HERO    from-slate-900 via-primary-950  │  ← always dark, dot-grid
│          + code window widget            │
│                                          │
├──────────────────────────────────────────┤
│  BODY    bg-gray-50/50 · 3-col + 1-col   │  ← light/neutral, dark adapts
│          sidebar sticky top-20           │
├──────────────────────────────────────────┤
│  FOOTER  bg-white/80 · 4-col grid        │  ← glass footer
└──────────────────────────────────────────┘
```

**Core principles:**

- **Precision over decoration** — every visual element serves a functional purpose
- **Developer aesthetics** — code windows, mono fonts, syntax colors, terminal prompts
- **Blue as signal** — primary-500 is reserved for interactive / brand moments only
- **Progressive disclosure** — cards reveal depth on hover (bar, shadow, border shift)

---

## 2. Color Tokens

### 2.1 Primary Scale (Blue — Brand & Interactive)

| Token             | Hex           | Tailwind                        | Usage                                   |
| ----------------- | ------------- | ------------------------------- | --------------------------------------- |
| `primary-50`      | `#eff6ff`     | `bg-primary-50`                 | Hover bg on light                       |
| `primary-100`     | `#dbeafe`     | `bg-primary-100`                | Badge bg                                |
| `primary-200`     | `#bfdbfe`     | `border-primary-200`            | Card hover border (light)               |
| `primary-300`     | `#93c5fd`     | `text-primary-300`              | Accent text on dark                     |
| `primary-400`     | `#60a5fa`     | `text-primary-400`              | Links, icons on dark bg                 |
| **`primary-500`** | **`#3b82f6`** | `bg-primary-500`                | **Default CTA, accent dots**            |
| `primary-600`     | `#2563eb`     | `bg-primary-600`                | Hover CTA, active pages, widget headers |
| `primary-700`     | `#1d4ed8`     | `bg-primary-700`                | Widget header gradient end              |
| `primary-800`     | `#1e40af`     | —                               | Deep accent                             |
| `primary-900`     | `#1e3a8a`     | `dark:hover:border-primary-900` | Card hover border (dark)                |
| `primary-950`     | `#172554`     | `via-primary-950`               | Hero gradient midpoint                  |

> **Rule:** In dark mode, use `primary-400` for interactive text, not `primary-500` — it has better contrast on dark surfaces.

### 2.2 Dark Scale (Zinc — Surfaces)

| Token                  | Hex      | Usage              |
| ---------------------- | -------- | ------------------ |
| `dark-50` / `#18181b`  | zinc-900 | Deepest bg in dark |
| `dark-100` / `#27272a` | zinc-800 | Card surface dark  |
| `dark-200` / `#3f3f46` | zinc-700 | Elevated surface   |
| `dark-300` / `#52525b` | zinc-600 | Borders            |
| `dark-400` / `#71717a` | zinc-500 | Muted icons        |
| `dark-500` / `#a1a1aa` | zinc-400 | Muted text         |

### 2.3 Semantic Mapping

| Role                 | Light              | Dark                       |
| -------------------- | ------------------ | -------------------------- |
| Page background      | `bg-white`         | `dark:bg-gray-900`         |
| Section background   | `bg-gray-50/50`    | `dark:bg-transparent`      |
| Card surface         | `bg-white`         | `dark:bg-gray-900`         |
| Card border          | `border-gray-200`  | `dark:border-gray-800`     |
| Body text            | `text-gray-900`    | `dark:text-white`          |
| Muted text           | `text-gray-600`    | `dark:text-gray-400`       |
| Subtle text / meta   | `text-gray-500`    | `dark:text-gray-500`       |
| Caption / timestamps | `text-gray-400`    | `dark:text-gray-500`       |
| Primary interactive  | `text-primary-600` | `dark:text-primary-400`    |
| Dividers             | `border-gray-100`  | `dark:border-gray-800`     |
| Destructive          | `text-red-600`     | `dark:text-red-400`        |
| Destructive hover bg | `hover:bg-red-50`  | `dark:hover:bg-red-900/20` |

### 2.4 Hero Code Syntax Colors

The hero uses a code window with these exact token colors (on dark `slate-900` bg):

| Token type            | Color class        | Hex approx |
| --------------------- | ------------------ | ---------- |
| Keyword (`const`)     | `text-purple-400`  | `#c084fc`  |
| Variable (`blog`)     | `text-blue-300`    | `#93c5fd`  |
| Object key            | `text-emerald-400` | `#34d399`  |
| String value          | `text-amber-300`   | `#fcd34d`  |
| Number / reference    | `text-sky-300`     | `#7dd3fc`  |
| Punctuation / default | `text-slate-300`   | `#cbd5e1`  |
| Comment / muted       | `text-slate-500`   | `#64748b`  |
| Terminal prompt `$`   | `text-slate-500`   | `#64748b`  |
| Terminal command      | `text-primary-400` | `#60a5fa`  |

---

## 3. Typography

### 3.1 Font Families

```css
/* tailwind.config.js */
fontFamily: {
  sans: ['Inter', 'ui-sans-serif', 'system-ui'],
  mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
}
```

- **Inter** — all UI chrome: headers, nav, buttons, body copy
- **JetBrains Mono** — code blocks, inline code, tech tags on hero, terminal elements

### 3.2 Type Scale

| Role                 | Size                       | Weight  | Tailwind                                          |
| -------------------- | -------------------------- | ------- | ------------------------------------------------- |
| Hero H1              | `clamp(2.25rem → 4.5rem)`  | 800     | `text-4xl sm:text-5xl xl:text-7xl font-extrabold` |
| Article H1           | `clamp(1.875rem → 2.5rem)` | 800     | via prose plugin                                  |
| Article H2           | `clamp(1.5rem → 2rem)`     | 700     | via prose plugin                                  |
| Article H3           | `clamp(1.25rem → 1.5rem)`  | 600     | via prose plugin                                  |
| Section heading      | `1.25–1.5rem`              | 700     | `text-xl sm:text-2xl font-bold`                   |
| Card title           | `1rem–1.125rem`            | 700     | `text-base sm:text-lg font-bold`                  |
| Sidebar widget title | `0.875rem`                 | 600     | `text-sm font-semibold`                           |
| Button / label       | `0.875rem`                 | 500–600 | `text-sm font-medium`                             |
| Meta / caption       | `0.75rem`                  | 500     | `text-xs font-medium`                             |
| Eyebrow label        | `0.75rem`                  | 600     | `text-xs font-semibold uppercase tracking-widest` |
| Footer section title | `0.875rem`                 | 600     | `text-sm font-semibold uppercase tracking-wider`  |
| Mono / code          | `0.875em`                  | 400–600 | `font-mono text-sm`                               |

### 3.3 Letter Spacing

| Context               | Class             | Value      |
| --------------------- | ----------------- | ---------- |
| Hero + large headings | `tracking-tight`  | `-0.025em` |
| Standard headings     | `tracking-tight`  | `-0.02em`  |
| Sub-headings          | `tracking-tight`  | `-0.01em`  |
| **Eyebrow labels**    | `tracking-widest` | `0.1em`    |
| Footer section titles | `tracking-wider`  | `0.05em`   |

### 3.4 Line Height

| Context        | Class                            | Value |
| -------------- | -------------------------------- | ----- |
| Hero headline  | `leading-none` / `leading-tight` | —     |
| Card titles    | `leading-snug`                   | 1.375 |
| Body / excerpt | `leading-relaxed`                | 1.625 |
| Article prose  | `leading-[1.8]`                  | 1.8   |
| Mono / code    | `leading-relaxed`                | —     |

---

## 4. Spacing & Layout

### 4.1 Standard Container

```html
<!-- All pages use this wrapper -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"></div>
```

### 4.2 Content Grid

```html
<!-- Main content + sidebar (3+1 columns) -->
<div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
  <div class="lg:col-span-3"><!-- articles --></div>
  <div class="lg:col-span-1">
    <div class="sticky top-20 space-y-4"><!-- sidebar widgets --></div>
  </div>
</div>
```

> **Sidebar sticky offset:** `top-20` = 80px, accounts for the sticky header height.

### 4.3 Key Spacing Tokens

| Usage                   | Class                     | px               |
| ----------------------- | ------------------------- | ---------------- |
| Icon-label gap (badge)  | `gap-1`                   | 4                |
| Icon-label gap (button) | `gap-2`                   | 8                |
| Button group gap        | `gap-3`                   | 12               |
| Card padding            | `p-4 sm:p-5`              | 16–20            |
| Card header/footer      | `px-5 py-4`               | 20/16            |
| Sidebar widget padding  | `p-4`                     | 16               |
| Section top-padding     | `py-10 sm:py-12`          | 40–48            |
| Hero section            | `py-20 sm:py-28 lg:py-32` | 80–128           |
| Sidebar widgets gap     | `space-y-4`               | 16 between       |
| Article list            | `space-y-4`               | 16 between cards |

### 4.4 Breakpoints

| Name | Width   | Key changes                                         |
| ---- | ------- | --------------------------------------------------- |
| `sm` | ≥640px  | Larger padding, horizontal button groups            |
| `md` | ≥768px  | Desktop mobile detection cutoff                     |
| `lg` | ≥1024px | Sidebar appears, desktop nav shows, hero goes 2-col |
| `xl` | ≥1280px | Hero card becomes wider (`w-96`)                    |

---

## 5. Elevation & Borders

### 5.1 Shadow Scale

| Level                  | Class                             | Usage                           |
| ---------------------- | --------------------------------- | ------------------------------- |
| Flat                   | —                                 | Text elements                   |
| Subtle                 | `shadow-sm`                       | Default card, pagination button |
| Card hover             | `shadow-md`                       | Card on hover                   |
| Prominent              | `shadow-lg`                       | Dropdowns, logo mark            |
| **Primary glow**       | `shadow-lg shadow-primary-500/30` | CTA buttons                     |
| **Primary glow hover** | `shadow-xl shadow-primary-500/40` | CTA button :hover               |
| Hero code window       | `shadow-2xl shadow-black/40`      | Dark card widget                |
| Dropdown               | `shadow-xl`                       | User menu, modals               |

### 5.2 Border Radius

| Element                     | Class                       | px   |
| --------------------------- | --------------------------- | ---- |
| Buttons                     | `rounded-xl`                | 12   |
| Cards                       | `rounded-xl`                | 12   |
| Inputs                      | `rounded-lg` / `rounded-xl` | 8–12 |
| Code window                 | `rounded-2xl`               | 16   |
| Category badge (over image) | `rounded-md`                | 6    |
| Tags                        | `rounded-md`                | 6    |
| Badge / pill                | `rounded-full`              | 9999 |
| Avatar                      | `rounded-full`              | 9999 |
| Logo mark                   | `rounded-xl`                | 12   |
| Pagination buttons          | `rounded-lg`                | 8    |
| Social icon buttons         | `rounded-xl`                | 12   |

### 5.3 Card Border Behavior

```
default:  border-gray-200          dark:border-gray-800
hover:    border-primary-200       dark:border-primary-900/60
          shadow-sm → shadow-md
```

---

## 6. Component Library

All base utility classes are defined in `assets/css/main.css` via `@layer components`.

### 6.1 Buttons

#### Base `.btn`

```
inline-flex items-center justify-center px-4 py-2
border border-transparent text-sm font-medium rounded-lg
shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2
transition-all duration-200 cursor-pointer
```

#### Variants

| Variant          | When to use                                   |
| ---------------- | --------------------------------------------- |
| `.btn-primary`   | Primary CTA — blue fill + shadow glow         |
| `.btn-secondary` | Secondary action — gray fill                  |
| `.btn-outline`   | Tertiary — white bg + gray border, dark-aware |
| `.btn-ghost`     | Icon buttons, nav actions — no bg/border      |

#### Hero CTA (large, inline)

```html
<!-- Primary CTA on hero -->
<NuxtLink
  class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl bg-primary-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-400 hover:shadow-xl hover:shadow-primary-500/40 active:translate-y-0"
></NuxtLink>
```

#### Ghost Hero CTA

```html
<NuxtLink
  class="touch-optimized inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white/90 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 active:translate-y-0"
></NuxtLink>
```

#### Inline "View all / Read more" Link

```html
<!-- Arrow animates right on hover -->
<NuxtLink
  class="group inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-primary-600 transition-all duration-150 hover:bg-primary-50 hover:text-primary-700 dark:text-primary-400 dark:hover:bg-primary-900/20 dark:hover:text-primary-300"
>
  查看全部
  <Icon class="h-4 w-4 transition-transform duration-150 group-hover:translate-x-1" />
</NuxtLink>
```

#### "Read more" micro-link (card footer)

```html
<!-- Gap expands on hover, pulling arrow closer -->
<NuxtLink
  class="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 transition-all hover:gap-1.5 dark:text-primary-400"
>
  阅读 <Icon class="h-3.5 w-3.5" />
</NuxtLink>
```

---

### 6.2 Cards

#### Base `.card`

```
bg-white dark:bg-gray-900
rounded-xl border border-gray-200 dark:border-gray-800
shadow-sm
```

#### `.card-hover`

```
.card + transition-all duration-200
hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900
```

| Slot class     | Style                                                                                                 |
| -------------- | ----------------------------------------------------------------------------------------------------- |
| `.card-header` | `px-5 py-4 border-b border-gray-100 dark:border-gray-800`                                             |
| `.card-body`   | `px-5 py-4`                                                                                           |
| `.card-footer` | `px-5 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 rounded-b-xl` |

#### Blog Post Card — Anatomy

```
┌─ border-primary-500 (left bar, scale-y-0 → 1 on hover) ──────────┐
│                                                                    │
│  [cover image h-44 sm:h-48 md:h-52]  ← scale-105 on hover       │
│   └─ [category badge] top-left overlay                           │
│                                                                    │
│  padding p-4 sm:p-5                                               │
│  ├─ meta row: [badge-primary] [calendar icon date] [clock time]  │
│  ├─ h2 title  line-clamp-2  → primary-600/400 on group-hover     │
│  ├─ excerpt   line-clamp-2  text-gray-500                        │
│  ├─ tags row  .tag × 3  +  .badge-gray overflow                  │
│  └─ footer border-t                                               │
│     ├─ [heart N] [comment N] [eye N]  text-xs text-gray-400     │
│     └─ [阅读 →]  hover:gap-1.5                                   │
└────────────────────────────────────────────────────────────────────┘
```

Full card classes:

```html
<article
  class="group relative flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-primary-900/60"
>
  <!-- Left accent bar -->
  <div
    class="absolute left-0 top-0 h-full w-0.5 scale-y-0 rounded-r-full bg-primary-500 transition-transform duration-200 group-hover:scale-y-100"
  />
</article>
```

---

### 6.3 Form Controls

| Class            | Style summary                                                                                                                 |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `.form-input`    | `px-4 py-2.5 rounded-lg border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500` |
| `.form-textarea` | `.form-input resize-vertical`                                                                                                 |
| `.select-input`  | `rounded-xl bg-gray-50 dark:bg-gray-800/50 py-2.5 pl-10 pr-9 focus:ring-primary-500/20`                                       |

**Focus ring:** `focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500`  
**Mobile font lock:** All inputs enforce `font-size: 16px` to prevent iOS auto-zoom.

---

### 6.4 Navigation

#### Header

```
sticky top-0 z-50
bg-white/95 dark:bg-gray-900/95 backdrop-blur-md
border-b border-gray-200 dark:border-gray-800
transition-all duration-300
```

Height: `h-14 sm:h-16 lg:h-17`

#### Logo Mark

```html
<div
  class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/25 sm:h-10 sm:w-10"
>
  <Icon name="i-heroicons-book-open" class="h-5 w-5 text-white" />
</div>
```

#### Logo Text

```html
<span
  class="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-lg font-bold text-transparent dark:from-white dark:to-gray-300 sm:text-xl"
></span>
```

#### Desktop Nav Link

```
px-3 py-2 text-sm font-medium
text-gray-600 dark:text-gray-300
hover:text-primary-600 dark:hover:text-primary-400
transition-colors
```

Active underline: `absolute inset-x-3 -bottom-px h-0.5 rounded-full bg-primary-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300`

#### Mobile Nav Link

```
touch-optimized flex items-center gap-3
rounded-xl px-4 py-3 text-base font-medium
text-gray-700 dark:text-gray-300
hover:bg-gray-100 dark:hover:bg-gray-800
```

Active state: `bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400`

---

### 6.5 Badges & Tags

| Class            | Appearance                                                         | Usage                 |
| ---------------- | ------------------------------------------------------------------ | --------------------- |
| `.badge`         | `inline-flex gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium` | Base only             |
| `.badge-primary` | Blue tint bg + blue text                                           | Category on cards     |
| `.badge-gray`    | Gray bg + gray text                                                | Overflow count (`+N`) |
| `.tag`           | `px-2.5 py-1 rounded-md text-xs bg-gray-100 hover:bg-primary-100`  | Clickable topic tags  |

Tags always prefixed with `#` and link to `/blog?tag=...`.

---

### 6.6 Sidebar Widgets

```
sticky top-20 space-y-4    ← outer wrapper
```

Standard widget:

```html
<div class="card overflow-hidden">
  <div class="sidebar-widget-header">
    <h3 class="sidebar-widget-title">
      <Icon class="h-4 w-4 text-primary-500" />
      Widget Title
    </h3>
  </div>
  <div class="| p-2 p-4"><!-- content --></div>
</div>
```

Featured widget header (gradient):

```html
<div class="relative overflow-hidden bg-gradient-to-br from-primary-600 to-primary-700 px-4 py-3.5">
  <!-- Dot grid overlay inside gradient headers -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:14px_14px]"
  />
  <h3 class="relative flex items-center gap-2 text-sm font-semibold text-white">
    <Icon class="h-4 w-4 text-primary-200" />
    关于博客
  </h3>
</div>
```

Category list item (inside sidebar widget):

```html
<NuxtLink
  class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-primary-400"
>
  <span>Category Name</span>
  <Icon name="i-heroicons-chevron-right" class="h-3.5 w-3.5 text-gray-400" />
</NuxtLink>
```

---

### 6.7 Callout Blocks (Article Content)

```
.callout  →  rounded-xl border-l-4 p-4 my-6 shadow-sm transition-all duration-200
```

| Variant            | Border              | Background                              |
| ------------------ | ------------------- | --------------------------------------- |
| `.callout-info`    | `border-blue-500`   | `bg-blue-50/80 dark:bg-blue-950/50`     |
| `.callout-warning` | `border-yellow-500` | `bg-yellow-50/80 dark:bg-yellow-950/50` |
| `.callout-error`   | `border-red-500`    | `bg-red-50/80 dark:bg-red-950/50`       |
| `.callout-success` | `border-green-500`  | `bg-green-50/80 dark:bg-green-950/50`   |
| `.callout-tip`     | `border-purple-500` | `bg-purple-50/80 dark:bg-purple-950/50` |

---

### 6.8 Pagination

Active page: `bg-primary-600 text-white shadow-sm shadow-primary-600/30`  
Inactive page: `border border-gray-200 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400`  
Disabled: `opacity-40 cursor-not-allowed`  
Min touch size: `min-w-[36px] sm:min-w-[40px]`  
Ellipsis: `text-gray-400 dark:text-gray-600 select-none px-1`

---

### 6.9 Social Icon Buttons (Footer)

```html
<a
  class="touch-optimized flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600 transition-all hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
  aria-label="GitHub"
>
  <Icon name="i-simple-icons-github" class="h-5 w-5" />
</a>
```

---

### 6.10 Skeleton Loading

```html
<div class="h-8 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
```

All skeletons use `animate-pulse` + `rounded-lg` + `bg-gray-100 dark:bg-gray-800`.  
For tag clouds: `h-6 w-14`, for sidebar items: `h-8 full-width`.

---

## 7. Signature Patterns

These are unique recurring patterns that define the blog's visual identity.

### 7.1 Section Eyebrow + Heading

Always used to introduce content sections:

```html
<div>
  <!-- Eyebrow label -->
  <p class="mb-1.5 text-xs font-semibold uppercase tracking-widest text-primary-500">Latest</p>
  <!-- Heading with colored bar -->
  <div class="flex items-center gap-3">
    <div class="h-6 w-1 rounded-full bg-primary-500" />
    <h2 class="text-xl font-bold text-gray-900 dark:text-white sm:text-2xl">最新文章</h2>
  </div>
</div>
```

> The `1px wide × 24px tall rounded-full` bar is the signature section marker.

---

### 7.2 Hero Code Window

A decorative macOS-style code card displayed in the hero:

```html
<div
  class="relative rounded-2xl border border-slate-700/60 bg-slate-900/80 shadow-2xl shadow-black/40 backdrop-blur-sm"
>
  <!-- macOS traffic-light title bar -->
  <div
    class="flex items-center gap-2 rounded-t-2xl border-b border-slate-700/60 bg-slate-800/60 px-4 py-3"
  >
    <div class="h-3 w-3 rounded-full bg-red-500/80" />
    <div class="h-3 w-3 rounded-full bg-yellow-500/80" />
    <div class="h-3 w-3 rounded-full bg-green-500/80" />
    <span class="ml-2 font-mono text-xs text-slate-500">blog.config.ts</span>
  </div>

  <!-- Syntax-highlighted content (font-mono text-sm leading-relaxed) -->
  <div class="space-y-1 p-5 font-mono text-sm leading-relaxed">
    <span class="text-purple-400">const</span>
    <span class="text-blue-300"> blog</span>
    <span class="text-slate-300"> = {</span>
    <!-- ... object body with text-emerald-400 keys, text-amber-300 strings ... -->

    <!-- Terminal prompt at bottom -->
    <div class="mt-2 flex items-center gap-1.5">
      <span class="text-slate-500">$</span>
      <span class="text-primary-400">nuxt dev</span>
      <!-- Blinking cursor -->
      <span class="inline-block h-4 w-0.5 animate-pulse bg-primary-400 opacity-80" />
    </div>
  </div>
</div>
```

---

### 7.3 Hero Stats Bar

A 3-column stat strip at the bottom of the hero section:

```html
<div class="border-t border-white/[0.07]">
  <div class="grid grid-cols-3 divide-x divide-white/[0.07]">
    <div class="flex flex-col items-center py-5 sm:flex-row sm:justify-center sm:gap-3">
      <span class="text-2xl font-bold text-white sm:text-3xl">
        42<span class="text-lg text-primary-400">+</span>
      </span>
      <span class="text-xs text-slate-400 sm:text-sm">技术文章</span>
    </div>
    <!-- repeat × 3 -->
  </div>
</div>
```

- Dividers: `divide-x divide-white/[0.07]` (7% opacity white)
- Numbers: `text-white font-bold`, the `+` suffix uses `text-primary-400`
- Labels: `text-slate-400 text-xs sm:text-sm`
- Loading state: `animate-pulse text-slate-600` showing `—`

---

### 7.4 Hero Tech Tag Strip

A scrollable row of monospaced technology badges under the hero CTA:

```html
<div class="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start">
  <span
    class="cursor-default rounded-lg border border-slate-700/50 bg-slate-800/50 px-3 py-1.5 font-mono text-slate-400 backdrop-blur-sm transition-colors duration-150 hover:border-primary-500/40 hover:bg-primary-900/20 hover:text-primary-300"
  >
    Vue.js
  </span>
</div>
```

---

### 7.5 Hero Background Effects

Layered in order (bottom to top):

```html
<!-- 1. Base gradient -->
<section class="bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900">
  <!-- 2. Dot grid (opacity 22%) -->
  <div
    class="pointer-events-none absolute inset-0 opacity-[0.22]"
    style="background-image: radial-gradient(circle, rgb(148 163 184 / 0.3) 1px, transparent 1px);
           background-size: 30px 30px;"
  />

  <!-- 3. Glow orbs -->
  <div
    class="absolute -right-56 -top-28 h-[580px] w-[580px] rounded-full bg-primary-600/15 blur-3xl"
  />
  <div
    class="absolute -left-56 bottom-0 h-[480px] w-[480px] rounded-full bg-indigo-600/15 blur-3xl"
  />
  <div
    class="absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-violet-400/[0.07] blur-3xl"
  />

  <!-- 4. Bottom fade-out -->
  <div
    class="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-slate-900/60 to-transparent"
  />
</section>
```

---

### 7.6 Live Status Badge

Used in the hero to indicate "continuously updated":

```html
<div
  class="mb-8 inline-flex items-center gap-2 rounded-full border border-primary-500/30 bg-primary-500/10 px-4 py-2 text-sm font-medium text-primary-300 backdrop-blur-sm"
>
  <!-- Ping animation dot -->
  <span class="relative flex h-2 w-2">
    <span
      class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"
    />
    <span class="relative inline-flex h-2 w-2 rounded-full bg-primary-400" />
  </span>
  持续更新中
</div>
```

---

### 7.7 Glass Effects

| Class                           | Composition                                                                                       |
| ------------------------------- | ------------------------------------------------------------------------------------------------- |
| `.glass`                        | `bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-700/50` |
| Header                          | `bg-white/95 dark:bg-gray-900/95 backdrop-blur-md`                                                |
| Footer                          | `bg-white/80 dark:bg-gray-900/90 backdrop-blur-sm`                                                |
| Card over image (category pill) | `bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm`                                                |

---

### 7.8 Text Gradients

```css
/* Blue gradient text (CTA, brand) */
.text-gradient {
  @apply bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent;
}

/* Adaptive gradient (light heading → dark heading) */
.text-gradient-dark {
  @apply bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent dark:from-white dark:to-gray-300;
}
```

Used for: logo text, hero H1 inner text, footer logo text.

---

### 7.9 Reading Progress Bar

```css
.reading-progress {
  @apply fixed left-0 top-0 z-[60] h-0.5 bg-gradient-to-r from-primary-500 via-primary-400 to-primary-600 transition-all duration-100 ease-out;
  background-size: 200% auto;
}
```

---

## 8. Dark Mode

**Mechanism:** `@nuxtjs/color-mode` → class `dark` on `<html>`.  
**Config:** `darkMode: 'class'` in `tailwind.config.js`.  
**Toggle:** Header sun/moon button → `colorMode.preference = 'light' | 'dark'`.

### Pairing Rules

Every surface declaration must include its dark counterpart:

```
bg-white                →  dark:bg-gray-900
bg-gray-50              →  dark:bg-transparent  (body section)
border-gray-200         →  dark:border-gray-800
border-gray-100         →  dark:border-gray-800
text-gray-900           →  dark:text-white
text-gray-700           →  dark:text-gray-300
text-gray-600           →  dark:text-gray-400
text-gray-500           →  dark:text-gray-500  (no change needed)
text-primary-600        →  dark:text-primary-400
hover:bg-gray-100       →  dark:hover:bg-gray-800
hover:bg-gray-50        →  dark:hover:bg-gray-800/80  (lighter hover)
bg-gray-100             →  dark:bg-gray-800
bg-gray-50 (footer)     →  dark:bg-gray-800/50
```

---

## 9. Animation & Motion

### 9.1 Custom Keyframes

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

| Class                 | Duration      | Use for                    |
| --------------------- | ------------- | -------------------------- |
| `.animate-fade-in`    | 0.4s ease-out | Overlay reveals            |
| `.animate-fade-in-up` | 0.5s ease-out | Card/section entry         |
| `animate-pulse`       | Tailwind      | Skeletons, blinking cursor |
| `animate-ping`        | Tailwind      | Live status dot            |

### 9.2 Transition Standards

| Type              | Duration  | Class                                                |
| ----------------- | --------- | ---------------------------------------------------- |
| Color / opacity   | 150ms     | `transition-colors duration-150`                     |
| Multi-property    | 200ms     | `transition-all duration-200`                        |
| Menus / dropdowns | 200–300ms | See Vue Transition below                             |
| Hover lift        | 200ms     | `hover:-translate-y-0.5 transition-all duration-200` |
| Underline expand  | 300ms     | `transition-transform duration-300`                  |
| Scroll indicator  | 100ms     | `transition-all duration-100 ease-out`               |

### 9.3 Vue `<Transition>` — Dropdown

```html
<Transition
  enter-active-class="transition ease-out duration-200"
  enter-from-class="opacity-0 scale-95"
  enter-to-class="opacity-100 scale-100"
  leave-active-class="transition ease-in duration-150"
  leave-from-class="opacity-100 scale-100"
  leave-to-class="opacity-0 scale-95"
></Transition>
```

### 9.4 Vue `<Transition>` — Mobile Menu Slide

```html
<Transition
  enter-active-class="transition-all duration-300 ease-out"
  enter-from-class="opacity-0 -translate-y-2"
  enter-to-class="opacity-100 translate-y-0"
  leave-active-class="transition-all duration-200 ease-in"
  leave-from-class="opacity-100 translate-y-0"
  leave-to-class="opacity-0 -translate-y-2"
></Transition>
```

### 9.5 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  /* Remove all transforms and keyframe animations */
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

> Every animated element must degrade gracefully when `prefers-reduced-motion` is active.

---

## 10. Article / Prose

Apply `prose dark:prose-invert` from `@tailwindcss/typography`. All overrides are in `tailwind.config.js` under `theme.extend.typography`.

### Key Values

| Element            | Light                      | Dark                        |
| ------------------ | -------------------------- | --------------------------- |
| Body text          | `rgb(55 65 81)` gray-700   | `rgb(209 213 219)` gray-300 |
| H1–H4              | `rgb(17 24 39)` gray-900   | `rgb(243 244 246)` gray-100 |
| Links              | `#3b82f6` primary-500      | `#60a5fa` primary-400       |
| Link hover         | `#1d4ed8` primary-700      | `#93c5fd` primary-300       |
| List markers       | `#3b82f6`                  | `#60a5fa`                   |
| Blockquote border  | `#3b82f6`                  | `#60a5fa`                   |
| Blockquote bg      | `rgb(239 246 255)` blue-50 | `rgb(30 41 59)` slate-800   |
| `code` text        | `rgb(220 38 38)` red-600   | `rgb(252 165 165)` red-300  |
| `code` bg          | `rgb(254 242 242)` red-50  | `rgb(69 26 26)`             |
| `pre` bg           | `rgb(13 17 23)`            | same                        |
| H2 `border-bottom` | `rgb(229 231 235)`         | `rgb(55 65 81)` gray-700    |
| `tbody tr:hover`   | `rgb(243 244 246)`         | `rgb(39 50 66)`             |

### External link indicator

All `a[href^="http"]` get `::after { content: "↗"; font-size: 0.85em; opacity: 0.6; }` — automatic, via typography config.

### Code highlighting

Library: **highlight.js** | Theme: `github-dark`  
Import: `@import 'highlight.js/styles/github-dark.css'` (bottom of `main.css`)

---

## 11. Icons

```
Libraries: @iconify-json/heroicons · @iconify-json/simple-icons
Component: <Icon name="i-heroicons-*" /> or <Icon name="i-simple-icons-*" />
```

| Size    | Class         | Usage                                  |
| ------- | ------------- | -------------------------------------- |
| XS      | `h-3 w-3`     | Micro-links (arrow in "了解更多")      |
| S       | `h-3.5 w-3.5` | Card meta icons (heart, eye, calendar) |
| Default | `h-4 w-4`     | Sidebar titles, badges                 |
| M       | `h-5 w-5`     | Header buttons, nav icons, social      |
| L       | `h-6 w-6`     | Hamburger menu button                  |

**Rules:**

- Use **Heroicons** for all UI actions
- Use **Simple Icons** for brand logos (GitHub, Twitter, etc.)
- All icon-only buttons MUST have `aria-label`
- Never use emoji as icons

---

## 12. Mobile & Touch

### 12.1 Touch Target Class

```css
.touch-optimized {
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  min-height: 44px; /* Apple HIG minimum */
  min-width: 44px;
  cursor: pointer;
}
```

Add `.touch-optimized` to: header buttons, mobile nav links, CTA buttons, social icon buttons, pagination buttons.

### 12.2 Active Feedback (touch devices only)

```css
@media (hover: none) and (pointer: coarse) {
  button:active,
  [role='button']:active {
    transform: scale(0.97);
    opacity: 0.85;
  }
}
```

Cards on mobile get `active:scale-[0.99]` for feedback. Detected via JS: `window.innerWidth < 768`.

### 12.3 Mobile Utilities

| Class               | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `.safe-area-top`    | `padding-top: env(safe-area-inset-top)` — notch          |
| `.safe-area-bottom` | `padding-bottom: env(safe-area-inset-bottom)` — home bar |
| `.swipe-horizontal` | Horizontal snap scroll container                         |
| `.mobile-only`      | `block md:hidden`                                        |
| `.desktop-only`     | `hidden md:block`                                        |
| `.scrollbar-thin`   | Styled thin scrollbar (5px)                              |

### 12.4 Input Mobile Rules

```css
input,
textarea,
select {
  font-size: 16px;
} /* prevents iOS zoom */
input:focus {
  scroll-margin-top: 20px;
  scroll-margin-bottom: 20px;
}
```

---

## 13. Anti-Patterns

> Do not use any of these in new components.

| ❌ Pattern                                 | Why                        | ✅ Instead                                             |
| ------------------------------------------ | -------------------------- | ------------------------------------------------------ |
| Emoji as icons                             | Inconsistent, inaccessible | SVG via `<Icon>`                                       |
| `scale` hover on cards                     | Causes layout shift        | `shadow` + `border-color` + `-translate-y-0.5`         |
| `bg-white/10` glass (light mode)           | Invisible                  | `bg-white/80` minimum                                  |
| `text-gray-400` for body text (light)      | Fails WCAG 4.5:1           | `text-gray-600` minimum                                |
| `border-white/10` in light mode            | Invisible border           | `border-gray-200`                                      |
| Hardcoded hex in `.vue` templates          | Breaks design tokens       | Tailwind classes only                                  |
| Input without `font-size: 16px` mobile     | iOS auto-zoom              | `.form-input` already handles this                     |
| Focusable element without focus ring       | Keyboard inaccessible      | `focus:ring-2 focus:ring-primary-500/30`               |
| Icon-only button without `aria-label`      | Screen reader fails        | Always add `aria-label`                                |
| Missing `dark:` counterpart                | Broken dark mode           | Match every light class with dark pair                 |
| `color` as sole state indicator            | WCAG 1.4.1 fail            | Add icon or text label                                 |
| `transition-duration > 500ms`              | Feels sluggish             | 150–300ms max                                          |
| Navbar content hidden behind sticky header | UX bug                     | `sticky top-20` on sidebar, `scroll-padding-top: 4rem` |

---

## 14. Pre-Delivery Checklist

### Visual

- [ ] No emojis used as icons (SVG via `<Icon>` only)
- [ ] Icons from Heroicons (UI) or Simple Icons (brand) exclusively
- [ ] Brand logos verified against Simple Icons
- [ ] Hover effects don't shift layout (no `scale` on parent containers)
- [ ] Tokens used consistently (no hardcoded hex in templates)

### Interaction

- [ ] All clickable elements have `cursor-pointer` or `.touch-optimized`
- [ ] Hover states provide clear visual feedback
- [ ] All transitions between 150–300ms
- [ ] Focus states visible (`focus:ring-2`)
- [ ] Icon-only buttons have `aria-label`

### Dark Mode

- [ ] Every `bg-*` has a `dark:bg-*` pair
- [ ] Every `text-*` has a `dark:text-*` pair
- [ ] Every `border-*` has a `dark:border-*` pair
- [ ] Glass elements use `bg-white/80+` in light mode (not `bg-white/10`)
- [ ] Tested in both modes

### Layout

- [ ] Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- [ ] Sidebar wrapper: `sticky top-20 space-y-4`
- [ ] No content hidden behind sticky header (`z-50`)
- [ ] Responsive at 375px / 768px / 1024px / 1440px
- [ ] No horizontal scroll on mobile

### Accessibility

- [ ] All `<img>` and `<NuxtImg>` have `alt` text
- [ ] All form `<input>` have associated `<label>` or `aria-label`
- [ ] Color alone does not convey information
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets ≥ 44×44px (`.touch-optimized`)
- [ ] Keyboard navigable (tab, enter, escape where relevant)

### Performance

- [ ] Images use `<NuxtImg>` with `loading="lazy"` and `sizes`
- [ ] Cover images use `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"`
- [ ] Placeholder blur: `:placeholder="[20, 11, 75, 5]"`
