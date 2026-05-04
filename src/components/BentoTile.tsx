'use client';

// BentoTile — versatile tile primitive for editorial bento layouts.
// Replaces the ad-hoc "div with rounded-2xl + ring-1 + padding" pattern that
// was scattered across pages. Every tile is one of these shapes:
//
//   - photo      : full-bleed lifestyle image with optional overlay caption
//   - stat       : large number + small label, with optional sparkline
//   - billboard  : large serif headline (text-only tile, sets the section voice)
//   - content    : freeform — pass children for custom content (e.g. AIMoment,
//                  product list, agent action card)
//
// Bento layouts work when tiles are mixed media (some image, some text, some
// numerical). One photo tile in a row of stats is the difference between
// "dashboard" and "editorial."

import { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Sparkline } from './Sparkline';

interface BaseProps {
  /** Tailwind grid span. Default 'col-span-12 lg:col-span-6'. */
  span?: string;
  /** Surface variant. Default 'bone' (warm near-white). */
  surface?: 'bone' | 'oat' | 'ink' | 'forest' | 'cream' | 'transparent';
  /** Optional href — wraps tile in a Link with hover lift. */
  href?: string;
  /** Min height — keeps tiles from collapsing when content is short. */
  minHeight?: string;
  className?: string;
}

interface PhotoTile extends BaseProps {
  variant: 'photo';
  imageUrl: string;
  alt: string;
  /** Eyebrow above caption (uppercase, tracked). */
  eyebrow?: string;
  /** Caption headline overlaid on photo (or below if `captionPosition="below"`). */
  caption?: ReactNode;
  /** Optional supporting copy below caption. */
  subCaption?: ReactNode;
  /** Where to anchor caption relative to the photo. Default 'overlay-bottom'. */
  captionPosition?: 'overlay-bottom' | 'overlay-top' | 'overlay-center' | 'below';
  /** Overlay strength when caption is overlaid. Default 'medium'. */
  overlay?: 'none' | 'soft' | 'medium' | 'strong';
}

interface StatTile extends BaseProps {
  variant: 'stat';
  /** Small-caps label */
  label: string;
  /** The big number / value */
  value: ReactNode;
  /** Optional unit/suffix */
  unit?: string;
  /** Caption below the number */
  caption?: string;
  /** 30-day trend for sparkline */
  trend?: number[];
  /** Hex color for value + sparkline */
  accent?: string;
  /** Use serif Fraunces for the value */
  serif?: boolean;
  /** Display size. Default 'lg' (~64px). */
  size?: 'md' | 'lg' | 'xl';
}

interface BillboardTile extends BaseProps {
  variant: 'billboard';
  eyebrow?: string;
  /** Massive serif headline */
  headline: ReactNode;
  /** Optional supporting copy */
  body?: ReactNode;
  /** Optional bottom-right rendered children (CTA, chip, etc.) */
  children?: ReactNode;
}

interface ContentTile extends BaseProps {
  variant: 'content';
  children: ReactNode;
  /** Optional eyebrow */
  eyebrow?: string;
  /** Optional title */
  title?: ReactNode;
  /** Optional CTA href + label */
  ctaHref?: string;
  ctaLabel?: string;
}

type BentoTileProps = PhotoTile | StatTile | BillboardTile | ContentTile;

const SURFACE_BG: Record<NonNullable<BaseProps['surface']>, string> = {
  bone: '#FBF9F4',
  oat: '#E8E0D2',
  ink: '#0F1815',
  forest: '#0A6B3C',
  cream: '#F5F1EA',
  transparent: 'transparent',
};

const SURFACE_TEXT: Record<NonNullable<BaseProps['surface']>, string> = {
  bone: '#1A1A1A',
  oat: '#1A1A1A',
  ink: '#F5F1EA',
  forest: '#FFFFFF',
  cream: '#1A1A1A',
  transparent: 'inherit',
};

