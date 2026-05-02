# iHerb Wellness 2.0 — Claude Instructions

## Project

A clickable, multi-page Next.js prototype showcasing iHerb's future state as a personalized specialty store that knows you. Companion to the Search 2.0 prototype — same 2026 Evergreen brand refresh, same component patterns, but applied across a full wellness experience instead of just SERP/PDP.

- **Repo:** https://github.com/alexpakiherb/iherbfuture
- **Project root in this workspace:** `C:\Users\Alex.000\Desktop\Projects\Agentic Future\iherb-wellness-2.0`
- **Vercel project:** auto-deploys from GitHub `main` (same as Search 2.0)
- **Sister project:** `C:\Users\Alex.000\Desktop\Projects\Search 2.0` — many components were ported from there; cross-reference when needed.
- **Git author for pushes:** `alex.pak@iherb.com`

## Tech Stack

- Next.js 16.2.2 (Turbopack), React 19, TypeScript, Tailwind CSS v4
- Tailwind v4 uses `@import "tailwindcss"` and `@theme inline` blocks in `globals.css` — not the v3 `tailwind.config.js` `theme.extend` pattern
- `lucide-react` for icons
- Noto Sans loaded via `next/font/google` in `layout.tsx`

## 2026 Brand Refresh Tokens (same as Search 2.0)

- **Primary green ("Evergreen"):** `#0A6B3C` — header, CTAs, AI moment accents, active nav
- **Action Orange:** `#D14800` — promotions, discounts, sale, "Add to cart"
- **Trust Blue:** `#1558A6` — links, credibility signals
- **Light tints:** `#F1FAF3` (light green), `#FFF7F1` (light orange), `#FAFBFA` (off-white surface)
- **Borders:** `#C3E6CB` (light green), `#FFD9C4` (light orange), `#E0E0E0` / `#F0F0F0` (neutral)
- **Page bg:** `#FAFAFA`. Text: `#1A1A1A` / `#444` / `#666` / `#888`
- **Typography:** Noto Sans, weights 400/500/600/700
- **Border radius:** Pill (`9999px`) for badges, buttons, search bar; `12px–16px` for cards
- **Spacing:** 4px base grid

## Page Map

| Route | Purpose |
|---|---|
| `/` | Today / Home — dynamic personalized landing, morphs by persona + time of day |
| `/onboarding` | 5-step wellness profile flow (Welcome → Goals → Profile → Routine → Connect) |
| `/advisor` | Wellness Advisor — chat + agent action queue + automation rules |
| `/stack` | Daily Stack — supplement routine grouped by time, adherence rings, streaks |
| `/forecast` | Health Forecast — 7-day environmental → AI product recs |
| `/search?q=...` | SERP — direct port from Search 2.0 (AIContextualHeader, SmartFilterPills, AIAnswerCard) |
| `/product/[id]` | PDP — persona-aware "Why this is good for you" panel + smart pairing |
| `/cart` | Smart Cart — agentic curation with bundle detection + free shipping unlock |
| `/subscriptions` | Subscription Manager — auto-tuning agent with audit trail per item |
| `/wellness-hub/[slug]` | Long-form editorial article (anchors AI citations) |

## Component Conventions

### Reusable AI patterns (key to visual cohesion)

- **`AIMoment`** (`src/components/AIMoment.tsx`) — canonical "AI did something for you" container. Two variants:
  - `card` (default): white bg, 3px green gradient accent bar on top (`#0A6B3C → #79A83C → #0A6B3C`), Sparkles + uppercase tracking-widest eyebrow, headline, body, optional children, "Powered by iHerb Wellness Hub" footer
  - `inline`: tinted light-green container (`#F1FAF3`), left-edge green accent bar, no shadow — for slimmer inline contexts
- **`ContextPill`** — small pill with sparkle that labels *why* something is shown ("Based on your sleep goal", "Whoop recovery: 84%"). Two variants: `default` (green, behavioral context) and `data` (blue, biometric context).
- **`AgentActionCard`** (`src/components/AgentActionCard.tsx`) — visualizes one autonomous action by the advisor. Three states: `taken` (✓ done for you), `pending` (clock + Approve / Skip buttons), `paused`. Includes savings badge, category tag (subscription/bundle/protocol/inventory/price), timestamp.

