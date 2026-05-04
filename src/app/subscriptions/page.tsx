'use client';

// Subscriptions — editorial v2 (May 3, 2026).
//
// Hero · Stat row (clean) · Recently-optimized digest · Editorial quote ·
// Subscription list (lighter cards) · Trust badges · Expert/savings split ·
// Automation rules. Side rail is gone; everything reads vertically with
// generous breathing room.

import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  PauseCircle,
  SkipForward,
  RefreshCw,
  Settings2,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { AdherenceRing } from '@/components/AdherenceRing';
import { Sparkline } from '@/components/Sparkline';
import { LifestyleHero } from '@/components/LifestyleHero';
import { SectionHeader } from '@/components/SectionHeader';
import { MetricRow, type Metric } from '@/components/MetricRow';
import { EditorialSplit } from '@/components/EditorialSplit';
import { ExpertCallout } from '@/components/ExpertCallout';
import { TrustBadgeStrip } from '@/components/TrustBadgeStrip';
import { EditorialQuote } from '@/components/EditorialQuote';
import { usePersona } from '@/components/PersonaProvider';
import {
  SUBSCRIPTIONS_HERO,
  EXPERT_DR_CHEN,
  DELIVERY_LIFESTYLE,
} from '@/data/lifestyleImages';

function freqLabel(days: number): string {
  if (days === 30) return 'Every 30 days';
  if (days === 45) return 'Every 45 days';
  if (days === 60) return 'Every 60 days';
  return `Every ${days} days`;
}

function trendFor(adherence: number): number[] {
  const series: number[] = [];
  let v = Math.max(40, adherence - 20);
  for (let i = 0; i < 30; i++) {
    const drift = (Math.sin(i * 0.6) * 5) + (i * (adherence - v) / 30) * 0.7;
    v = Math.max(35, Math.min(100, v + drift * 0.4));
    series.push(Math.round(v));
  }
  series[29] = adherence;
  return series;
}

const SAVINGS_TREND_MAYA = [0, 1, 2, 3, 5, 8, 10, 11, 11, 13, 14, 15, 15, 17, 18, 19, 20, 20, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23];
const SAVINGS_TREND_DANIEL = [12, 25, 38, 47, 62, 75, 88, 95, 105, 118, 130, 138, 150, 165, 178, 188, 195, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 187];

