'use client';

// Health Forecast — detailed 7-day environmental intelligence page.
// Reuses HealthForecastStrip (compact=false), AIMoment, AgentActionCard.
// Personalized: Maya sees actionable beginner copy, Daniel sees data-rich biohacker copy.

import { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Bell,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { HealthForecastStrip } from '@/components/HealthForecastStrip';
import { usePersona } from '@/components/PersonaProvider';
import { getForecast } from '@/data/healthForecast';
import { AgentAction } from '@/data/personas';

// UV color helper (mirrors HealthForecastStrip)
function uvColor(idx: number): string {
  if (idx <= 2) return '#79A83C';
  if (idx <= 5) return '#F5A623';
  if (idx <= 7) return '#D14800';
  return '#CA2222';
}

function pollenColor(level: string): string {
  if (level === 'Low') return '#79A83C';
  if (level === 'Moderate') return '#F5A623';
  if (level === 'High') return '#D14800';
  return '#CA2222';
}

function aqiColor(aqi: number): string {
  if (aqi <= 50) return '#79A83C';
  if (aqi <= 100) return '#F5A623';
  if (aqi <= 150) return '#D14800';
  return '#CA2222';
}

function aqiLabel(aqi: number): string {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive';
  return 'Unhealthy';
}

// Mini bar for pollen breakdown
function PollenBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 7 ? '#CA2222' : value >= 5 ? '#D14800' : value >= 3 ? '#F5A623' : '#79A83C';
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 text-[10.5px] font-semibold text-[#666]">{label}</div>
      <div className="flex-1 h-2 rounded-full bg-[#F0F0F0] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-6 text-right text-[10.5px] font-bold" style={{ color }}>{value.toFixed(1)}</div>
    </div>
  );
}