### Persona system

- **`PersonaProvider`** (`src/components/PersonaProvider.tsx`) — React context exposing `persona`, `personaId`, `setPersonaId`, `timeOfDay`, `setTimeOfDay`, `greeting`. Persists to `localStorage`. **Always renders the Provider** even when not yet hydrated — earlier versions returned a non-Provider wrapper before hydration which broke SSR/prerender. Visibility toggle is on a wrapper div, not the Provider.
- **`PersonaSwitcher`** — floating bottom-right control with persona + time-of-day toggles. Used by reviewers to demonstrate dynamic adaptation.
- **Personas** are in `src/data/personas.ts`:
  - **Maya** — 28, Austin TX, wellness beginner with 3 supplements. Primary goals: sleep, energy, immune. Apple Health connected only.
  - **Daniel** — 42, Seattle WA, advanced biohacker with 12+ supplements. Goals: longevity, cognitive, athletic, sleep. Whoop, Oura, Garmin, Levels CGM all connected.
  - Each persona has full mock data: `stack`, `agentActions`, `achievements`, `connectedApps`, `routine`, `contextHints`, etc.
- **Every page MUST personalize copy and choices via `usePersona().persona.id`.** Maya gets beginner-friendly framing; Daniel gets data-rich biohacker framing.

### Other shared components

- **`Header`** — 3-tier (promo bar / primary bar with logo+search+`Ask Advisor` pill+account+cart / wellness nav)
- **`Footer`** — same as Search 2.0
- **`HealthForecastStrip`** — 7-day mini forecast card
- **`AdherenceRing`** — circular progress ring used on Home, Stack, Subscriptions
- **Search 2.0 ported components**: `AIContextualHeader`, `AIAnswerCard`, `SmartFilterPills`, `FilterSidebar`, `ProductCardGrid`, `ProductCardList` — used on `/search` and `/product/[id]`
- **`BundleCollage`** (`src/components/BundleCollage.tsx`) — 3-product overlapped bottle collage on a tinted gradient backdrop. Center bottle is the hero (larger, on top, no rotation); flanking bottles are smaller and rotated outward. Used on Home bundle cards and the Wellness Hub article hero. Props: `images: [string, string, string]`, `tint?: 'green' | 'orange' | 'blue'`, `size?: 'sm' | 'md' | 'lg'`. Always pass real Cloudinary product URLs.

## Visual Recipe (the through-line)

1. AI moments use the `AIMoment` component, never raw card markup
2. Sparkle icon (`lucide-react Sparkles`, size 11–13, strokeWidth 2.5) + uppercase tracking-widest eyebrow precedes every personalized surface
3. `ContextPill` chips visible on Home, Advisor, PDP — labels *why* something is shown
4. Light-tint surfaces (`#F1FAF3`, `#FFF7F1`, `#FAFBFA`) for AI/agentic moments; pure white for neutral content
5. Subtle motion: `animate-[fadeIn_200ms_ease-out]`, `active:scale-[0.97]`, `hover:-translate-y-0.5` — no aggressive transitions
6. Pills (`rounded-full`) for everything interactive: badges, buttons, filter chips, action chips, time toggles, day-of-week selectors

## Git & Deployment Workflow (mirrors Search 2.0)

- **The mounted workspace filesystem is read-only for git lock files** — `git add` and `git commit` fail with `index.lock` errors from the mounted path. Always commit from a writable temp clone.
- **Writable temp clone:** `/sessions/<session-id>/wellness-push/` — recreate if missing. Configure with `git config user.email "alex.pak@iherb.com"`.
- **Workflow for every change:**
  1. **Prefer writing directly to the clone** at `/sessions/.../wellness-push/src/...` using `cat > path << 'WELLNESSEOF'` heredoc. **Do NOT use `cp` or `rsync` from the mounted Windows path** — see the Known Issues section below.
  2. Commit and push:
     ```bash
     cd /sessions/<session-id>/wellness-push
     git add <files>
     git -c user.email="alex.pak@iherb.com" -c user.name="Alex Pak" commit -m "..."
     # Add token to remote URL just for the push, then sanitize
     git remote set-url origin "https://${TOKEN}@github.com/alexpakiherb/iherbfuture.git"
     git push origin main
     git remote set-url origin "https://github.com/alexpakiherb/iherbfuture.git"
     ```
