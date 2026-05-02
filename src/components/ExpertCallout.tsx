'use client';

// ExpertCallout — credential strip with portrait + endorsement.
// Used as a trust marker on Subscriptions, Advisor, and any page where the
// user is being asked to defer to AI judgement. Visual recipe: portrait,
// name + credentials, short endorsement copy, optional verification badge.

import { CheckCircle2, GraduationCap } from 'lucide-react';

interface ExpertCalloutProps {
  /** Portrait image URL */
  portraitUrl: string;
  /** Expert's name */
  name: string;
  /** Letters / credential abbreviation (e.g. "ND, MS") */
  credentials: string;
  /** Title or affiliation */
  title: string;
  /** One- to two-sentence endorsement / role description */
  endorsement: string;
  /** Optional small chip of expertise areas */
  expertiseChips?: string[];
  /** Visual variant */
  variant?: 'card' | 'inline';
  className?: string;
}

export function ExpertCallout({
  portraitUrl,
  name,
  credentials,
  title,
  endorsement,
  expertiseChips,
  variant = 'card',
  className = '',
}: ExpertCalloutProps) {
  if (variant === 'inline') {
    return (
      <div
        className={`flex items-center gap-3 rounded-2xl border border-[#E0E0E0] bg-white px-4 py-3 ${className}`}
      >
        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#F1FAF3] ring-1 ring-[#C3E6CB]">
          <img src={portraitUrl} alt={name} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-bold text-[#1A1A1A]">{name}</span>
            <span className="text-[11px] font-semibold text-[#0A6B3C]">{credentials}</span>
            <CheckCircle2 size={11} className="text-[#0A6B3C]" strokeWidth={3} />
          </div>
          <div className="text-[11.5px] text-[#666]">{title}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#D9EADF] bg-gradient-to-br from-white via-white to-[#F1FAF3] p-5 ${className}`}
    >
      {/* Top eyebrow with verification badge */}
      <div className="mb-3 flex items-center gap-1.5">
        <GraduationCap size={13} className="text-[#0A6B3C]" strokeWidth={2.5} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A6B3C]">
          Reviewed by clinical advisor
        </span>
        <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-[#F1FAF3] px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-[#0A6B3C]">
          <CheckCircle2 size={9} strokeWidth={3} />
          Verified
        </span>
      </div>

      <div className="flex gap-4">
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full border-2 border-white bg-[#F1FAF3] shadow-[0_2px_8px_rgba(10,107,60,0.18)] ring-1 ring-[#C3E6CB]">
          <img src={portraitUrl} alt={name} className="h-full w-full object-cover" loading="lazy" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold text-[#1A1A1A]">{name}</span>
            <span className="text-[12px] font-semibold text-[#0A6B3C]">{credentials}</span>
          </div>
          <div className="text-[11.5px] uppercase tracking-wide text-[#666]">{title}</div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[#444]">{endorsement}</p>

          {expertiseChips && expertiseChips.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1">
              {expertiseChips.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center rounded-full border border-[#C3E6CB] bg-white px-2 py-0.5 text-[10.5px] font-semibold text-[#0A6B3C]"
                >
                  {c}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