export default function ForecastPage() {
  const { persona } = usePersona();
  const forecast = getForecast(persona.id);
  const today = forecast.days[0];
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const isMaya = persona.id === 'maya';

  // Seasonal protocol agent actions — synthesized from persona data and season
  const seasonalActions: AgentAction[] = isMaya
    ? [
        {
          id: 'seas-m-1',
          type: 'taken',
          title: 'Added Quercetin + Bromelain to your spring protocol',
          detail:
            'Cedar and oak pollen in Austin peaks this week. Quercetin acts as a natural antihistamine. Take 1 capsule in the morning with Vitamin C for best absorption.',
          timestamp: 'This week',
          category: 'protocol',
        },
        {
          id: 'seas-m-2',
          type: 'taken',
          title: 'Reduced Vitamin D3 dose for spring/summer',
          detail:
            'UV index is Very High for most of the week — you\'ll synthesize enough D3 through sun exposure. Your autoship will resume at 5,000 IU in October.',
          timestamp: '2 days ago',
          category: 'subscription',
          savings: 'Paused D3 shipment — saved $18.99',
        },
        {
          id: 'seas-m-3',
          type: 'taken',
          title: 'Added electrolyte reminder for outdoor activity',
          detail:
            'Heat index forecast 95°F+ on 4 days this week. Added a hydration reminder at 10am and 3pm. LMNT Electrolyte Mix added to your suggested cart.',
          timestamp: 'Yesterday',
          category: 'protocol',
        },
      ]
    : [
        {
          id: 'seas-d-1',
          type: 'taken',
          title: 'Auto-reduced Vitamin D3 to 2,000 IU for spring',
          detail:
            'Seattle UV is entering seasonal "high" range (UV 6–7 Mon–Wed). Natural synthesis complements your NMN protocol. Will auto-restore to 5,000 IU post-September.',
          timestamp: '3 days ago',
          category: 'subscription',
        },
        {
          id: 'seas-d-2',
          type: 'taken',
          title: 'Added Quercetin to morning stack for allergy season',
          detail:
            'Tree pollen rising to High in Seattle. Quercetin Phytosome already in your longevity protocol — dose confirmed at 1 capsule AM. No change needed.',
          timestamp: '1 week ago',
          category: 'protocol',
        },
        {
          id: 'seas-d-3',
          type: 'taken',
          title: 'Pre-workout window moved earlier for outdoor Z2',
          detail:
            'Mon–Wed dry days optimal for outdoor zone-2. Moved LMNT + creatine timing to 6:45am to align with your Whoop morning readiness score of 84%.',
          timestamp: '2 days ago',
          category: 'protocol',
        },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">

        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="mb-5">
          <div className="mb-2 flex items-center gap-1.5 text-[#0A6B3C]">
            <Sparkles size={13} strokeWidth={2.5} />
            <span className="text-[10.5px] font-bold uppercase tracking-widest">
              Health Forecast
            </span>
          </div>
          <h1 className="text-[26px] font-bold text-[#1A1A1A]">
            {forecast.city}, {forecast.state} — May 1, 2026
          </h1>
          <p className="mt-1 text-[13.5px] text-[#666]">
            {isMaya
              ? 'Your environment, translated into wellness recommendations you can act on today.'
              : 'Your environment, correlated with biometric data to optimize your protocol in real time.'}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {isMaya ? (
              <>
                <ContextPill label="Based on your immune goal" />
                <ContextPill label="Austin allergy season active" />
                <ContextPill label="Beginner-friendly actions" />
              </>
            ) : (
              <>
                <ContextPill label="Whoop recovery: 84%" variant="data" />
                <ContextPill label="HRV trending +6 vs 30-day" variant="data" />
                <ContextPill label="AQI 32 — favorable for HIIT" variant="data" />
                <ContextPill label="Outdoor Z2 window open Mon–Wed" variant="data" />
              </>
            )}
          </div>
        </div>

        {/* ── 7-day strip ──────────────────────────────────────────────── */}
        <section className="mb-6">
          <HealthForecastStrip
            days={forecast.days}
            city={forecast.city}
            state={forecast.state}
            compact={false}
          />
        </section>

        {/* ── Three insight cards ──────────────────────────────────────── */}
        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">
              {isMaya ? 'What this week means for you' : 'Environmental signal analysis'}
            </h2>
            <p className="text-[12.5px] text-[#666]">
              {isMaya
                ? 'Plain-language guidance based on your goals and local conditions'
                : 'Correlated with Whoop, Oura, and your active longevity protocol'}
            </p>
          </div>
          <div className="space-y-4">
            {forecast.insights.map((insight, i) => (
              <AIMoment
                key={i}
                eyebrow={
                  i === 0
                    ? isMaya ? 'Allergy & immune' : 'Longevity protocol'
                    : i === 1
                      ? isMaya ? 'UV & vitamin D' : 'Training window'
                      : isMaya ? 'Heat & hydration' : 'Air quality & performance'
                }
                headline={
                  <span className="flex items-center gap-2">
                    <span className="text-[18px] leading-none">{insight.icon}</span>
                    <span>{insight.title}</span>
                  </span>
                }
                body={insight.body}
                footerLabel={`Powered by iHerb Wellness Hub · ${forecast.city}, ${forecast.state}`}
                footerRight={
                  <Link
                    href="/advisor"
                    className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
                  >
                    {insight.ctaLabel}
                    <ArrowRight size={10} strokeWidth={2.5} />
                  </Link>
                }
              >
                {insight.productSuggestion && (
                  <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] bg-[#FAFBFA] p-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[20px] shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      💊
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-[#1A1A1A]">
                        {insight.productSuggestion.name}
                      </div>
                      <div className="text-[11.5px] text-[#666]">
                        {insight.productSuggestion.reason}
                      </div>
                    </div>
                    <button className="rounded-full bg-[#0A6B3C] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#085131]">
                      Add to cart
                    </button>
                  </div>
                )}
              </AIMoment>
            ))}
          </div>
        </section>

        {/* ── Seasonal protocol ────────────────────────────────────────── */}
        <section className="mb-6">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h2 className="text-[18px] font-bold text-[#1A1A1A]">
                {isMaya ? 'Your spring protocol' : 'Seasonal stack adjustments'}
              </h2>
              <p className="text-[12.5px] text-[#666]">
                {isMaya
                  ? 'Your advisor updated your routine for the season — here\'s what changed'
                  : 'Autonomous adjustments made based on seasonal data, UV index, and biometric trends'}
              </p>
            </div>
            <Link
              href="/subscriptions"
              className="flex items-center gap-1 text-[12px] font-medium text-[#1558A6] hover:underline"
            >
              Manage subscriptions
              <ArrowRight size={11} strokeWidth={2.5} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {seasonalActions.map((action) => (
              <AgentActionCard key={action.id} action={action} />
            ))}
          </div>
        </section>

        {/* ── Environmental detail grid ─────────────────────────────── */}
        <section className="mb-6">
          <div className="mb-3">
            <h2 className="text-[18px] font-bold text-[#1A1A1A]">
              Today&rsquo;s environmental detail
            </h2>
            <p className="text-[12.5px] text-[#666]">
              {isMaya
                ? 'What these numbers mean for your day — in plain English'
                : `Quantified environmental inputs for ${forecast.city}, ${forecast.state} · May 1, 2026`}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4">
            {/* UV Index */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${uvColor(today.uvIndex)}1a` }}
                >
                  <Sun size={15} strokeWidth={2.5} style={{ color: uvColor(today.uvIndex) }} />
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                  UV Index
                </span>
              </div>
              <div
                className="text-[36px] font-bold leading-none"
                style={{ color: uvColor(today.uvIndex) }}
              >
                {today.uvIndex}
              </div>
              <div
                className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold text-white"
                style={{ backgroundColor: uvColor(today.uvIndex) }}
              >
                {today.uvLabel}
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-[#666]">
                {isMaya
                  ? today.uvIndex >= 8
                    ? 'Apply SPF 30+ before going outside. Your Vitamin D needs are covered.'
                    : 'Moderate UV — 20 min outside covers your Vitamin D needs.'
                  : today.uvIndex >= 6
                    ? 'Sufficient for D3 synthesis. Morning outdoor run window: 8–10am for optimal angle.'
                    : 'Low synthesis — maintain D3 supplementation at adjusted dose.'}
              </p>
            </div>

            {/* Air Quality */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: `${aqiColor(today.airQualityIndex)}1a` }}
                >
                  <Wind size={15} strokeWidth={2.5} style={{ color: aqiColor(today.airQualityIndex) }} />
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                  Air Quality
                </span>
              </div>
              <div
                className="text-[36px] font-bold leading-none"
                style={{ color: aqiColor(today.airQualityIndex) }}
              >
                {today.airQualityIndex}
              </div>
              <div
                className="mt-1 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold text-white"
                style={{ backgroundColor: aqiColor(today.airQualityIndex) }}
              >
                {aqiLabel(today.airQualityIndex)}
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-[#666]">
                {isMaya
                  ? today.airQualityIndex > 70
                    ? 'AQI moderate-high — limit time outside if you feel allergy symptoms.'
                    : 'Air quality is good for outdoor activity today.'
                  : today.airQualityIndex < 50
                    ? `AQI ${today.airQualityIndex} — well below HIIT threshold. Outdoor training fully cleared.`
                    : `AQI ${today.airQualityIndex} — moderate. Quercetin protocol on. Z2 cleared, HIIT caution.`}
              </p>
            </div>

            {/* Pollen Breakdown */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF7E5]">
                  <span className="text-[14px]">🌳</span>
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                  Pollen
                </span>
              </div>
              <div
                className="mb-2 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold text-white"
                style={{ backgroundColor: pollenColor(today.pollenLevel) }}
              >
                {today.pollenLevel}
              </div>
              <div className="space-y-2 mt-2">
                <PollenBar label="Tree" value={today.pollenTree} />
                <PollenBar label="Grass" value={today.pollenGrass} />
                <PollenBar
                  label="Weed"
                  value={isMaya ? 3.8 : 1.4}
                />
              </div>
              <p className="mt-3 text-[11px] text-[#888]">
                {isMaya
                  ? 'Cedar oak dominant — peak season for Central Texas'
                  : 'Alder + birch primary — typical Pacific Northwest May'}
              </p>
            </div>

            {/* Heat / Hydration */}
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFF1E8]">
                  <Thermometer size={15} className="text-[#D14800]" strokeWidth={2.5} />
                </div>
                <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#666]">
                  Heat &amp; Hydration
                </span>
              </div>
              <div className="text-[36px] font-bold leading-none text-[#1A1A1A]">
                {today.tempHigh}°
              </div>
              <div className="mt-1 text-[10.5px] text-[#888]">
                High · {today.tempLow}° low
              </div>
              <div className="mt-3 flex items-center gap-2">
                <Droplets size={12} className="text-[#1558A6]" strokeWidth={2.5} />
                <span className="text-[11.5px] font-medium text-[#1558A6]">
                  {isMaya
                    ? today.tempHigh >= 85
                      ? 'High hydration risk'
                      : 'Normal hydration'
                    : `HRR target: ${today.tempHigh >= 65 ? 'adjust pacing +5 bpm' : 'normal pace'}`}
                </span>
              </div>
              <p className="mt-2 text-[11.5px] leading-snug text-[#666]">
                {isMaya
                  ? today.tempHigh >= 85
                    ? 'Heat index 95°F+ likely. Add electrolytes if training outside today.'
                    : 'Mild heat risk. Standard water intake sufficient.'
                  : today.tempHigh >= 62
                    ? 'Optimal outdoor Z2 temp range. Pre-workout LMNT queued at 6:45am.'
                    : 'Cool conditions — ideal for tempo runs. No electrolyte adjustments needed.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Alerts banner (Maya only, high pollen) ────────────────── */}
        {isMaya && today.alerts && today.alerts.length > 0 && (
          <section className="mb-6">
            <div className="rounded-2xl border border-[#FFD9C4] bg-gradient-to-r from-[#FFF7F1] to-white p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[#D14800]/10">
                  <span className="text-[16px]">⚠️</span>
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-[#D14800]">
                    Weather alert
                  </div>
                  <div className="mt-0.5 text-[13px] font-semibold text-[#1A1A1A]">
                    {today.alerts[0]}
                  </div>
                  <p className="mt-1 text-[12px] text-[#666]">
                    Your advisor has added quercetin to your morning routine and set hydration reminders for today. Rain forecast Sunday may offer relief.
                  </p>
                </div>
                <Link
                  href="/advisor"
                  className="flex-shrink-0 rounded-full border border-[#D14800] px-3 py-1.5 text-[12px] font-semibold text-[#D14800] hover:bg-[#FFF1E8]"
                >
                  View changes
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* ── Daniel: weekly training window ────────────────────────── */}
        {!isMaya && (
          <section className="mb-6">
            <AIMoment
              eyebrow="Training window analysis"
              headline="This week: 3 outdoor Z2 sessions optimal"
              body="Mon (UV 7, AQI 48), Tue (UV 5, AQI 38), and Sat (UV 5, AQI 35) align with your Whoop recovery score and heart rate variability. Wednesday rain clears particulates — consider a tempo run if strain budget allows."
              footerLabel={`Powered by iHerb Wellness Hub · Whoop + Oura integration`}
              footerRight={
                <Link
                  href="/advisor"
                  className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
                >
                  Open advisor
                  <ArrowRight size={10} strokeWidth={2.5} />
                </Link>
              }
            >
              <div className="mt-1 grid grid-cols-7 gap-1.5">
                {forecast.days.map((day, i) => {
                  const score = day.airQualityIndex <= 40 && day.uvIndex >= 4 ? 'great' : day.airQualityIndex <= 55 ? 'good' : 'fair';
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div className="text-[10px] font-bold text-[#666]">{day.label.slice(0, 3)}</div>
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg text-[14px] ${
                        score === 'great' ? 'bg-[#F1FAF3] border border-[#C3E6CB]' :
                        score === 'good' ? 'bg-[#FFF7E5] border border-[#F5D78A]' :
                        'bg-[#F8F8F8] border border-[#E8E8E8]'
                      }`}>
                        {day.weather}
                      </div>
                      <div className={`text-[8.5px] font-bold uppercase ${
                        score === 'great' ? 'text-[#0A6B3C]' :
                        score === 'good' ? 'text-[#B38900]' :
                        'text-[#999]'
                      }`}>
                        {score}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AIMoment>
          </section>
        )}

        {/* ── Stay ahead: email reminder ────────────────────────────── */}
        <section className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-[#D9EADF] bg-gradient-to-br from-[#F1FAF3] to-white">
            <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />
            <div className="p-6">
              <div className="grid grid-cols-12 gap-5 items-center">
                <div className="col-span-8">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bell size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
                    <span className="text-[10.5px] font-bold uppercase tracking-widest text-[#0A6B3C]">
                      Stay ahead of your environment
                    </span>
                  </div>
                  <h2 className="text-[18px] font-bold text-[#1A1A1A]">
                    {isMaya
                      ? 'Get your daily forecast in your inbox'
                      : 'Daily environmental briefing — delivered at 6am'}
                  </h2>
                  <p className="mt-1 text-[13px] text-[#555]">
                    {isMaya
                      ? 'A short, plain-language summary each morning: what\'s in the air, what to take, what to watch.'
                      : 'AQI, pollen index, UV forecast, and protocol adjustments — all before your first workout.'}
                  </p>
                </div>
                <div className="col-span-4">
                  {emailSubmitted ? (
                    <div className="flex items-center gap-2 rounded-xl border border-[#C3E6CB] bg-white p-4">
                      <CheckCircle2 size={18} className="text-[#0A6B3C]" strokeWidth={2.5} />
                      <div>
                        <div className="text-[13px] font-semibold text-[#1A1A1A]">You&rsquo;re on the list!</div>
                        <div className="text-[11px] text-[#666]">First forecast arrives tomorrow at 6am.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#E0E0E0] bg-white p-3">
                      <div className="text-[11px] font-semibold text-[#444] mb-2">
                        Notify me daily at
                      </div>
                      <div className="flex gap-1.5 mb-2">
                        {['6am', '7am', '8am'].map((t) => (
                          <button
                            key={t}
                            className="flex-1 rounded-full border border-[#E0E0E0] py-1 text-[11px] font-semibold text-[#444] hover:border-[#0A6B3C] hover:bg-[#F1FAF3] hover:text-[#0A6B3C] transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="mb-2 w-full rounded-lg border border-[#E0E0E0] px-3 py-2 text-[12px] text-[#1A1A1A] placeholder-[#AAA] focus:border-[#0A6B3C] focus:outline-none"
                      />
                      <button
                        onClick={() => { if (email.trim()) setEmailSubmitted(true); }}
                        className="w-full rounded-full bg-[#0A6B3C] py-2 text-[12px] font-bold text-white hover:bg-[#085131] transition-colors"
                      >
                        Set up daily forecast
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