- **GitHub PAT:** the dedicated token for this repo is named `Cowork - iHerb Wellness 2.0` in github.com/settings/tokens. To retrieve, use Claude in Chrome — but values aren't readable after creation, so create a new one if needed.

## Known Issues / Build Pitfalls

These ALL bit the first deploy. Don't repeat them.

1. **Mount sync truncation.** When files are written via the Windows-side `Write` tool, the Linux-side mount (`/sessions/.../mnt/...`) sees stale or **truncated** content for some time afterward. `wc -l`, `cat`, `rsync`, `cp` all read the truncated content silently. The Read tool sees the canonical content from Windows. **Always reconstruct files into the temp clone via bash heredoc** (`cat > /sessions/.../wellness-push/path << 'WELLNESSEOF'`) using content read from the Windows side via Read. Never `cp` or `rsync` from the mount into the clone.
2. **Curly apostrophes in JS string literals.** A `'` (U+2019) inside a single-quoted string literal terminates the string. The wellness-hub article's mid-paragraph "you're" used a smart quote and broke the parser with `Expected '</', got 'ident'`. Use straight `'` (U+0027), or wrap in double-quoted strings, or escape via `&apos;` if it's JSX text.
3. **Optional fields must be declared on types.** PDP referenced `product.servingsPerContainer` with a `?? 90` runtime fallback, but TS type-check failed because the field wasn't on `Product`. Always add `optionalField?: type` to the interface even if the runtime path uses fallbacks.
4. **PersonaProvider must always render the Provider.** Earlier version did `if (!hydrated) return <div>{children}</div>` (no context) — this broke `/_not-found` and any other prerendered route that consumed `usePersona`. Now the Provider is always mounted; only visibility of children depends on hydration.
5. **`useSearchParams` requires Suspense in app router.** The SERP page wraps `<SERPPageInner>` in `<Suspense>` to satisfy Next 16 + Turbopack.

## Refinements Needed (next pass)

The build deploys, but there's a meaningful gap between *the prototype works* and *the prototype sells the vision*. Priority order:

### 1. Real product imagery everywhere ✅ (done — May 1, 2026)

Done in commit `f5b7fee`. Every product surface now uses real iHerb Cloudinary images:

- **`src/data/personas.ts`** — All `StackItem.imageUrl` and `AgentAction.productImage` fields now point to real `cloudinary.images-iherb.com/.../images/<brand>/<sku>/u/<n>.jpg` URLs (Maya: CGN D3 5000, NOW Mag Glycinate, CGN Vit C; Daniel: Thorne creatine/omega/bisglycinate/collagen/ashwagandha + LE NMN/Quercetin + Nuun substituted for LMNT).
- **PDP** — main image, 4-thumb row, and smart pairing all wired to real Cloudinary URLs (uses `product.image` from products.ts, with the MOCK_PRODUCT fallback also pointing to a real URL).
- **Cart** — `CartItem.emoji` field renamed to `imageUrl`; all line items render real images. Free-shipping upsell also has a thumbnail.
- **Subscriptions** — removed the `productEmoji(category)` helper; subscription cards use `item.imageUrl` directly.
- **Stack timeline rows, Today "Now in your routine" mini-cards** — both use `item.imageUrl`.
- **Forecast `productSuggestion`** — `ForecastInsight.productSuggestion` gained an `imageUrl?` field. Maya's quercetin and Daniel's electrolyte suggestions now show real bottles.
- **Home bundle cards** — switched from emoji + price layout to `<BundleCollage>` 3-bottle collage on tinted gradient. 9 distinct curated bundles (3 per persona) each have their own image trio.
- **Wellness Hub article hero** — gradient backdrop now displays a 3-bottle product collage (NOW glycinate + Thorne bisglycinate + LE threonate) instead of a single 🧪 emoji.

