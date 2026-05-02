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

**Core palette:**
- **Primary green ("Evergreen"):** `#0A6B3C` — header, CTAs, AI moment accents, active nav, subscription category
- **Action Orange:** `#D14800` — promotions, discounts, sale, "Add to cart", bundle category
- **Trust Blue:** `#1558A6` — links, credibility signals, biometric data pills

**Extended accent palette (added in bento refresh, May 2 2026):**
- **Coral:** `#FF6B4A` — streaks, energy, "act now" moments. Tints: `#FFF1E8`, `#FFE8DC`, `#FFD9C4`. Border: `#FFC7B0`.
- **Deep Purple:** `#6B4FBC` — protocol category, achievements, longevity/cognitive themes. Tints: `#F4F0FB`, `#EDE6F8`, `#E2D9F4`. Border: `#D6C8F0`.
- **Teal:** `#0E9594` — rewards, hydration, inventory category, connected apps. Tints: `#E5F6F5`, `#D4EFEE`, `#BFE6E4`. Border: `#A7DDDC`.

**Light tints + borders:**
- Greens: `#F1FAF3` / `#E8F5EC` / `#DDF0E1` / border `#C3E6CB`
- Oranges: `#FFF7F1` / `#FFEFE2` / border `#FFD9C4`
- Off-white surface: `#FAFBFA`, neutral border `#E0E0E0` / `#F0F0F0`
- **Page bg:** `#FAFAFA`. Text: `#1A1A1A` / `#444` / `#666` / `#888`

**Typography:** Noto Sans, weights 400/500/600/700
**Border radius:** Pill (`9999px`) for badges, buttons, search bar; `12px–16px` for cards
**Spacing:** 4px base grid

## Page Map

| Route | Purpose |
|---|---|
| `/` | Today / Home — dynamic personalized landing, morphs by persona + time of day |
| `/onboarding` | 5-step wellness profile flow (Welcome → Goals → Profile → Routine → Connect) |
| `/advisor` | **Wellness Advisor** — agentic-action console (5th nav tab). Hero stats bento + chat + automation rules + filtered action queue |
| `/stack` | My Stack — supplement routine grouped by time, adherence rings, streaks |
| `/forecast` | Health Forecast — 7-day environmental → AI product recs |
| `/search?q=...` | SERP — direct port from Search 2.0 (AIContextualHeader, SmartFilterPills, AIAnswerCard) |
| `/product/[id]` | PDP — persona-aware "Why this is good for you" panel + smart pairing |
| `/cart` | Smart Cart — agentic curation with bundle detection + free shipping unlock |
| `/subscriptions` | Subscription Manager — auto-tuning agent with audit trail per item |
| `/wellness-hub/[slug]` | Long-form editorial article (anchors AI citations). Reachable from Today page CTA + PDP, **not in primary nav** |

**Primary nav order (in `Header.tsx` → `WELLNESS_NAV`):** Today · My Stack · Health Forecast · Subscriptions · Wellness Advisor. Wellness Hub was removed from the nav in favor of the Advisor as the 5th tab; the article still has multiple entry points.

## Component Conventions

### Reusable AI patterns (key to visual cohesion)

- **`AIMoment`** (`src/components/AIMoment.tsx`) — canonical "AI did something for you" container. Two variants:
  - `card` (default): white bg, 3px green gradient accent bar on top (`#0A6B3C → #79A83C → #0A6B3C`), Sparkles + uppercase tracking-widest eyebrow, headline, body, optional children, "Powered by iHerb Wellness Hub" footer
  - `inline`: tinted light-green container (`#F1FAF3`), left-edge green accent bar, no shadow — for slimmer inline contexts
- **`ContextPill`** — small pill with sparkle that labels *why* something is shown ("Based on your sleep goal", "Whoop recovery: 84%"). Two variants: `default` (green, behavioral context) and `data` (blue, biometric context).
- **`AgentActionCard`** (`src/components/AgentActionCard.tsx`) — visualizes one autonomous action by the advisor. Three states: `taken` (✓ done for you), `pending` (clock + Approve / Skip buttons), `paused`. Visual recipe: left-edge category-colored strip, status pill, category pill, timestamp, title (1 line) + body (line-clamped to 1–2), then a **delta row** with a chip + optional sparkline.
  - Categories map to colors: `subscription` → green, `bundle` → orange, `protocol` → purple, `inventory` → teal, `price` → gold.
  - Pass `compact` to drop into 3-up grids (smaller padding, line-clamp-1, no sparkline).
  - Pass `delta?: ActionDelta` to control the chip — `{ label, direction: 'up'|'down'|'date'|'savings', sparkline?: number[], color? }`. If omitted but `action.savings` is set, a "Saved $X" chip is auto-inferred.

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
- **`Sparkline`** (`src/components/Sparkline.tsx`) — tiny inline SVG trend line. Drop into stat tiles, agent action deltas, anywhere a metric is mentioned. Props: `values: number[]`, `width=60`, `height=18`, `color?` (hex), `filled?=true`, `showLastPoint?=true`. No axes, no labels — just shape with optional fill. Pair with a number, never alone.
- **`StreakHeatmap`** (`src/components/StreakHeatmap.tsx`) — 30-day GitHub-style calendar grid (6×5). Each cell tints by 0..1 dose-percentage. Props: `values?: number[]` (default mock pattern), `size?=9`, `gap?=2`, `color?` (hex base), `emptyColor?`. Used on Home streak tile (coral) and could be used on Stack page.

