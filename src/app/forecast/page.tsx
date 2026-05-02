'use client';

// Health Forecast — editorial rebuild.
// Big lifestyle hero of the user's location, restyled environmental detail
// gauges, magazine-style insight breaks with lifestyle imagery, expert
// callout, and seasonal protocol. The page now reads as a wellness
// publication's daily briefing rather than a dashboard.

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
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AIMoment, ContextPill } from '@/components/AIMoment';
import { AgentActionCard } from '@/components/AgentActionCard';
import { HealthForecastStrip } from '@/components/HealthForecastStrip';
import { LifestyleHero } from '@/components/LifestyleHero';
import { EditorialQuote } from '@/components/EditorialQuote';
import { ExpertCallout } from '@/components/ExpertCallout';
import { usePersona } from '@/components/PersonaProvider';
import { getForecast } from '@/data/healthForecast';
import { AgentAction } from '@/data/personas';
import {
  FORECAST_HERO_AUSTIN,
  FORECAST_HERO_SEATTLE,
  ALLERGY_LIFESTYLE,
  HYDRATION_LIFESTYLE,
  EXPERT_DR_CHEN,
} from '@/data/lifestyleImages';

// ── Helpers ─────────────────────────────────────────────────────────────────

function uvColor(idx: number): string {
  if (idx <= 2) return '#79A83C';
  if (idx <= 5) return '#F5A623';
  if (idx <= 7) return '#D14800';
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

function pollenColor(level: string): string {
  if (level === 'Low') return '#79A83C';
  if (level === 'Moderate') return '#F5A623';
  if (level === 'High') return '#D14800';
  return '#CA2222';
}

// Half-circle gauge — used inside each environmental tile.
function Gauge({
  value,
  max,
  color,
  unit,
  size = 130,
}: {
  value: number;
  max: number;
  color: string;
  unit?: string;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(1, value / max));
  const circumference = Math.PI * 60; // half-circle perimeter at r=60
  const dash = circumference * pct;
  const strokeWidth = 12;

  return (
    <svg width={size} height={size / 2 + 18} viewBox="0 0 160 90" className="overflow-visible">
      {/* Track */}
      <path
        d="M 20 80 A 60 60 0 0 1 140 80"
        fill="none"
        stroke="#F0F0F0"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Value arc */}
      <path
        d="M 20 80 A 60 60 0 0 1 140 80"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
      />
      <text
        x="80"
        y="68"
        textAnchor="middle"
        fontSize="28"
        fontWeight="700"
        fill="#1A1A1A"
      >
        {value}
      </text>
      {unit && (
        <text x="80" y="84" textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#888" letterSpacing="1.5">
          {unit}
        </text>
      )}
    </svg>
  );
}

