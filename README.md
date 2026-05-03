# iHerb Wellness 2.0 — Prototype

A clickable, multi-page Next.js prototype showcasing the future state of iHerb as a personalized specialty store that knows you, anticipates your needs, and helps you reach your wellness goals.

Builds on the design system from Search 2.0 and the 2026 Evergreen brand refresh.

## Run it

```bash
cd iherb-wellness-2.0
npm install
npm run dev
```

Then open http://localhost:3000.

## What's in here

10 interconnected pages, fully linked:

| Route | Page |
|---|---|
| `/` | **Today** — dynamic, personalized landing page that morphs by persona, time of day, and recent activity |
| `/onboarding` | **Wellness Profile** — 5-step flow that builds the user's goals, profile, routine, connected apps |
| `/advisor` | **Wellness Advisor** — chat + agentic action queue with approve/skip/paused states |
| `/stack` | **Daily Stack** — supplement routine grouped by time of day, adherence tracking, streaks |
| `/forecast` | **Health Forecast** — 7-day weather/UV/pollen → AI-driven product recommendations |
| `/search?q=...` | **SERP** — ported from Search 2.0; AI Contextual Header, Smart Filter Pills, AI Answer Card |
| `/product/[id]` | **PDP** — product detail with persona-aware "Why this is good for you" panel |
| `/cart` | **Smart Cart** — agentic curation: bundle detection, free shipping unlock, advisor savings |
| `/subscriptions` | **Subscription Manager** — auto-tuning agent, automation rules, audit trail per item |
| `/wellness-hub/[slug]` | **Wellness Hub article** — long-form editorial that anchors AI citations |

## The persona system

Two switchable personas demonstrate how the experience adapts to who you are:

**Judy** — 28, Austin, TX. Wellness Beginner with 3 supplements, building her first routine. Goals: sleep, energy, immune support. Apple Health connected.

**Daniel** — 42, Seattle, WA. Advanced Optimizer with 12+ supplements, longevity protocol. Goals: longevity, cognitive performance, athletic recovery, sleep. Whoop, Oura, Garmin, Levels CGM all connected.

Use the floating control in the bottom-right to switch personas and time of day. Watch how the homepage, advisor recommendations, daily stack, and product pages all morph in response.

## Visual system

- **2026 Evergreen palette** — `#0A6B3C` primary, `#D14800` action orange, `#1558A6` trust blue, `#F1FAF3` light green tint
- **Noto Sans** — only one font family, weight + size for hierarchy
- **AI moment recipe** — wherever the experience surfaces a personalized insight: 3px green gradient accent bar + `Sparkles` + uppercase tracking-widest eyebrow + headline + optional chips + "Powered by iHerb Wellness Hub" footer (`AIMoment` component)
- **Agentic action card** — 3 states: taken (✓), pending (clock + Approve/Skip), paused (`AgentActionCard` component)
- **Pills everywhere** — `border-radius: 9999px` on search, badges, buttons, action chips
- **Light, deliberate motion** — `fadeIn 200ms`, `active:scale-[0.97]`, no harsh shadows

## Architecture

Built on Next.js 16.2.2 + React 19 + TypeScript + Tailwind CSS v4.

Key modules:

```
src/
  app/                         (one folder per route — see route table above)
  components/
    Header.tsx                 3-tier header w/ persona-aware greeting + Ask Advisor pill
    Footer.tsx
    AIMoment.tsx               Reusable AI moment surface (card + inline variants)
    AgentActionCard.tsx        Reusable agent action card (taken/pending/paused)
    HealthForecastStrip.tsx    7-day forecast strip
    AdherenceRing.tsx          Circular adherence percentage
    PersonaProvider.tsx        React context for persona + time-of-day
    PersonaSwitcher.tsx        Floating demo control
    [Search 2.0 ported]        AIContextualHeader, AIAnswerCard, SmartFilterPills,
                               FilterSidebar, ProductCardGrid, ProductCardList
  data/
    personas.ts                Judy & Daniel persona definitions (stack, agent
                               actions, achievements, connected apps, etc.)
    healthForecast.ts          Per-persona 7-day forecast + AI insights
    products.ts                31 mock products (from Search 2.0)
    filters.ts, navigation.ts  (from Search 2.0)
```

## Strategic frame

Four pillars showcased across the prototype:

1. **Personalization ("knows you")** — dynamic homepage, wellness profile, recommended layouts that morph per user
2. **Wellness advisor / AI guidance** — always-available advisor (header pill + dedicated page); inline AI overviews on lists/PDPs; Wellness Hub editorial that AI cites
3. **Agentic ecommerce** — action queue in advisor; autoship auto-tuning visible on subscription page; Smart Cart with proactive bundle/timing nudges; one-tap approvals
4. **Specialty store identity** — curated stacks, expert picks, 3rd-party-tested badges, trust amplifiers, category storytelling

## Things that are mocked

- Product images are `https://res.cloudinary.com/iherb/...` URLs that may not all resolve; placeholder emoji + green tint divs are used as fallbacks
- Search uses 31 mock products; backend filtering only
- Persona/time switching uses `localStorage` for persistence
- The advisor chat is keyword-matched mock responses, not LLM-backed
- Agent actions show realistic patterns but are static data

## Where this came from

- Audit of the prior `preview--iherbwellness.lovable.app` prototype — kept the conceptually-strong agentic framing, dropped the generic Lovable visual template
- Visual + interaction DNA from Search 2.0 (`../Search 2.0`)
- Tokens from `DESIGN_SYSTEM_2026.md`
