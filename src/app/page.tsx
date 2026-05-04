'use client';

// Today / Home — editorial v3 (May 4, 2026).
//
// Bento returns — but every bento row mixes photo tiles with data tiles so it
// reads as editorial, not dashboard. Aesop voice in copy. Patagonia photography
// rhythm (4+ lifestyle images per page). One Nike-billboard moment for the
// merchandising row. Page background is now warm cream, not gray.

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { LifestyleHero } from '@/components/LifestyleHero';
import { Bento, BentoTile } from '@/components/BentoTile';
import { Billboard } from '@/components/Billboard';
import { EditorialSplit } from '@/components/EditorialSplit';
import { BundleCollage } from '@/components/BundleCollage';
import { usePersona } from '@/components/PersonaProvider';
import { getForecast } from '@/data/healthForecast';
import {
  MORNING_HERO_MAYA,
  MORNING_HERO_DANIEL,
  ALLERGY_LIFESTYLE,
  SUPPLEMENT_STILLLIFE_AMBER,
  RITUAL_KITCHEN,
  RITUAL_EVENING,
  RITUAL_WORKOUT,
  RITUAL_BOTTLES_WOOD,
} from '@/data/lifestyleImages';

const ADHERENCE_TREND_MAYA = [62, 68, 71, 70, 74, 78, 75, 80, 82, 79, 84, 86, 83, 87, 85, 88, 90, 88, 92, 91, 90, 94, 92, 93, 95, 94, 96, 95, 97, 98];
const ADHERENCE_TREND_DANIEL = [88, 90, 91, 89, 93, 94, 92, 95, 94, 96, 97, 95, 96, 98, 97, 96, 98, 97, 99, 98, 99, 100, 99, 100, 99, 100, 100, 99, 100, 100];
const SAVINGS_TREND_MAYA = [0, 2, 4, 5, 8, 12, 15, 18, 18, 19, 22, 23, 23, 25, 28, 32, 35, 35, 38, 42, 44, 47, 50, 52, 55, 58, 62, 65, 68, 71];
const SAVINGS_TREND_DANIEL = [12, 25, 38, 47, 62, 75, 88, 95, 105, 118, 130, 138, 150, 165, 178, 188, 195, 210, 225, 238, 250, 265, 278, 292, 305, 318, 330, 342, 355, 368];

