# Avqentra Design System

The single reference for how Avqentra looks, moves and speaks. Every page and component follows it.
If something you need isn't here, add it here first, then build it.

The homepage (`app/page.tsx`, `components/home/home.module.css`) is the reference implementation.
The founders page (`components/founders/`) is the reference for a second page built on the system.

---

## 1. Principles

1. **Blueprint, not brochure.** The site reads like a technical drawing: hairline rules, numbered indices,
   corner ticks, a mono voice. Decoration is structural, never ornamental.
2. **Warm dark.** Near-black with a warm (olive/cream) cast. Never pure black, never pure white, never blue.
3. **One accent.** Cream/gold is the only accent. Hierarchy comes from size, weight and tone, not from colour.
4. **Quiet until it matters.** Motion is slow and eased; nothing bounces, nothing autoplays sound, nothing
   competes with the content.
5. **Say what it is.** Copy is specific and concrete. If a sentence could appear on any tech company's site,
   rewrite it (see §9).

---

## 2. Colour

All colours sit on the warm-dark base. Use these values only; don't introduce near-duplicates
(`#e6e2d8` vs `#ece8df`): pick the token.

### Surfaces

| Token | Value | Use |
|---|---|---|
| `bg/deep` | `#0a0a08` | Hero backgrounds, deepest layer |
| `bg/base` | `#0e0e0b` | Page background (`.page`) |
| `bg/raised` | `#12120e` | Menus, popovers |
| `bg/panel` | `linear-gradient(160deg,#1b1a15,#0e0e0b)` | Visual panels, portrait plates |
| `bg/cta` | `#0b0b09` + olive radial glow | Closing CTA band, footer stage |

### Text (contrast measured on `#0e0e0b`)

| Token | Value | Contrast | Use |
|---|---|---|---|
| `text/display` | `#f2efe8` | 16.8:1 | Headlines (h1, h2, CTA titles) |
| `text/primary` | `#ece8df` | 15.8:1 | Names, h3, nav, emphasised body |
| `text/secondary` | `#cfccc4` | 12.0:1 | Lede paragraphs, list items |
| `text/body` | `#a09d94` | 7.1:1 | Default paragraph text (`.sub`) |
| `text/muted` | `#9a978e` | 6.6:1 | Long body copy (`.body`) |
| `text/meta` | `#8a877f` | 5.4:1 | Footer, captions, **lowest tone allowed for information** |
| `text/label` | `#7d7a73` | 4.5:1 | Kickers / eyebrows only (uppercase, tracked) |
| `text/ghost` | `#6f6c65`, `#55534c` | 3.7:1, 2.5:1 | **Decoration only:** index numbers, frame labels. Never real information |

### Accent

| Token | Value | Use |
|---|---|---|
| `accent` | `#e6dcc8` (`--cream`) | Solid button fill, active states, focus outline, timeline markers |
| `accent/hover` | `#f3ecdd` | Solid button hover |
| `accent/on` | `#1c1a16` | Text on a cream fill (12.8:1) |
| `accent/label` | `#b9ae94` | Category labels, role tags, `dt` labels |
| `accent/gold` | `linear-gradient(90deg,#9c937a,#d2c9b1)` | `.gold`: the one emphasised phrase per headline |

### Lines

| Token | Value | Use |
|---|---|---|
| `--hair` | `rgba(255,245,225,.07)` | Default hairline: section rules, list dividers, frame |
| `line/strong` | `rgba(255,245,225,.14)` | Top border of a list or table: "this block starts here" |
| `--tick` | `rgba(255,245,225,.3)` | Kicker tick marks, frame ticks |
| `line/panel` | `rgba(230,220,195,.12)` → `.28` active | Panel borders |

**Rules**
- Information must be `text/meta` (`#8a877f`) or lighter. `#6f6c65` and `#55534c` fail WCAG for text and are
  decoration only.
- Gold gradient: **one phrase per headline**, usually the last line. Never on body text, never on two lines in
  the same heading block.
- No other hues. Status colours (success/error), if ever needed, get added here first.

---

## 3. Typography

Two families, loaded in `lib/fonts.ts` via `next/font` (self-hosted, no layout shift):

| Family | Variable | Role |
|---|---|---|
| **Archivo** (width axis) | `--font-display` | Display: headlines, names, numbers. Always `font-stretch:112–125%` |
| **JetBrains Mono** 400/500/600 | `--font-mono` | Everything else: body, labels, buttons, nav |

There is no third font and no system sans. Don't use `system-ui` on themed pages.

### Type scale

