'use client';

// LifestyleHero — full-width or contained image hero with overlay text.
// Used to give pages a magazine-style sense of place and persona context.
// Image is loaded native <img> (no Next.js optimization), with object-cover
// and an optional dark gradient overlay to keep overlay text legible.

import { ReactNode } from 'react';

interface LifestyleHeroProps {
  /** Image URL (use lifestyleImages.ts entries). */
  imageUrl: string;
  /** Required alt for accessibility. */
  alt: string;
  /** Eyebrow label rendered above the headline (small caps, tracked). */
  eyebrow?: string;
  /** Main headline (display weight). */
  headline: ReactNode;
  /** Optional sub-copy underneath. */
  subline?: ReactNode;
  /** Optional rendered chips/CTAs below subline. */
  children?: ReactNode;
  /** Visual height. Default 'md'. */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Overlay strength. Default 'medium'. */
  overlay?: 'soft' | 'medium' | 'strong';
  /** Where to anchor the text within the hero. */
  align?: 'left' | 'center' | 'right';
  /** Tint hue for the overlay gradient. Default neutral. */
  tint?: 'neutral' | 'green' | 'coral' | 'teal' | 'purple';
  className?: string;
}

const HEIGHT_STYLES = {
  sm: 'h-[200px]',
  md: 'h-[300px]',
  lg: 'h-[420px]',
  xl: 'h-[520px]',
};

// Tint adds a soft colored wash on top of the dark gradient to anchor the
// hero to a section's color zone. Keep these subtle.
const TINT_GRADIENTS = {
  neutral: 'from-black/55 via-black/25 to-black/10',
  green:   'from-[#0A6B3C]/65 via-[#0A6B3C]/25 to-black/15',
  coral:   'from-[#7B4022]/60 via-[#D14800]/20 to-black/15',
  teal:    'from-[#0A4A4A]/65 via-[#0E9594]/25 to-black/15',
  purple:  'from-[#3A2680]/65 via-[#6B4FBC]/25 to-black/15',
};

const OVERLAY_STRENGTH = {
  soft:   'opacity-75',
  medium: 'opacity-95',
  strong: 'opacity-100',
};

const ALIGN_STYLES = {
  left:   'items-start text-left',
  center: 'items-center text-center',
  right:  'items-end text-right',
};

export function LifestyleHero({
  imageUrl,
  alt,
  eyebrow,
  headline,
  subline,
  children,
  size = 'md',
  overlay = 'medium',
  align = 'left',
  tint = 'neutral',
  className = '',
}: LifestyleHeroProps) {
  return (
    <div
      className={`relative w-full overflow-hidden rounded-2xl ${HEIGHT_STYLES[size]} ${className}`}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay for text legibility */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${TINT_GRADIENTS[tint]} ${OVERLAY_STRENGTH[overlay]}`}
      />

      {/* Content */}
      <div
        className={`relative flex h-full flex-col justify-end p-7 lg:p-9 ${ALIGN_STYLES[align]}`}
      >
        {eyebrow && (
          <div className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.18em] text-white/85">
            {eyebrow}
          </div>
        )}
        <h1
          className="font-bold leading-[1.1] text-white"
          style={{
            // Editorial-feeling display via stretched tracking and large size.
            // Using inline style so we don't fight against any global typography.
            fontSize: size === 'xl' ? '44px' : size === 'lg' ? '36px' : size === 'md' ? '30px' : '24px',
            letterSpacing: '-0.01em',
          }}
        >
          {headline}
        </h1>
        {subline && (
          <p className="mt-2 max-w-[640px] text-[14px] leading-relaxed text-white/90">
            {subline}
          </p>
        )}
        {children && <div className="mt-3 flex flex-wrap gap-1.5">{children}</div>}
      </div>
    </div>
  );
}