export function BentoTile(props: BentoTileProps) {
  const { span = 'col-span-12 lg:col-span-6', surface = 'bone', href, minHeight, className = '' } = props;
  const bg = SURFACE_BG[surface];
  const text = SURFACE_TEXT[surface];
  const isDark = surface === 'ink' || surface === 'forest';

  const inner = (() => {
    if (props.variant === 'photo') {
      const { imageUrl, alt, eyebrow, caption, subCaption, captionPosition = 'overlay-bottom', overlay = 'medium' } = props;
      const overlayClass =
        overlay === 'none' ? '' :
        overlay === 'soft' ? 'bg-gradient-to-t from-black/35 via-black/10 to-transparent' :
        overlay === 'medium' ? 'bg-gradient-to-t from-black/65 via-black/15 to-transparent' :
        'bg-gradient-to-t from-black/85 via-black/35 to-transparent';

      const captionAlignClass =
        captionPosition === 'overlay-top' ? 'items-start pt-7' :
        captionPosition === 'overlay-center' ? 'items-center justify-center text-center' :
        'items-end pb-7';

      if (captionPosition === 'below') {
        return (
          <div className="flex h-full flex-col">
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={imageUrl} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
            </div>
            {(eyebrow || caption || subCaption) && (
              <div className="px-7 py-6">
                {eyebrow && (
                  <div className="mb-2.5 text-[11px] font-bold uppercase" style={{ letterSpacing: '0.18em', color: 'rgba(0,0,0,0.55)' }}>
                    {eyebrow}
                  </div>
                )}
                {caption && (
                  <div className="font-serif-display text-[24px] md:text-[28px] font-semibold" style={{ letterSpacing: '-0.012em', lineHeight: 1.1 }}>
                    {caption}
                  </div>
                )}
                {subCaption && <div className="mt-2 text-[13.5px] text-[#666]" style={{ lineHeight: 1.55 }}>{subCaption}</div>}
              </div>
            )}
          </div>
        );
      }

      return (
        <div className="relative h-full w-full media-zoom" style={{ minHeight: minHeight ?? '320px' }}>
          <img src={imageUrl} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          {overlay !== 'none' && <div className={`absolute inset-0 ${overlayClass}`} />}
          {(eyebrow || caption || subCaption) && (
            <div className={`absolute inset-0 flex flex-col px-7 ${captionAlignClass}`}>
              {eyebrow && (
                <div className="mb-3 text-[11px] font-bold uppercase text-white/90" style={{ letterSpacing: '0.18em' }}>
                  {eyebrow}
                </div>
              )}
              {caption && (
                <div className="font-serif-display text-[28px] md:text-[36px] font-semibold text-white max-w-[20ch]" style={{ letterSpacing: '-0.018em', lineHeight: 1.06 }}>
                  {caption}
                </div>
              )}
              {subCaption && <div className="mt-3 max-w-[420px] text-[14px] text-white/85" style={{ lineHeight: 1.55 }}>{subCaption}</div>}
            </div>
          )}
        </div>
      );
    }

    if (props.variant === 'stat') {
      const { label, value, unit, caption, trend, accent = isDark ? '#F5F1EA' : '#1A1A1A', serif, size = 'lg' } = props;
      const valueClass =
        size === 'xl' ? 'text-[64px] md:text-[88px]' :
        size === 'lg' ? 'text-[56px] md:text-[72px]' :
                        'text-[40px] md:text-[52px]';
      return (
        <div className="flex h-full flex-col justify-between p-7 md:p-9" style={{ minHeight: minHeight ?? '260px' }}>
          <div className="text-[11px] font-bold uppercase" style={{ letterSpacing: '0.18em', opacity: 0.65, color: text }}>
            {label}
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span
                className={`${valueClass} ${serif ? 'font-serif-display' : ''} font-semibold tabular-nums leading-[0.92]`}
                style={{ letterSpacing: '-0.026em', color: accent }}
              >
                {value}
              </span>
              {unit && (
                <span className="text-[16px] font-semibold" style={{ color: accent, opacity: 0.7 }}>
                  {unit}
                </span>
              )}
            </div>
            {caption && (
              <p className="mt-3 text-[13px]" style={{ lineHeight: 1.5, color: text, opacity: 0.7 }}>
                {caption}
              </p>
            )}
            {trend && (
              <div className="mt-4">
                <Sparkline values={trend} color={accent} width={140} height={26} />
              </div>
            )}
          </div>
        </div>
      );
    }

    if (props.variant === 'billboard') {
      const { eyebrow, headline, body, children } = props;
      return (
        <div className="flex h-full flex-col justify-between p-8 md:p-12" style={{ minHeight: minHeight ?? '300px' }}>
          <div>
            {eyebrow && (
              <div className="mb-5 text-[11px] font-bold uppercase" style={{ letterSpacing: '0.18em', opacity: 0.7, color: text }}>
                {eyebrow}
              </div>
            )}
            <div
              className="font-serif-display font-semibold max-w-[24ch]"
              style={{
                fontSize: 'clamp(34px, 4.4vw, 60px)',
                letterSpacing: '-0.022em',
                lineHeight: 1.04,
                color: text,
              }}
            >
              {headline}
            </div>
            {body && (
              <p
                className="mt-5 max-w-[520px] text-[15.5px]"
                style={{ lineHeight: 1.6, color: text, opacity: 0.85 }}
              >
                {body}
              </p>
            )}
          </div>
          {children && <div className="mt-8">{children}</div>}
        </div>
      );
    }

    // content variant
    const { eyebrow, title, ctaHref, ctaLabel, children } = props;
    return (
      <div className="flex h-full flex-col p-7 md:p-9" style={{ minHeight: minHeight ?? '260px' }}>
        {(eyebrow || title || ctaLabel) && (
          <div className="mb-5 flex items-baseline justify-between gap-4">
            <div>
              {eyebrow && (
                <div className="mb-2 text-[11px] font-bold uppercase" style={{ letterSpacing: '0.18em', opacity: 0.65, color: text }}>
                  {eyebrow}
                </div>
              )}
              {title && (
                <div className="font-serif-display text-[22px] md:text-[26px] font-semibold" style={{ letterSpacing: '-0.012em', lineHeight: 1.15, color: text }}>
                  {title}
                </div>
              )}
            </div>
            {ctaHref && ctaLabel && (
              <Link
                href={ctaHref}
                className="group inline-flex flex-shrink-0 items-center gap-1 text-[12.5px] font-semibold transition-opacity hover:opacity-70"
                style={{ color: text }}
              >
                {ctaLabel}
                <ArrowUpRight size={14} strokeWidth={2.25} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}
        <div className="flex-1">{children}</div>
      </div>
    );
  })();

  const wrapperClass = `${span} overflow-hidden rounded-3xl ${href ? 'motion-lift cursor-pointer' : ''} ${className}`;
  const wrapperStyle = { backgroundColor: bg, color: text };

  if (href) {
    return (
      <Link href={href} className={wrapperClass} style={wrapperStyle}>
        {inner}
      </Link>
    );
  }

  return (
    <div className={wrapperClass} style={wrapperStyle}>
      {inner}
    </div>
  );
}

/** Bento — the grid container. Pass BentoTile children. */
export function Bento({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-12 auto-rows-fr gap-4 lg:gap-5 ${className}`}>
      {children}
    </div>
  );
}