**Scraping pattern (for future image needs):** iherb.com blocks server-side fetches with 403, but Claude in Chrome works. Navigate to `https://www.iherb.com/search?kw=<query>`, wait 2 seconds, then run this JS to extract canonical image URLs:
```js
Array.from(document.querySelectorAll('img'))
  .filter(i => (i.currentSrc || i.src).includes('cloudinary.images-iherb') && !i.src.includes('cms/'))
  .map(i => { let el = i.parentElement, h = '', t = '';
    for (let d = 0; d < 8 && el; d++) { const lk = el.querySelector('a[href*="/pr/"]'); if (lk) { h = lk.href; t = lk.title; break; } el = el.parentElement; }
    return { src: i.currentSrc || i.src, href: h, title: t };
  })
```
Brand prefixes seen: `cgn` (California Gold), `now` (NOW Foods), `thr` (Thorne), `lex` (Life Extension), `nuu` (Nuun), `slg`/`sol` (Solgar), `drb` (Doctor's Best), `jar`/`jrw` (Jarrow), `gol` (Garden of Life), `nbr` (NutraBio), `ncs`/`nwy` (Nature's Way), `sre` (Sports Research). LMNT is not on iHerb — substitute with Nuun (`nuu/nuu02050/u/30.jpg`).

### 2. Less text-heavy

The current AI moments and agent action cards are paragraph-heavy. Compress and visualize:

- **AgentActionCard `detail`** — many of the Maya/Daniel mock actions have 2–3 sentence explanations. Trim to 1 short sentence + a small visual delta (e.g., "Sleep score ↑ 12%" with a sparkline thumb, "Saved $18.99" with a tiny coin icon, "Delivery moved May 18 → May 21" with a date pill).
- **AIMoment body** — many cards include both a `body` prop AND children. Pick one default — typically chips/CTAs are stronger than prose. Reserve `body` for the rare case where the explanation is the point.
- **Wellness Hub article inline AIMoment** — currently has a long body; could be 1 sentence + 2 chips.
- **Onboarding step descriptions** — every step has a subtitle paragraph; many can become a single sentence + an inline diagram or progress visualization.
- **Forecast page detail panels** — UV / pollen / AQI details are paragraph form; should be data-viz-first (mini bars, thresholds, trend arrows).

### 3. Make it more visual

The May 1 imagery sweep crossed off bundle collages and the Wellness Hub hero. Remaining:

- **Sparklines / trend lines** wherever a metric is mentioned (sleep score, HRV, adherence over time, savings YTD)
- **Bigger Health Forecast strip** — current 7-day strip is small; on the Forecast page itself, make it the visual hero with prominent UV/pollen meters
- **Real workout / wearable iconography** instead of emoji for Whoop, Oura, Garmin, Apple Health, Levels CGM — pull SVG logos
- **Subtle illustrations** in onboarding for each step (currently all text + pills)
- **Daily Stack timeline** could use a vertical timeline visualization instead of stacked grouped boxes
- **Streak card** could include a 30-day calendar heatmap, not just a number
- **Adherence rings** could be more prominent on Home; currently small in the side rail
- **Bundle savings on Smart Cart** — visualize as a progress bar ("save 15% with bundle") instead of just a price line

### 4. Copy + content polish (lower priority)

- The advisor's mock chat responses are useful but feel "scripted" — adding 4–6 more keyword paths would make the demo feel deeper
- Several products in the persona stacks reference specific iHerb SKUs that may not exist; align with real Search 2.0 product IDs so the click-through to PDP shows a real product
- The Wellness Hub article is currently magnesium-only; a second article (e.g. omega-3 or sleep) would let the cross-linking from Daniel's content feel less repetitive
- Mobile responsiveness is untested — current breakpoints assume ≥1280px viewport
