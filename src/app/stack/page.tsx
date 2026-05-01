'use client';

// Daily Stack — your full supplement routine, organized by time of day, with
// adherence tracking, streaks, achievements, and AI nudges.

import { useState } from 'react';
import {
  Sun,
  Moon,
  Cloud,
  Sunrise,
  Dumbbell,
  CheckCircle2,
  Plus,
  Flame,
  Award,
  Calendar,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { AdherenceRing } from '@/components/AdherenceRing';
import { usePersona } from '@/components/PersonaProvider';
import { StackItem } from '@/data/personas';

const TIME_GROUPS: { key: StackItem['timeOfDay']; label: string; icon: typeof Sun; description: string }[] = [
  { key: 'morning', label: 'Morning', icon: Sunrise, description: 'With breakfast or first thing' },
  { key: 'pre-workout', label: 'Pre-workout', icon: Dumbbell, description: '20–30 min before training' },
  { key: 'midday', label: 'Midday', icon: Sun, description: 'With lunch' },
  { key: 'post-workout', label: 'Post-workout', icon: Dumbbell, description: 'Within 30 min of training' },
  { key: 'evening', label: 'Evening', icon: Moon, description: '30 min before bed' },
];

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

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">
        {/* Header */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <div className="mb-1.5 flex items-center gap-1.5 text-[#0A6B3C]">
              <Sparkles size={13} strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest">
                Your Daily Stack
              </span>
            </div>
            <h1 className="text-[26px] font-bold text-[#1A1A1A]">
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

        {/* Top stat row */}
        <div className="mb-6 grid grid-cols-12 gap-4">
          <div className="col-span-3 rounded-2xl border border-[#FFD9C4] bg-gradient-to-br from-[#FFF7F1] to-white p-5">
            <div className="flex items-center gap-2">
              <Flame size={16} className="text-[#D14800]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#D14800]">
                Streak
              </span>
            </div>
            <div className="mt-1 text-[32px] font-bold text-[#1A1A1A]">{persona.streakDays}</div>
            <div className="text-[12px] text-[#666]">days consistent</div>
          </div>
          <div className="col-span-3 rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="flex items-center gap-2">
              <TrendingUp size={16} className="text-[#0A6B3C]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                30-day adherence
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="text-[32px] font-bold text-[#1A1A1A]">{avgAdherence}%</div>
              {avgAdherence >= 90 && (
                <span className="rounded-full bg-[#F1FAF3] px-2 py-0.5 text-[10px] font-bold text-[#0A6B3C]">
                  +6% MoM
                </span>
              )}
            </div>
            <div className="text-[12px] text-[#666]">average across stack</div>
          </div>
          <div className="col-span-3 rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-[#1558A6]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Next delivery
              </span>
            </div>
            <div className="mt-1 text-[16px] font-bold text-[#1A1A1A]">May 10</div>
            <div className="text-[12px] text-[#666]">
              {persona.id === 'maya' ? '2 items in box' : '4 items in box'}
            </div>
          </div>
          <div className="col-span-3 rounded-2xl border border-[#E0E0E0] bg-white p-5">
            <div className="flex items-center gap-2">
              <Award size={16} className="text-[#F5A623]" strokeWidth={2.5} />
              <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                Earned
              </span>
            </div>
            <div className="mt-1 text-[32px] font-bold text-[#1A1A1A]">
              {persona.achievements.length}
            </div>
            <div className="text-[12px] text-[#666]">badges this year</div>
          </div>
        </div>

        {/* Today progress */}
        <div className="mb-6 rounded-2xl border border-[#D9EADF] bg-white p-5">
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
              <div className="mt-2 text-[12px] text-[#666]">
                Tap each supplement below to mark it taken. Apple Health logs automatically when connected.
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* ── LEFT — Stack timeline ────────────────────────────── */}
          <section className="col-span-8 space-y-5">
            {grouped.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.key} className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F1FAF3] text-[#0A6B3C]">
                      <Icon size={14} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#1A1A1A]">{group.label}</div>
                      <div className="text-[11px] text-[#888]">{group.description}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {group.items.map((item) => {
                      const isTaken = !!taken[item.productId];
                      return (
                        <div
                          key={item.productId}
                          className={`flex items-center gap-3 rounded-xl border p-3 transition-all ${
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

                          <div className="flex flex-col items-end gap-0.5">
                            <div className="text-[10.5px] font-bold uppercase text-[#888]">
                              30-day
                            </div>
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
                              <div className="mt-1 inline-flex items-center gap-1 text-[9.5px] font-medium text-[#1558A6]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#1558A6]" />
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

          {/* ── RIGHT — AI insights & achievements ───────────────── */}
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
                  ? "Vitamin C is your weak link. The gap is mostly Tuesday/Thursday afternoons. Want me to set a 2pm reminder, or move it to morning?"
                  : 'Your bisglycinate is doing its job. This is the right moment to consider layering in glycine 3g or magnesium threonate to push deep sleep further.'
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

            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="mb-3 flex items-center gap-1.5">
                <Award size={13} className="text-[#F5A623]" strokeWidth={2.5} />
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                  Achievements
                </span>
              </div>
              <div className="space-y-2.5">
                {persona.achievements.map((a) => (
                  <div key={a.id} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7E5] text-[20px]">
                      {a.emoji}
                    </div>
                    <div className="flex-1">
                      <div className="text-[12.5px] font-semibold text-[#1A1A1A]">{a.label}</div>
                      <div className="text-[10.5px] text-[#999]">Earned {a.earned}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#D9EADF] bg-[#F1FAF3] p-5">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                Weekly snapshot
              </div>
              <div className="mt-2 grid grid-cols-7 gap-1">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => {
                  const taken = i < 5; // mock — last 2 days incomplete
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-[#666]">{d}</span>
                      <div
                        className={`h-7 w-7 rounded-md ${
                          taken ? 'bg-[#0A6B3C]' : 'border border-dashed border-[#B8DFC4] bg-white'
                        }`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 text-[11.5px] text-[#0A6B3C]">
                <span className="font-semibold">5/7 days complete</span> this week
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
