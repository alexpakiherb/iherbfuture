'use client';

// EditorialQuote — magazine-style pulled quote with attribution.
// Used as a section break in long-form layouts (Forecast, Subscriptions,
// Wellness Hub) to create a moment of editorial pacing.
// Uses serif quotation mark + italic body for tonal contrast against the
// rest of the prototype's clean sans-serif voice.

interface EditorialQuoteProps {
  quote: string;
  /** Author name */
  attribution: string;
  /** Author credential or title */
  credential?: string;
  /** Optional small portrait of the author */
  portraitUrl?: string;
  /** Visual variant. Default 'default'. */
  variant?: 'default' | 'tinted';
  /** Hue for tinted variant. Default 'green'. */
  tint?: 'green' | 'coral' | 'teal' | 'purple';
  className?: string;
}

const TINT_BG = {
  green:  'bg-gradient-to-br from-[#F1FAF3] via-white to-[#E8F5EC] border-[#C3E6CB]',
  coral:  'bg-gradient-to-br from-[#FFF1E8] via-white to-[#FFE8DC] border-[#FFC7B0]',
  teal:   'bg-gradient-to-br from-[#E5F6F5] via-white to-[#D4EFEE] border-[#A7DDDC]',
  purple: 'bg-gradient-to-br from-[#F4F0FB] via-white to-[#EDE6F8] border-[#D6C8F0]',
};

const TINT_QUOTE_COLOR = {
  green:  '#0A6B3C',
  coral:  '#FF6B4A',
  teal:   '#0E9594',
  purple: '#6B4FBC',
};

export function EditorialQuote({
  quote,
  attribution,
  credential,
  portraitUrl,
  variant = 'default',
  tint = 'green',
  className = '',
}: EditorialQuoteProps) {
  const isTinted = variant === 'tinted';

  return (
    <figure
      className={`relative overflow-hidden rounded-2xl border ${
        isTinted ? TINT_BG[tint] : 'border-[#E0E0E0] bg-white'
      } px-8 py-7 ${className}`}
    >
      {/* Decorative oversized opening quotation mark */}
      <div
        className="absolute left-5 top-2 select-none font-serif text-[88px] leading-none opacity-[0.18]"
        style={{ color: TINT_QUOTE_COLOR[tint] }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <blockquote
        className="relative z-10 font-serif text-[20px] italic leading-[1.45] text-[#1A1A1A] lg:text-[22px]"
        style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
      >
        {quote}
      </blockquote>

      <figcaption className="mt-5 flex items-center gap-3">
        {portraitUrl && (
          <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[#EBEBEB] bg-white">
            <img
              src={portraitUrl}
              alt={attribution}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}
        <div>
          <div className="text-[12.5px] font-bold uppercase tracking-widest text-[#1A1A1A]">
            {attribution}
          </div>
          {credential && (
            <div className="mt-0.5 text-[11.5px] text-[#666]">{credential}</div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