// Mini horizontal pollen meter
function PollenBar({ label, value, max = 10 }: { label: string; value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 7 ? '#CA2222' : value >= 5 ? '#D14800' : value >= 3 ? '#F5A623' : '#79A83C';
  return (
    <div className="flex items-center gap-2">
      <div className="w-12 text-[10.5px] font-semibold text-[#666]">{label}</div>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#F0F0F0]">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <div className="w-7 text-right text-[10.5px] font-bold tabular-nums" style={{ color }}>{value.toFixed(1)}</div>
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
  const heroImage = isMaya ? FORECAST_HERO_AUSTIN : FORECAST_HERO_SEATTLE;

  // Seasonal protocol agent actions (synthesized from persona + season).
  const seasonalActions: AgentAction[] = isMaya
    ? [
        {
          id: 'seas-m-1',
          type: 'taken',
          title: 'Added Quercetin + Bromelain to your spring protocol',
          detail:
            'Cedar and oak pollen in Austin peaks this week. Quercetin acts as a natural antihistamine.',
          timestamp: 'This week',
          category: 'protocol',
        },
        {
          id: 'seas-m-2',
          type: 'taken',
          title: 'Reduced Vitamin D3 dose for spring/summer',
          detail:
            'UV index is Very High most of the week — sun synthesizes enough D3.',
          timestamp: '2 days ago',
          category: 'subscription',
          savings: '$18.99',
        },
        {
          id: 'seas-m-3',
          type: 'taken',
          title: 'Hydration reminders queued for outdoor activity',
          detail:
            'Heat index forecast 95°F+ on 4 days. LMNT added to your suggested cart.',
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
            'Seattle UV entering seasonal high range. Natural synthesis complements your NMN protocol.',
          timestamp: '3 days ago',
          category: 'subscription',
        },
        {
          id: 'seas-d-2',
          type: 'taken',
          title: 'Added Quercetin to morning stack for allergy season',
          detail:
            'Tree pollen rising to High in Seattle — already in your longevity protocol.',
          timestamp: '1 week ago',
          category: 'protocol',
        },
        {
          id: 'seas-d-3',
          type: 'taken',
          title: 'Pre-workout window moved earlier for outdoor Z2',
          detail:
            'Mon–Wed dry days optimal. LMNT + creatine timing now 6:45am to align with Whoop readiness.',
          timestamp: '2 days ago',
          category: 'protocol',
        },
      ];

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <Header />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-8 py-6">

        {/* ── Editorial hero ───────────────────────────────────────── */}
        <section className="mb-6">
          <LifestyleHero
            imageUrl={heroImage.url}
            alt={heroImage.alt}
            eyebrow={`Health Forecast · May 1, 2026`}
            headline={
              isMaya
                ? 'A bright spring week in Austin — and what to do with it.'
                : 'Cool dry days are opening up in the Pacific Northwest.'
            }
            subline={
              isMaya
                ? 'Your environment, translated into wellness recommendations you can act on today.'
                : 'Your environment, correlated with biometric data to optimize your protocol in real time.'
            }
            size="xl"
            tint={isMaya ? 'coral' : 'green'}
            overlay="medium"
          >
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
              <MapPin size={12} strokeWidth={2.5} />
              {forecast.city}, {forecast.state}
            </div>
            {isMaya ? (
              <>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Allergy season active
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Beginner-friendly recommendations
                </div>
              </>
            ) : (
              <>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Whoop recovery: 84%
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  AQI 32 · favorable for HIIT
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  Z2 window open Mon–Wed
                </div>
              </>
            )}
          </LifestyleHero>
        </section>

        {/* ── 7-day strip ──────────────────────────────────────────── */}
        <section className="mb-6">
          <HealthForecastStrip
            days={forecast.days}
            city={forecast.city}
            state={forecast.state}
            compact={false}
          />
        </section>

        {/* ── Today's conditions: 4-tile bento with gauges ─────────── */}
        <section className="mb-6">
          <div className="mb-3">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#0A6B3C]">
              Today&rsquo;s conditions
            </div>
            <h2 className="mt-1 text-[22px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.01em' }}>
              {isMaya ? 'What the air, sun, and heat are doing for you' : 'Quantified environmental inputs'}
            </h2>
          </div>

          <div className="grid grid-cols-12 gap-4">
            {/* UV — coral/orange */}
            <div className="col-span-3 overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-5">
              <div className="mb-2 flex items-center gap-1.5">
                <Sun size={13} className="text-[#FF6B4A]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D14800]">
                  UV Index
                </span>
              </div>
              <div className="flex justify-center">
                <Gauge value={today.uvIndex} max={11} color={uvColor(today.uvIndex)} unit="OF 11" />
              </div>
              <div
                className="mx-auto mt-1 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: uvColor(today.uvIndex) }}
              >
                {today.uvLabel}
              </div>
              <p className="mt-3 text-[11.5px] leading-snug text-[#7B4022]">
                {isMaya
                  ? today.uvIndex >= 8 ? 'Apply SPF 30+ outside. D3 needs covered.' : '20 min outside covers your D3 needs.'
                  : today.uvIndex >= 6 ? 'Sufficient for D3 synthesis. 8–10am window optimal.' : 'Maintain D3 supplementation.'}
              </p>
            </div>

            {/* AQI — teal */}
            <div className="col-span-3 overflow-hidden rounded-2xl border border-[#A7DDDC] bg-gradient-to-br from-[#E5F6F5] via-[#D4EFEE] to-[#BFE6E4] p-5">
              <div className="mb-2 flex items-center gap-1.5">
                <Wind size={13} className="text-[#0E9594]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#0E9594]">
                  Air Quality
                </span>
              </div>
              <div className="flex justify-center">
                <Gauge value={today.airQualityIndex} max={200} color={aqiColor(today.airQualityIndex)} unit="AQI" />
              </div>
              <div
                className="mx-auto mt-1 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: aqiColor(today.airQualityIndex) }}
              >
                {aqiLabel(today.airQualityIndex)}
              </div>
              <p className="mt-3 text-[11.5px] leading-snug text-[#1F6E6D]">
                {isMaya
                  ? today.airQualityIndex > 70 ? 'Limit time outside if symptomatic.' : 'Good for outdoor activity.'
                  : today.airQualityIndex < 50 ? 'Below HIIT threshold. Outdoor cleared.' : 'Z2 cleared. HIIT caution.'}
              </p>
            </div>

            {/* Pollen — gold (uses pollen helper) */}
            <div className="col-span-3 overflow-hidden rounded-2xl border border-[#F5D78A] bg-gradient-to-br from-[#FFF7E5] via-[#FFEFC3] to-[#FFE7A5] p-5">
              <div className="mb-2 flex items-center gap-1.5">
                <span className="text-[14px]">🌳</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B38900]">
                  Pollen
                </span>
              </div>
              <div
                className="mb-3 inline-block rounded-full px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: pollenColor(today.pollenLevel) }}
              >
                {today.pollenLevel}
              </div>
              <div className="space-y-2">
                <PollenBar label="Tree" value={today.pollenTree} />
                <PollenBar label="Grass" value={today.pollenGrass} />
                <PollenBar label="Weed" value={isMaya ? 3.8 : 1.4} />
              </div>
              <p className="mt-3 text-[11px] text-[#856600]">
                {isMaya ? 'Cedar oak peaking · Central Texas' : 'Alder + birch · typical PNW May'}
              </p>
            </div>

            {/* Heat / Hydration — coral/red */}
            <div className="col-span-3 overflow-hidden rounded-2xl border border-[#FFC7B0] bg-gradient-to-br from-[#FFF1E8] via-[#FFE8DC] to-[#FFD9C4] p-5">
              <div className="mb-2 flex items-center gap-1.5">
                <Thermometer size={13} className="text-[#FF6B4A]" strokeWidth={2.5} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#D14800]">
                  Heat &amp; Hydration
                </span>
              </div>
              <div className="text-[44px] font-bold leading-none text-[#1A1A1A]">{today.tempHigh}°</div>
              <div className="text-[11px] text-[#7B4022]">High · {today.tempLow}° low</div>
              <div className="mt-3 flex items-center gap-1.5">
                <Droplets size={11} className="text-[#1558A6]" strokeWidth={2.5} />
                <span className="text-[11px] font-semibold text-[#1558A6]">
                  {isMaya
                    ? today.tempHigh >= 85 ? 'High hydration risk' : 'Normal hydration'
                    : `HRR target: ${today.tempHigh >= 65 ? '+5 bpm' : 'normal'}`}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-[#7B4022]">
                {isMaya
                  ? today.tempHigh >= 85 ? 'Heat index 95°F+. Add electrolytes.' : 'Mild heat risk. Standard intake.'
                  : today.tempHigh >= 62 ? 'Optimal Z2 temp. LMNT queued 6:45am.' : 'Cool tempo run conditions.'}
              </p>
            </div>
          </div>
        </section>

        {/* ── Editorial quote — section break ──────────────────────── */}
        <section className="mb-7">
          <EditorialQuote
            variant="tinted"
            tint={isMaya ? 'coral' : 'green'}
            quote={
              isMaya
                ? "Your environment is a continuous wellness input — and this week, it's asking more of you than usual. Lean into hydration, give your immune system a hand."
                : "When the data agrees — UV climbing, AQI clean, recovery green — your protocol can lean forward. This is one of those weeks."
            }
            attribution="Dr. Sarah Chen, ND"
            credential="Naturopathic Doctor · iHerb Wellness Hub clinical reviewer"
            portraitUrl={EXPERT_DR_CHEN.url}
          />
        </section>

        {/* ── Insight cards (intermixed with imagery) ──────────────── */}
        <section className="mb-6">
          <div className="mb-3">
            <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#0A6B3C]">
              {isMaya ? 'Read of the week' : 'Environmental signal analysis'}
            </div>
            <h2 className="mt-1 text-[22px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.01em' }}>
              {isMaya ? 'What this week means for you' : 'Where to lean in, where to back off'}
            </h2>
            <p className="mt-1 text-[13px] text-[#666]">
              {isMaya
                ? 'Plain-language guidance based on your goals and local conditions'
                : 'Correlated with Whoop, Oura, and your active longevity protocol'}
            </p>
          </div>

          <div className="grid grid-cols-12 gap-5">
            {/* First insight (full width on left) */}
            <div className="col-span-7">
              {forecast.insights[0] && (
                <AIMoment
                  eyebrow={isMaya ? 'Allergy & immune' : 'Longevity protocol'}
                  headline={
                    <span className="flex items-center gap-2">
                      <span className="text-[18px] leading-none">{forecast.insights[0].icon}</span>
                      <span>{forecast.insights[0].title}</span>
                    </span>
                  }
                  body={forecast.insights[0].body}
                  footerLabel={`Powered by iHerb Wellness Hub · ${forecast.city}, ${forecast.state}`}
                  footerRight={
                    <Link
                      href="/advisor"
                      className="flex items-center gap-0.5 text-[11px] font-medium text-[#1558A6] hover:underline"
                    >
                      {forecast.insights[0].ctaLabel}
                      <ArrowRight size={10} strokeWidth={2.5} />
                    </Link>
                  }
                >
                  {forecast.insights[0].productSuggestion && (
                    <div className="flex items-center gap-3 rounded-xl border border-[#E8E8E8] bg-[#FAFBFA] p-3">
                      <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                        {forecast.insights[0].productSuggestion.imageUrl ? (
                          <img src={forecast.insights[0].productSuggestion.imageUrl} alt={forecast.insights[0].productSuggestion.name} className="h-full w-full object-contain" loading="lazy" />
                        ) : (
                          <span className="text-[20px]">💊</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold text-[#1A1A1A]">{forecast.insights[0].productSuggestion.name}</div>
                        <div className="text-[11.5px] text-[#666]">{forecast.insights[0].productSuggestion.reason}</div>
                      </div>
                      <button className="rounded-full bg-[#0A6B3C] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#085131]">
                        Add to cart
                      </button>
                    </div>
                  )}
                </AIMoment>
              )}
            </div>

            {/* Lifestyle vignette (right side) */}
            <div className="col-span-5">
              <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl border border-[#EBEBEB]">
                <img
                  src={ALLERGY_LIFESTYLE.url}
                  alt={ALLERGY_LIFESTYLE.alt}
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
                    Seasonal context
                  </div>
                  <div className="mt-1 text-[16px] font-semibold leading-snug">
                    {isMaya
                      ? "Cedar and oak pollen drive 70% of Austin's spring sneezes."
                      : 'PNW alder peaks early and intense — short window of relief.'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Remaining insights in a 2-up below */}
          <div className="mt-5 grid grid-cols-2 gap-5">
            {forecast.insights.slice(1).map((insight, i) => (
              <AIMoment
                key={i}
                eyebrow={
                  i === 0
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
                footerLabel="Powered by iHerb Wellness Hub"
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
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                      {insight.productSuggestion.imageUrl ? (
                        <img src={insight.productSuggestion.imageUrl} alt={insight.productSuggestion.name} className="h-full w-full object-contain" loading="lazy" />
                      ) : (
                        <span className="text-[20px]">💊</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-[#1A1A1A]">{insight.productSuggestion.name}</div>
                      <div className="text-[11.5px] text-[#666]">{insight.productSuggestion.reason}</div>
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

        {/* ── Hydration lifestyle break (Maya only, when heat is high) ── */}
        {isMaya && today.tempHigh >= 85 && (
          <section className="mb-6">
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-5">
                <div className="relative h-[220px] overflow-hidden rounded-2xl border border-[#EBEBEB]">
                  <img src={HYDRATION_LIFESTYLE.url} alt={HYDRATION_LIFESTYLE.alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                </div>
              </div>
              <div className="col-span-7 flex flex-col justify-center">
                <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#0E9594]">
                  Hydration cue
                </div>
                <h3 className="mt-1 text-[22px] font-bold leading-snug text-[#1A1A1A]" style={{ letterSpacing: '-0.01em' }}>
                  Four hot days this week. Your sodium needs go up before they catch up to you.
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-[#555]">
                  Heat index 95°F+ is the threshold where most people start losing electrolytes faster than they replace them. We added a hydration reminder for 10 AM and 3 PM — and a one-tap LMNT add-to-cart in your morning brief.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Link
                    href="/cart"
                    className="rounded-full bg-[#0A6B3C] px-4 py-2 text-[12.5px] font-bold text-white transition-all hover:bg-[#085131]"
                  >
                    View cart
                  </Link>
                  <Link
                    href="/advisor"
                    className="text-[12.5px] font-medium text-[#1558A6] hover:underline"
                  >
                    Discuss with advisor →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Seasonal protocol ────────────────────────────────────── */}
        <section className="mb-6">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <div className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#6B4FBC]">
                Seasonal protocol
              </div>
              <h2 className="mt-1 text-[22px] font-bold text-[#1A1A1A]" style={{ letterSpacing: '-0.01em' }}>
                {isMaya ? 'Your spring routine — adjusted' : 'Stack adjustments for the season'}
              </h2>
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

        {/* ── Daniel: training window analysis ─────────────────────── */}
        {!isMaya && (
          <section className="mb-6">
            <AIMoment
              eyebrow="Training window analysis"
              headline="This week: 3 outdoor Z2 sessions optimal"
              body="Mon (UV 7, AQI 48), Tue (UV 5, AQI 38), and Sat (UV 5, AQI 35) align with your Whoop recovery score. Wednesday rain clears particulates — consider a tempo run if strain budget allows."
              footerLabel="Powered by iHerb Wellness Hub · Whoop + Oura integration"
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

        {/* ── Email signup — magazine footer style ─────────────────── */}
        <section className="mb-6">
          <div className="overflow-hidden rounded-2xl border border-[#D9EADF] bg-gradient-to-br from-[#F1FAF3] to-white">
            <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />
            <div className="p-7">
              <div className="grid grid-cols-12 gap-5 items-center">
                <div className="col-span-7">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Bell size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
                    <span className="text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#0A6B3C]">
                      The morning briefing
                    </span>
                  </div>
                  <h2 className="text-[22px] font-bold leading-snug text-[#1A1A1A]" style={{ letterSpacing: '-0.01em' }}>
                    {isMaya
                      ? 'Your forecast in your inbox before coffee.'
                      : 'AQI, pollen, UV, protocol — before your first workout.'}
                  </h2>
                  <p className="mt-2 text-[13px] leading-relaxed text-[#555]">
                    {isMaya
                      ? "A short, plain-language summary each morning — what's in the air, what to take, what to watch."
                      : "Daily environmental briefing with the protocol adjustments your advisor made overnight, calibrated to your data."}
                  </p>
                </div>
                <div className="col-span-5">
                  {emailSubmitted ? (
                    <div className="flex items-center gap-2 rounded-xl border border-[#C3E6CB] bg-white p-4">
                      <CheckCircle2 size={18} className="text-[#0A6B3C]" strokeWidth={2.5} />
                      <div>
                        <div className="text-[13px] font-semibold text-[#1A1A1A]">You&rsquo;re on the list.</div>
                        <div className="text-[11px] text-[#666]">First brief arrives tomorrow at 6 AM.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-[#E0E0E0] bg-white p-3.5">
                      <div className="mb-2 text-[11px] font-semibold text-[#444]">
                        Notify me daily at
                      </div>
                      <div className="mb-2 flex gap-1.5">
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
                        Set up daily brief
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
