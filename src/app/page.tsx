'use client';

// Home page — bento-grid personalized landing that morphs by persona,
// time of day, season, and recent activity. Sets the visual bar for the whole
// prototype: varied tile sizes, color zones per category, sparklines on every
// metric, real product imagery, AIMoment / AgentActionCard reusable patterns.

import {
  ArrowRight,
  Sun,
  Moon,
  Cloud,
  Flame,
  Award,
  ShoppingBag,
  Activity,
  Sparkles,
  TrendingUp,
  CalendarDays,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { HealthForecastStrip } from '@/components/HealthForecastStrip';
import { AdherenceRing } from '@/components/AdherenceRing';
import { BundleCollage } from '@/components/BundleCollage';
import { Sparkline } from '@/components/Sparkline';
import { StreakHeatmap } from '@/components/StreakHeatmap';
import { usePersona } from '@/components/PersonaProvider';
import { getForecast } from '@/data/healthForecast';

// Mock 30-day adherence trend (used for sparklines on home stats).
const ADHERENCE_TREND_MAYA = [62, 68, 71, 70, 74, 78, 75, 80, 82, 79, 84, 86, 83, 87, 85, 88, 90, 88, 92, 91, 90, 94, 92, 93, 95, 94, 96, 95, 97, 98];
const ADHERENCE_TREND_DANIEL = [88, 90, 91, 89, 93, 94, 92, 95, 94, 96, 97, 95, 96, 98, 97, 96, 98, 97, 99, 98, 99, 100, 99, 100, 99, 100, 100, 99, 100, 100];

// Mock 30-day "savings" trend
const SAVINGS_TREND_MAYA = [0, 2, 4, 5, 8, 12, 15, 18, 18, 19, 22, 23, 23, 25, 28, 32, 35, 35, 38, 42, 44, 47, 50, 52, 55, 58, 62, 65, 68, 71];
const SAVINGS_TREND_DANIEL = [12, 25, 38, 47, 62, 75, 88, 95, 105, 118, 130, 138, 150, 165, 178, 188, 195, 210, 225, 238, 250, 265, 278, 292, 305, 318, 330, 342, 355, 368];

export default function TodayPage() {
  const { persona, timeOfDay, greeting } = usePersona();
  const forecast = getForecast(persona.id);

  // Filter stack by current time of day
  const now = persona.stack.filter((s) => {
    if (timeOfDay === 'morning') return s.timeOfDay === 'morning' || s.timeOfDay === 'pre-workout';
    if (timeOfDay === 'evening') return s.timeOfDay === 'evening';
    return s.timeOfDay === 'midday' || s.timeOfDay === 'morning';
  });

  const pendingActions = persona.agentActions.filter((a) => a.type === 'pending');
  const recentActions = persona.agentActions.filter((a) => a.type === 'taken').slice(0, 3);

  const avgAdherence = Math.round(
    persona.stack.reduce((s, i) => s + i.adherence30d, 0) / persona.stack.length
  );

  const TimeIcon = timeOfDay === 'morning' ? Sun : timeOfDay === 'evening' ? Moon : Cloud;

  const heroInsight = forecast.insights[0];

  const adherenceTrend = persona.id === 'maya' ? ADHERENCE_TREND_MAYA : ADHERENCE_TREND_DANIEL;
  const savingsTrend = persona.id === 'maya' ? SAVINGS_TREND_MAYA : SAVINGS_TREND_DANIEL;

  // Time-aware copy below greeting
  const timeMessage =
    timeOfDay === 'morning' && persona.id === 'maya'
      ? "Here's your morning stack and what your advisor noticed overnight."
      : timeOfDay === 'morning' && persona.id === 'daniel'
        ? 'HRV is trending +6 vs your baseline. Whoop says you\'re cleared for a higher-strain day.'
        : timeOfDay === 'afternoon' && persona.id === 'maya'
          ? 'Halfway through the day — keep your hydration and energy steady.'
          : timeOfDay === 'afternoon' && persona.id === 'daniel'
            ? 'Strain target on track. Your advisor moved the LMNT into your pre-workout window.'
            : timeOfDay === 'evening' && persona.id === 'maya'
              ? 'Time to wind down. Magnesium glycinate goes 30 minutes before bed.'
              : 'Wind-down stack ready. Glycine + magnesium queued. Ashwagandha on board for cortisol.';

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">

        {/* ─── ROW 1: Hero greeting (8) + Streak heatmap tile (4) ────────── */}
        <section className="mb-4 grid grid-cols-12 gap-4">
          {/* Greeting + now-stack — large tile, 8 cols */}
          <div className="col-span-8 overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white">
            <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />
            <div className="px-7 pt-6 pb-5">
              <div className="mb-3 flex items-center gap-2 text-[#0A6B3C]">
                <TimeIcon size={16} strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {timeOfDay === 'morning' ? 'Your morning' : timeOfDay === 'evening' ? 'Your evening' : 'Your afternoon'}
                </span>
              </div>
              <h1 className="text-[30px] font-bold leading-tight text-[#1A1A1A]">{greeting}</h1>
              <p className="mt-1.5 text-[14px] text-[#555]">{timeMessage}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {persona.contextHints.slice(0, persona.id === 'daniel' ? 4 : 3).map((hint) => (
                  <ContextPill
                    key={hint}
                    label={hint}
                    variant={
                      hint.toLowerCase().includes('whoop') ||
                      hint.toLowerCase().includes('hrv') ||
                      hint.toLowerCase().includes('oura') ||
                      hint.toLowerCase().includes('z2')
                        ? 'data'
                        : 'default'
                    }
                  />
                ))}
              </div>
            </div>

            <div className="border-t border-[#F0F0F0] bg-[#FAFBFA] px-7 py-4">
              <div className="mb-3 flex items-baseline justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                    {timeOfDay === 'morning' ? 'Morning stack' : timeOfDay === 'evening' ? 'Evening stack' : 'Now in your routine'}
                  </div>
                  <div className="text-[12.5px] text-[#555]">
                    {now.length} {now.length === 1 ? 'supplement' : 'supplements'} · {timeOfDay === 'evening'
                      ? `Anchored to ${persona.routine.eveningTime}`
                      : `Anchored to ${persona.routine.morningTime}`}
                  </div>
                </div>
                <Link
                  href="/stack"
                  className="flex items-center gap-0.5 text-[12px] font-medium text-[#1558A6] hover:underline"
                >
                  Full stack
                  <ArrowRight size={11} strokeWidth={2.5} />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {now.slice(0, 3).map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-2.5 rounded-xl border border-[#E8E8E8] bg-white p-2.5 transition-all hover:border-[#0A6B3C]"
                  >
                    <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white">
                      <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain" loading="lazy" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[10.5px] font-bold uppercase tracking-wide text-[#0A6B3C]">
                        {item.brand}
                      </div>
                      <div className="truncate text-[12px] font-semibold text-[#1A1A1A]">
                        {item.name.replace(/—.*$/, '').trim()}
                      </div>
                      <div className="text-[10.5px] text-[#666]">
                        {item.dose} · {item.reasonShort}
                      </div>
                    </div>
                  </div>
                ))}
                {now.length === 0 && (
                  <div className="col-span-3 text-center text-[12px] italic text-[#999]">
                    No supplements scheduled for this part of the day.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Streak hero tile — 4 cols, coral accent, with calendar heatmap */}
          <div className="col-span-4 overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-6">
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70">
                <Flame size={14} className="text-[#FF6B4A]" strokeWidth={2.5} />
              </div>
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#D14800]">
                {persona.id === 'maya' ? 'Your streak' : 'Long-term streak'}
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-[44px] font-bold leading-none text-[#1A1A1A]">{persona.streakDays}</span>
              <span className="text-[13px] font-semibold text-[#D14800]">days</span>
            </div>
            <div className="mt-1 text-[11.5px] text-[#7B4022]">
              consistent dosing · {persona.id === 'maya' ? 'next milestone 21' : '180+ achieved'}
            </div>

            {/* 30-day heatmap */}
            <div className="mt-4">
              <div className="mb-1.5 text-[9.5px] font-bold uppercase tracking-widest text-[#7B4022]">
                Last 30 days
              </div>
              <StreakHeatmap color="#FF6B4A" emptyColor="#FFE0D0" size={11} gap={3} />
            </div>
          </div>
        </section>

        {/* ─── ROW 2: 4-tile bento (forecast 6 + 3 small tiles 2+2+2) ────── */}
        <section className="mb-4 grid grid-cols-12 gap-4">
          {/* Forecast strip — 6 cols */}
          <div className="col-span-6">
            <HealthForecastStrip days={forecast.days} city={forecast.city} state={forecast.state} />
          </div>

          {/* Adherence with sparkline — 3 cols */}
          <Link
            href="/stack"
            className="col-span-3 group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#C3E6CB] bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#DDF0E1] p-5 transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(10,107,60,0.08)]"
          >
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <TrendingUp size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                  30-day adherence
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <AdherenceRing percentage={avgAdherence} size={56} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[10.5px] font-medium text-[#1F5034]">
                {avgAdherence >= 90 ? 'Crushing it.' : avgAdherence >= 75 ? 'Solid.' : 'Room to grow.'}
              </div>
              <div className="mt-1.5">
                <Sparkline values={adherenceTrend} color="#0A6B3C" width={120} height={20} />
              </div>
            </div>
          </Link>

          {/* Rewards / spend mini-tile — 3 cols, teal */}
          <div className="col-span-3 flex flex-col justify-between overflow-hidden rounded-2xl border border-[#A7DDDC] bg-gradient-to-br from-[#E5F6F5] via-[#D4EFEE] to-[#BFE6E4] p-5">
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <ShoppingBag size={13} className="text-[#0E9594]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E9594]">
                  Rewards balance
                </span>
              </div>
              <div className="text-[28px] font-bold leading-none text-[#0A4A4A]">${persona.rewardCredits}.00</div>
              <div className="mt-1 text-[10.5px] text-[#1F6E6D]">
                ${persona.spentThisYear} spent in 2026
              </div>
            </div>
            <div className="mt-3">
              <div className="text-[9.5px] font-bold uppercase tracking-widest text-[#1F6E6D]">
                Saved by advisor
              </div>
              <Sparkline values={savingsTrend} color="#0E9594" width={120} height={20} />
            </div>
          </div>
        </section>

        {/* ─── ROW 3: Pending agent actions ──────────────────────────────── */}
        {pendingActions.length > 0 && (
          <section className="mb-4">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#1A1A1A]">Awaiting your approval</h2>
                <p className="text-[12px] text-[#666]">
                  {pendingActions.length} {pendingActions.length === 1 ? 'recommendation' : 'recommendations'} from your advisor
                </p>
              </div>
              <Link href="/advisor" className="flex items-center gap-1 text-[12px] font-medium text-[#1558A6] hover:underline">
                Open advisor
                <ArrowRight size={11} strokeWidth={2.5} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pendingActions.slice(0, 2).map((a) => (
                <AgentActionCard key={a.id} action={a} />
              ))}
            </div>
          </section>
        )}

        {/* ─── ROW 4: AIMoment from forecast (full width) ─────────────────── */}
        <section className="mb-4">
          <AIMoment
            eyebrow="From your Health Forecast"
            headline={heroInsight.title}
            footerLabel={`Powered by iHerb Wellness Hub · ${forecast.city}, ${forecast.state}`}
            footerRight={
              <Link
                href="/forecast"
                className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
              >
                {heroInsight.ctaLabel}
                <ArrowRight size={10} strokeWidth={2.5} />
              </Link>
            }
          >
            {heroInsight.productSuggestion && (
              <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] bg-[#FAFBFA] p-3">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                  {heroInsight.productSuggestion.imageUrl ? (
                    <img
                      src={heroInsight.productSuggestion.imageUrl}
                      alt={heroInsight.productSuggestion.name}
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <span className="text-[20px]">💊</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-[#1A1A1A]">
                    {heroInsight.productSuggestion.name}
                  </div>
                  <div className="text-[11.5px] text-[#666]">
                    {heroInsight.productSuggestion.reason}
                  </div>
                </div>
                <button className="rounded-full bg-[#0A6B3C] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#085131]">
                  Add to cart
                </button>
              </div>
            )}
          </AIMoment>
        </section>

        {/* ─── ROW 5: Things your advisor handled (3-up bento) ───────────── */}
        <section className="mb-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#1A1A1A]">Things your advisor handled</h2>
              <p className="text-[12px] text-[#666]">
                Autonomous actions on your behalf · all reversible
              </p>
            </div>
            <Link href="/advisor" className="flex items-center gap-1 text-[12px] font-medium text-[#1558A6] hover:underline">
              Full audit log
              <ArrowRight size={11} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {recentActions.map((a) => (
              <AgentActionCard key={a.id} action={a} compact />
            ))}
          </div>
        </section>

        {/* ─── ROW 6: Curated bundles (3-up collages) ────────────────────── */}
        <section className="mb-4">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#1A1A1A]">
                {persona.id === 'maya' ? 'Curated for beginners' : 'Curated for your protocol'}
              </h2>
              <p className="text-[12px] text-[#666]">
                {persona.id === 'maya'
                  ? 'Trusted starter stacks our wellness experts recommend most'
                  : 'Picks from longevity researchers + our quality team'}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {(persona.id === 'maya'
              ? [
                  {
                    badge: 'Beginner Bundle',
                    title: 'Sleep Foundations · 3-supplement starter',
                    price: '$48',
                    save: 'Save 12%',
                    tint: 'green' as const,
                    images: [
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01066/u/159.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00932/u/298.jpg',
                    ] as [string, string, string],
                  },
                  {
                    badge: '3rd-Party Tested',
                    title: 'Quality Promise picks · Gold-tier brands only',
                    price: 'From $14',
                    save: 'NSF & Informed Choice',
                    tint: 'blue' as const,
                    images: [
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01330/u/350.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex25359/u/8.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/sre/sre09180/u/8.jpg',
                    ] as [string, string, string],
                  },
                  {
                    badge: 'Energy Boost',
                    title: 'Steady energy · Without the crash',
                    price: '$32',
                    save: '4-week supply',
                    tint: 'orange' as const,
                    images: [
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex45706/u/94.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/jar/jar05079/u/36.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01300/u/82.jpg',
                    ] as [string, string, string],
                  },
                ]
              : [
                  {
                    badge: 'Longevity Stack',
                    title: 'Cellular Longevity · 5-supplement protocol',
                    price: '$184',
                    save: 'Save 18%',
                    tint: 'green' as const,
                    images: [
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23443/u/24.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23023/u/66.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00934/u/221.jpg',
                    ] as [string, string, string],
                  },
                  {
                    badge: '3rd-Party Tested',
                    title: 'Quality Promise picks · Gold-tier brands only',
                    price: 'From $14',
                    save: 'NSF & Informed Choice',
                    tint: 'blue' as const,
                    images: [
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00644/u/96.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00690/u/50.jpg',
                    ] as [string, string, string],
                  },
                  {
                    badge: 'Performance Stack',
                    title: 'Z2 cardio support · Pre/intra/post stack',
                    price: '$96',
                    save: '4-week supply',
                    tint: 'orange' as const,
                    images: [
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nuu/nuu02050/u/30.jpg',
                      'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr01311/u/96.jpg',
                    ] as [string, string, string],
                  },
                ]
            ).map((card, i) => (
              <Link
                key={i}
                href="/search?q=bundle"
                className="group relative overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white transition-all hover:-translate-y-0.5 hover:border-[#0A6B3C] hover:shadow-[0_8px_24px_rgba(10,107,60,0.08)]"
              >
                <div className="absolute right-3 top-3 z-20 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#0A6B3C] backdrop-blur">
                  {card.badge}
                </div>
                <BundleCollage images={card.images} alt={card.title} tint={card.tint} size="md" />
                <div className="p-4">
                  <h3 className="text-[14px] font-semibold leading-snug text-[#1A1A1A]">{card.title}</h3>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="text-[18px] font-bold text-[#1A1A1A]">{card.price}</div>
                    <div className="text-[11px] font-medium text-[#D14800]">{card.save}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ─── ROW 7: Bento — Connected apps (8) + Achievements (4) ──────── */}
        <section className="mb-4 grid grid-cols-12 gap-4">
          <div className="col-span-8 overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Activity size={15} className="text-[#0E9594]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Connected to your day
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {persona.connectedApps.map((app) => (
                <div
                  key={app.name}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 ${
                    app.status === 'connected'
                      ? 'border-[#A7DDDC] bg-[#E5F6F5]'
                      : 'border-dashed border-[#E0E0E0] bg-white'
                  }`}
                >
                  <div className="text-[18px]">{app.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-[#1A1A1A]">{app.name}</div>
                    <div className={`text-[10px] ${app.status === 'connected' ? 'text-[#0E9594]' : 'text-[#888]'}`}>
                      {app.status === 'connected' ? `Synced ${app.lastSync}` : 'Connect'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-[#F4F0FB] via-[#EDE6F8] to-[#E2D9F4] p-5">
            <div className="mb-3 flex items-center gap-2">
              <Award size={15} className="text-[#6B4FBC]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                Recent achievements
              </span>
            </div>
            <div className="space-y-2">
              {persona.achievements.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-2.5 rounded-lg bg-white/70 px-2.5 py-1.5 backdrop-blur">
                  <div className="text-[20px]">{a.emoji}</div>
                  <div className="flex-1">
                    <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{a.label}</div>
                    <div className="text-[10.5px] text-[#6B4FBC]">Earned {a.earned}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── ROW 8: Wellness Hub editorial entry ───────────────────────── */}
        <section className="mb-6">
          <Link
            href="/wellness-hub/magnesium-guide"
            className="group flex items-center gap-5 overflow-hidden rounded-2xl border border-[#D9EADF] bg-gradient-to-r from-white via-white to-[#F1FAF3] p-5 transition-all hover:border-[#0A6B3C]"
          >
            <div className="relative flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#DDF0E1] p-2">
              <img
                src="https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg"
                alt=""
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <Sparkles size={11} className="text-[#0A6B3C]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                  Wellness Hub · Recommended for you
                </span>
                <span className="rounded-full bg-[#FFF7F1] px-2 py-0.5 text-[9.5px] font-bold uppercase text-[#D14800]">
                  6 min read
                </span>
              </div>
              <h3 className="text-[16px] font-bold text-[#1A1A1A] group-hover:text-[#0A6B3C]">
                {persona.id === 'maya'
                  ? 'The Magnesium Guide: Glycinate vs Citrate vs Malate'
                  : 'Magnesium Forms & Cognitive Performance: What the Research Says'}
              </h3>
              <p className="mt-1 text-[12.5px] text-[#666]">
                {persona.id === 'maya'
                  ? 'Why your advisor recommended glycinate for sleep — and when to consider switching forms.'
                  : 'Threonate, taurate, and glycinate — when to use each, and what your sleep data should tell you.'}
              </p>
            </div>
            <ArrowRight size={20} className="text-[#999] group-hover:text-[#0A6B3C]" />
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
