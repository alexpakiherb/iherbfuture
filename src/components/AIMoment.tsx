'use client';

// AIMoment — the canonical "this is the AI doing something for you" container.
// Used wherever the experience surfaces a personalized insight, recommendation,
// or summary. Visual recipe matches Search 2.0's AIAnswerCard:
//   - 3px gradient accent bar on top
//   - Sparkles + uppercase eyebrow tagline
//   - Headline (semi-bold)
//   - Optional body
//   - Optional chip row (action chips)
//   - "Powered by iHerb Wellness Hub" footer (optional)

import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';

interface AIMomentProps {
  eyebrow?: string;
  headline: ReactNode;
  body?: ReactNode;
  children?: ReactNode;
  footerLabel?: string;
  footerRight?: ReactNode;
  /**
   * `card` — white box with subtle border + soft shadow + thin accent bar (default).
   * `inline` — tinted left-accent strip for inline notes.
   * `flat`  — editorial v2: no border, no shadow, no accent bar; just a green
   *           sparkle eyebrow + headline + body + footer divider. Use this on
   *           pages where the card chrome was overpowering. (May 3 2026)
   */
  variant?: 'card' | 'inline' | 'flat';
  className?: string;
}

export function AIMoment({
  eyebrow = 'Personalized for you',
  headline,
  body,
  children,
  footerLabel = 'Powered by iHerb Wellness Hub',
  footerRight,
  variant = 'card',
  className = '',
}: AIMomentProps) {
  if (variant === 'inline') {
    // Inline variant: tinted background, left accent bar, no shadow
    return (
      <div
        className={`flex gap-3 rounded-xl border border-[#C3E6CB] bg-[#F1FAF3] px-4 py-3.5 ${className}`}
      >
        <div className="mt-1 w-[3px] flex-shrink-0 rounded-full bg-[#0A6B3C]" />
        <div className="flex-1 min-w-0">
          <div className="mb-1.5 flex items-center gap-1.5">
            <Sparkles size={12} className="text-[#0A6B3C]" strokeWidth={2.5} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
              {eyebrow}
            </span>
          </div>
          <div className="mb-1 text-[14px] font-semibold leading-snug text-[#1A1A1A]">
            {headline}
          </div>
          {body && <div className="text-[13px] leading-relaxed text-[#555]">{body}</div>}
          {children && <div className="mt-2.5">{children}</div>}
        </div>
      </div>
    );
  }

  if (variant === 'flat') {
    // Flat editorial variant — no card chrome. Use inside other layout
    // sections (EditorialSplit, full-width sections) where the AI moment
    // is one of several content blocks and shouldn't dominate visually.
    return (
      <div className={`animate-[fadeIn_200ms_ease-out] ${className}`}>
        <div className="mb-3 flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
          <span
            className="text-[11px] font-bold uppercase text-[#0A6B3C]"
            style={{ letterSpacing: '0.18em' }}
          >
            {eyebrow}
          </span>
        </div>
        <div
          className="text-[22px] md:text-[26px] font-bold text-[#1A1A1A]"
          style={{ letterSpacing: '-0.012em', lineHeight: 1.18 }}
        >
          {headline}
        </div>
        {body && (
          <div className="mt-3 text-[15px] text-[#555]" style={{ lineHeight: 1.6 }}>
            {body}
          </div>
        )}
        {children && <div className="mt-5">{children}</div>}
        {(footerLabel || footerRight) && (
          <div className="mt-5 flex items-center justify-between border-t border-[#EEE] pt-3">
            {footerLabel && <span className="text-[11px] text-[#888]">{footerLabel}</span>}
            {footerRight && <div className="ml-auto">{footerRight}</div>}
          </div>
        )}
      </div>
    );
  }

  // Card variant: white background, gradient bar, shadow.
  // Lightened May 3 2026: thinner accent (1px), softer shadow, slightly
  // larger headline + body so it earns its space when used.
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#EAEAEA] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(10,107,60,0.05)] animate-[fadeIn_200ms_ease-out] ${className}`}
    >
      <div className="h-[2px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

      <div className="px-6 py-5">
        <div className="mb-2 flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#0A6B3C]" strokeWidth={2.5} />
          <span
            className="text-[11px] font-bold uppercase text-[#0A6B3C]"
            style={{ letterSpacing: '0.18em' }}
          >
            {eyebrow}
          </span>
        </div>
        <div
          className="text-[18px] font-bold text-[#1A1A1A]"
          style={{ letterSpacing: '-0.01em', lineHeight: 1.25 }}
        >
          {headline}
        </div>
        {body && (
          <div
            className="mt-2 text-[14.5px] text-[#444]"
            style={{ lineHeight: 1.6 }}
          >
            {body}
          </div>
        )}
        {children && <div className="mt-4">{children}</div>}
      </div>

      {(footerLabel || footerRight) && (
        <div className="flex items-center justify-between border-t border-[#F2F2F2] bg-white px-6 py-3">
          {footerLabel && (
            <span className="text-[11px] text-[#888]">{footerLabel}</span>
          )}
          {footerRight && <div className="ml-auto">{footerRight}</div>}
        </div>
      )}
    </div>
  );
}

// Context pill — used to label why something is shown ("Based on your sleep goal")
interface ContextPillProps {
  label: string;
  variant?: 'default' | 'data';
}
export function ContextPill({ label, variant = 'default' }: ContextPillProps) {
  const isData = variant === 'data';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-semibold ${
        isData
          ? 'border border-[#B6CFEC] bg-[#EAF1FB] text-[#1558A6]'
          : 'border border-[#C3E6CB] bg-[#F1FAF3] text-[#0A6B3C]'
      }`}
    >
      <Sparkles size={9} strokeWidth={3} className="opacity-80" />
      {label}
    </span>
  );
}
