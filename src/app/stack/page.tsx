'use client';

// My Stack — editorial v3 (May 4, 2026).
//
// Bento returns mixed-media. Hero photo (apothecary aesthetic), then a
// 12-col grid that mixes a big content tile (today's progress + streak)
// with photo tiles (morning kitchen, evening wind-down) and stat
// billboards. Time-of-day groups are below as editorial sub-sections.

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
import { Bento, BentoTile } from '@/components/BentoTile';
import { Sparkline } from '@/components/Sparkline';
import { ScrollReveal } from '@/components/ScrollReveal';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { usePersona } from '@/components/PersonaProvider';
import { StackItem } from '@/data/personas';
import {
  RITUAL_KITCHEN,
  RITUAL_EVENING,
  RITUAL_WORKOUT,
  RITUAL_BOTTLES_WOOD,
} from '@/data/lifestyleImages';

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

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1500px] px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
          <LifestyleHero
            imageUrl={RITUAL_BOTTLES_WOOD.url}
            alt={RITUAL_BOTTLES_WOOD.alt}
            eyebrow={isMaya ? 'A simple ritual' : 'A precise protocol'}
            headline={
              isMaya
                ? <>{persona.firstName}&rsquo;s daily stack.</>
                : <>{persona.firstName}&rsquo;s twelve, <em className="not-italic font-serif-display italic">calibrated.</em></>
            }
            subline={
              isMaya
                ? "Three supplements anchored to the morning and evening you already keep."
                : "Twelve compounds, paced through the day to your data and your training cycle."
            }
            size="xl"
            tint="neutral"
            overlay="medium"
            serif
            rounded="lg"
          />
        </section>

        <section className="mx-auto w-full max-w-[1500px] px-4 pt-6 sm:px-6 md:px-8 md:pt-8">
          <Bento>
            <BentoTile
              variant="content"
              span="col-span-12 lg:col-span-8"
              surface="ink"
              eyebrow="Today"
              title={
                <span>
                  {takenCount} of {totalCount} doses logged.
                </span>
              }
              ctaHref="#log"
              ctaLabel="Log dose"
              minHeight="320px"
            >
              <div className="mt-1 h-[6px] overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#79A83C] transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-4 max-w-[520px] text-[14px] text-white/70" style={{ lineHeight: 1.55 }}>
                Tap any supplement below to log it. Apple Health logs automatically when connected.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-[#F5F1EA] px-5 py-2.5 text-[13px] font-semibold text-[#0F1815] transition-transform hover:-translate-y-0.5">
                  <Plus size={14} strokeWidth={2.5} />
                  Add to stack
                </button>
                <span className="text-[12.5px] text-white/60">
                  Anchored to {persona.routine.morningTime} & {persona.routine.eveningTime}
                </span>
              </div>
            </BentoTile>

            <BentoTile
              variant="stat"
              span="col-span-12 lg:col-span-4"
              surface="oat"
              label={isMaya ? 'Day streak' : 'Long streak'}
              value={<AnimatedCounter to={persona.streakDays} duration={1600} />}
              unit="days"
              caption={isMaya ? 'Twenty-one is the next milestone.' : '180+ achieved · top 3 percent.'}
              accent="#0F1815"
              serif
              size="xl"
              minHeight="320px"
            />
          </Bento>
        </section>

        <section className="mx-auto w-full max-w-[1500px] px-4 pt-5 sm:px-6 md:px-8">
          <Bento>
            <BentoTile
              variant="photo"
              span="col-span-12 lg:col-span-5"
              imageUrl={isMaya ? RITUAL_KITCHEN.url : RITUAL_WORKOUT.url}
              alt={isMaya ? RITUAL_KITCHEN.alt : RITUAL_WORKOUT.alt}
              eyebrow={isMaya ? 'Anchor habits' : 'Training cycle'}
              caption={isMaya ? 'A morning, paced.' : 'Strain-aware. Recovery-first.'}
              overlay="medium"
              minHeight="280px"
            />

            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-3"
              surface="bone"
              label="30-day adherence"
              value={`${avgAdherence}`}
              unit="%"
              caption={avgAdherence >= 90 ? 'Crushing it.' : avgAdherence >= 75 ? 'Solid.' : 'Room to grow.'}
              trend={adherenceTrend}
              accent="#0A6B3C"
              size="lg"
              minHeight="280px"
            />

            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-2"
              surface="forest"
              label="Next delivery"
              value={nextDelivery.split(' ')[1] ?? nextDelivery}
              unit={nextDelivery.split(' ')[0] ?? ''}
              caption={`${autoshipItems.length} items in box.`}
              accent="#FFFFFF"
              size="md"
              minHeight="280px"
            />

            <BentoTile
              variant="stat"
              span="col-span-12 lg:col-span-2"
              surface="bone"
              label="Earned"
              value={persona.achievements.length.toString()}
              unit="badges"
              caption="this year."
              accent="#6B4FBC"
              serif
              size="md"
              minHeight="280px"
            />
          </Bento>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-6 pt-28 md:px-10 md:pt-36" id="log">
          <ScrollReveal as="div" className="mb-8">
            <div className="text-[11.5px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.22em' }}>
              The day
            </div>
            <h2
              className="mt-4 font-serif-display font-semibold text-[#0F1815] max-w-[24ch]"
              style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.06 }}
            >
              {isMaya ? 'Your routine, in time.' : 'Five windows, twelve compounds.'}
            </h2>
            <p className="mt-4 max-w-[560px] text-[15.5px] text-[#555]" style={{ lineHeight: 1.6 }}>
              {isMaya
                ? `Anchored to ${persona.routine.morningTime} and ${persona.routine.eveningTime}. Tap each supplement to log it.`
                : `Calibrated to your training cycle and biometric inputs. Each window has its own purpose.`}
            </p>
          </ScrollReveal>

          <div className="space-y-12">
            {grouped.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.key}>
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

                  <div className="overflow-hidden rounded-2xl bg-[#FBF9F4] ring-1 ring-[#EFEAE0]">
                    {group.items.map((item, i) => {
                      const isTaken = !!taken[item.productId];
                      const itemTrend = trendFor(item.adherence30d);
                      return (
                        <div
                          key={item.productId}
                          className={`flex items-center gap-5 p-5 transition-colors ${
                            i > 0 ? 'border-t border-[#EFEAE0]' : ''
                          } ${isTaken ? 'bg-[#F5F1EA]' : 'hover:bg-white'}`}
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

                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
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
                            <div className={`mt-0.5 text-[15px] font-semibold ${isTaken ? 'text-[#888] line-through' : 'text-[#0F1815]'}`}>
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
                              className="font-serif-display text-[24px] font-semibold tabular-nums"
                              style={{
                                color:
                                  item.adherence30d >= 90 ? '#0A6B3C' :
                                  item.adherence30d >= 75 ? '#B38900' :
                                                            '#D14800',
                                letterSpacing: '-0.018em',
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

        <section className="mx-auto w-full max-w-[1500px] px-4 pt-28 sm:px-6 md:px-8 md:pt-36">
          <Bento>
            <BentoTile
              variant="content"
              span="col-span-12 lg:col-span-7"
              surface="bone"
              minHeight="340px"
            >
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
                    ? 'Vitamin C is your weak link — mostly Tuesday and Thursday afternoons, likely tied to your gym schedule. Want me to move it to mornings?'
                    : 'Bisglycinate is doing its job. Right moment to layer in glycine 3g or magnesium L-threonate at 9 PM, depending on whether you want REM depth or cognitive next-morning sharpness.'
                }
                footerLabel="Sourced from iHerb Wellness Hub"
                footerRight={
                  <Link
                    href="/advisor"
                    className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A6B3C] hover:underline"
                  >
                    Discuss with advisor →
                  </Link>
                }
              />
            </BentoTile>

            <BentoTile
              variant="photo"
              span="col-span-12 lg:col-span-5"
              imageUrl={RITUAL_EVENING.url}
              alt={RITUAL_EVENING.alt}
              eyebrow="Wind down"
              caption={isMaya ? 'Magnesium, thirty minutes before lights out.' : 'Glycine first. Magnesium with it.'}
              overlay="medium"
              minHeight="340px"
            />
          </Bento>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-6 pt-28 pb-24 md:px-10 md:pt-36 md:pb-32">
          <ScrollReveal as="div" className="mb-8">
            <div className="text-[11.5px] font-bold uppercase text-[#6B4FBC]" style={{ letterSpacing: '0.22em' }}>
              Earned
            </div>
            <h2
              className="mt-4 font-serif-display font-semibold text-[#0F1815] max-w-[24ch]"
              style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.06 }}
            >
              {persona.achievements.length} {persona.achievements.length === 1 ? 'badge' : 'badges'}, this year.
            </h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {persona.achievements.map((a) => (
              <div
                key={a.id}
                className="motion-lift flex items-center gap-4 rounded-2xl bg-[#FBF9F4] p-6 ring-1 ring-[#EFEAE0]"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#F4F0FB] text-[24px]">
                  {a.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[14.5px] font-semibold text-[#0F1815]">{a.label}</div>
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
