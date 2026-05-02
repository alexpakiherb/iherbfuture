'use client';

// Daily Stack — bento layout with varied tile sizes for streak/adherence/
// delivery/achievements, then time-of-day grouped supplement timeline.
// Per-supplement sparkline thumb shows that item's 30-day adherence trend.

import { useState } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Dumbbell,
  CheckCircle2,
  Plus,
  Flame,
  Award,
  Calendar,
  TrendingUp,
  Sparkles,
  Package,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { AdherenceRing } from '@/components/AdherenceRing';
import { Sparkline } from '@/components/Sparkline';
import { StreakHeatmap } from '@/components/StreakHeatmap';
import { usePersona } from '@/components/PersonaProvider';
import { StackItem } from '@/data/personas';

const TIME_GROUPS: { key: StackItem['timeOfDay']; label: string; icon: typeof Sun; description: string; color: string; bg: string; border: string }[] = [
  { key: 'morning',      label: 'Morning',      icon: Sunrise,  description: 'With breakfast or first thing',     color: '#FF6B4A', bg: '#FFF1E8', border: '#FFC7B0' },
  { key: 'pre-workout',  label: 'Pre-workout',  icon: Dumbbell, description: '20–30 min before training',          color: '#0E9594', bg: '#E5F6F5', border: '#A7DDDC' },
  { key: 'midday',       label: 'Midday',       icon: Sun,      description: 'With lunch',                          color: '#F5A623', bg: '#FFF7E5', border: '#F5D78A' },
  { key: 'post-workout', label: 'Post-workout', icon: Dumbbell, description: 'Within 30 min of training',           color: '#1558A6', bg: '#EAF1FB', border: '#B6CFEC' },
  { key: 'evening',      label: 'Evening',      icon: Moon,     description: '30 min before bed',                   color: '#6B4FBC', bg: '#F4F0FB', border: '#D6C8F0' },
];

// Mock 30-day adherence trends per item (slightly varied per supplement).
function trendFor(adherence: number): number[] {
  const series: number[] = [];
  let v = Math.max(40, adherence - 25);
  for (let i = 0; i < 30; i++) {
    const drift = (Math.sin(i * 0.6) * 6) + (i * (adherence - v) / 30) * 0.7;
    v = Math.max(35, Math.min(100, v + drift * 0.4));
    series.push(Math.round(v));
  }
  series[29] = adherence;
  return series;
}

const ADHERENCE_TREND_MAYA = [62, 68, 71, 70, 74, 78, 75, 80, 82, 79, 84, 86, 83, 87, 85, 88, 90, 88, 92, 91, 90, 94, 92, 93, 95, 94, 96, 95, 97, 98];
const ADHERENCE_TREND_DANIEL = [88, 90, 91, 89, 93, 94, 92, 95, 94, 96, 97, 95, 96, 98, 97, 96, 98, 97, 99, 98, 99, 100, 99, 100, 99, 100, 100, 99, 100, 100];

