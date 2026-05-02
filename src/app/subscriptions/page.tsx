'use client';

// Subscription Manager — bento layout with auto-tuning intelligence.
// Stats row uses varied accent colors (green active, teal savings, purple
// next-delivery, coral paused). Subscription cards include per-item sparkline
// of adherence trend.

import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Calendar,
  Package,
  PauseCircle,
  SkipForward,
  RefreshCw,
  Settings2,
  TrendingDown,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { AdherenceRing } from '@/components/AdherenceRing';
import { Sparkline } from '@/components/Sparkline';
import { usePersona } from '@/components/PersonaProvider';

// Frequency label helper
function freqLabel(days: number): string {
  if (days === 30) return 'Every 30 days';
  if (days === 45) return 'Every 45 days';
  if (days === 60) return 'Every 60 days';
  return `Every ${days} days`;
}

// Per-item adherence trend mock
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

// Mock 30-day cumulative savings trend
const SAVINGS_TREND_MAYA = [0, 1, 2, 3, 5, 8, 10, 11, 11, 13, 14, 15, 15, 17, 18, 19, 20, 20, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23];
const SAVINGS_TREND_DANIEL = [12, 25, 38, 47, 62, 75, 88, 95, 105, 118, 130, 138, 150, 165, 178, 188, 195, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 198, 187];

