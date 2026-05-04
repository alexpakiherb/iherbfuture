'use client';

// My Stack — editorial v2 (May 3, 2026).
//
// The day timeline is the protagonist now. Stats live in a clean MetricRow,
// each time-of-day group becomes its own editorial section with a real
// SectionHeader, and the side rail (AI insight + achievements + weekly grid)
// is gone — those moments now live as full-width sections after the timeline.
// Less card chrome, much more breathing room.

import { useState } from 'react';
import {
  Sun,
  Moon,
  Sunrise,
  Dumbbell,
  CheckCircle2,
  Plus,
  Award,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { LifestyleHero } from '@/components/LifestyleHero';
import { SectionHeader } from '@/components/SectionHeader';
import { MetricRow, type Metric } from '@/components/MetricRow';
import { Sparkline } from '@/components/Sparkline';
import { usePersona } from '@/components/PersonaProvider';
import { StackItem } from '@/data/personas';
import { STACK_HERO } from '@/data/lifestyleImages';

const TIME_GROUPS: {
  key: StackItem['timeOfDay'];
  label: string;
  icon: typeof Sun;
  description: string;
  color: string;
}[] = [
  { key: 'morning',      label: 'Morning',      icon: Sunrise,  description: 'With breakfast or first thing',     color: '#FF6B4A' },
  { key: 'pre-workout',  label: 'Pre-workout',  icon: Dumbbell, description: '20–30 min before training',          color: '#0E9594' },
  { key: 'midday',       label: 'Midday',       icon: Sun,      description: 'With lunch',                          color: '#F5A623' },
  { key: 'post-workout', label: 'Post-workout', icon: Dumbbell, description: 'Within 30 min of training',           color: '#1558A6' },
  { key: 'evening',      label: 'Evening',      icon: Moon,     description: '30 minutes before bed',               color: '#6B4FBC' },
];

// Per-supplement 30-day mock trend.
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
  const isMaya = persona.id === 'maya';

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

  const adherenceTrend = isMaya ? ADHERENCE_TREND_MAYA : ADHERENCE_TREND_DANIEL;

  const nextDelivery = persona.stack
    .filter((s) => s.autoship && s.nextDelivery)
    .sort((a, b) => (a.nextDelivery ?? '').localeCompare(b.nextDelivery ?? ''))[0]?.nextDelivery ?? 'May 10';

  const autoshipItems = persona.stack.filter((s) => s.autoship);

  const metrics: Metric[] = [
    {
      label: 'Streak',
      value: persona.streakDays.toString(),
      unit: 'days',
      caption: isMaya ? 'next milestone 21' : '180+ achieved · top 3%',
      accent: '#FF6B4A',
      hero: true,
    },
    {
      label: '30-day adherence',
      value: `${avgAdherence}`,
      unit: '%',
      caption: avgAdherence >= 90 ? 'Crushing it.' : avgAdherence >= 75 ? 'Solid.' : 'Room to grow.',
      trend: adherenceTrend,
      accent: '#0A6B3C',
    },
    {
      label: 'Next delivery',
      value: nextDelivery.split(' ')[1] ?? nextDelivery,
      unit: nextDelivery.split(' ')[0] ?? '',
      caption: `${autoshipItems.length} items in box · ${isMaya ? '1 paused by AI' : 'auto-tuned'}`,
      accent: '#0E9594',
    },
    {
      label: 'Earned',
      value: persona.achievements.length.toString(),
      unit: 'badges',
      caption: 'this year',
      accent: '#6B4FBC',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1">
        {/* ── 1. Editorial hero ──────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
          <LifestyleHero
            imageUrl={STACK_HERO.url}
            alt={STACK_HERO.alt}
            eyebrow={isMaya ? 'A simple ritual' : 'A precise protocol'}
            headline={`${persona.firstName}'s daily stack`}
            subline={
              isMaya
                ? 'Three supplements anchored to the morning and evening routines you already keep.'
                : 'Twelve supplements, calibrated to your biometrics, your training cycle, and the windows of your day.'
            }
            size="md"
            tint="green"
            overlay="medium"
            serif
            rounded="lg"
          />
        </section>

        {/* ── 2. Stat row ────────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <MetricRow metrics={metrics} />
        </section>

        {/* ── 3. Today's progress — clean strip, no card chrome ──────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <div className="flex flex-col items-start gap-5 rounded-2xl bg-white p-7 ring-1 ring-[#EFEFEF] sm:flex-row sm:items-center">
            <div className="flex-1">
              <div className="text-[11.5px] font-bold uppercase text-[#666]" style={{ letterSpacing: '0.18em' }}>
                Today
              </div>
              <h2 className="mt-2 text-[24px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.012em' }}>
                {takenCount} of {totalCount} doses logged
              </h2>
              <div className="mt-4 h-[6px] overflow-hidden rounded-full bg-[#F3F3F3]">
                <div
                  className="h-full rounded-full bg-[#0A6B3C] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-3 text-[13px] text-[#666]">
                Tap each supplement to mark taken. Apple Health logs automatically when connected.
              </div>
            </div>
            <button className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-5 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0A6B3C]">
              <Plus size={14} strokeWidth={2.5} />
              Add to stack
            </button>
          </div>
        </section>

        {/* ── 4. Time-of-day timeline — each group as editorial section ── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-20 md:px-10 md:pt-24">
          <SectionHeader
            eyebrow="The day"
            headline="Your routine, in time"
            lede={
              isMaya
                ? `Anchored to ${persona.routine.morningTime} and ${persona.routine.eveningTime}. Tap any supplement to log it.`
                : `Five windows. ${persona.stack.length} supplements. Calibrated to your training cycle and biometric inputs.`
            }
          />

          <div className="space-y-14">
            {grouped.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.key}>
                  {/* Group header — eyebrow + label in the section's color */}
                  <div className="mb-5 flex items-baseline gap-3">
                    <Icon size={18} strokeWidth={2.25} style={{ color: group.color }} />
                    <div
                      className="text-[11.5px] font-bold uppercase"
                      style={{ color: group.color, letterSpacing: '0.18em' }}
                    >
                      {group.label}
                    </div>
                    <div className="text-[12.5px] text-[#999]">{group.description}</div>
                    <div className="ml-auto text-[12.5px] font-semibold text-[#666]">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF]">
                    {group.items.map((item, i) => {
                      const isTaken = !!taken[item.productId];
                      const itemTrend = trendFor(item.adherence30d);
                      return (
                        <div
                          key={item.productId}
                          className={`flex items-center gap-5 p-5 transition-colors ${
                            i > 0 ? 'border-t border-[#F2F2F2]' : ''
                          } ${isTaken ? 'bg-[#FAFCFA]' : 'hover:bg-[#FAFBFA]'}`}
                        >
                          <button
                            onClick={() => toggleTaken(item.productId)}
                            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all active:scale-90 ${
                              isTaken
                                ? 'border-[#0A6B3C] bg-[#0A6B3C]'
                                : 'border-[#D8D8D8] bg-white hover:border-[#0A6B3C]'
                            }`}
                          >
                            {isTaken && <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />}
                          </button>

                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#FAFBFA]">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-contain p-1.5"
                              loading="lazy"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="text-[10.5px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.14em' }}>
                              {item.brand}
                            </div>
                            <div className={`mt-0.5 text-[15px] font-semibold ${isTaken ? 'text-[#888] line-through' : 'text-[#1A1A1A]'}`}>
                              {item.name}
                            </div>
                            <div className="mt-0.5 text-[12.5px] text-[#666]">
                              {item.dose} · {item.reasonShort}
                            </div>
                          </div>

                          <div className="hidden flex-shrink-0 flex-col items-end gap-1 lg:flex">
                            <div className="text-[10px] font-bold uppercase text-[#999]" style={{ letterSpacing: '0.14em' }}>
                              30d trend
                            </div>
                            <Sparkline
                              values={itemTrend}
                              color={item.adherence30d >= 90 ? '#0A6B3C' : item.adherence30d >= 75 ? '#B38900' : '#D14800'}
                              width={86}
                              height={22}
                            />
                          </div>

                          <div className="flex flex-shrink-0 flex-col items-end gap-1">
                            <div
                              className="text-[20px] font-bold tabular-nums"
                              style={{
                                color:
                                  item.adherence30d >= 90 ? '#0A6B3C' :
                                  item.adherence30d >= 75 ? '#B38900' :
                                                            '#D14800',
                                letterSpacing: '-0.015em',
                              }}
                            >
                              {item.adherence30d}%
                            </div>
                            {item.autoship && (
                              <div className="inline-flex items-center gap-1 text-[10.5px] font-medium text-[#0E9594]">
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
          </div>
        </section>

        {/* ── 5. Insight from your routine (flat AIMoment) ───────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <AIMoment
                variant="flat"
                eyebrow="Insight from your routine"
                headline={
                  isMaya
                    ? "You're at 92% on magnesium — but 71% on Vitamin C."
                    : 'Sleep score has held above 75 for 21 days running.'
                }
                body={
                  isMaya
                    ? 'Vitamin C is your weak link. The pattern is mostly Tuesday and Thursday afternoons — likely tied to your gym schedule. Want me to move it to mornings?'
                    : 'Bisglycinate is doing its job. Right moment to layer in glycine 3g or magnesium L-threonate at 9 PM, depending on whether you want REM depth or cognitive next-morning sharpness.'
                }
                footerLabel="Powered by iHerb Wellness Hub"
                footerRight={
                  <Link
                    href="/advisor"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A6B3C] hover:underline"
                  >
                    Discuss with advisor →
                  </Link>
                }
              />
            </div>
          </div>
        </section>

        {/* ── 6. Achievements ────────────────────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 pb-24 md:px-10 md:pt-28 md:pb-32">
          <SectionHeader
            eyebrow="Earned"
            eyebrowColor="#6B4FBC"
            headline={`${persona.achievements.length} ${persona.achievements.length === 1 ? 'badge' : 'badges'} this year`}
            lede="Small celebrations of consistency. Each one is automatically recognized as you build the habit."
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {persona.achievements.map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-4 rounded-2xl bg-white p-6 ring-1 ring-[#EFEFEF] transition-all hover:ring-[#6B4FBC]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F4F0FB] text-[24px]">
                  {a.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-semibold text-[#1A1A1A]">{a.label}</div>
                  <div className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] font-medium text-[#6B4FBC]">
                    <Award size={11} strokeWidth={2.5} />
                    Earned {a.earned}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