export default function StackPage() {
  const { persona } = usePersona();
  const [taken, setTaken] = useState<Record<string, boolean>>({});

  const toggleTaken = (id: string) =>
    setTaken((prev) => ({ ...prev, [id]: !prev[id] }));

  const grouped = TIME_GROUPS.map((g) => ({
    ...g,
    items: persona.stack.filter((s) => s.timeOfDay === g.key),
  })).filter((g) => g.items.length > 0);

  const totalCount = persona.stack.length;
  const takenCount = persona.stack.filter((s) => taken[s.productId]).length;
  const progress = Math.round((takenCount / totalCount) * 100);

  const avgAdherence = Math.round(
    persona.stack.reduce((s, i) => s + i.adherence30d, 0) / persona.stack.length
  );

  const adherenceTrend = persona.id === 'maya' ? ADHERENCE_TREND_MAYA : ADHERENCE_TREND_DANIEL;

  // Earliest upcoming delivery date among autoship items.
  const nextDelivery = persona.stack
    .filter((s) => s.autoship && s.nextDelivery)
    .sort((a, b) => (a.nextDelivery ?? '').localeCompare(b.nextDelivery ?? ''))[0]?.nextDelivery ?? 'May 10';

  const autoshipItems = persona.stack.filter((s) => s.autoship);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[#0A6B3C]">
              <Sparkles size={13} strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest">
                Your Daily Stack
              </span>
            </div>
            <h1 className="text-[28px] font-bold text-[#1A1A1A]">
              {persona.firstName}&rsquo;s routine · {persona.stackSize} supplements
            </h1>
            <p className="mt-1 text-[13.5px] text-[#666]">
              Anchored to your {persona.routine.morningTime} morning and {persona.routine.eveningTime} evening windows.
            </p>
          </div>
          <button className="flex items-center gap-1.5 rounded-full bg-[#0A6B3C] px-4 py-2 text-[13px] font-bold text-white shadow-sm transition-all hover:bg-[#085131] active:scale-[0.98]">
            <Plus size={14} strokeWidth={2.5} />
            Add to stack
          </button>
        </div>

        {/* ── Bento stat row: 5 (streak) + 4 (adherence) + 3 (rail) ────── */}
        <section className="mb-5 grid grid-cols-12 gap-4">
          {/* Streak — coral, with heatmap */}
          <div className="col-span-5 overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/70">
                    <Flame size={14} className="text-[#FF6B4A]" strokeWidth={2.5} />
                  </div>
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#D14800]">
                    {persona.id === 'maya' ? 'Streak' : 'Long-term streak'}
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-[52px] font-bold leading-none text-[#1A1A1A]">{persona.streakDays}</span>
                  <span className="text-[14px] font-semibold text-[#D14800]">days consistent</span>
                </div>
                <div className="mt-1 text-[11.5px] text-[#7B4022]">
                  {persona.id === 'maya' ? 'next milestone: 21 days' : '180+ achieved · top 3% of users'}
                </div>
              </div>
              <div>
                <div className="mb-1.5 text-right text-[9.5px] font-bold uppercase tracking-widest text-[#7B4022]">
                  Last 30 days
                </div>
                <StreakHeatmap color="#FF6B4A" emptyColor="#FFE0D0" size={11} gap={3} />
              </div>
            </div>
          </div>

          {/* Adherence — green, with ring + sparkline */}
          <div className="col-span-4 overflow-hidden rounded-2xl border border-[#C3E6CB] bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#DDF0E1] p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                30-day adherence
              </span>
            </div>
            <div className="flex items-center gap-4">
              <AdherenceRing percentage={avgAdherence} size={68} color={avgAdherence >= 90 ? '#0A6B3C' : '#79A83C'} />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-medium text-[#1F5034]">
                  {avgAdherence >= 90 ? 'Crushing it.' : avgAdherence >= 75 ? 'Solid consistency.' : 'Room to grow.'}
                </div>
                <div className="mt-0.5 text-[11px] text-[#3A6E4E]">
                  average across stack
                </div>
                <div className="mt-2">
                  <Sparkline values={adherenceTrend} color="#0A6B3C" width={140} height={22} />
                </div>
              </div>
            </div>
            {avgAdherence >= 90 && (
              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-0.5 text-[10.5px] font-bold text-[#0A6B3C]">
                <TrendingUp size={10} strokeWidth={2.5} />
                +6% MoM
              </div>
            )}
          </div>

          {/* Right rail: 2 small tiles stacked */}
          <div className="col-span-3 flex flex-col gap-4">
            {/* Next delivery — teal */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-[#A7DDDC] bg-gradient-to-br from-[#E5F6F5] via-[#D4EFEE] to-[#BFE6E4] p-4">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Calendar size={12} className="text-[#0E9594]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E9594]">
                  Next delivery
                </span>
              </div>
              <div className="text-[24px] font-bold leading-none text-[#0A4A4A]">{nextDelivery}</div>
              <div className="mt-1 text-[10.5px] text-[#1F6E6D]">
                {autoshipItems.length} {autoshipItems.length === 1 ? 'item' : 'items'} in box · {persona.id === 'maya' ? '1 paused by AI' : 'auto-tuned'}
              </div>
            </div>

            {/* Earned — purple */}
            <div className="flex-1 overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-[#F4F0FB] via-[#EDE6F8] to-[#E2D9F4] p-4">
              <div className="mb-1.5 flex items-center gap-1.5">
                <Award size={12} className="text-[#6B4FBC]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                  Earned
                </span>
              </div>
              <div className="text-[24px] font-bold leading-none text-[#3A2680]">{persona.achievements.length}</div>
              <div className="mt-1 text-[10.5px] text-[#5C3FA8]">
                badges this year
              </div>
            </div>
          </div>
        </section>

        {/* ── Today's progress strip — full width ──────────────────────── */}
        <section className="mb-5 overflow-hidden rounded-2xl border border-[#D9EADF] bg-white p-5">
          <div className="flex items-center gap-5">
            <AdherenceRing
              percentage={progress}
              size={68}
              color={progress === 100 ? '#0A6B3C' : '#79A83C'}
            />
            <div className="flex-1">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Today
              </div>
              <h2 className="text-[18px] font-bold text-[#1A1A1A]">
                {takenCount} of {totalCount} doses logged
              </h2>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F0F0F0]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#0A6B3C] to-[#79A83C] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 text-[11.5px] text-[#666]">
                Tap each supplement below to mark it taken. Apple Health logs automatically when connected.
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-12 gap-5">
          {/* ── LEFT — Stack timeline grouped by time of day ─────────── */}
          <section className="col-span-8 space-y-5">
            {grouped.map((group) => {
              const Icon = group.icon;
              return (
                <div
                  key={group.key}
                  className="overflow-hidden rounded-2xl border border-[#E0E0E0] bg-white p-5"
                >
                  {/* Time-of-day header with category color */}
                  <div className="mb-3 flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full"
                      style={{ backgroundColor: group.bg }}
                    >
                      <Icon size={15} strokeWidth={2.5} style={{ color: group.color }} />
                    </div>
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: group.color }}
                      >
                        {group.label}
                      </div>
                      <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{group.description}</div>
                    </div>
                    <div
                      className="ml-auto rounded-full px-2 py-0.5 text-[11px] font-bold"
                      style={{ color: group.color, backgroundColor: group.bg }}
                    >
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const isTaken = !!taken[item.productId];
                      const itemTrend = trendFor(item.adherence30d);
                      return (
                        <div
                          key={item.productId}
                          className={`relative flex items-center gap-3 overflow-hidden rounded-xl border p-3 transition-all ${
                            isTaken
                              ? 'border-[#C3E6CB] bg-[#F1FAF3]'
                              : 'border-[#E8E8E8] bg-white hover:border-[#0A6B3C]'
                          }`}
                        >
                          <button
                            onClick={() => toggleTaken(item.productId)}
                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
                              isTaken
                                ? 'border-[#0A6B3C] bg-[#0A6B3C]'
                                : 'border-[#D0D0D0] bg-white hover:border-[#0A6B3C]'
                            }`}
                          >
                            {isTaken && <CheckCircle2 size={16} className="text-white" strokeWidth={2.5} />}
                          </button>

                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-[10.5px] font-bold uppercase tracking-wide text-[#0A6B3C]">
                              {item.brand}
                            </div>
                            <div className={`text-[13.5px] font-semibold ${isTaken ? 'text-[#666] line-through' : 'text-[#1A1A1A]'}`}>
                              {item.name}
                            </div>
                            <div className="text-[11.5px] text-[#666]">
                              {item.dose} · {item.reasonShort}
                            </div>
                          </div>

                          {/* Sparkline of this item's 30-day adherence */}
                          <div className="hidden flex-shrink-0 flex-col items-end gap-0.5 lg:flex">
                            <div className="text-[9.5px] font-bold uppercase tracking-widest text-[#888]">
                              30d trend
                            </div>
                            <Sparkline
                              values={itemTrend}
                              color={item.adherence30d >= 90 ? '#0A6B3C' : item.adherence30d >= 75 ? '#B38900' : '#D14800'}
                              width={70}
                              height={20}
                            />
                          </div>

                          <div className="flex flex-col items-end gap-0.5">
                            <div
                              className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                                item.adherence30d >= 90
                                  ? 'bg-[#F1FAF3] text-[#0A6B3C]'
                                  : item.adherence30d >= 75
                                    ? 'bg-[#FFF7E5] text-[#B38900]'
                                    : 'bg-[#FFF1E8] text-[#D14800]'
                              }`}
                            >
                              {item.adherence30d}%
                            </div>
                            {item.autoship && (
                              <div className="mt-1 inline-flex items-center gap-1 text-[9.5px] font-medium text-[#0E9594]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#0E9594]" />
                                Autoship
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ── RIGHT — AI insights & achievements ─────────────────── */}
          <aside className="col-span-4 space-y-4">
            <AIMoment
              eyebrow="Insight from your routine"
              headline={
                persona.id === 'maya'
                  ? "You're 92% on magnesium — but 71% on Vitamin C."
                  : 'Sleep score has held above 75 for 21 days running.'
              }
              body={
                persona.id === 'maya'
                  ? "Vitamin C is your weak link — gap is mostly Tuesday/Thursday afternoons."
                  : 'Bisglycinate is doing its job. Right moment to layer in glycine 3g or threonate.'
              }
              footerLabel="Powered by iHerb Wellness Hub"
              footerRight={
                <Link
                  href="/advisor"
                  className="text-[11px] font-medium text-[#1558A6] hover:underline"
                >
                  Discuss with advisor →
                </Link>
              }
            />

            <div className="overflow-hidden rounded-2xl border border-[#D6C8F0] bg-gradient-to-br from-[#F4F0FB] via-[#EDE6F8] to-[#E2D9F4] p-5">
              <div className="mb-3 flex items-center gap-1.5">
                <Award size={13} className="text-[#6B4FBC]" strokeWidth={2.5} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#6B4FBC]">
                  Achievements
                </span>
              </div>
              <div className="space-y-2">
                {persona.achievements.map((a) => (
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

            <div className="overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-5">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#D14800]">
                This week
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                  const taken = i < 5;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-[#7B4022]">{d}</span>
                      <div
                        className={`h-7 w-7 rounded-md ${
                          taken ? 'bg-[#FF6B4A]' : 'border border-dashed border-[#FFC7B0] bg-white/70'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-[11.5px] font-semibold text-[#D14800]">
                5/7 days complete
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