| Role | Class | Family | Spec |
|---|---|---|---|
| Hero title | `.title` | Display 125% / 300 | 74px/76px (64 at ≤1280, `clamp(44px,11vw,72px)` mobile), `-.053em`, UPPERCASE |
| CTA title | `.ctaTitle` | Display 125% / 300 | `clamp(38px,6vw,92px)`/1.04, `-.045em`, UPPERCASE |
| Section h2 | `.h2` | Display 125% / 300 | `clamp(30px,3.7vw,52px)`/1.1, `-.03em`, UPPERCASE |
| Card / item h3 | `.h3s` | Display 112% / 400 | 18px/1.2, UPPERCASE |
| Big numerals | `.pNum`, stats | Display 125% / 200 | 44–64px/1, tone `rgba(216,205,180,.5)` or cream |
| Lede | `.lede` | Mono 400 | 16px/23px, `text/secondary` |
| Section intro | `.sub` | Mono 400 | 15px/1.75, `text/body`, max 620px |
| Body | `.body` | Mono 400 | 14px/1.75, `text/muted`, max 480px |
| Kicker / eyebrow | `.kicker` | Mono 400 | 10px/14px, `.14em`, UPPERCASE, `text/label`, preceded by `— ` |
| Label / tag | — | Mono 600 | 10px/1, `.14em`, UPPERCASE, `accent/label` |
| Button | `.btn` | Mono 500 | 10px/1, `.14em`, UPPERCASE |

**Rules**
- Headlines are UPPERCASE display, light weight (200–300). Never bold display.
- Body is never uppercase. Labels are always uppercase and tracked (`.14em`).
- **Minimum size 10px**, and only for uppercase tracked labels. Sentence-case text is **13px minimum**.
  9px exists in the codebase today and is being removed (§10).
- Measure: paragraphs max ~620px (`.sub`) or ~480px (`.body`). Never full-width text.
- Kickers start with an em dash and a space: `— Our products`.
- Numbers in sequences are zero-padded: `01`, `02`, `04 / 04`.

---

## 4. Layout

- **Frame.** Sections carry two vertical hairlines at `64px` from each viewport edge (`.sec::before/after`).
  Content starts at `112px` left so kickers can hang a tick into the gutter.
- **Section.** `.sec`: `padding:128px 64px 128px 112px`, `border-top: var(--hair)`, content `max-width:1216px`.
  CTA bands use `.cta` (160px vertical).
- **Section head.** `.secHead`: kicker → h2 → optional `.sub`, `margin-bottom:72px`, `max-width:760px`
  (`.secHeadWide` 980px).
- **Grids.** Content splits are asymmetric: `6fr/5fr`, `7fr/4fr`, `4fr/7fr`. Lists of equal items use 3 or 4
  equal columns separated by hairlines, **not cards with gaps**.
- **Header.** Fixed, 90px (72px mobile), transparent until scroll, then `rgba(10,10,8,.82)` + 14px blur.
- **Breakpoints.** `1280` (tighten), `1080` (single column, frame + ticks hidden, padding 24px),
  `520` (full-width buttons, stacked facts). Design mobile at **390px**.
- No horizontal scroll at any width. Check 390px before every merge.

---

## 5. Components

Use the existing class before writing a new one.

| Component | Where | Notes |
|---|---|---|
| Buttons | `.btn` + `.btnSolid` / `.btnGhost` | Square corners (radius 0), 45px tall, label left, `↗` arrow right. **One solid button per view.** |
| Arrow | `<Arrow />` (12px SVG, 1.1 stroke) | Nudges `translate(2px,-2px)` on hover. Every CTA has it. |
| Section head | `Head` in `Sections.tsx` | Kicker + h2 + sub |
| Numbered list | `.principles`, `.caps` | Big or small zero-padded number, h3, body, hairline dividers |
| Timeline | `.timeline` / `.marker` | Horizontal on desktop, vertical under 1080px |
| Facts | `.facts` | `dt` label column (110px) + `dd`, hairline rows |
| Roster / routes | `.roster`, `.routes` (founders) | Hairline rows that indent 8px on hover |
| Panel / plate | `.plate`, product visuals | Gradient panel, 32px grid mask, four corner ticks, `Fig. 01` caption |
| Matrix | `.matrix` (founders) | Real `<table>` with `scope`, glyph + text, legend |

**Rules**
- Corners are square. The only radius in the system is `2px` on gallery panels.
- No drop shadows. Depth comes from tone and hairlines.
- Icons are line icons at 1.1–1.7 stroke, `currentColor`. No emoji, no filled icon sets.
- Illustrative interfaces must be labelled as illustrative (`Illustrative interface` caption).

