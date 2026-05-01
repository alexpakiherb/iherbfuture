'use client';

// Subscription Manager — the agentic auto-tuning moment.
// Shows iHerb's agent visibly managing deliveries, timing, and pricing.
// Maya: 2 autoship items, gentle recommendations.
// Daniel: 4 autoship items, biometric-driven adjustments, dense audit log.

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
import { usePersona } from '@/components/PersonaProvider';

// Emoji icons per product category — mirrors stack page pattern
function productEmoji(category: string): string {
  const map: Record<string, string> = {
    Vitamins: '☀️',
    Minerals: '💊',
    Sports: '⚡',
    Longevity: '🧬',
    Omega: '🐟',
    Adaptogens: '🌿',
    Protein: '🥩',
  };
  return map[category] ?? '💊';
}

// Frequency label helper
function freqLabel(days: number): string {
  if (days === 30) return 'Every 30 days';
  if (days === 45) return 'Every 45 days';
  if (days === 60) return 'Every 60 days';
  return `Every ${days} days`;
}

export default function SubscriptionsPage() {
  const { persona } = usePersona();
  const isMaya = persona.id === 'maya';

  const autoshipItems = persona.stack.filter((s) => s.autoship);

  // Per-card action state
  const [skipped, setSkipped] = useState<Record<string, boolean>>({});
  const [paused, setPaused] = useState<Record<string, boolean>>({});

  // Automation rules state (mirroring advisor page pattern)
  const [rules, setRules] = useState([
    { id: 'pause-overstock', rule: 'Pause autoship if I\'m overstocked', detail: 'Pauses when 21+ days of supply remain on hand', on: true },
    { id: 'lock-price', rule: 'Lock in prices when promos hit', detail: 'Applies to all active autoship items automatically', on: true },
    { id: 'optimize-timing', rule: 'Auto-optimize delivery timing', detail: 'Adjusts dates based on your actual usage pace', on: true },
    {
      id: 'biometric-dose',
      rule: 'Adjust dose based on biometric data',
      detail: isMaya ? 'Apple Health only — sleep and activity trends' : 'Whoop, Oura, CGM · full protocol adjustments',
      on: isMaya ? false : true,
    },
    { id: 'bundle-detect', rule: 'Smart bundle detection', detail: 'Auto-applies bundle discounts when your stack qualifies', on: true },
  ]);

  const toggleRule = (id: string) =>
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));

  // Relevant agent actions: subscription, inventory, price categories
  const agentSideActions = persona.agentActions.filter(
    (a) => a.category === 'subscription' || a.category === 'inventory' || a.category === 'price'
  );

  // Stats row
  const activeCount = autoshipItems.length;
  const savedThisYear = isMaya ? '$23.39' : '$187.40';
  const nextDelivery = autoshipItems
    .filter((s) => s.nextDelivery)
    .sort()[0]?.nextDelivery ?? 'May 10';
  const pausedCount = Object.values(paused).filter(Boolean).length;

  // AI summary bullets per persona
  const aiSummaryBullets = isMaya
    ? [
        'Moved your Magnesium Glycinate delivery 3 days later — you still had 17 days of stock.',
        'Locked in a 20% promo price on Vitamin D3 before it expired — saved $4.40.',
        'Added a spring-season reminder: UV index suggests your D3 dose can be reduced through summer.',
      ]
    : [
        'Locked in Thorne EPA/DHA at current pricing before June 1 increase — saved $11.97 across 3 deliveries.',
        'Paused LMNT electrolytes — you added 4 boxes at the gym. Will resume when inventory drops below 14 days.',
        'Bumped Creatine to 6g for 14 days based on Whoop strain average of 16.2. Will revert automatically.',
        'Bundled NMN + Quercetin + Resveratrol into Longevity Stack — saved 18% ($31.20/month).',
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
          <h1 className="text-[26px] font-bold text-[#1A1A1A]">
            Auto-tuned by your advisor
          </h1>
          <p className="mt-1 text-[13.5px] text-[#666]">
            {isMaya
              ? 'Your advisor watches your usage patterns and adjusts deliveries so you never run out — or end up with too much.'
              : 'Deliveries optimized in real time from Whoop strain, Oura usage trends, and price intelligence. Every change is logged and reversible.'}
          </p>
        </div>

        {/* ── Top stat row ─────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="flex items-center gap-2 mb-1">
              <Package size={14} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Active
              </span>
            </div>
            <div className="text-[32px] font-bold text-[#1A1A1A]">{activeCount}</div>
            <div className="text-[12px] text-[#666]">autoship subscriptions</div>
          </div>

          <div className="rounded-2xl border border-[#D9EADF] bg-gradient-to-br from-[#F1FAF3] to-white p-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={14} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                Saved
              </span>
            </div>
            <div className="text-[32px] font-bold text-[#1A1A1A]">{savedThisYear}</div>
            <div className="text-[12px] text-[#666]">via auto-tuning this year</div>
          </div>

          <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="flex items-center gap-2 mb-1">
              <Calendar size={14} className="text-[#1558A6]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Next delivery
              </span>
            </div>
            <div className="text-[16px] font-bold text-[#1A1A1A]">{nextDelivery}</div>
            <div className="text-[12px] text-[#666]">
              {isMaya ? '2 items in this box' : '4 items in this box'}
            </div>
          </div>

          <div className={`rounded-2xl border p-5 ${pausedCount > 0 ? 'border-[#E0E0E0] bg-white' : 'border-[#E0E0E0] bg-white'}`}>
            <div className="flex items-center gap-2 mb-1">
              <PauseCircle size={14} className="text-[#888]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Paused
              </span>
            </div>
            <div className="text-[32px] font-bold text-[#1A1A1A]">
              {isMaya ? pausedCount : pausedCount + 1}
            </div>
            <div className="text-[12px] text-[#666]">
              {isMaya
                ? pausedCount === 0
                  ? 'Nothing paused right now'
                  : 'by you or your advisor'
                : 'LMNT paused — overstocked'}
            </div>
          </div>
        </div>

        {/* ── AIMoment: recently optimized ─────────────────────────── */}
        <section className="mb-6">
          <AIMoment
            eyebrow="Recently optimized"
            headline="I made these adjustments this month"
            body={
              isMaya
                ? "Here's what changed in your subscriptions since your last delivery — all designed to keep your routine running without gaps or waste."
                : "Autonomous adjustments based on your biometric data, inventory signals, and price intelligence. Full audit log below."
            }
            footerLabel="Powered by iHerb Wellness Hub · all actions reversible"
            footerRight={
              <Link
                href="/advisor"
                className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
              >
                View full audit log
                <ArrowRight size={10} strokeWidth={2.5} />
              </Link>
            }
          >
            <ul className="mt-1 space-y-2">
              {aiSummaryBullets.map((bullet, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-[#0A6B3C]/10">
                    <Sparkles size={9} className="text-[#0A6B3C]" strokeWidth={3} />
                  </div>
                  <span className="text-[13px] leading-relaxed text-[#444]">{bullet}</span>
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
                      {/* Product image */}
                      <div className="flex-shrink-0">
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-xl border border-[#E8E8E8] bg-[#FAFBFA] text-[28px]">
                          {productEmoji(item.category)}
                          {item.autoshipNote && (
                            <div className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#0A6B3C]">
                              <Sparkles size={9} className="text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product info */}
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

                        {/* Status pills row */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                          {item.nextDelivery && !isPaused && !isSkipped && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F1FAF3] px-2.5 py-1 text-[10.5px] font-semibold text-[#0A6B3C] border border-[#C3E6CB]">
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
                              Next delivery skipped
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF1FB] px-2.5 py-1 text-[10.5px] font-semibold text-[#1558A6] border border-[#B6CFEC]">
                            {freqLabel(isMaya ? 30 : item.productId === 'thorne-creatine' ? 30 : 45)}
                          </span>
                          {item.autoshipNote && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#0A6B3C] px-2.5 py-1 text-[10.5px] font-semibold text-white">
                              <Sparkles size={9} strokeWidth={3} />
                              Auto-tuned
                            </span>
                          )}
                        </div>

                        {/* Auto-tune note */}
                        {item.autoshipNote && (
                          <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-[#F1FAF3] border border-[#D9EADF] px-3 py-2">
                            <Sparkles size={10} className="text-[#0A6B3C] mt-0.5 flex-shrink-0" strokeWidth={3} />
                            <span className="text-[11.5px] text-[#444] leading-snug">
                              {item.autoshipNote}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Adherence ring */}
                      <div className="flex-shrink-0">
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
                      </div>
                    </div>

                    {/* Action buttons */}
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
                      <button className="flex items-center gap-1.5 rounded-full border border-[#D0D0D0] px-3 py-1.5 text-[12px] font-semibold text-[#666] hover:border-[#999] hover:text-[#333] transition-all">
                        <RefreshCw size={11} strokeWidth={2.5} />
                        Adjust frequency
                      </button>
                      <button className="flex items-center gap-1.5 rounded-full border border-[#D0D0D0] px-3 py-1.5 text-[12px] font-semibold text-[#666] hover:border-[#999] hover:text-[#333] transition-all">
                        <Settings2 size={11} strokeWidth={2.5} />
                        Replace
                      </button>

                      {/* Audit log — only for items that have agent history */}
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
                            Price locked 3 deliveries · April 26
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

            {/* ── Automation rules ──────────────────────────────────── */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                    Automation rules
                  </div>
                  <p className="mt-0.5 text-[12.5px] text-[#666]">
                    Things your advisor handles automatically — toggle to customize
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
                    className="flex items-center justify-between rounded-lg border border-[#F0F0F0] px-3 py-2.5 transition-all hover:border-[#D9EADF] hover:bg-[#FAFBFA]"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{r.rule}</div>
                      <div className="text-[11px] text-[#888]">{r.detail}</div>
                    </div>
                    <button
                      onClick={() => toggleRule(r.id)}
                      className={`relative h-5 w-9 flex-shrink-0 rounded-full transition-colors ${
                        r.on ? 'bg-[#0A6B3C]' : 'bg-[#E0E0E0]'
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

          {/* ── RIGHT: Agent action queue ─────────────────────────── */}
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

              {/* Savings summary card */}
              <div className="rounded-2xl border border-[#D9EADF] bg-[#F1FAF3] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={14} className="text-[#0A6B3C]" strokeWidth={2.5} />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                    Advisor savings
                  </span>
                </div>
                <div className="text-[28px] font-bold text-[#1A1A1A]">{savedThisYear}</div>
                <div className="text-[11.5px] text-[#666] mb-3">saved via auto-tuning in 2026</div>
                <div className="space-y-1.5">
                  {isMaya ? (
                    <>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#666]">Price lock on D3</span>
                        <span className="font-bold text-[#0A6B3C]">$4.40</span>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#666]">Avoided duplicate delivery</span>
                        <span className="font-bold text-[#0A6B3C]">$18.99</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#666]">EPA/DHA price lock</span>
                        <span className="font-bold text-[#0A6B3C]">$11.97</span>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#666]">Longevity bundle</span>
                        <span className="font-bold text-[#0A6B3C]">$31.20/mo</span>
                      </div>
                      <div className="flex items-center justify-between text-[11.5px]">
                        <span className="text-[#666]">LMNT pause savings</span>
                        <span className="font-bold text-[#0A6B3C]">est. $24</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Trust signal */}
              <div className="rounded-xl border border-[#E0E0E0] bg-white p-4">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#0A6B3C] mt-0.5 flex-shrink-0" strokeWidth={2.5} />
                  <div>
                    <div className="text-[12.5px] font-semibold text-[#1A1A1A]">
                      Every action is reversible
                    </div>
                    <p className="mt-0.5 text-[11.5px] leading-relaxed text-[#666]">
                      {isMaya
                        ? 'Your advisor never ships anything or spends money without your approval — it only adjusts timing and locks in prices.'
                        : 'Protocol changes, delivery timing, and price locks are all reversible from this page or via your advisor.'}
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