export default function SubscriptionsPage() {
  const { persona } = usePersona();
  const isMaya = persona.id === 'maya';

  const autoshipItems = persona.stack.filter((s) => s.autoship);

  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  const [rules, setRules] = useState([
    { id: 'pause-overstock', rule: "Pause autoship if I'm overstocked", detail: 'Pauses when 21+ days of supply remain', on: true },
    { id: 'lock-price', rule: 'Lock in prices when promos hit', detail: 'Applies to all active autoship items', on: true },
    { id: 'optimize-timing', rule: 'Auto-optimize delivery timing', detail: 'Adjusts dates based on actual usage pace', on: true },
    {
      id: 'biometric-dose',
      rule: 'Adjust dose based on biometric data',
      detail: isMaya ? 'Apple Health only — sleep and activity trends' : 'Whoop, Oura, CGM · full protocol adjustments',
      on: isMaya ? false : true,
    },
    { id: 'bundle-detect', rule: 'Smart bundle detection', detail: 'Auto-applies bundle discounts when stack qualifies', on: true },
  ]);

  const toggleRule = (id: string) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));

  const agentSideActions = persona.agentActions.filter(
    (a) => a.category === 'subscription' || a.category === 'inventory' || a.category === 'price'
  );

  const activeCount = autoshipItems.length;
  const savedThisYear = isMaya ? '$23.39' : '$187.40';
  const savingsTrend = isMaya ? SAVINGS_TREND_MAYA : SAVINGS_TREND_DANIEL;
  const nextDelivery = autoshipItems
    .filter((s) => s.nextDelivery)
    .sort()[0]?.nextDelivery ?? 'May 10';
  const pausedCount = Object.values(paused).filter(Boolean).length;

  const aiSummaryBullets = isMaya
    ? [
        { text: 'Moved your Magnesium Glycinate delivery 3 days later — you still had 17 days of stock.', delta: 'Saved $18.99', dir: 'savings' as const },
        { text: 'Locked in a 20% promo price on Vitamin D3 before it expired.', delta: 'Saved $4.40', dir: 'savings' as const },
        { text: 'Spring-season reminder: UV index suggests your D3 dose can be reduced through summer.', delta: 'Auto-paused', dir: 'date' as const },
      ]
    : [
        { text: 'Locked in Thorne EPA/DHA at current pricing before June 1 increase.', delta: 'Saved $11.97', dir: 'savings' as const },
        { text: 'Paused LMNT — you added 4 boxes at the gym. Will resume below 14 days.', delta: 'Auto-paused', dir: 'date' as const },
        { text: 'Bumped Creatine to 6g for 14 days based on Whoop strain average 16.2.', delta: 'Strain ↑ 12%', dir: 'up' as const },
        { text: 'Bundled NMN + Quercetin + Resveratrol into Longevity Stack.', delta: 'Saved $31.20/mo', dir: 'savings' as const },
      ];

  const metrics: Metric[] = [
    {
      label: 'Active',
      value: activeCount.toString(),
      unit: 'subs',
      caption: 'all on autoship',
      accent: '#0A6B3C',
      hero: true,
    },
    {
      label: 'Saved by auto-tuning',
      value: savedThisYear,
      caption: `YTD · ${isMaya ? '2' : '6'} actions taken`,
      trend: savingsTrend,
      accent: '#0E9594',
    },
    {
      label: 'Next delivery',
      value: nextDelivery.split(' ')[1] ?? nextDelivery,
      unit: nextDelivery.split(' ')[0] ?? '',
      caption: `${isMaya ? '2' : '4'} items in this box`,
      accent: '#6B4FBC',
    },
    {
      label: 'Paused',
      value: (isMaya ? pausedCount : pausedCount + 1).toString(),
      caption: isMaya ? (pausedCount === 0 ? 'all running' : 'by you or AI') : 'LMNT overstock',
      accent: '#FF6B4A',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1">
        {/* ── 1. Editorial hero ──────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
          <LifestyleHero
            imageUrl={SUBSCRIPTIONS_HERO.url}
            alt={SUBSCRIPTIONS_HERO.alt}
            eyebrow="Subscriptions · auto-tuned"
            headline={
              isMaya
                ? "A routine that adjusts itself, so you don't have to."
                : 'Calibrated to your data, lifted by your protocol.'
            }
            subline={
              isMaya
                ? 'Your advisor watches your usage patterns and adjusts deliveries so you never run out — or end up with too much.'
                : 'Optimized in real time from Whoop, Oura, and price intelligence. Every change is logged and reversible.'
            }
            size="lg"
            tint="green"
            overlay="medium"
            serif
            rounded="lg"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
              <CheckCircle2 size={12} strokeWidth={2.5} />
              Every action reversible
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md">
              <Sparkles size={12} strokeWidth={2.5} />
              {isMaya ? '2 actions this month' : '6 actions this month'}
            </span>
          </LifestyleHero>
        </section>

        {/* ── 2. Stat row ────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <MetricRow metrics={metrics} />
        </section>

        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <hr className="hairline" />
        </div>

        {/* ── 3. Recently optimized — flat AIMoment ──────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-16 md:px-10 md:pt-20">
          <SectionHeader
            eyebrow="Recently optimized"
            headline="What I adjusted this month"
            lede="A monthly digest of timing tweaks, price locks, and dose changes I made on your behalf."
            ctaLabel="Full audit log"
            ctaHref="/advisor"
          />
          <ul className="space-y-3">
            {aiSummaryBullets.map((b, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-[#EFEFEF]"
              >
                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F1FAF3]">
                  <Sparkles size={11} className="text-[#0A6B3C]" strokeWidth={3} />
                </div>
                <span className="flex-1 text-[14.5px] text-[#444]" style={{ lineHeight: 1.55 }}>
                  {b.text}
                </span>
                <span
                  className={`flex-shrink-0 self-center rounded-full px-3 py-1 text-[11.5px] font-bold ${
                    b.dir === 'savings'
                      ? 'bg-[#F1FAF3] text-[#0A6B3C]'
                      : b.dir === 'up'
                        ? 'bg-[#FFF1E8] text-[#FF6B4A]'
                        : 'bg-[#EAF1FB] text-[#1558A6]'
                  }`}
                >
                  {b.delta}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── 4. Editorial quote section break ───────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <EditorialQuote
            variant="tinted"
            tint="teal"
            quote={
              isMaya
                ? 'The right supplement at the wrong time is the wrong supplement. Your routine should adjust to your life, not the other way around.'
                : "Auto-tuning isn't about removing decisions — it's about removing the boring ones so you can spend the budget on the decisions that matter."
            }
            attribution="Dr. Sarah Chen, ND"
            credential="iHerb Wellness Hub clinical reviewer"
            portraitUrl={EXPERT_DR_CHEN.url}
          />
        </section>

        {/* ── 5. Subscription list ───────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <SectionHeader
            eyebrow="Your subscriptions"
            headline={`${autoshipItems.length} ${autoshipItems.length === 1 ? 'item' : 'items'} on autoship`}
            lede="Skip, pause, swap, or adjust frequency without leaving the page. Adjustments are logged on each card."
          />
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">
            {autoshipItems.map((item, i) => {
              const isSkipped = skipped[item.productId];
              const isPaused = paused[item.productId];
              const itemTrend = trendFor(item.adherence30d);

              return (
                <div
                  key={item.productId}
                  className={`p-7 transition-colors ${i > 0 ? 'border-t border-[#F2F2F2]' : ''} ${isPaused ? 'opacity-65' : ''}`}
                >
                  <div className="flex items-start gap-6">
                    <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#FAFBFA]">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                      />
                      {item.autoshipNote && (
                        <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#0A6B3C] ring-4 ring-white">
                          <Sparkles size={11} className="text-white" strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[10.5px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.14em' }}>
                        {item.brand}
                      </div>
                      <div className="mt-1 text-[18px] font-semibold leading-snug text-[#1A1A1A]" style={{ letterSpacing: '-0.012em' }}>
                        {item.name}
                      </div>
                      <div className="mt-1 text-[13px] text-[#666]">
                        {item.dose} · {item.timeOfDay} · {item.reasonShort}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {item.nextDelivery && !isPaused && !isSkipped && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#C3E6CB] bg-[#F1FAF3] px-2.5 py-1 text-[11px] font-semibold text-[#0A6B3C]">
                            <Calendar size={10} strokeWidth={3} />
                            Next: {item.nextDelivery}
                          </span>
                        )}
                        {isPaused && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F4F4] px-2.5 py-1 text-[11px] font-semibold text-[#888]">
                            <PauseCircle size={10} strokeWidth={3} />
                            Paused
                          </span>
                        )}
                        {isSkipped && !isPaused && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7F1] px-2.5 py-1 text-[11px] font-semibold text-[#D14800]">
                            <SkipForward size={10} strokeWidth={3} />
                            Skipped
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#B6CFEC] bg-[#EAF1FB] px-2.5 py-1 text-[11px] font-semibold text-[#1558A6]">
                          {freqLabel(isMaya ? 30 : item.productId === 'thorne-creatine' ? 30 : 45)}
                        </span>
                        {item.autoshipNote && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#0A6B3C] px-2.5 py-1 text-[11px] font-semibold text-white">
                            <Sparkles size={10} strokeWidth={3} />
                            Auto-tuned
                          </span>
                        )}
                      </div>

                      {item.autoshipNote && (
                        <p className="mt-3 max-w-[560px] text-[13px] text-[#555]" style={{ lineHeight: 1.55 }}>
                          {item.autoshipNote}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-shrink-0 flex-col items-end gap-2">
                      <AdherenceRing
                        percentage={item.adherence30d}
                        size={64}
                        label="30-day"
                        color={
                          item.adherence30d >= 90 ? '#0A6B3C' :
                          item.adherence30d >= 75 ? '#B38900' : '#D14800'
                        }
                      />
                      <Sparkline
                        values={itemTrend}
                        color={
                          item.adherence30d >= 90 ? '#0A6B3C' :
                          item.adherence30d >= 75 ? '#B38900' : '#D14800'
                        }
                        width={86}
                        height={20}
                      />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#F4F4F4] pt-4">
                    <button
                      onClick={() => setSkipped((p) => ({ ...p, [item.productId]: !p[item.productId] }))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-all ${
                        isSkipped
                          ? 'border-[#0A6B3C] bg-[#F1FAF3] text-[#0A6B3C]'
                          : 'border-[#E0E0E0] text-[#444] hover:border-[#999]'
                      }`}
                    >
                      <SkipForward size={12} strokeWidth={2.5} />
                      {isSkipped ? 'Unskip next' : 'Skip next'}
                    </button>
                    <button
                      onClick={() => setPaused((p) => ({ ...p, [item.productId]: !p[item.productId] }))}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold transition-all ${
                        isPaused
                          ? 'border-[#0A6B3C] bg-[#F1FAF3] text-[#0A6B3C]'
                          : 'border-[#E0E0E0] text-[#444] hover:border-[#999]'
                      }`}
                    >
                      <PauseCircle size={12} strokeWidth={2.5} />
                      {isPaused ? 'Resume' : 'Pause'}
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-full border border-[#E0E0E0] px-3.5 py-2 text-[12.5px] font-semibold text-[#444] transition-all hover:border-[#999]">
                      <RefreshCw size={12} strokeWidth={2.5} />
                      Adjust frequency
                    </button>
                    <button className="inline-flex items-center gap-1.5 rounded-full border border-[#E0E0E0] px-3.5 py-2 text-[12.5px] font-semibold text-[#444] transition-all hover:border-[#999]">
                      <Settings2 size={12} strokeWidth={2.5} />
                      Replace
                    </button>

                    {item.productId === 'now-mag-glycinate' && (
                      <span className="ml-auto text-[11.5px] font-medium text-[#888]">
                        Last adjusted · Moved 3 days later · April 19
                      </span>
                    )}
                    {item.productId === 'cgn-vit-d3' && (
                      <span className="ml-auto text-[11.5px] font-medium text-[#888]">
                        Last adjusted · Price locked 20% off · April 27
                      </span>
                    )}
                    {item.productId === 'thorne-omega' && (
                      <span className="ml-auto text-[11.5px] font-medium text-[#888]">
                        Last adjusted · Locked 3 deliveries · April 26
                      </span>
                    )}
                    {item.productId === 'thorne-creatine' && (
                      <span className="ml-auto text-[11.5px] font-medium text-[#888]">
                        Last adjusted · Dose bumped to 6g · April 28
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8">
            <TrustBadgeStrip
              badges={['nsf', 'informed-sport', 'third-party', 'non-gmo', 'gmp']}
              density="loose"
              background="white"
            />
          </div>
        </section>

        {/* ── 6. Expert + savings editorial split ────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <EditorialSplit
            imageUrl={DELIVERY_LIFESTYLE.url}
            alt={DELIVERY_LIFESTYLE.alt}
            eyebrow="Backed by clinical review"
            headline="Dr. Sarah Chen reviews every protocol shift."
            body={
              isMaya
                ? 'Your stack is on her safe-to-self-tune list. The advisor only acts within the boundaries she has approved for your goals.'
                : 'She backs your longevity protocol. Recommended your bisglycinate-first sleep approach 3 months ago, and the data is bearing it out.'
            }
            ratio="balanced"
            minHeight="380px"
          >
            <ExpertCallout
              portraitUrl={EXPERT_DR_CHEN.url}
              name="Dr. Sarah Chen"
              credentials="ND, MS"
              title="Naturopathic Doctor · Wellness Hub"
              endorsement=""
              expertiseChips={['Sleep', 'Mineral repletion', 'Allergy protocols']}
              variant="inline"
            />
          </EditorialSplit>
        </section>

        {/* ── 7. Action queue ─────────────────────────────────────── */}
        {agentSideActions.length > 0 && (
          <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
            <SectionHeader
              eyebrow="Live action queue"
              headline="Subscription, inventory, and pricing intelligence"
              lede={
                isMaya
                  ? 'Smaller actions handled in the background — you only see them if they pass a threshold worth knowing about.'
                  : 'Real-time queue reflecting your data feeds. Every action is reversible from here or your audit log.'
              }
            />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {agentSideActions.map((a) => (
                <AgentActionCard key={a.id} action={a} />
              ))}
            </div>
          </section>
        )}

        {/* ── 8. Automation rules ────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 pb-24 md:px-10 md:pt-28 md:pb-32">
          <SectionHeader
            eyebrow="Hands-off"
            eyebrowColor="#6B4FBC"
            headline="Automation rules"
            lede="Behaviors your advisor handles without asking. Each rule is independently togglable."
            ctaLabel="Manage in advisor"
            ctaHref="/advisor"
          />
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">
            {rules.map((r, i) => (
              <div
                key={r.id}
                className={`flex items-center justify-between gap-4 p-5 transition-colors ${
                  i > 0 ? 'border-t border-[#F2F2F2]' : ''
                } ${r.on ? 'bg-white' : 'bg-[#FAFAFA]'}`}
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-semibold text-[#1A1A1A]">{r.rule}</div>
                  <div className="mt-0.5 text-[12.5px] text-[#888]">{r.detail}</div>
                </div>
                <button
                  onClick={() => toggleRule(r.id)}
                  className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                    r.on ? 'bg-[#6B4FBC]' : 'bg-[#E0E0E0]'
                  }`}
                  aria-label={r.on ? 'Disable rule' : 'Enable rule'}
                >
                  <div
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-all ${
                      r.on ? 'left-[22px]' : 'left-0.5'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
