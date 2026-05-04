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
  - **Judy** — 28, Austin TX, wellness beginner with 3 supplements. Primary goals: sleep, energy, immune. Apple Health connected only. **NOTE:** display name is "Judy" but `persona.id` is still `'maya'` (and constants like `SUGGESTED_QUESTIONS_MAYA`, `ADHERENCE_TREND_MAYA`, conditionals like `persona.id === 'maya'`) intentionally kept the old key to avoid a cascading refactor. Pages render the display name via `persona.firstName`. If you need to add a new persona key, choose a fresh ID — don't reuse `'maya'`.
  - **Daniel** — 42, Seattle WA, advanced biohacker with 12+ supplements. Goals: longevity, cognitive, athletic, sleep. Whoop, Oura, Garmin, Levels CGM all connected.
  - Each persona has full mock data: `stack`, `agentActions`, `achievements`, `connectedApps`, `routine`, `contextHints`, etc.
- **Every page MUST personalize copy and choices via `usePersona().persona.id`.** Judy (id `'maya'`) gets beginner-friendly framing; Daniel gets data-rich biohacker framing.

### Other shared components

- **`Header`** — 3-tier (promo bar / primary bar with logo+search+`Ask Advisor` pill+account+cart / wellness nav)
- **`Footer`** — same as Search 2.0
- **`HealthForecastStrip`** — 7-day mini forecast card
- **`AdherenceRing`** — circular progress ring used on Home, Stack, Subscriptions
- **Search 2.0 ported components**: `AIContextualHeader`, `AIAnswerCard`, `SmartFilterPills`, `FilterSidebar`, `ProductCardGrid`, `ProductCardList` — used on `/search` and `/product/[id]`
- **`BundleCollage`** (`src/components/BundleCollage.tsx`) — 3-product overlapped bottle collage on a tinted gradient backdrop. Center bottle is the hero (larger, on top, no rotation); flanking bottles are smaller and rotated outward. Used on Home bundle cards and the Wellness Hub article hero. Props: `images: [string, string, string]`, `tint?: 'green' | 'orange' | 'blue'`, `size?: 'sm' | 'md' | 'lg'`. Always pass real Cloudinary product URLs.
- **`Sparkline`** (`src/components/Sparkline.tsx`) — tiny inline SVG trend line. Drop into stat tiles, agent action deltas, anywhere a metric is mentioned. Props: `values: number[]`, `width=60`, `height=18`, `color?` (hex), `filled?=true`, `showLastPoint?=true`. No axes, no labels — just shape with optional fill. Pair with a number, never alone.
- **`StreakHeatmap`** (`src/components/StreakHeatmap.tsx`) — 30-day GitHub-style calendar grid (6×5). Each cell tints by 0..1 dose-percentage. Props: `values?: number[]` (default mock pattern), `size?=9`, `gap?=2`, `color?` (hex base), `emptyColor?`. Used on Home streak tile (coral) and could be used on Stack page.

### Editorial / luxury specialty-store components (added May 2 2026)

- **`LifestyleHero`** (`src/components/LifestyleHero.tsx`) — full-width image hero with overlay text. Used on Forecast (location-aware) and Subscriptions (luxury wellness). Props: `imageUrl`, `alt`, `eyebrow?`, `headline`, `subline?`, `children?`, `size?: 'sm'|'md'|'lg'|'xl'`, `overlay?: 'soft'|'medium'|'strong'`, `align?: 'left'|'center'|'right'`, `tint?: 'neutral'|'green'|'coral'|'teal'|'purple'`. Uses bottom-up gradient — top of image stays clear, only the bottom band gets the dark wash for legible text. Don't crank `overlay` higher than `medium` unless the image is busy.
- **`EditorialQuote`** (`src/components/EditorialQuote.tsx`) — magazine pulled quote. Serif Georgia italic body, oversized decorative `&ldquo;` mark, portrait + credential below. Use as a section break in long-form layouts. Variants: `default` (white bg) or `tinted` with `green`/`coral`/`teal`/`purple` for color zones. Pairs well with `Dr. Sarah Chen` (`EXPERT_DR_CHEN.url`) as the speaker on most surfaces.
- **`ExpertCallout`** (`src/components/ExpertCallout.tsx`) — credential strip with portrait, name, letters, title, endorsement copy, optional `expertiseChips`. Variants: `card` (full bordered tile with 'Reviewed by clinical advisor' eyebrow + 'Verified' badge) or `inline` (small horizontal pill for sidebars). Use anywhere the user is being asked to defer to AI judgement — Subscriptions sidebar, Advisor below hero stats.
- **`TrustBadgeStrip`** (`src/components/TrustBadgeStrip.tsx`) — row of certification icon pills. Available badges: `nsf`, `informed-sport`, `third-party`, `non-gmo`, `gmp`, `usp`. Props: `badges?: TrustBadgeKey[]`, `density?: 'tight'|'loose'`, `background?: 'white'|'tinted'`. Use on Subscriptions, Advisor, future PDP — anywhere quality/safety questions surface.

