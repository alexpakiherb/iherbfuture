'use client';

// Home page — the dynamic, personalized landing that morphs by persona,
// time of day, season, and recent activity. Sets the visual bar for the whole
// prototype: heavy use of the AIMoment / AgentActionCard patterns, light tints,
// pills everywhere, gradient accents.

import {
  ArrowRight,
  Sun,
  Moon,
  Cloud,
  Flame,
  Award,
  ShoppingBag,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { HealthForecastStrip } from '@/components/HealthForecastStrip';
import { AdherenceRing } from '@/components/AdherenceRing';
import { usePersona } from '@/components/PersonaProvider';
import { getForecast } from '@/data/healthForecast';

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
  const recentActions = persona.agentActions.filter((a) => a.type === 'taken').slice(0, 2);

  const avgAdherence = Math.round(
    persona.stack.reduce((s, i) => s + i.adherence30d, 0) / persona.stack.length
  );

  const TimeIcon = timeOfDay === 'morning' ? Sun : timeOfDay === 'evening' ? Moon : Cloud;

  const heroInsight = forecast.insights[0];

  // Time-aware copy below greeting
  const timeMessage =
    timeOfDay === 'morning' && persona.id === 'maya'
      ? "Here's your morning stack and what your advisor noticed overnight."
      : timeOfDay === 'morning' && persona.id === 'daniel'
        ? "HRV is trending +6 vs your baseline. Whoop says you're cleared for a higher-strain day."
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
        {/* Hero greeting band */}
        <section className="mb-6 grid grid-cols-12 gap-5">
          <div className="col-span-8 overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white">
            <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />
            <div className="px-7 py-6">
              <div className="mb-3 flex items-center gap-2 text-[#0A6B3C]">
                <TimeIcon size={16} strokeWidth={2.5} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  {timeOfDay === 'morning' ? 'Your morning' : timeOfDay === 'evening' ? 'Your evening' : 'Your afternoon'}
                </span>
              </div>
              <h1 className="text-[28px] font-bold leading-tight text-[#1A1A1A]">{greeting}</h1>
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
                  <div className="text-[13px] text-[#555]">
                    {now.length} {now.length === 1 ? 'supplement' : 'supplements'} ·{' '}
                    {timeOfDay === 'evening'
                      ? `Usually taken at ${persona.routine.eveningTime}`
                      : `Anchored to ${persona.routine.morningTime}`}
                  </div>
                </div>
                <Link
                  href="/stack"
                  className="flex items-center gap-0.5 text-[12px] font-medium text-[#1558A6] hover:underline"
                >
                  View full stack
                  <ArrowRight size={11} strokeWidth={2.5} />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {now.slice(0, 3).map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-2.5 rounded-xl border border-[#E8E8E8] bg-white p-2.5 transition-all hover:border-[#0A6B3C]"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#F1FAF3] text-[18px]">
                      💊
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

          {/* Side rail */}
          <div className="col-span-4 flex flex-col gap-4">
            <div className="rounded-2xl border border-[#FFD9C4] bg-gradient-to-br from-[#FFF7F1] to-white p-5">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-[#D14800]" strokeWidth={2.5} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#D14800]">
                  Your streak
                </span>
              </div>
              <div className="mt-1 text-[36px] font-bold leading-none text-[#1A1A1A]">
                {persona.streakDays}
              </div>
              <div className="text-[12px] text-[#666]">days of consistent dosing</div>
              <div className="mt-3 flex items-center gap-1 text-[11px] text-[#D14800]">
                <Award size={11} strokeWidth={2.5} />
                <span className="font-medium">
                  {persona.id === 'maya' ? 'Next milestone: 21 days' : 'Longevity protocol locked in'}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                  30-day adherence
                </span>
                <Link href="/stack" className="text-[11px] text-[#1558A6] hover:underline">
                  Details →
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <AdherenceRing percentage={avgAdherence} />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-[#444]">
                    {avgAdherence >= 90
                      ? "You're crushing it."
                      : avgAdherence >= 75
                        ? 'Solid consistency.'
                        : 'Room to improve.'}
                  </div>
                  <div className="mt-1 text-[11px] text-[#888]">
                    {persona.id === 'maya'
                      ? 'Most missed: Vitamin C in afternoon'
                      : 'Most missed: Quercetin (weekend gap)'}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9EADF] bg-[#F1FAF3] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                    Rewards balance
                  </div>
                  <div className="mt-1 text-[24px] font-bold text-[#1A1A1A]">
                    ${persona.rewardCredits}.00
                  </div>
                </div>
                <ShoppingBag size={28} className="text-[#0A6B3C]" strokeWidth={1.5} />
              </div>
              <div className="mt-1 text-[11.5px] text-[#666]">
                ${persona.spentThisYear} spent this year
              </div>
            </div>
          </div>
        </section>

        {/* Pending agent actions */}
        {pendingActions.length > 0 && (
          <section className="mb-6">
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <h2 className="text-[18px] font-bold text-[#1A1A1A]">Awaiting your approval</h2>
                <p className="text-[12.5px] text-[#666]">
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

        {/* Hero AI insight */}
        <section className="mb-6 grid grid-cols-12 gap-5">
          <div className="col-span-7">
            <AIMoment
              eyebrow="From your Health Forecast"
              headline={heroInsight.title}
              body={heroInsight.body}
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
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                    💊
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
          </div>
          <div className="col-span-5">
            <HealthForecastStrip days={forecast.days} city={forecast.city} state={forecast.state} />
          </div>
        </section>

        {/* Things your advisor handled */}
        <section className="mb-6">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#1A1A1A]">Things your advisor handled</h2>
              <p className="text-[12.5px] text-[#666]">
                Autonomous actions taken on your behalf · all reversible
              </p>
            </div>
            <Link href="/advisor" className="flex items-center gap-1 text-[12px] font-medium text-[#1558A6] hover:underline">
              See full audit log
              <ArrowRight size={11} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {recentActions.map((a) => (
              <AgentActionCard key={a.id} action={a} />
            ))}
          </div>
        </section>

        {/* Curated bundles */}
        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">
              {persona.id === 'maya' ? 'Curated for beginners' : 'Curated for your protocol'}
            </h2>
            <p className="text-[12.5px] text-[#666]">
              {persona.id === 'maya'
                ? 'Trusted starter stacks our wellness experts recommend most'
                : 'Picks from longevity researchers + our quality team'}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                emoji: '🌱',
                badge: persona.id === 'maya' ? 'Beginner Bundle' : 'Longevity Stack',
                title:
                  persona.id === 'maya'
                    ? 'Sleep Foundations · 3-supplement starter'
                    : 'Cellular Longevity · 5-supplement protocol',
                price: persona.id === 'maya' ? '$48' : '$184',
                save: persona.id === 'maya' ? 'Save 12%' : 'Save 18%',
              },
              {
                emoji: '🔬',
                badge: '3rd-Party Tested',
                title: 'Quality Promise picks · Gold-tier brands only',
                price: 'From $14',
                save: 'NSF & Informed Choice',
              },
              {
                emoji: '⚡',
                badge: persona.id === 'maya' ? 'Energy Boost' : 'Performance Stack',
                title:
                  persona.id === 'maya'
                    ? 'Steady energy · Without the crash'
                    : 'Z2 cardio support · Pre/intra/post stack',
                price: persona.id === 'maya' ? '$32' : '$96',
                save: '4-week supply',
              },
            ].map((card, i) => (
              <Link
                key={i}
                href="/search?q=bundle"
                className="group relative overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-[#0A6B3C] hover:shadow-[0_8px_24px_rgba(10,107,60,0.08)]"
              >
                <div className="absolute right-3 top-3 rounded-full bg-[#F1FAF3] px-2 py-0.5 text-[10px] font-bold text-[#0A6B3C]">
                  {card.badge}
                </div>
                <div className="mb-3 text-[40px]">{card.emoji}</div>
                <h3 className="text-[14px] font-semibold leading-snug text-[#1A1A1A]">{card.title}</h3>
                <div className="mt-3 flex items-end justify-between">
                  <div className="text-[18px] font-bold text-[#1A1A1A]">{card.price}</div>
                  <div className="text-[11px] font-medium text-[#D14800]">{card.save}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Connected apps + achievements */}
        <section className="mb-6 grid grid-cols-12 gap-5">
          <div className="col-span-8 rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="mb-3 flex items-center gap-2">
              <Activity size={15} className="text-[#0A6B3C]" />
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
                      ? 'border-[#C3E6CB] bg-[#F1FAF3]'
                      : 'border-dashed border-[#E0E0E0] bg-white'
                  }`}
                >
                  <div className="text-[18px]">{app.icon}</div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[12px] font-semibold text-[#1A1A1A]">{app.name}</div>
                    <div
                      className={`text-[10px] ${
                        app.status === 'connected' ? 'text-[#0A6B3C]' : 'text-[#888]'
                      }`}
                    >
                      {app.status === 'connected' ? `Synced ${app.lastSync}` : 'Connect'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-4 rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <Award size={15} className="text-[#F5A623]" />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Recent achievements
              </span>
            </div>
            <div className="space-y-2">
              {persona.achievements.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center gap-2.5">
                  <div className="text-[20px]">{a.emoji}</div>
                  <div className="flex-1">
                    <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{a.label}</div>
                    <div className="text-[10.5px] text-[#999]">Earned {a.earned}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Wellness hub editorial entry */}
        <section className="mb-6">
          <Link
            href="/wellness-hub/magnesium-guide"
            className="group flex items-center gap-5 rounded-2xl border border-[#E0E0E0] bg-white p-5 transition-all hover:border-[#0A6B3C]"
          >
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#F1FAF3] to-[#E5F8E6] text-[28px]">
              📖
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
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