export default function SubscriptionsPage() {
  const { persona } = usePersona();
  const isMaya = persona.id === 'maya';

  const autoshipItems = persona.stack.filter((s) => s.autoship);

  // Per-card action state
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  // Automation rules state
  const [rules, setRules] = useState([
    { id: 'pause-overstock', rule: 'Pause autoship if I\'m overstocked', detail: 'Pauses when 21+ days of supply remain', on: true },
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

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-1.5 text-[#0A6B3C]">
            <Sparkles size={13} strokeWidth={2.5} />
            <span className="text-[10.5px] font-bold uppercase tracking-widest">
              Subscriptions
            </span>
          </div>
          <h1 className="text-[28px] font-bold text-[#1A1A1A]">
            Auto-tuned by your advisor
          </h1>
          <p className="mt-1 text-[13.5px] text-[#666]">
            {isMaya
              ? 'Watching your usage patterns and adjusting deliveries so you never run out — or end up with too much.'
              : 'Optimized in real time from Whoop, Oura, and price intelligence. Every change is logged and reversible.'}
          </p>
        </div>

        {/* ── Bento stat row ─────────────────────────────────────── */}
        <section className="mb-5 grid grid-cols-12 gap-4">
          {/* Active subscriptions — green */}
          <div className="col-span-3 overflow-hidden rounded-2xl border border-[#C3E6CB] bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#DDF0E1] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Package size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                Active
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none text-[#1F5034]">{activeCount}</div>
            <div className="mt-1 text-[11.5px] text-[#3A6E4E]">autoship subscriptions</div>
          </div>

          {/* Saved this year — teal, with sparkline */}
          <div className="col-span-4 overflow-hidden rounded-2xl border border-[#A7DDDC] bg-gradient-to-br from-[#E5F6F5] via-[#D4EFEE] to-[#BFE6E4] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <TrendingDown size={13} className="text-[#0E9594]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E9594]">
                Saved by auto-tuning
              </span>
            </div>
            <div className="flex items-end gap-3">
              <div className="text-[36px] font-bold leading-none text-[#0A4A4A]">{savedThisYear}</div>
              <Sparkline values={savingsTrend} color="#0E9594" width={120} height={28} />
            </div>
            <div className="mt-1 text-[11.5px] text-[#1F6E6D]">YTD · {isMaya ? '2 actions taken' : '6 actions taken'}</div>
          </div>

          {/* Next delivery — purple */}
          <div className="col-span-3 overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-[#F4F0FB] via-[#EDE6F8] to-[#E2D9F4] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Calendar size={13} className="text-[#6B4FBC]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                Next delivery
              </span>
            </div>
            <div className="text-[26px] font-bold leading-none text-[#3A2680]">{nextDelivery}</div>
            <div className="mt-1 text-[11.5px] text-[#5C3FA8]">
              {isMaya ? '2 items in this box' : '4 items in this box'}
            </div>
          </div>

          {/* Paused — coral */}
          <div className="col-span-2 overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <PauseCircle size={13} className="text-[#FF6B4A]" strokeWidth={2.5} />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D14800]">
                Paused
              </span>
            </div>
            <div className="text-[36px] font-bold leading-none text-[#7B4022]">
              {isMaya ? pausedCount : pausedCount + 1}
            </div>
            <div className="mt-1 text-[11.5px] text-[#7B4022]">
              {isMaya
                ? pausedCount === 0
                  ? 'all running'
                  : 'by you or AI'
                : 'LMNT overstock'}
            </div>
          </div>
        </section>

        {/* ── Recently optimized AIMoment with delta chips ─────────── */}
        <section className="mb-5">
          <AIMoment
            eyebrow="Recently optimized"
            headline="I made these adjustments this month"
            footerLabel="Powered by iHerb Wellness Hub · all reversible"
            footerRight={
              <Link
                href="/advisor"
                className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
              >
                Full audit log
                <ArrowRight size={10} strokeWidth={2.5} />
              </Link>
            }
          >
            <ul className="mt-1 space-y-1.5">
              {aiSummaryBullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-[#F0F0F0] bg-[#FAFBFA] px-3 py-2">
                  <div className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#0A6B3C]/10">
                    <Sparkles size={9} className="text-[#0A6B3C]" strokeWidth={3} />
                  </div>
                  <span className="flex-1 text-[12.5px] leading-snug text-[#444]">{b.text}</span>
                  <span
                    className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
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
          </AIMoment>
        </section>

        <div className="grid grid-cols-12 gap-5">
          {/* ── LEFT: Subscription cards ─────────────────────────── */}
          <section className="col-span-8 space-y-4">
            {autoshipItems.map((item) => {
              const isSkipped = skipped[item.productId];
              const isPaused = paused[item.productId];
              const itemTrend = trendFor(item.adherence30d);

              return (
                <div
                  key={item.productId}
                  className={`overflow-hidden rounded-2xl border bg-white transition-all ${
                    isPaused
                      ? 'border-[#E0E0E0] opacity-75'
                      : isSkipped
                        ? 'border-[#E0E0E0]'
                        : 'border-[#E0E0E0] hover:border-[#0A6B3C]'
                  }`}
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-[#E8E8E8] bg-white">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-contain"
                            loading="lazy"
                          />
                          {item.autoshipNote && (
                            <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A6B3C] ring-2 ring-white">
                              <Sparkles size={9} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-[10.5px] font-bold uppercase tracking-wide text-[#0A6B3C]">
                          {item.brand}
                        </div>
                        <div className="text-[15px] font-semibold leading-snug text-[#1A1A1A]">
                          {item.name}
                        </div>
                        <div className="mt-0.5 text-[12px] text-[#666]">
                          {item.dose} · {item.timeOfDay} · {item.reasonShort}
                        </div>

                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          {item.nextDelivery && !isPaused && !isSkipped && (
                            <span className="inline-flex items-center gap-1 rounded-full border border-[#C3E6CB] bg-[#F1FAF3] px-2.5 py-1 text-[10.5px] font-semibold text-[#0A6B3C]">
                              <Calendar size={9} strokeWidth={3} />
                              Next: {item.nextDelivery}
                            </span>
                          )}
                          {isPaused && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F4F4F4] px-2.5 py-1 text-[10.5px] font-semibold text-[#888]">
                              <PauseCircle size={9} strokeWidth={3} />
                              Paused
                            </span>
                          )}
                          {isSkipped && !isPaused && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF7F1] px-2.5 py-1 text-[10.5px] font-semibold text-[#D14800]">
                              <SkipForward size={9} strokeWidth={3} />
                              Skipped
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#B6CFEC] bg-[#EAF1FB] px-2.5 py-1 text-[10.5px] font-semibold text-[#1558A6]">
                            {freqLabel(isMaya ? 30 : item.productId === 'thorne-creatine' ? 30 : 45)}
                          </span>
                          {item.autoshipNote && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#0A6B3C] px-2.5 py-1 text-[10.5px] font-semibold text-white">
                              <Sparkles size={9} strokeWidth={3} />
                              Auto-tuned
                            </span>
                          )}
                        </div>

                        {item.autoshipNote && (
                          <div className="mt-2 flex items-start gap-1.5 rounded-lg border border-[#D9EADF] bg-[#F1FAF3] px-3 py-2">
                            <Sparkles size={10} className="mt-0.5 flex-shrink-0 text-[#0A6B3C]" strokeWidth={3} />
                            <span className="text-[11.5px] leading-snug text-[#444]">
                              {item.autoshipNote}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Adherence ring + sparkline */}
                      <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                        <AdherenceRing
                          percentage={item.adherence30d}
                          size={56}
                          label="30-day"
                          color={
                            item.adherence30d >= 90
                              ? '#0A6B3C'
                              : item.adherence30d >= 75
                                ? '#B38900'
                                : '#D14800'
                          }
                        />
                        <Sparkline
                          values={itemTrend}
                          color={
                            item.adherence30d >= 90
                              ? '#0A6B3C'
                              : item.adherence30d >= 75
                                ? '#B38900'
                                : '#D14800'
                          }
                          width={70}
                          height={16}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-[#F4F4F4] pt-3">
                      <button
                        onClick={() => setSkipped((p) => ({ ...p, [item.productId]: !p[item.productId] }))}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                          isSkipped
                            ? 'border-[#0A6B3C] bg-[#F1FAF3] text-[#0A6B3C]'
                            : 'border-[#D0D0D0] text-[#666] hover:border-[#999] hover:text-[#333]'
                        }`}
                      >
                        <SkipForward size={11} strokeWidth={2.5} />
                        {isSkipped ? 'Unskip next' : 'Skip next'}
                      </button>
                      <button
                        onClick={() => setPaused((p) => ({ ...p, [item.productId]: !p[item.productId] }))}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                          isPaused
                            ? 'border-[#0A6B3C] bg-[#F1FAF3] text-[#0A6B3C]'
                            : 'border-[#D0D0D0] text-[#666] hover:border-[#999] hover:text-[#333]'
                        }`}
                      >
                        <PauseCircle size={11} strokeWidth={2.5} />
                        {isPaused ? 'Resume' : 'Pause'}
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full border border-[#D0D0D0] px-3 py-1.5 text-[12px] font-semibold text-[#666] transition-all hover:border-[#999] hover:text-[#333]">
                        <RefreshCw size={11} strokeWidth={2.5} />
                        Adjust frequency
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full border border-[#D0D0D0] px-3 py-1.5 text-[12px] font-semibold text-[#666] transition-all hover:border-[#999] hover:text-[#333]">
                        <Settings2 size={11} strokeWidth={2.5} />
                        Replace
                      </button>

                      {/* Right-aligned: last adjustment context */}
                      {item.productId === 'now-mag-glycinate' && (
                        <div className="ml-auto text-right">
                          <div className="text-[10px] text-[#AAA]">Last adjustment</div>
                          <div className="text-[10.5px] font-medium text-[#666]">
                            Moved 3 days later · April 19
                          </div>
                        </div>
                      )}
                      {item.productId === 'cgn-vit-d3' && (
                        <div className="ml-auto text-right">
                          <div className="text-[10px] text-[#AAA]">Last adjustment</div>
                          <div className="text-[10.5px] font-medium text-[#666]">
                            Price locked 20% off · April 27
                          </div>
                        </div>
                      )}
                      {item.productId === 'thorne-omega' && (
                        <div className="ml-auto text-right">
                          <div className="text-[10px] text-[#AAA]">Last adjustment</div>
                          <div className="text-[10.5px] font-medium text-[#666]">
                            Locked 3 deliveries · April 26
                          </div>
                        </div>
                      )}
                      {item.productId === 'thorne-creatine' && (
                        <div className="ml-auto text-right">
                          <div className="text-[10px] text-[#AAA]">Last adjustment</div>
                          <div className="text-[10.5px] font-medium text-[#666]">
                            Dose bumped to 6g · April 28
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Automation rules — purple-tinted */}
            <div className="overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-white via-white to-[#F4F0FB] p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                    Automation rules
                  </div>
                  <p className="mt-0.5 text-[12px] text-[#666]">
                    Things your advisor handles without asking — toggle to customize
                  </p>
                </div>
                <Link
                  href="/advisor"
                  className="text-[11px] font-medium text-[#1558A6] hover:underline"
                >
                  Manage in advisor →
                </Link>
              </div>
              <div className="space-y-1.5">
                {rules.map((r) => (
                  <div
                    key={r.id}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-all ${
                      r.on
                        ? 'border-[#D6C8F0] bg-white/70'
                        : 'border-[#F0F0F0] bg-white hover:border-[#D9EADF] hover:bg-[#FAFBFA]'
                    }`}
                  >
                    <div className="mr-4 min-w-0 flex-1">
                      <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{r.rule}</div>
                      <div className="text-[11px] text-[#888]">{r.detail}</div>
                    </div>
                    <button
                      onClick={() => toggleRule(r.id)}
                      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
                        r.on ? 'bg-[#6B4FBC]' : 'bg-[#E0E0E0]'
                      }`}
                      aria-label={r.on ? 'Disable rule' : 'Enable rule'}
                    >
                      <div
                        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                          r.on ? 'left-[18px]' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── RIGHT: Action queue + savings panel ─────────────── */}
          <aside className="col-span-4">
            <div className="sticky top-[140px] space-y-4">
              <div>
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-[16px] font-bold text-[#1A1A1A]">Agent actions</h2>
                  <span className="text-[11.5px] text-[#888]">
                    {agentSideActions.length} subscription-related
                  </span>
                </div>
                <p className="mb-3 text-[12px] text-[#666]">
                  {isMaya
                    ? 'Subscription, inventory, and price actions from your advisor'
                    : 'Live queue — subscription, inventory, and pricing intelligence'}
                </p>
                <div className="space-y-2.5">
                  {agentSideActions.map((a) => (
                    <AgentActionCard key={a.id} action={a} compact />
                  ))}
                  {agentSideActions.length === 0 && (
                    <div className="rounded-xl border border-dashed border-[#E0E0E0] py-8 text-center text-[12.5px] italic text-[#999]">
                      No pending actions for subscriptions
                    </div>
                  )}
                </div>
              </div>

              {/* Savings summary — teal */}
              <div className="overflow-hidden rounded-2xl border border-[#A7DDDC] bg-gradient-to-br from-[#E5F6F5] via-[#D4EFEE] to-[#BFE6E4] p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Zap size={14} className="text-[#0E9594]" strokeWidth={2.5} />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0E9594]">
                    Advisor savings
                  </span>
                </div>
                <div className="text-[28px] font-bold leading-none text-[#0A4A4A]">{savedThisYear}</div>
                <div className="text-[11.5px] text-[#1F6E6D]">saved via auto-tuning in 2026</div>
                <div className="mt-2">
                  <Sparkline values={savingsTrend} color="#0E9594" width={200} height={28} />
                </div>
                <div className="mt-3 space-y-1.5 border-t border-[#A7DDDC] pt-3">
                  {isMaya ? (
                    <>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#1F6E6D]">Price lock on D3</span>
                        <span className="font-bold text-[#0A4A4A]">$4.40</span>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#1F6E6D]">Avoided duplicate delivery</span>
                        <span className="font-bold text-[#0A4A4A]">$18.99</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#1F6E6D]">EPA/DHA price lock</span>
                        <span className="font-bold text-[#0A4A4A]">$11.97</span>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#1F6E6D]">Longevity bundle</span>
                        <span className="font-bold text-[#0A4A4A]">$31.20/mo</span>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#1F6E6D]">LMNT pause</span>
                        <span className="font-bold text-[#0A4A4A]">~$24</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Reversibility trust strip */}
              <div className="rounded-xl border border-[#E0E0E0] bg-white p-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-[#0A6B3C]" strokeWidth={2.5} />
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#1A1A1A]">
                      Every action is reversible
                    </div>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#666]">
                      {isMaya
                        ? 'Your advisor never ships or charges anything without your approval — it adjusts timing and locks in prices.'
                        : 'Protocol changes, delivery timing, and price locks are all reversible from this page.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
