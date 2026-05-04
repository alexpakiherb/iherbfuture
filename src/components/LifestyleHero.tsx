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
  /** Use Fraunces serif for the headline (editorial moments). May 3 2026. */
  serif?: boolean;
  /** Round corners. Default 'lg' (24px). 'none' for full-bleed page heroes. */
  rounded?: 'none' | 'md' | 'lg';
  className?: string;
}

const HEIGHT_STYLES = {
  sm: 'h-[260px]',
  md: 'h-[400px]',
  lg: 'h-[520px]',
  xl: 'h-[640px]',
};

const ROUNDED_STYLES = {
  none: 'rounded-none',
  md: 'rounded-2xl',
  lg: 'rounded-3xl',
};

// Tint adds a soft colored wash on top of the dark gradient to anchor the
// hero to a section's color zone. Keep these subtle so the underlying photo
// still reads. The vertical bottom-up gradient lets the top of the image
// breathe while the bottom gets enough darkness for legible overlay text.
const TINT_GRADIENTS = {
  neutral: 'from-black/75 via-black/35 to-transparent',
  green:   'from-[#0A2A1A]/80 via-[#0A6B3C]/25 to-transparent',
  coral:   'from-[#3D1A0A]/75 via-[#D14800]/15 to-transparent',
  teal:    'from-[#06292A]/80 via-[#0E9594]/20 to-transparent',
  purple:  'from-[#1F1247]/80 via-[#6B4FBC]/20 to-transparent',
};

const OVERLAY_STRENGTH = {
  soft:   'opacity-60',
  medium: 'opacity-80',
  strong: 'opacity-95',
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
  serif = false,
  rounded = 'lg',
  className = '',
}: LifestyleHeroProps) {
  // Display sizes — bumped May 3 2026. Patagonia/Apple territory:
  // hero headlines need to dominate the viewport.
  const headlineSize =
    size === 'xl' ? 'clamp(40px, 6.4vw, 76px)' :
    size === 'lg' ? 'clamp(34px, 4.8vw, 60px)' :
    size === 'md' ? 'clamp(28px, 3.6vw, 44px)' :
                    'clamp(22px, 2.8vw, 32px)';

  return (
    <div
      className={`relative w-full overflow-hidden ${ROUNDED_STYLES[rounded]} ${HEIGHT_STYLES[size]} ${className}`}
    >
      {/* Background image */}
      <img
        src={imageUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />

      {/* Gradient overlay for text legibility — bottom is dark, top stays clear */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${TINT_GRADIENTS[tint]} ${OVERLAY_STRENGTH[overlay]}`}
      />

      {/* Content */}
      <div
        className={`relative flex h-full flex-col justify-end p-7 md:p-10 lg:p-14 ${ALIGN_STYLES[align]}`}
      >
        {eyebrow && (
          <div
            className="mb-4 text-[11.5px] font-bold uppercase text-white/90"
            style={{ letterSpacing: '0.18em', lineHeight: 1 }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          className={`font-bold text-white max-w-[20ch] ${serif ? 'font-serif-display' : ''}`}
          style={{
            fontSize: headlineSize,
            letterSpacing: '-0.022em',
            lineHeight: 1.04,
          }}
        >
          {headline}
        </h1>
        {subline && (
          <p
            className="mt-4 max-w-[560px] text-[15.5px] text-white/90"
            style={{ lineHeight: 1.55 }}
          >
            {subline}
          </p>
        )}
        {children && <div className="mt-5 flex flex-wrap gap-2">{children}</div>}
      </div>
    </div>
  );
}