---

## 6. Motion

| Pattern | Spec |
|---|---|
| Entrance (hero) | `rise`: translateY 18–28px → 0, `.9s cubic-bezier(.2,.7,.2,1)`, staggered `90ms` via `--i` |
| Scroll reveal | `.reveal`: CSS `animation-timeline: view()`, progressive enhancement only |
| Hover | `.2–.3s`, colour/border/background or ≤8px translate |
| Ambient | Grid drift `40s linear`; must be barely perceptible |

**Rules**
- Single easing curve: `cubic-bezier(.2,.7,.2,1)`.
- Every animation and transition has a `prefers-reduced-motion: reduce` override that removes it.
- Content is fully visible without JS and without scroll-timeline support. Never gate content on animation.
- No scroll-jacking beyond the existing pinned product section, which un-pins below 1080px / 620px tall.

---

## 7. Accessibility (non-negotiable)

- Text contrast ≥ 4.5:1 (see §2). Decorative text gets `aria-hidden="true"`.
- Visible focus: `outline:1px solid var(--cream); outline-offset:3px` on links, buttons, summaries.
- One `h1` per page; headings in order; sections use `aria-labelledby` pointing at their h2.
- Tables are real `<table>` with `<caption>` and `scope`. Lists are `<ul>`/`<ol>`.
- Icon-only controls have an `aria-label`. External links: `target="_blank" rel="noopener noreferrer"`.
- The custom cursor is enhancement only. It must never hide the system cursor on touch, keyboard, or
  reduced-motion users.

---

## 8. Code conventions

- Styles live in CSS Modules next to their components (`home.module.css`, `founders.module.css`). New pages
  import `home.module.css` for shared primitives and add their own module for page-specific pieces.
- Themed pages render `<div className={\`home-theme ${display.variable} ${mono.variable} ${h.page}\`}>` and their
  own `<SiteHeader />`, and are excluded from the legacy `Nav` in `components/Nav.tsx`.
- No inline `style` blocks, no `!important`, no `<style>` tags in pages.
- Content lives in `lib/` (`products.ts`, `founders.ts`), never hard-coded in multiple components.
  Product names, descriptions and status come from `lib/products.ts` only.

---

## 9. Voice & positioning

### What Avqentra is

> **Avqentra is a product and engineering studio.** We are building our own AI products, launching soon,
> and we design and build software for clients.

Every page must make both halves clear: **our products** and **work with us**. A first-time visitor should
know within one screen what we make, that the products are not live yet, and that they can hire us.

### Rules

- **Products are launching, not launched.** Say *launching soon*, *in development*, *early access*. Don't
  write as if they have users, integrations or results they don't yet have.
- **Client work is a real offer.** Use *client projects*, *we build for teams*, *start a project*. Avoid
  vague agency phrases (*"let's create magic"*, *"digital solutions"*).
- **Specific over grand.** "Detects and explains application failures" beats "pushes the boundaries of
  what's possible".
- **Product names** are exact: `AgentBattle`, `DevSick`, `QuestionForge`, `Ops Academy`.
- **Tone:** confident, plain, short sentences. No exclamation marks. No superlatives we can't prove
  (*best*, *leading*, *enterprise-grade*).
- **CTAs** are verbs: *Explore AgentBattle*, *Get early access*, *Start a project*, *Get in touch*.
- Headlines: short, uppercase, ending in a full stop. One gold phrase.

### Standard CTAs

| Intent | Label | Target |
|---|---|---|
| See products | Explore our products | `/products` |
| Product interest | Get early access | `/contact?type=early-access` |
| Agency work | Start a project | `/contact?type=project` |
| General | Get in touch | `/contact` |

---

## 10. Known debt

Pages and patterns that don't follow this system yet. Fix them, don't copy them.

- `/products`, `/products/*`, `/about`, `/contact` still use the legacy light theme (`globals.css` `.wrap`,
  `.card`, `.btn`) and bespoke inline styles. They need migrating to the themed shell.
- 9px labels (`.index`, `.statLabel`, `.rRole`, founders `.colRole`) → raise to 10px minimum.
- `#6f6c65` used for information (`.capNum`, ecosystem wheel text) → move to `text/meta` or mark decorative.
- `globals.css` still defines the legacy blue tokens (`--accent:#6d7cff`) overridden by
  `body:has(.home-theme)`. Remove once all pages are migrated.
- Contact form is `mailto:`. Replace with a form endpoint.
- No Open Graph image.
