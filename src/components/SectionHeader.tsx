'use client';

// SectionHeader — the editorial v2 section opener. Replaces ad-hoc
// `<div className="mb-3"><div className="text-[10.5px]...">` patterns that
// were repeated across every page with inconsistent sizes.
//
// Recipe (Patagonia / Apple inspired):
//   - Optional eyebrow (uppercase, tracked, brand-tinted)
//   - Display-weight headline with negative tracking
//   - Optional lede paragraph (clamped to 640px so it never goes wide-skinny)
//   - Optional right-aligned CTA link
//
// Use one per section. If a page has 5 sections, it has 5 SectionHeaders.

import { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface SectionHeaderProps {
  eyebrow?: ReactNode;
  /** Color of the eyebrow text. Default brand green. Pick from the section's color zone. */
  eyebrowColor?: string;
  /** Headline. Pass a string for default sans, or a ReactNode (e.g. with a serif span). */
  headline: ReactNode;
  /** Optional lede paragraph below the headline. */
  lede?: ReactNode;
  /** Optional right-aligned CTA. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Use serif for the headline (Fraunces). Reserve for editorial moments. */
  serif?: boolean;
  /** Override the headline size. Default is 'lg' (~32-40px). */
  size?: 'md' | 'lg' | 'xl';
  /** Whether to center-align the whole header. Default left. */
  align?: 'left' | 'center';
  className?: string;
}

const SIZE_CLASS = {
  md: 'text-[24px] md:text-[28px]',
  lg: 'text-[28px] md:text-[36px] lg:text-[40px]',
  xl: 'text-[36px] md:text-[44px] lg:text-[52px]',
};

export function SectionHeader({
  eyebrow,
  eyebrowColor = '#0A6B3C',
  headline,
  lede,
  ctaLabel,
  ctaHref,
  serif = false,
  size = 'lg',
  align = 'left',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';
  return (
    <div
      className={`mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between ${
        isCenter ? 'md:flex-col md:items-center md:gap-3' : ''
      } ${className}`}
    >
      <div className={`max-w-[760px] ${isCenter ? 'mx-auto text-center' : ''}`}>
        {eyebrow && (
          <div
            className="mb-3 text-[11.5px] font-bold uppercase"
            style={{ color: eyebrowColor, letterSpacing: '0.18em', lineHeight: 1 }}
          >
            {eyebrow}
          </div>
        )}
        <h2
          className={`${SIZE_CLASS[size]} font-bold text-[#1A1A1A] ${
            serif ? 'font-serif-display' : ''
          }`}
          style={{ letterSpacing: '-0.018em', lineHeight: 1.08 }}
        >
          {headline}
        </h2>
        {lede && (
          <p
            className={`mt-3 text-[15.5px] text-[#555] ${isCenter ? 'mx-auto' : ''}`}
            style={{ lineHeight: 1.55, maxWidth: '640px' }}
          >
            {lede}
          </p>
        )}
      </div>

      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="group inline-flex flex-shrink-0 items-center gap-1.5 self-start text-[13px] font-semibold text-[#1A1A1A] hover:text-[#0A6B3C] md:self-end"
        >
          {ctaLabel}
          <ArrowUpRight
            size={15}
            strokeWidth={2.25}
            className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </Link>
      )}
    </div>
  );
}
