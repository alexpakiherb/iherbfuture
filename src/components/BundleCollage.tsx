'use client';

// BundleCollage — overlapped trio of product bottles for bundle/protocol cards.
// Used on Home bundle cards, Cart bundle suggestions, and anywhere we want to
// suggest "this is a curated collection of 3 supplements" at a glance.
//
// The center bottle is the hero (slightly larger, on top, no rotation). The
// left and right bottles are smaller, rotated outward, and dimmer in z-order.
// All three sit on a soft tinted gradient backdrop with the brand evergreen.

interface BundleCollageProps {
  /** 3 image URLs — pass real product Cloudinary URLs */
  images: [string, string, string];
  /** Optional alt text for accessibility (single label for the bundle) */
  alt?: string;
  /** Tint variant for the backdrop. Defaults to green. */
  tint?: 'green' | 'orange' | 'blue';
  /** Compact variant for tighter layouts */
  size?: 'sm' | 'md' | 'lg';
}

const TINT_STYLES = {
  green: 'bg-gradient-to-br from-[#F1FAF3] via-[#E8F5EC] to-[#DDF0E1]',
  orange: 'bg-gradient-to-br from-[#FFF7F1] via-[#FFEFE2] to-[#FFE2CD]',
  blue: 'bg-gradient-to-br from-[#EAF1FB] via-[#DCEAF7] to-[#CADEF1]',
};

const SIZE_STYLES = {
  sm: { wrap: 'h-[88px]', center: 'h-[68px] w-[52px]', side: 'h-[56px] w-[42px]', offset: 22 },
  md: { wrap: 'h-[120px]', center: 'h-[96px] w-[72px]', side: 'h-[78px] w-[58px]', offset: 30 },
  lg: { wrap: 'h-[160px]', center: 'h-[128px] w-[96px]', side: 'h-[104px] w-[78px]', offset: 40 },
};

export function BundleCollage({
  images,
  alt = 'Product bundle',
  tint = 'green',
  size = 'md',
}: BundleCollageProps) {
  const [left, center, right] = images;
  const s = SIZE_STYLES[size];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${s.wrap} ${TINT_STYLES[tint]}`}
      role="img"
      aria-label={alt}
    >
      {/* Left bottle — rotated outward */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -rotate-12 transform"
        style={{ left: `calc(50% - ${s.offset + 32}px)` }}
      >
        <div className={`flex ${s.side} items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white p-1.5 shadow-[0_4px_12px_rgba(10,107,60,0.08)]`}>
          <img src={left} alt="" className="h-full w-full object-contain" loading="lazy" />
        </div>
      </div>

      {/* Center bottle — hero, on top */}
      <div
        className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 transform"
        style={{ left: '50%' }}
      >
        <div className={`flex ${s.center} items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white p-2 shadow-[0_8px_20px_rgba(10,107,60,0.14)]`}>
          <img src={center} alt="" className="h-full w-full object-contain" loading="lazy" />
        </div>
      </div>

      {/* Right bottle — rotated outward */}
      <div
        className="absolute top-1/2 -translate-y-1/2 rotate-12 transform"
        style={{ left: `calc(50% + ${s.offset}px)` }}
      >
        <div className={`flex ${s.side} items-center justify-center overflow-hidden rounded-lg border border-[#EBEBEB] bg-white p-1.5 shadow-[0_4px_12px_rgba(10,107,60,0.08)]`}>
          <img src={right} alt="" className="h-full w-full object-contain" loading="lazy" />
        </div>
      </div>
    </div>
  );
}
