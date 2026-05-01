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
  variant?: 'card' | 'inline';
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

  // Card variant: white background, gradient bar, shadow
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-[#D9EADF] bg-white shadow-[0_2px_16px_rgba(10,107,60,0.07)] animate-[fadeIn_200ms_ease-out] ${className}`}
    >
      <div className="h-[3px] bg-gradient-to-r from-[#0A6B3C] via-[#79A83C] to-[#0A6B3C]" />

      <div className="px-5 py-4">
        <div className="mb-1 flex items-center gap-1.5">
          <Sparkles size={12} className="text-[#0A6B3C]" strokeWidth={2.5} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
            {eyebrow}
          </span>
        </div>
        <div className="text-[15px] font-semibold leading-snug text-[#1A1A1A]">{headline}</div>
        {body && <div className="mt-1.5 text-[13.5px] leading-relaxed text-[#444]">{body}</div>}
        {children && <div className="mt-3">{children}</div>}
      </div>

      {(footerLabel || footerRight) && (
        <div className="flex items-center justify-between border-t border-[#F0F0F0] bg-[#FAFBFA] px-5 py-2.5">
          {footerLabel && (
            <span className="text-[10.5px] text-[#888]">{footerLabel}</span>
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