## Visual Recipe (the through-line)

1. AI moments use the `AIMoment` component, never raw card markup
2. Sparkle icon (`lucide-react Sparkles`, size 11–13, strokeWidth 2.5) + uppercase tracking-widest eyebrow precedes every personalized surface
3. `ContextPill` chips visible on Home, Advisor, PDP — labels *why* something is shown
4. Light-tint surfaces (`#F1FAF3`, `#FFF7F1`, `#FAFBFA`) for AI/agentic moments; pure white for neutral content
5. Subtle motion: `animate-[fadeIn_200ms_ease-out]`, `active:scale-[0.97]`, `hover:-translate-y-0.5` — no aggressive transitions
6. Pills (`rounded-full`) for everything interactive: badges, buttons, filter chips, action chips, time toggles, day-of-week selectors
7. **Bento bias for layouts**: prefer varied tile sizes (`col-span-{4,6,8}` mixed in the same row) over uniform 4-col grids. Pair a hero tile (8 cols) with a content-rich accent tile (4 cols) — e.g., greeting + streak heatmap on Home Row 1.
8. **Color zones, not all green**: lean on the extended palette (coral / purple / teal) so each tile reads as a different category at a glance. Streak/energy → coral. Longevity/protocol/achievement → purple. Rewards/hydration/inventory → teal.
9. **Every metric gets a sparkline**: when a number is shown (adherence %, savings $, streak days), include a `<Sparkline>` of its 30-day trend or a `<StreakHeatmap>` for binary daily data. Numbers without a trend look static.
10. **Cut prose, surface deltas**: AgentActionCard body is line-clamped; the actual *effect* of the action lives in a delta chip ("Saved $18.99", "Sleep score ↑ 12%", "May 18 → May 21"). Don't write paragraphs explaining what a chip can show.

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

### 2. Less text-heavy ✅ (mostly done — May 2, 2026)

`AgentActionCard` was rewritten with delta chips + line-clamped body; this cascades to Home, Cart, Subscriptions, Forecast wherever the card appears. Remaining:

- **AIMoment body** — many cards include both a `body` prop AND children. Pick one default — typically chips/CTAs are stronger than prose. Reserve `body` for the rare case where the explanation is the point.
- **Wellness Hub article inline AIMoment** — currently has a long body; could be 1 sentence + 2 chips.
- **Onboarding step descriptions** — every step has a subtitle paragraph; many can become a single sentence + an inline diagram or progress visualization.
- **Forecast page detail panels** — UV / pollen / AQI details are paragraph form; should be data-viz-first (mini bars, thresholds, trend arrows).

### 3. Make it more visual ✅ (4 of 5 nav tabs done — May 2, 2026)

Bento + accent palette + sparklines now applied across the four primary nav tabs:

- **Today/Home** (commit `9bd2fee`) — varied bento with greeting + coral streak tile + heatmap, forecast strip + green adherence + teal rewards, achievements moved to purple gradient tile.
- **My Stack** (commit `773008e`) — bento stat row: coral streak (5 cols) w/ heatmap, green adherence (4 cols) w/ sparkline, 2-up rail (teal next-delivery + purple earned). Time-of-day group headers carry category colors (morning=coral, pre-workout=teal, midday=gold, post-workout=blue, evening=purple). Each supplement row gets a per-item 30-day adherence sparkline.
- **Subscriptions** (commit `773008e`) — bento stat row: green active + teal saved w/ sparkline + purple next-delivery + coral paused. Recently optimized AIMoment uses delta chips per bullet. Subscription cards show ring + sparkline. Automation rules card switched to purple-tinted with purple toggles.
- **Wellness Advisor** (commit `773008e`) — refocused on agentic actions. Hero bento of 4 stat tiles (coral pending, green actions taken w/ sparkline, teal savings w/ sparkline, purple approval rate w/ sparkline). Action queue gets category filter chips on top of state tabs. Automation rules carry category-colored dots + toggles.

Still flagged (not yet done):

- **Health Forecast** — already has accent colors via helper functions, but the 4 env-detail cards are prose-heavy. Tighten body copy + bigger UV/pollen meters on the Forecast page itself.
- **Real workout / wearable iconography** instead of emoji for Whoop, Oura, Garmin, Apple Health, Levels CGM — pull SVG logos.
- **Subtle illustrations** in onboarding for each step (currently all text + pills).
- **Bundle savings on Smart Cart** — visualize as a progress bar instead of a price line.

### 4. Copy + content polish (lower priority)

- The advisor's mock chat responses are useful but feel "scripted" — adding 4–6 more keyword paths would make the demo feel deeper
- Several products in the persona stacks reference specific iHerb SKUs that may not exist; align with real Search 2.0 product IDs so the click-through to PDP shows a real product
- The Wellness Hub article is currently magnesium-only; a second article (e.g. omega-3 or sleep) would let the cross-linking from Daniel's content feel less repetitive
- Mobile responsiveness is untested — current breakpoints assume ≥1280px viewport
