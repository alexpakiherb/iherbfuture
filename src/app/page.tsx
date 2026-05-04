'use client';

// Today / Home — editorial v2 (May 3, 2026).
//
// Rebuilt from a bento-everywhere dashboard into an editorial flow inspired
// by Patagonia (full-bleed photo + magazine pacing) and ASOS/Nike (tight
// merchandising rows for the bundle/recipe sections). Every section is a
// distinct moment with a real headline, not a tile in a sea of tiles.
//
// Section flow:
//   1. Lifestyle hero (photo + greeting + persona context chips)
//   2. Stat row (streak / adherence / saved / next delivery — no card chrome)
//   3. Morning/evening ritual (3-up product cards, clean)
//   4. Health Forecast editorial split (image + AI insight + product CTA)
//   5. Pending advisor actions (when any)
//   6. Curated bundles (3-up merchandising row)
//   7. Recently handled by advisor (3-up agent cards)
//   8. Wellness Hub article (editorial split)
//
// Connected apps + achievements moved to /stack — Today is for action.

import {
  ArrowRight,
  Sun,
  Moon,
  Cloud,
  ShoppingBag,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { LifestyleHero } from '@/components/LifestyleHero';
import { SectionHeader } from '@/components/SectionHeader';
import { EditorialSplit } from '@/components/EditorialSplit';
import { MetricRow, type Metric } from '@/components/MetricRow';
import { BundleCollage } from '@/components/BundleCollage';
import { usePersona } from '@/components/PersonaProvider';
import { getForecast } from '@/data/healthForecast';
import {
  MORNING_HERO_MAYA,
  MORNING_HERO_DANIEL,
  ALLERGY_LIFESTYLE,
  SUPPLEMENT_STILLLIFE_AMBER,
} from '@/data/lifestyleImages';

// 30-day adherence + savings trend mocks — drive the stat row sparklines.
const ADHERENCE_TREND_MAYA = [62, 68, 71, 70, 74, 78, 75, 80, 82, 79, 84, 86, 83, 87, 85, 88, 90, 88, 92, 91, 90, 94, 92, 93, 95, 94, 96, 95, 97, 98];
const ADHERENCE_TREND_DANIEL = [88, 90, 91, 89, 93, 94, 92, 95, 94, 96, 97, 95, 96, 98, 97, 96, 98, 97, 99, 98, 99, 100, 99, 100, 99, 100, 100, 99, 100, 100];
const SAVINGS_TREND_MAYA = [0, 2, 4, 5, 8, 12, 15, 18, 18, 19, 22, 23, 23, 25, 28, 32, 35, 35, 38, 42, 44, 47, 50, 52, 55, 58, 62, 65, 68, 71];
const SAVINGS_TREND_DANIEL = [12, 25, 38, 47, 62, 75, 88, 95, 105, 118, 130, 138, 150, 165, 178, 188, 195, 210, 225, 238, 250, 265, 278, 292, 305, 318, 330, 342, 355, 368];

export default function TodayPage() {
  const { persona, timeOfDay, greeting } = usePersona();
  const forecast = getForecast(persona.id);

  const isMaya = persona.id === 'maya';

  // Filter stack to current time of day for the "ritual" section.
  const ritual = persona.stack.filter((s) => {
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

  const adherenceTrend = isMaya ? ADHERENCE_TREND_MAYA : ADHERENCE_TREND_DANIEL;
  const savingsTrend = isMaya ? SAVINGS_TREND_MAYA : SAVINGS_TREND_DANIEL;
  const totalSaved = savingsTrend[savingsTrend.length - 1];

  // Subline copy for the hero — time-of-day + persona aware.
  const heroSubline =
    timeOfDay === 'morning' && isMaya
      ? "Here's your morning stack and what your advisor noticed overnight."
      : timeOfDay === 'morning' && !isMaya
        ? 'HRV is trending +6 vs your baseline. Whoop says you\'re cleared for a higher-strain day.'
        : timeOfDay === 'afternoon' && isMaya
          ? 'Halfway through the day — keep your hydration and energy steady.'
          : timeOfDay === 'afternoon' && !isMaya
            ? 'Strain target on track. Your advisor moved the LMNT into your pre-workout window.'
            : timeOfDay === 'evening' && isMaya
              ? 'Time to wind down. Magnesium glycinate goes 30 minutes before bed.'
              : 'Wind-down stack ready. Glycine + magnesium queued. Ashwagandha on board for cortisol.';

  // Time label for the hero eyebrow.
  const timeLabel =
    timeOfDay === 'morning' ? 'Your morning brief' :
    timeOfDay === 'evening' ? 'Your evening brief' :
                              'Your afternoon brief';

  // Next-delivery surfacing — first autoship in the persona stack.
  const nextDelivery = persona.stack.find((s) => s.autoship)?.nextDelivery ?? '—';

  // Stats for the MetricRow.
  const metrics: Metric[] = [
    {
      label: 'Streak',
      value: persona.streakDays.toString(),
      unit: 'days',
      caption: isMaya ? 'next milestone 21' : '180+ achieved',
      accent: '#FF6B4A',
      hero: true,
    },
    {
      label: '30-day adherence',
      value: `${avgAdherence}`,
      unit: '%',
      caption: avgAdherence >= 90 ? 'Crushing it.' : avgAdherence >= 75 ? 'Solid week.' : 'Room to grow.',
      trend: adherenceTrend,
      accent: '#0A6B3C',
    },
    {
      label: 'Saved by advisor',
      value: `$${totalSaved}`,
      caption: 'this year · subscriptions + bundles',
      trend: savingsTrend,
      accent: '#0E9594',
    },
    {
      label: 'Next delivery',
      value: nextDelivery.split(' ')[1] ?? nextDelivery,
      unit: nextDelivery.split(' ')[0] ?? '',
      caption: `${persona.stack.filter((s) => s.autoship).length} subscriptions active`,
      accent: '#1A1A1A',
    },
  ];

  // Curated bundle data (per persona). Imagery = real iHerb Cloudinary URLs.
  const bundles = isMaya
    ? [
        {
          badge: 'Beginner Bundle',
          title: 'Sleep foundations',
          subtitle: '3-supplement starter for deeper rest',
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
          title: 'Quality Promise picks',
          subtitle: 'NSF & Informed Choice — gold-tier brands only',
          price: 'From $14',
          save: 'Verified clean',
          tint: 'blue' as const,
          images: [
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01330/u/350.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex25359/u/8.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/sre/sre09180/u/8.jpg',
          ] as [string, string, string],
        },
        {
          badge: 'Energy Boost',
          title: 'Steady energy',
          subtitle: 'Without the afternoon crash',
          price: '$32',
          save: '4-week supply',
          tint: 'orange' as const,
          images: [
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex45706/u/94.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/jrw/jrw01006/u/114.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01300/u/82.jpg',
          ] as [string, string, string],
        },
      ]
    : [
        {
          badge: 'Longevity Stack',
          title: 'Cellular longevity',
          subtitle: '5-supplement protocol · NMN + quercetin foundation',
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
          title: 'Quality Promise picks',
          subtitle: 'Thorne, NSF, Informed Sport — verified clean',
          price: 'From $14',
          save: 'Verified clean',
          tint: 'blue' as const,
          images: [
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00644/u/96.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00690/u/50.jpg',
          ] as [string, string, string],
        },
        {
          badge: 'Performance Stack',
          title: 'Z2 cardio support',
          subtitle: 'Pre / intra / post — Whoop & Oura calibrated',
          price: '$96',
          save: '4-week supply',
          tint: 'orange' as const,
          images: [
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nuu/nuu02050/u/30.jpg',
            'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr01311/u/96.jpg',
          ] as [string, string, string],
        },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1">
        {/* ── 1. Editorial hero — full-bleed photography with overlay ────── */}
        <section className="mx-auto w-full max-w-[1440px] px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
          <LifestyleHero
            imageUrl={isMaya ? MORNING_HERO_MAYA.url : MORNING_HERO_DANIEL.url}
            alt={isMaya ? MORNING_HERO_MAYA.alt : MORNING_HERO_DANIEL.alt}
            eyebrow={timeLabel}
            headline={greeting.replace(',', ', ')}
            subline={heroSubline}
            size="lg"
            tint={isMaya ? 'coral' : 'green'}
            overlay="medium"
            serif
            rounded="lg"
          >
            {persona.contextHints.slice(0, isMaya ? 3 : 4).map((hint) => (
              <span
                key={hint}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[12px] font-semibold text-white backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                {hint}
              </span>
            ))}
          </LifestyleHero>
        </section>

        {/* ── 2. Stat row — clean, no card chrome ───────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 py-12 md:px-10 md:py-16">
          <MetricRow metrics={metrics} />
        </section>

        {/* Hairline breaks the page into editorial movements. */}
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <hr className="hairline" />
        </div>

        {/* ── 3. Today's ritual — section header + 3-up product cards ─── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-16 md:px-10 md:pt-20">
          <SectionHeader
            eyebrow={
              <span className="inline-flex items-center gap-1.5">
                <TimeIcon size={12} strokeWidth={2.5} />
                {timeOfDay === 'morning' ? 'Right now · morning' : timeOfDay === 'evening' ? 'Right now · evening' : 'Right now · midday'}
              </span>
            }
            headline={
              timeOfDay === 'evening'
                ? 'Your wind-down ritual'
                : timeOfDay === 'afternoon'
                  ? 'Steady through the afternoon'
                  : 'This morning, on your bench'
            }
            lede={
              timeOfDay === 'evening'
                ? `Anchored to ${persona.routine.eveningTime}. Magnesium 30 minutes before lights out.`
                : `Anchored to ${persona.routine.morningTime}. ${ritual.length} ${ritual.length === 1 ? 'supplement' : 'supplements'} on deck.`
            }
            ctaLabel="Full stack"
            ctaHref="/stack"
          />

          {ritual.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {ritual.slice(0, 3).map((item) => (
                <Link
                  key={item.productId}
                  href={`/product/${item.productId}`}
                  className="group relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-white p-6 ring-1 ring-[#EFEFEF] transition-all hover:-translate-y-0.5 hover:ring-[#0A6B3C]"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-xl bg-[#FAFBFA]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="h-full w-full object-contain p-3 transition-transform group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.14em' }}>
                      {item.brand}
                    </div>
                    <div className="mt-1.5 text-[16px] font-semibold leading-snug text-[#1A1A1A]">
                      {item.name.replace(/—.*$/, '').trim()}
                    </div>
                    <div className="mt-2 text-[13px] text-[#666]">
                      {item.dose} · {item.reasonShort}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-[14px] italic text-[#999]">
              No supplements scheduled for this part of the day.
            </p>
          )}
        </section>

        {/* ── 4. Health Forecast editorial split ─────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <EditorialSplit
            imageUrl={isMaya ? ALLERGY_LIFESTYLE.url : SUPPLEMENT_STILLLIFE_AMBER.url}
            alt={isMaya ? ALLERGY_LIFESTYLE.alt : SUPPLEMENT_STILLLIFE_AMBER.alt}
            ratio="content-heavy"
            minHeight="440px"
          >
            <AIMoment
              variant="flat"
              eyebrow={`Health forecast · ${forecast.city}`}
              headline={heroInsight.title}
              body={heroInsight.body}
              footerLabel={`Powered by iHerb Wellness Hub · ${forecast.city}, ${forecast.state}`}
              footerRight={
                <Link
                  href="/forecast"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0A6B3C] hover:underline"
                >
                  {heroInsight.ctaLabel}
                  <ArrowRight size={12} strokeWidth={2.5} />
                </Link>
              }
            >
              {heroInsight.productSuggestion && (
                <div className="flex items-center gap-4 rounded-2xl border border-[#EFEFEF] bg-white p-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#F2F2F2] bg-white">
                    {heroInsight.productSuggestion.imageUrl ? (
                      <img
                        src={heroInsight.productSuggestion.imageUrl}
                        alt={heroInsight.productSuggestion.name}
                        className="h-full w-full object-contain p-1.5"
                        loading="lazy"
                      />
                    ) : (
                      <span className="text-[22px]">💊</span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-[14px] font-semibold text-[#1A1A1A]">
                      {heroInsight.productSuggestion.name}
                    </div>
                    <div className="text-[12.5px] text-[#666]">
                      {heroInsight.productSuggestion.reason}
                    </div>
                  </div>
                  <button className="flex-shrink-0 rounded-full bg-[#0A6B3C] px-4 py-2 text-[12.5px] font-bold text-white transition-colors hover:bg-[#085131]">
                    Add to cart
                  </button>
                </div>
              )}
            </AIMoment>
          </EditorialSplit>
        </section>

        {/* ── 5. Pending advisor actions (only when present) ──────────── */}
        {pendingActions.length > 0 && (
          <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
            <SectionHeader
              eyebrow="Awaiting your nod"
              eyebrowColor="#D14800"
              headline={`${pendingActions.length} ${pendingActions.length === 1 ? 'recommendation' : 'recommendations'} from your advisor`}
              lede="Each one is reversible. Approve, skip, or open the conversation in your Wellness Advisor."
              ctaLabel="Open advisor"
              ctaHref="/advisor"
            />
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {pendingActions.slice(0, 2).map((a) => (
                <AgentActionCard key={a.id} action={a} />
              ))}
            </div>
          </section>
        )}

        {/* ── 6. Curated bundles — merchandising row (ASOS density) ──── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <SectionHeader
            eyebrow={isMaya ? 'Curated for beginners' : 'Curated for your protocol'}
            headline={isMaya ? 'Stacks our wellness experts recommend most' : 'Picks from longevity researchers'}
            lede={isMaya
              ? 'Trusted starter sets — small commitments that move the needle on sleep, energy, and immune support.'
              : 'Five-supplement protocols backed by clinical research and curated by our quality team.'
            }
            ctaLabel="Shop all bundles"
            ctaHref="/search?q=bundle"
          />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {bundles.map((card, i) => (
              <Link
                key={i}
                href="/search?q=bundle"
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-[#EFEFEF] transition-all hover:-translate-y-1 hover:ring-[#0A6B3C]"
              >
                <div className="absolute right-4 top-4 z-20 rounded-full bg-white/95 px-2.5 py-1 text-[10.5px] font-bold text-[#1A1A1A] backdrop-blur" style={{ letterSpacing: '0.06em' }}>
                  {card.badge}
                </div>
                <BundleCollage images={card.images} alt={card.title} tint={card.tint} size="md" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-[18px] font-bold leading-snug text-[#1A1A1A]" style={{ letterSpacing: '-0.012em' }}>
                    {card.title}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] text-[#666]" style={{ lineHeight: 1.55 }}>
                    {card.subtitle}
                  </p>
                  <div className="mt-auto flex items-end justify-between pt-5">
                    <div className="text-[22px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.015em' }}>
                      {card.price}
                    </div>
                    <div className="text-[12px] font-semibold text-[#D14800]">
                      {card.save}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── 7. Recently handled by advisor ─────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 md:px-10 md:pt-28">
          <SectionHeader
            eyebrow="Hands-off"
            headline="Recently handled by your advisor"
            lede="Autonomous actions on your behalf — every one reversible from your audit log."
            ctaLabel="Full audit log"
            ctaHref="/advisor"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentActions.map((a) => (
              <AgentActionCard key={a.id} action={a} compact />
            ))}
          </div>
        </section>

        {/* ── 8. Wellness Hub editorial split ────────────────────────── */}
        <section className="mx-auto w-full max-w-[1280px] px-6 pt-24 pb-24 md:px-10 md:pt-28 md:pb-32">
          <EditorialSplit
            imageUrl="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1400&q=80&auto=format&fit=crop"
            alt="Magnesium supplement still life"
            eyebrow="Wellness Hub · Recommended for you"
            headline={
              isMaya
                ? 'The magnesium guide: glycinate vs citrate vs malate.'
                : 'Magnesium forms & cognitive performance: what the research says.'
            }
            body={
              isMaya
                ? 'Why your advisor recommended glycinate for sleep — and when it makes sense to switch forms. A 6-minute read.'
                : 'Threonate, taurate, and glycinate — when to use each, and what your sleep data should be telling you.'
            }
            ratio="balanced"
            minHeight="360px"
            reverse
          >
            <Link
              href="/wellness-hub/magnesium-guide"
              className="inline-flex items-center gap-2 rounded-full bg-[#1A1A1A] px-6 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#0A6B3C]"
            >
              Read the guide
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#666]">
              <ShoppingBag size={13} strokeWidth={2.25} />
              6 min read · 3 products mentioned
            </span>
          </EditorialSplit>
        </section>
      </main>

      <Footer />
    </div>
  );
}
