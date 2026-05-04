'use client';

// Billboard — full-width brand moment. Nike SNKRS / Apple product page energy.
// Use ONCE per page max. Surface options:
//   - ink     : near-black with green undertone (#0F1815). Default.
//   - cream   : warm cream (#F5F1EA), used for quiet luxury moments
//   - oat     : warmer surface (#E8E0D2)
//   - forest  : brand green hero
//   - photo   : full-bleed photography (lifestyle hero variant)
//
// The point is to break up the bento rhythm with a single "wow this is a brand"
// page-spanning moment. Don't put data here; this is editorial.

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface BillboardProps {
  surface?: 'ink' | 'cream' | 'oat' | 'forest' | 'photo';
  /** Required when surface is 'photo'. */
  imageUrl?: string;
  alt?: string;
  /** Eyebrow above the headline (uppercase, tracked). */
  eyebrow?: string;
  /** Display headline. Goes through Fraunces serif. */
  headline: ReactNode;
  /** Optional supporting copy below headline. */
  body?: ReactNode;
  /** Optional primary CTA. */
  ctaLabel?: string;
  ctaHref?: string;
  /** Optional secondary CTA. */
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  /** Optional content rendered to the right of headline (e.g. product photo). */
  rightSlot?: ReactNode;
  /** Vertical scale. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  /** Text alignment. Default 'left'. */
  align?: 'left' | 'center';
  /** Round corners. Default true. */
  rounded?: boolean;
  className?: string;
}

const SURFACE_BG = {
  ink:    '#0F1815',
  cream:  '#F5F1EA',
  oat:    '#E8E0D2',
  forest: '#0A6B3C',
};

const SURFACE_TEXT = {
  ink:    '#F5F1EA',
  cream:  '#1A1A1A',
  oat:    '#1A1A1A',
  forest: '#FFFFFF',
};

const SIZE_PADDING = {
  sm: 'px-8 py-12 md:px-14 md:py-16',
  md: 'px-8 py-16 md:px-16 md:py-24',
  lg: 'px-8 py-24 md:px-20 md:py-32',
};

const SIZE_HEADLINE = {
  sm: 'clamp(32px, 4.4vw, 56px)',
  md: 'clamp(40px, 6.4vw, 88px)',
  lg: 'clamp(52px, 8vw, 120px)',
};

export function Billboard({
  surface = 'ink',
  imageUrl,
  alt = '',
  eyebrow,
  headline,
  body,
  ctaLabel,
  ctaHref,
  secondaryCtaLabel,
  secondaryCtaHref,
  rightSlot,
  size = 'md',
  align = 'left',
  rounded = true,
  className = '',
}: BillboardProps) {
  const isPhoto = surface === 'photo';
  const bg = isPhoto ? '#0F1815' : SURFACE_BG[surface];
  const fg = isPhoto ? '#FFFFFF' : SURFACE_TEXT[surface];

  return (
    <section
      className={`relative overflow-hidden ${rounded ? 'rounded-3xl' : ''} ${className}`}
      style={{ backgroundColor: bg, color: fg }}
    >
      {isPhoto && imageUrl && (
        <>
          <img
            src={imageUrl}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
        </>
      )}

      <div
        className={`relative grid grid-cols-12 items-center gap-8 ${SIZE_PADDING[size]} ${
          align === 'center' ? 'text-center' : ''
        }`}
      >
        <div className={`${rightSlot ? 'col-span-12 lg:col-span-7' : 'col-span-12'} ${align === 'center' ? 'mx-auto max-w-3xl' : ''}`}>
          {eyebrow && (
            <div
              className="mb-6 text-[11.5px] font-bold uppercase"
              style={{ letterSpacing: '0.22em', opacity: 0.75, lineHeight: 1 }}
            >
              {eyebrow}
            </div>
          )}
          <h2
            className="font-serif-display font-semibold max-w-[18ch]"
            style={{
              fontSize: SIZE_HEADLINE[size],
              letterSpacing: '-0.025em',
              lineHeight: 0.98,
              ...(align === 'center' ? { marginInline: 'auto' } : {}),
            }}
          >
            {headline}
          </h2>
          {body && (
            <p
              className="mt-7 max-w-[540px] text-[16px] md:text-[17px]"
              style={{ lineHeight: 1.55, opacity: 0.82, ...(align === 'center' ? { marginInline: 'auto' } : {}) }}
            >
              {body}
            </p>
          )}
          {(ctaLabel || secondaryCtaLabel) && (
            <div className={`mt-8 flex flex-wrap items-center gap-4 ${align === 'center' ? 'justify-center' : ''}`}>
              {ctaLabel && ctaHref && (
                <Link
                  href={ctaHref}
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold transition-transform hover:-translate-y-0.5"
                  style={{
                    backgroundColor: surface === 'cream' || surface === 'oat' ? '#0F1815' : '#F5F1EA',
                    color: surface === 'cream' || surface === 'oat' ? '#F5F1EA' : '#0F1815',
                  }}
                >
                  {ctaLabel}
                  <ArrowRight size={15} strokeWidth={2.25} />
                </Link>
              )}
              {secondaryCtaLabel && secondaryCtaHref && (
                <Link
                  href={secondaryCtaHref}
                  className="inline-flex items-center gap-1.5 text-[14px] font-semibold underline-offset-4 hover:underline"
                  style={{ color: fg, opacity: 0.85 }}
                >
                  {secondaryCtaLabel}
                  <ArrowRight size={14} strokeWidth={2.25} />
                </Link>
              )}
            </div>
          )}
        </div>

        {rightSlot && (
          <div className="col-span-12 lg:col-span-5">
            {rightSlot}
          </div>
        )}
      </div>
    </section>
  );
}
