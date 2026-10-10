<div align="center">

<img src="public/avqentra-logo.png" alt="Avqentra" width="320" />

### Ideas into tools.

**The official website of Avqentra: three products, one mission. We build software that helps people think, build, and explore without limits.**

![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![three.js](https://img.shields.io/badge/three.js-procedural_3D-000000?logo=threedotjs&logoColor=white)
![Status](https://img.shields.io/badge/products-launching_soon-e6dcc8)

[Products](#the-products) · [Screenshots](#screenshots) · [Architecture](#architecture) · [3D engine](#the-3d-engine) · [Getting started](#getting-started) · [Deployment](#deployment) · [Roadmap](#roadmap)

</div>

---

## Overview

This repository contains the Avqentra marketing and product site. It introduces the company, its founders, and its three upcoming products, each with its own live 3D hero scene and a dedicated product page.

The site is built around one design idea: **restrained, instrument-like, cream on black**. Fine lines, brushed metal, precise geometry, and motion that explains what the product does instead of decorating the page.

| | |
|---|---|
| **Framework** | Next.js 15 (App Router) · React 19 · TypeScript (strict) |
| **3D** | three.js with fully procedural scenes. No model files, no texture downloads |
| **Styling** | Hand-written CSS with design tokens. No UI framework, no runtime CSS-in-JS |
| **Fonts** | Archivo (extended width axis) and JetBrains Mono via `next/font`, self-hosted at build time |
| **Backend** | None. The site is fully static-renderable |

## The products

| # | Product | What it is | Status |
|---|---|---|---|
| 02 | **AgentBattle** | A head-to-head arena for AI agents. Same tasks, same conditions, scored and repeatable results, so you compare agents on data instead of demos. | Coming soon |
| 03 | **Devsick** | An incident-intelligence layer that sits on top of your monitoring stack, detects failures, explains the root cause with LLM reasoning, and keeps a human in the loop for the fix. | Coming soon |
| 04 | **QuestionForge** | Drafts technical interview questions with an LLM, then verifies them by running code or independent review before a human ever sees them. | Coming soon |

Each product has a landing section on `/products` and a full page at `/products/<slug>` with an overview, how-it-works steps, capabilities, an interface mockup, the tech stack, and a next-product link.

## Screenshots

<table>
  <tr>
    <td width="33%"><img src="docs/screenshots/agentbattle.png" alt="AgentBattle hero: a chess-piece duel on an engraved arena disc" /></td>
    <td width="33%"><img src="docs/screenshots/devsick.png" alt="Devsick hero: a city of service towers watched by a sentinel eye" /></td>
    <td width="33%"><img src="docs/screenshots/questionforge.png" alt="QuestionForge hero: cards pass a validation ring and land on a trusted stack" /></td>
  </tr>
  <tr>
    <td align="center"><b>AgentBattle</b><br/>Two identical pieces, two materials, one score.</td>
    <td align="center"><b>Devsick</b><br/>A sentinel eye locks onto the failing service.</td>
    <td align="center"><b>QuestionForge</b><br/>Generate. Validate. Trust.</td>
  </tr>
</table>

## The 3D engine

Every hero scene is built procedurally in code: geometry, materials, textures (drawn on canvas), labels, and animation. There are **no `.glb` files and no image textures to download**, which keeps the payload small and every scene fully themeable.

**Scenes**

- **AgentBattle** is an arena: a brushed-metal turntable with an engraved degree scale, two lathed chess-piece silhouettes (cream chrome versus smoked black), score collars, a radar sweep, and a scoring core that leans toward the round's winner.
- **Devsick** is a city of lit-window towers on a street grid with data packets in flight, watched by a gimbal-ring sentinel eye. On a 12-second loop one tower fails, the eye locks on, and a root-cause panel appears before the system resolves.
- **QuestionForge** is a vertical pipeline: a draft cloud, a validation chamber with a scan ring, and a stack of verified documents. Cards are checked as they pass through.
- **Home mark** is a particle cloud that condenses into the Avqentra mark and disperses again.

**Rendering and realism**

- ACES filmic tone mapping, HDR environment reflections (`RoomEnvironment` through PMREM), and MSAA through a half-float render target
- Soft PCF shadow maps from a single key light, so every object is grounded on its surface
- Procedural brushed-metal roughness maps, clearcoat, and rounded high-segment geometry for smooth edges
- Selective bloom for the glowing instrument elements

**Performance and accessibility**

- **Adaptive resolution:** a frame-time monitor trims or restores the pixel ratio automatically (between 1× and 1.75×) to hold a steady frame rate
- **Pauses off-screen:** an `IntersectionObserver` stops rendering when a scene is not visible, and rendering also stops when the tab is hidden
- **Smoothed timestep:** animation is frame-rate independent and blended against a running average so a single late frame never causes a jolt
- **`prefers-reduced-motion`** is respected: motion is stopped while the static composition stays
- **Graceful fallback:** if WebGL is unavailable, the scene silently does not mount and the page remains fully usable
- **Client-only:** three.js is loaded with `next/dynamic` (`ssr: false`) after the page is interactive, and every geometry, material and texture is disposed on unmount

## Architecture

```
app/
  layout.tsx            Root layout, metadata template, nav and footer
  page.tsx              Home
  about/ founders/ contact/
  products/
    page.tsx            Product index (hero + three product sections)
    products.css        Design tokens and all product-page styling
    agentbattle/ devsick/ questionforge/
components/
  Scene.tsx             Lazy client-only wrapper for the 3D canvas
  Scene3D.tsx           Renderer, lights, shadows, bloom, camera, lifecycle
  three-enterprise.ts   The three product scene builders
  three-models.ts       Shared kit: materials, textures, sparks, floor, HUD panels
  ProductsLanding.tsx   /products page
  ProductDetail.tsx     Shared product page template
  landing/              Interface mockups, tilt cards, section rail
  home/                 Home hero and logo
lib/
  products.ts           Single source of truth for all product content
  founders.ts           Founder data
  fonts.ts              next/font configuration
public/                 Logo and mark
docs/screenshots/       README imagery
```

**Content is data-driven.** Add or edit a product in `lib/products.ts` and the index, the product page, the navigation and the stats strip all update. Scene builders are selected by a `SceneVariant` and receive a shared `Ctx` (kit, root group, lights, tick list), so adding a new scene means writing one builder function.

## Design system

| Token | Value | Use |
|---|---|---|
| Background | `#0e0e0b` | Page |
| Surface | `#16150f` | Cards, panels |
| Text | `#ece8df` | Primary copy |
| Muted | `#8a877f` | Secondary copy, labels |
| Cream (accent) | `#e6dcc8` | The single accent, in UI and 3D |
| Alert | `#ff5a45` | Used only for the Devsick incident state |

Typography pairs **Archivo** at extended width for display with **JetBrains Mono** for labels and body, which gives the site its technical, instrument-panel character. The 3D scenes use the same cream so the canvas and the page read as one surface.

## Getting started

**Requirements:** Node.js 18.18 or newer (Node 22 recommended) and npm.

```bash
git clone <repository-url>
cd avqentra
npm ci
npm run dev
```

Open <http://localhost:3000>.

| Script | Purpose |
|---|---|
| `npm run dev` | Start the development server with hot reload |
| `npm run build` | Create an optimized production build |
| `npm start` | Serve the production build |
| `npx tsc --noEmit` | Type-check the project (strict mode) |

> **Tip:** do not run `npm run build` while `npm run dev` is running. Both write to `.next`, and the dev server can end up in a broken state. Stop the dev server first, or delete `.next` and restart.

## Quality and security

- **Strict TypeScript** across the codebase
- **Continuous integration** (`.github/workflows/ci.yml`) runs on every push and pull request to `main`:
  - **Secret scan** with Gitleaks across full git history
  - **Production build** with `npm ci` and `npm run build`
- No runtime secrets, no API keys, and no third-party scripts or trackers
- No client-side data collection

## Deployment

The site is a standard Next.js app with no server-side dependencies, so it deploys anywhere Next.js is supported.

**Vercel (recommended)**

1. Import the repository in Vercel
2. Framework preset: **Next.js**. Build command `npm run build`. Output is detected automatically
3. Assign the production domain and enable automatic deploys from `main`

**Self-hosted**

```bash
npm ci && npm run build && npm start   # serves on port 3000
```

Put it behind a reverse proxy (nginx, Caddy) or build a container around `npm start`.

## Launch checklist

Before pointing the production domain at this build:

- [ ] Replace the `mailto:` contact form with a real handler (a server action, an API route, or a form service) plus spam protection, so submissions are reliable and no email address ships in the markup
- [ ] Add Open Graph and Twitter card images, a `favicon`, `robots.txt` and `sitemap.xml`
- [ ] Add privacy-friendly analytics and a cookie or privacy notice if required
- [ ] Add security headers (CSP, `X-Content-Type-Options`, `Referrer-Policy`, HSTS) in `next.config.mjs`
- [ ] Run Lighthouse on a production build and the three product pages, and record the baseline here
- [ ] Verify the founder subdomains (`yash.`, `prabhav.`, `ishaan.avqentra.in`) resolve
- [ ] Confirm each product repository's visibility before linking it publicly
- [ ] Pin the Node version (`.nvmrc` or `engines`) so CI and local match; CI currently builds on Node 18

## Roadmap

- [ ] Launch AgentBattle, Devsick and QuestionForge and move their status from *Coming soon* to *Live*
- [ ] Waitlist capture and launch notifications
- [ ] Per-product OG images generated from the 3D scenes
- [ ] Lighter 3D tier for low-power devices
- [ ] Blog and changelog
- [ ] Automated visual regression tests for the hero scenes

## Team

| | Role | |
|---|---|---|
| **Yash Srivastava** | Chief Executive Officer | yash.avqentra.in |
| **Prabhav Singh** | Chief Technology Officer | prabhav.avqentra.in |
| **Ishaan Bajpai** | Chief Financial Officer | ishaan.avqentra.in |

## Contributing

This is a company website, so changes are made by the Avqentra team.

1. Branch from `main` (`feat/<topic>` or `fix/<topic>`)
2. Keep changes focused, and run `npx tsc --noEmit` and `npm run build` before opening a pull request
3. Match the surrounding code's naming, comment density and idiom
4. Open a pull request into `main`. CI must pass (secret scan and build) before merge

Never commit secrets. The Gitleaks scan will fail the build if it finds any.

## License

Copyright © Avqentra. All rights reserved. This source is proprietary and is not licensed for reuse or redistribution without written permission.

---

<div align="center">
<sub>Built by Avqentra · Ideas into tools.</sub>
</div>