export default function TodayPage() {
  const { persona, timeOfDay, greeting } = usePersona();
  const forecast = getForecast(persona.id);

  const isMaya = persona.id === 'maya';

  const ritual = persona.stack.filter((s) => {
    if (timeOfDay === 'morning') return s.timeOfDay === 'morning' || s.timeOfDay === 'pre-workout';
    if (timeOfDay === 'evening') return s.timeOfDay === 'evening';
    return s.timeOfDay === 'midday' || s.timeOfDay === 'morning';
  });

  const recentActions = persona.agentActions.filter((a) => a.type === 'taken').slice(0, 3);

  const avgAdherence = Math.round(
    persona.stack.reduce((s, i) => s + i.adherence30d, 0) / persona.stack.length
  );
  const adherenceTrend = isMaya ? ADHERENCE_TREND_MAYA : ADHERENCE_TREND_DANIEL;
  const savingsTrend = isMaya ? SAVINGS_TREND_MAYA : SAVINGS_TREND_DANIEL;
  const totalSaved = savingsTrend[savingsTrend.length - 1];
  const heroInsight = forecast.insights[0];
  const nextDelivery = persona.stack.find((s) => s.autoship)?.nextDelivery ?? '—';

  const heroEyebrow =
    timeOfDay === 'morning' ? 'A.M. brief'
      : timeOfDay === 'evening' ? 'P.M. brief'
      : 'Midday brief';

  const heroHeadline = isMaya
    ? (timeOfDay === 'morning' ? 'A quiet morning. Your stack, set.'
       : timeOfDay === 'evening' ? 'The day winds down. Magnesium next.'
       : 'A steady afternoon, on plan.')
    : (timeOfDay === 'morning' ? 'HRV up six. Cleared for higher strain.'
       : timeOfDay === 'evening' ? 'Wind-down stack ready. Glycine, magnesium, ashwagandha.'
       : 'Pre-workout window open. LMNT queued.');

  const heroSubline = isMaya
    ? "What your advisor saw overnight, the supplements on deck this morning, and the bundle that just dropped into your queue."
    : "Whoop, Oura, and the iHerb Wellness Hub agree: lean forward today. Your protocol is calibrated for it.";

  const bundles = isMaya
    ? [
        { title: 'Sleep foundations', subtitle: 'Magnesium, glycine, gentle.', price: '$48',
          images: ['https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01066/u/159.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01289/u/62.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00932/u/298.jpg'] as [string, string, string],
          tint: 'green' as const },
        { title: 'Quality Promise', subtitle: 'Verified clean. Gold-tier brands only.', price: 'From $14',
          images: ['https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn01330/u/350.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex25359/u/8.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/sre/sre09180/u/8.jpg'] as [string, string, string],
          tint: 'blue' as const },
        { title: 'Steady energy', subtitle: 'Without the afternoon crash.', price: '$32',
          images: ['https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex45706/u/94.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/jrw/jrw01006/u/114.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/now/now01300/u/82.jpg'] as [string, string, string],
          tint: 'orange' as const },
      ]
    : [
        { title: 'Cellular longevity', subtitle: 'NMN, quercetin, resveratrol.', price: '$184',
          images: ['https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23443/u/24.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/lex/lex23023/u/66.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/cgn/cgn00934/u/221.jpg'] as [string, string, string],
          tint: 'green' as const },
        { title: 'Quality Promise', subtitle: 'Thorne. NSF. Informed Sport.', price: 'From $14',
          images: ['https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00644/u/96.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00690/u/50.jpg'] as [string, string, string],
          tint: 'blue' as const },
        { title: 'Z2 cardio support', subtitle: 'Pre. Intra. Post.', price: '$96',
          images: ['https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr00635/u/61.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/nuu/nuu02050/u/30.jpg',
                   'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/thr/thr01311/u/96.jpg'] as [string, string, string],
          tint: 'orange' as const },
      ];

  const ritualImage =
    timeOfDay === 'evening' ? RITUAL_EVENING
      : isMaya ? RITUAL_KITCHEN
      : RITUAL_WORKOUT;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1500px] px-4 pt-4 sm:px-6 md:px-8 md:pt-6">
          <LifestyleHero
            imageUrl={isMaya ? MORNING_HERO_MAYA.url : MORNING_HERO_DANIEL.url}
            alt={isMaya ? MORNING_HERO_MAYA.alt : MORNING_HERO_DANIEL.alt}
            eyebrow={`${heroEyebrow} · ${greeting.replace('Good morning, ', '').replace('Hey ', '').replace('Winding down, ', '').replace('?', '')}`}
            headline={heroHeadline}
            subline={heroSubline}
            size="xl"
            tint="neutral"
            overlay="medium"
            serif
            rounded="lg"
          >
            {persona.contextHints.slice(0, 3).map((hint) => (
              <span
                key={hint}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 text-[12px] font-medium text-white backdrop-blur-md"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                {hint}
              </span>
            ))}
          </LifestyleHero>
        </section>

        <section className="mx-auto w-full max-w-[1500px] px-4 pt-6 sm:px-6 md:px-8 md:pt-8">
          <Bento>
            <BentoTile
              variant="content"
              span="col-span-12 lg:col-span-8"
              surface="ink"
              eyebrow={timeOfDay === 'morning' ? "Today's ritual" : timeOfDay === 'evening' ? 'Evening ritual' : 'Right now'}
              title={
                <span>
                  {ritual.length} {ritual.length === 1 ? 'supplement' : 'supplements'} on deck,
                  <br />anchored to {timeOfDay === 'evening' ? persona.routine.eveningTime : persona.routine.morningTime}.
                </span>
              }
              ctaHref="/stack"
              ctaLabel="Full stack"
              minHeight="320px"
            >
              {ritual.length > 0 ? (
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {ritual.slice(0, 3).map((item) => (
                    <Link
                      key={item.productId}
                      href={`/product/${item.productId}`}
                      className="group flex items-center gap-3 rounded-2xl bg-white/8 p-3 backdrop-blur-sm transition-colors hover:bg-white/14"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white/10">
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-contain p-1" loading="lazy" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10.5px] font-semibold uppercase text-white/60" style={{ letterSpacing: '0.1em' }}>
                          {item.brand.split(' ')[0]}
                        </div>
                        <div className="truncate text-[12.5px] font-semibold text-white">
                          {item.name.replace(/—.*$/, '').split(' ').slice(0, 3).join(' ')}
                        </div>
                        <div className="text-[10.5px] text-white/60">{item.dose}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] italic text-white/60">Nothing scheduled for this part of the day.</p>
              )}
            </BentoTile>

            <BentoTile
              variant="stat"
              span="col-span-12 lg:col-span-4"
              surface="oat"
              label={isMaya ? 'Day streak' : 'Long streak'}
              value={persona.streakDays.toString()}
              unit="days"
              caption={isMaya ? 'Next milestone, twenty-one.' : '180+ achieved · top three percent.'}
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
              imageUrl={ritualImage.url}
              alt={ritualImage.alt}
              eyebrow={timeOfDay === 'evening' ? 'Wind down' : 'Morning quiet'}
              caption={timeOfDay === 'evening' ? 'The lights soften. The body slows.' : isMaya ? 'A mug, the light, your stack.' : 'Strain budget, recovered.'}
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
              caption={avgAdherence >= 90 ? 'Crushing it.' : avgAdherence >= 75 ? 'Solid week.' : 'Room to grow.'}
              trend={adherenceTrend}
              accent="#0A6B3C"
              size="lg"
              minHeight="280px"
            />

            <BentoTile
              variant="stat"
              span="col-span-6 lg:col-span-2"
              surface="forest"
              label="Saved"
              value={`$${totalSaved}`}
              caption="this year"
              accent="#FFFFFF"
              size="md"
              minHeight="280px"
            />

            <BentoTile
              variant="content"
              span="col-span-12 lg:col-span-2"
              surface="bone"
              eyebrow="Next delivery"
              minHeight="280px"
            >
              <div className="mt-1">
                <div className="font-serif-display text-[40px] font-semibold leading-none text-[#0F1815]" style={{ letterSpacing: '-0.02em' }}>
                  {nextDelivery}
                </div>
                <p className="mt-3 text-[12px] text-[#666]" style={{ lineHeight: 1.45 }}>
                  {persona.stack.filter((s) => s.autoship).length} subscriptions active.
                </p>
                <Link href="/subscriptions" className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F1815] hover:opacity-70">
                  Manage <ArrowRight size={11} strokeWidth={2.5} />
                </Link>
              </div>
            </BentoTile>
          </Bento>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-6 pt-28 md:px-10 md:pt-36">
          <div className="mb-7">
            <div className="text-[11.5px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.22em' }}>
              The Forecast · {forecast.city}, {forecast.state}
            </div>
            <h2
              className="mt-4 font-serif-display font-semibold text-[#0F1815] max-w-[20ch]"
              style={{ fontSize: 'clamp(34px, 4vw, 52px)', letterSpacing: '-0.022em', lineHeight: 1.04 }}
            >
              {isMaya ? 'A bright spring week — and what to do with it.' : 'Cool dry days are opening up.'}
            </h2>
          </div>

          <EditorialSplit
            imageUrl={isMaya ? ALLERGY_LIFESTYLE.url : SUPPLEMENT_STILLLIFE_AMBER.url}
            alt={isMaya ? ALLERGY_LIFESTYLE.alt : SUPPLEMENT_STILLLIFE_AMBER.alt}
            ratio="content-heavy"
            minHeight="440px"
          >
            <AIMoment
              variant="flat"
              eyebrow={`Your advisor noticed`}
              headline={heroInsight.title}
              body={heroInsight.body}
              footerLabel={`Sourced from iHerb Wellness Hub`}
              footerRight={
                <Link
                  href="/forecast"
                  className="inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#0F1815] hover:opacity-70"
                >
                  Read the forecast
                  <ArrowRight size={12} strokeWidth={2.5} />
                </Link>
              }
            >
              {heroInsight.productSuggestion && (
                <div className="flex items-center gap-4 rounded-2xl bg-[#FBF9F4] p-4">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
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
                    <div className="truncate text-[14px] font-semibold text-[#0F1815]">
                      {heroInsight.productSuggestion.name}
                    </div>
                    <div className="text-[12.5px] text-[#666]">
                      {heroInsight.productSuggestion.reason}
                    </div>
                  </div>
                  <button className="flex-shrink-0 rounded-full bg-[#0F1815] px-4 py-2 text-[12.5px] font-semibold text-white transition-colors hover:bg-[#0A6B3C]">
                    Add
                  </button>
                </div>
              )}
            </AIMoment>
          </EditorialSplit>
        </section>

        <section className="mx-auto w-full max-w-[1500px] px-4 pt-28 sm:px-6 md:px-8 md:pt-36">
          <Billboard
            surface="ink"
            size="md"
            eyebrow={isMaya ? 'Curated · for beginners' : 'Curated · for your protocol'}
            headline={
              isMaya
                ? <>For the new ritual, <em className="not-italic font-serif-display" style={{ color: '#79A83C', fontStyle: 'italic' }}>start here.</em></>
                : <>Compounds your <em className="not-italic font-serif-display" style={{ color: '#79A83C', fontStyle: 'italic' }}>data</em> already wants.</>
            }
            body={
              isMaya
                ? 'Three small commitments. Each one is on a quality-promise tier and shipped on a schedule the advisor will tune for you.'
                : 'Five-supplement protocols backed by clinical research and calibrated to Whoop, Oura, and your continuous glucose. Reviewed by Dr. Chen.'
            }
            ctaLabel="Browse all bundles"
            ctaHref="/search?q=bundle"
            secondaryCtaLabel="Talk to your advisor"
            secondaryCtaHref="/advisor"
            rightSlot={
              <div className="grid grid-cols-3 gap-3">
                {bundles.map((b, i) => (
                  <Link
                    key={i}
                    href="/search?q=bundle"
                    className="group rounded-2xl bg-white/[0.04] p-3 backdrop-blur-sm transition-all hover:bg-white/[0.08]"
                  >
                    <div className="aspect-square overflow-hidden rounded-xl">
                      <BundleCollage images={b.images} alt={b.title} tint={b.tint} size="sm" />
                    </div>
                    <div className="mt-3 px-1">
                      <div className="font-serif-display text-[15px] font-semibold leading-tight text-white">
                        {b.title}
                      </div>
                      <div className="mt-1 text-[11.5px] text-white/60" style={{ lineHeight: 1.45 }}>{b.subtitle}</div>
                      <div className="mt-3 flex items-baseline justify-between">
                        <span className="text-[13px] font-semibold text-white">{b.price}</span>
                        <ArrowRight size={12} strokeWidth={2.5} className="text-white/70 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            }
          />
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-6 pt-28 md:px-10 md:pt-36">
          <div className="mb-8">
            <div className="text-[11.5px] font-bold uppercase text-[#0A6B3C]" style={{ letterSpacing: '0.22em' }}>
              Hands-off
            </div>
            <h2
              className="mt-4 font-serif-display font-semibold text-[#0F1815] max-w-[24ch]"
              style={{ fontSize: 'clamp(30px, 3.6vw, 44px)', letterSpacing: '-0.02em', lineHeight: 1.06 }}
            >
              What your advisor handled, while you weren&rsquo;t looking.
            </h2>
            <p className="mt-4 max-w-[560px] text-[15.5px] text-[#555]" style={{ lineHeight: 1.6 }}>
              Each one is reversible from your audit log. Open the advisor for the full conversation.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentActions.map((a) => (
              <AgentActionCard key={a.id} action={a} compact />
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-[1280px] px-6 pt-28 pb-24 md:px-10 md:pt-36 md:pb-32">
          <EditorialSplit
            imageUrl={RITUAL_BOTTLES_WOOD.url}
            alt={RITUAL_BOTTLES_WOOD.alt}
            eyebrow="Wellness Hub · For you"
            headline={
              <span>
                {isMaya
                  ? <>Glycinate, citrate, malate. <em className="not-italic font-serif-display italic">A guide.</em></>
                  : <>Threonate vs. taurate vs. glycinate. <em className="not-italic font-serif-display italic">What your sleep data is asking for.</em></>}
              </span>
            }
            body={
              isMaya
                ? "Why your advisor recommended glycinate for sleep — and when it makes sense to switch forms. A six-minute read."
                : "Three forms of magnesium, three different physiological mechanisms. Pick the one your continuous glucose and your Oura sleep agree on."
            }
            ratio="content-heavy"
            minHeight="420px"
            reverse
          >
            <Link
              href="/wellness-hub/magnesium-guide"
              className="inline-flex items-center gap-2 rounded-full bg-[#0F1815] px-7 py-3.5 text-[14px] font-semibold text-[#F5F1EA] transition-transform hover:-translate-y-0.5"
            >
              Read the guide
              <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-[#555]">
              Six-minute read · three products mentioned
            </span>
          </EditorialSplit>
        </section>
      </main>

      <Footer />
    </div>
  );
}