### Lifestyle imagery library

- `src/data/lifestyleImages.ts` — typed map of curated Unsplash + Pexels CDN URLs covering: persona-aware morning hero (Judy/Daniel), location-aware Forecast hero (Austin/Seattle), seasonal lifestyle vignettes (allergy/hydration), Subscriptions hero (row of branded vitamin bottles — ecommerce specialty-store shelf vibe), Stack hero (display wall of supplement bottles), expert portraits (Dr. Chen / Dr. Patel), supplement still-lifes. **Imagery rule of thumb:** for ecommerce/store-context heroes, prefer recognizable retail bottles or shelves over moody single-bottle macros — the latter look artsy but read as editorial, not as "shop here."
- All royalty-free; pulled via plain `<img>` tags (no Next.js Image optimization), so no `remotePatterns` allowlist needed in `next.config.ts`. URLs include `?w=NNNN&q=80` params so we ship reasonable file sizes (1800 for heroes, 1200 for inline, 400 for thumbs).
- **Always use this library** rather than hardcoding lifestyle URLs in pages. If you add a new image, append to the file with comment, alt text, and credit.
- **Verify URL works before shipping**: not every Unsplash photo ID is actually live, and IDs that worked yesterday can start 404'ing — Unsplash retires/relicenses photos. If a hero renders as a peach/gray gradient, the image 404'd — swap to a known-good URL. Verified IDs as of May 2 2026: `1704694671866-f83e0b91df09` (row of branded vitamin bottles — current Subscriptions hero), `1528272252360-5efd274e36fb` (supplement bottle wall — current Stack hero), `1556228720-195a672e8a03` (amber bottles), `1584308666744-24d5c474f2ae` (supplement ritual), `1441974231531-c6227db76b6e` (PNW forest), `1682458855022-b71fa850a085` (Texas hill country bluebonnets — current Forecast Austin hero, replaced previously-404'ing `1531219432768-9f540ec081f3` on May 2). When picking new URLs from Unsplash, beware: results from `plus.unsplash.com/premium_photo-...` are NOT free and resolve 404 on `images.unsplash.com`. Only photos whose og:image points to `images.unsplash.com/photo-...` are usable.

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
11. **Lifestyle imagery on hero moments**: long-form pages (Forecast, Subscriptions) and persona context bands (Today greeting, Stack ritual hero) need real wellness photography from `lifestyleImages.ts`, not gradient placeholders. The image is the headline; the headline is the caption.
12. **Editorial pacing in long pages**: insert an `EditorialQuote` from Dr. Chen as a section break between dense data sections. Magazine-style pacing — read, breathe, read.
13. **Trust signals near agentic moments**: anywhere the AI is asked to make a judgement call on the user's behalf, surface an `ExpertCallout` (Dr. Chen reviewed this) and/or `TrustBadgeStrip` (NSF, Informed Sport, third-party tested). Specialty-store credibility comes from the doctor and the certifications, not the chatbot.

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
6. **Lifestyle image URL validation.** Unsplash photo IDs sometimes 404 — when a `LifestyleHero` renders as just a gray gradient with no visible photo, the image URL didn't resolve. Quick test: open the URL in a browser. Verified-good IDs are listed in CLAUDE.md under "Lifestyle imagery library".

## Refinements Needed (next pass)

The build deploys, but there's a meaningful gap between *the prototype works* and *the prototype sells the vision*. Priority order:

### 1. Real product imagery everywhere ✅ (done — May 1, 2026)

Done in commit `f5b7fee`. Every product surface now uses real iHerb Cloudinary images:

- **`src/data/personas.ts`** — All `StackItem.imageUrl` and `AgentAction.productImage` fields now point to real `cloudinary.images-iherb.com/.../images/<brand>/<sku>/u/<n>.jpg` URLs (Judy: CGN D3 5000, NOW Mag Glycinate, CGN Vit C; Daniel: Thorne creatine/omega/bisglycinate/collagen/ashwagandha + LE NMN/Quercetin + Nuun substituted for LMNT).
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

### 3. Make it more visual ✅ (full editorial polish — May 2, 2026)

Two layers shipped:

**Layer 1 — Bento + accent palette + sparklines** (commits `9bd2fee`, `773008e`):

- **Today/Home** — varied bento with greeting + coral streak tile + heatmap, forecast strip + green adherence + teal rewards, achievements in purple gradient tile.
- **My Stack** — coral streak (5 cols) w/ heatmap, green adherence (4 cols) w/ sparkline, 2-up rail (teal next-delivery + purple earned). Time-of-day groups have category colors. Per-supplement 30-day sparkline.
- **Subscriptions** — green active + teal saved w/ sparkline + purple next-delivery + coral paused. Recently-optimized uses delta chips per bullet.
- **Wellness Advisor** — agentic-action console. Hero bento of 4 stat tiles all with sparklines. Action queue gets category filter chips.

**Layer 2 — Editorial / luxury specialty store** (commit `cd95457` and tweaks):

- **Health Forecast** — full editorial rebuild: location-aware lifestyle hero (Austin sunrise / Seattle PNW forest), magazine-style "Today's conditions" w/ half-circle SVG gauges replacing prose, `EditorialQuote` from Dr. Chen, lifestyle vignette (allergy blossoms) intermixed with first AIMoment, hydration lifestyle break (when heat ≥85°F), magazine "morning briefing" email signup.
- **Subscriptions** — luxury hero (amber bottle photography), `EditorialQuote` section break, `TrustBadgeStrip` after subscription cards, `ExpertCallout` (Dr. Chen) in right rail, larger product photos on cards.
- **Today** — persona-aware morning lifestyle band (140px) at top of greeting card with location chip overlay.
- **Stack** — wellness ritual lifestyle hero (180px) at top with editorial headline.
- **Advisor** — `ExpertCallout` + `TrustBadgeStrip` strip below hero stats — establishes clinical/quality trust before user starts chatting.

Still flagged (not yet done):

- **Real workout / wearable iconography** instead of emoji for Whoop, Oura, Garmin, Apple Health, Levels CGM — pull SVG logos.
- **Subtle illustrations** in onboarding for each step (currently all text + pills).
- **Bundle savings on Smart Cart** — visualize as a progress bar instead of a price line.
- **PDP** — could use the editorial recipe (lifestyle hero, expert callout, trust badges, editorial quote).

### 4. Copy + content polish (lower priority)

- The advisor's mock chat responses are useful but feel "scripted" — adding 4–6 more keyword paths would make the demo feel deeper
- Several products in the persona stacks reference specific iHerb SKUs that may not exist; align with real Search 2.0 product IDs so the click-through to PDP shows a real product
- The Wellness Hub article is currently magnesium-only; a second article (e.g. omega-3 or sleep) would let the cross-linking from Daniel's content feel less repetitive
- Mobile responsiveness is untested — current breakpoints assume ≥1280px viewport

## Session log — May 2 2026 (UI/UX polish pass)

A round of small but visible fixes after a review pass through the deployed prototype. All shipped to production.

**Persona rename — Maya → Judy.** The wellness beginner's display name is now "Judy" everywhere copy is rendered (`firstName: 'Judy'`, initials `JR`, `Good morning, Judy`, etc.). The persona key `persona.id` is still `'maya'` and constants like `SUGGESTED_QUESTIONS_MAYA`, `ADHERENCE_TREND_MAYA`, conditionals like `persona.id === 'maya'` and the `isMaya` boolean are intentionally **not** renamed — that would have been a cascading multi-file refactor with no functional benefit. The display name flows through `persona.firstName` so pages picked it up automatically. New persona keys should pick a fresh ID rather than reuse `'maya'`.

**Promo bar contrast.** "Free shipping…" and "24/7 Support" links in the green promo bar were rendering blue (browser default link color) and unreadable. Fixed with belt-and-suspenders: both inline `style={{ color: '#FFFFFF' }}` and Tailwind `!text-white visited:!text-white hover:!text-white` classes so all link states (visited / hover / focus) stay white.

**Ecommerce-fit hero imagery.** Subscriptions and Stack heroes were artsy single-bottle macros that read as editorial, not as "shop here." Swapped to:
- **Subscriptions:** `1704694671866-f83e0b91df09` — row of recognizable branded vitamin bottles (NOW Foods, Life Extension, etc.) on a wellness specialty-store shelf.
- **Stack:** `1528272252360-5efd274e36fb` — wall of supplement bottles in a display case.

**Forecast Austin hero — 404 fix.** The previously-shipped Unsplash ID `1531219432768-9f540ec081f3` started returning 404, leaving the Forecast hero as a peach gradient with alt text. Replaced with `1682458855022-b71fa850a085` — bluebonnets + oak tree + wooden fence in warm Hill Country light. Verified loading on the CDN before shipping. **New rule logged in the imagery section:** Unsplash IDs can quietly retire even after working previously, and `plus.unsplash.com/premium_photo-...` results are paid-tier and resolve 404 on the public CDN — only photos whose og:image points to `images.unsplash.com/photo-...` are usable for free.

**Energy Boost bundle — center bottle 404.** Judy's "Steady energy · Without the crash" starter bundle in `src/app/page.tsx` had a broken center hero in the `BundleCollage` (rendered as a blank silhouette). Root cause was a wrong brand prefix — the iHerb Cloudinary path used `jar/jar05079` but the correct prefix for Jarrow Formulas is `jrw`. Swapped to `jrw/jrw01006/u/114.jpg` (Jarrow Vegan B-Right). Bundle now reads as a textbook ALA + B-complex + magnesium-malate energy stack.

## Session log — May 3 2026 (Editorial v2 — production polish pass)

User feedback going into this session: "Take inspiration from Apple, Patagonia, ASOS, Nike. The Forecast page imagery and colors are the bar; the rest of the site has too many big text boxes that look busy and especially strange when wide and skinny across the desktop. I want production polish, not prototype." Scope: codify a recipe first, sweep all pages.

**Recipe** (now baked into `globals.css` + new components):

1. Typography — bigger displays with negative tracking. New utility classes: `.font-serif-display` (Fraunces, variable opsz axis), `.eyebrow` (11.5px, .18em tracking), `.display-1` (clamp 40-64px), `.headline-1`, `.headline-2`, `.lede` (17px, max-w 640), `.body-lg`, `.section-v2` (72/88px vertical rhythm), `.hairline` (1px gradient divider). Hero headlines now run clamp(40px, 6.4vw, 76px) on `size="xl"` LifestyleHero — Apple/Patagonia territory.

2. Color discipline — the gradient pastel everywhere look is gone. Default surface is white on `bg-[#FAFAFA]`. Tinted gradients (coral/teal/purple/green pastels) survive only as semantic accents (one streak tile, one achievement section, etc.), never as the default tile background. Borders dropped from 1px solid to `ring-1 ring-[#EFEFEF]` (a hair lighter, no harsh corners).

3. Layout — bento bias retired. Pages now flow vertically as distinct editorial sections with consistent rhythm (~80-100px between sections). Wide-skinny tiles converted to `EditorialSplit` (50/50 photo + content) when they have an image story, or `MetricRow` (clean horizontal stat strip with hairline dividers) when they're numbers, or just dropped. Side rails on Stack/Subscriptions removed in favor of full-width sections.

**New shared primitives** (`src/components/`):

- **`SectionHeader.tsx`** — eyebrow + display headline + lede (max-width 640px so it never goes wide-skinny) + optional right-aligned CTA. Pass `serif` for editorial moments. Use one per section.
- **`EditorialSplit.tsx`** — photo on one side, content on the other. Accepts `ratio` (`'balanced'`, `'image-heavy'`, `'content-heavy'`), `reverse`, `minHeight`. `headline` is optional — pass `children` for arbitrary content (e.g. a flat AIMoment).
- **`MetricRow.tsx`** — 2-5 stats in a row. Each stat: small-caps label, large value with negative tracking, optional unit, caption, sparkline trend, accent color. Set `hero: true` on one stat for serif Fraunces display + 56px size.
- **AIMoment** got a new `variant: 'flat'` — no border, no shadow, no accent bar. Use inside other layout primitives (EditorialSplit) so AIMoment doesn't dominate.

**Pages rebuilt:**

- **Today (`/`)** — Full-bleed `LifestyleHero` (size lg, serif) with greeting overlay → `MetricRow` (streak / adherence / saved / next delivery) → 3-up "Today's ritual" product cards → `EditorialSplit` showing the day's Health Forecast hero insight (photo left, flat AIMoment + product CTA right) → pending advisor actions (when present) → 3-up curated bundle merch row → 3-up "Recently handled by advisor" → Wellness Hub `EditorialSplit`. Connected apps + achievements moved to /stack.
- **My Stack (`/stack`)** — Hero (md, serif) → MetricRow → today's progress strip → "The day" section with each time-of-day group as its own editorial sub-section (no gradient pastel headers; just an icon + colored eyebrow + supplement count) → flat AIMoment insight → achievements grid (purple accent ring on hover, no pastel gradient backgrounds).
- **Subscriptions (`/subscriptions`)** — Hero → MetricRow → "Recently optimized" digest (cleaner bullet rows, separate `ring-1` cards) → editorial quote section break → subscription list (single list with hairline rows, no pastel gradients) → trust strip → expert + savings `EditorialSplit` → action queue → automation rules.
- **Wellness Advisor (`/advisor`)** — Editorial page header (serif display) → MetricRow → expert + trust split → 7/5 console split (chat + automation rules left, action queue right) with all the gradient pastel chrome stripped from automation rules.
- **Cart (`/cart`)** — Serif display header ("N items, ready when you are.") → cleaner cart-item rows (no header strip, lighter padding, larger product thumbs) → flat AIMoment for bundle savings → simpler agent action section (eyebrow + bold heading) → cleaner trust row using divide-x.
- **Health Forecast (`/forecast`)** — Hero size bumped to `lg` (was `xl`) and given `serif` + `rounded="lg"` for consistency with the new system; rest of the page is unchanged because it was already the bar.

**Pages intentionally untouched** (not driving the user's "prototype-y" complaint):

- SERP, PDP, Wellness Hub article, Onboarding. The audit flagged Onboarding as best-in-class hierarchy already; SERP and PDP are standard ecommerce shapes that don't suffer from the wide-skinny problem. They can get a follow-up touch later if needed.

**Build infra fix:**

- New `src/types/lucide-react.d.ts` — module shim with `LucideIcon` type and a curated list of every icon used in the codebase. The lucide-react package's published types stop resolving cleanly when node_modules is rebuilt cross-platform (Windows install → Linux build), so this keeps the `next build` TS pass green. If you import a new icon from lucide-react, add its name to this shim.
- `next/font/google` Fraunces config: must NOT pass `weight` when using `axes: ['opsz']` (variable font axis). The right invocation is `Fraunces({ variable: '--font-fraunces', subsets: ['latin'] })` — opsz comes for free, no weight array allowed.

**New rule logged:** when running `npm install` in the temp wellness-push clone after copying node_modules from the Windows mount, two platform-specific binaries don't get pulled in automatically — `lightningcss-linux-x64-gnu` (lives at `node_modules/@tailwindcss/node/node_modules/lightningcss/`) and `@tailwindcss/oxide-linux-x64-gnu` (lives at `node_modules/@tailwindcss/oxide/node_modules/`). Symptom: `next build` errors with "Cannot find module '../lightningcss.linux-x64-gnu.node'" or "Cannot find module './tailwindcss-oxide.linux-x64-gnu.node'". Fix: re-fetch each parent package after the npm install (e.g. `cd node_modules/@tailwindcss/node/node_modules && rm -rf lightningcss && npm install lightningcss@VERSION --no-save`), or download the platform tarball from the registry and place it manually under each package's `node_modules/@tailwindcss/{name}-linux-x64-gnu/`.

### What's next (UI/UX refinement — pick up here next session)

The editorial v2 system is in place. Open candidates:

- **PDP & SERP** with the editorial recipe — both were intentionally skipped because they didn't drive the "prototype-y" complaint, but they'd benefit from the new SectionHeader / typography hierarchy / lighter chrome. The PDP could get a `LifestyleHero` for hero category products and an `EditorialSplit` for the smart-pairing section.
- **Onboarding illustrations** — the audit said hierarchy is best-in-class, but each step is still text + emoji + form. A subtle illustration per step would make it feel premium.
- **Real wearable SVG iconography** — the connected-apps + persona avatars still use emoji (⌚ 💍 ❤️). Replacing with real SVG marks for Whoop / Oura / Garmin / Apple Health / Levels CGM is the highest visual ROI cosmetic change left.
- **Smart Cart bundle savings progress bar** — visualizing "$X saved by bundling" as a progress bar instead of a price line.
- **Mobile responsiveness pass** — current breakpoints still assume ≥1280px viewport in many places. Forecast and Cart already use `md:`/`lg:` breakpoints; Today/Stack/Subscriptions/Advisor were rewritten with grid-cols-1/sm:grid-cols-2/lg:grid-cols-N so they should be mostly OK but untested under 1024px.
- **Defensive image audit** — the brand-prefix pitfall (`jar/jar05079` 404'ing because the correct prefix is `jrw/jrw01006`) hasn't been swept. A build-time URL check or `<img onError>` fallback would catch these without manual review.
- **Deeper advisor mock chat responses** — 4-6 more keyword paths so the demo doesn't feel scripted on the first dozen prompts.
