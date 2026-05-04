'use client';

// EditorialSplit — magazine-style two-column block: lifestyle photo on one
// side, body content on the other. Replaces a common bento mistake where
// a wide-skinny tile (col-span-8) holds short copy that gets stretched
// into a strip.
//
// Defaults to image-left, content-right at a 5/7 split. Use `reverse` to
// flip. The image height matches the content column on desktop (no fixed
// pixel height — the photo grows to fit). `headline` is optional so you can
// pass a fully-formed AIMoment / EditorialQuote etc. as `children` and skip
// the SectionHeader-style header.

import { ReactNode } from 'react';

interface EditorialSplitProps {
  imageUrl: string;
  alt: string;
  /** Eyebrow above the headline. */
  eyebrow?: string;
  eyebrowColor?: string;
  /** Headline. Optional — pass a custom block via `children` if you don't want one. */
  headline?: ReactNode;
  /** Body paragraph (single paragraph encouraged). */
  body?: ReactNode;
  /** CTA buttons / chips below body. */
  children?: ReactNode;
  /** Image on the right instead of left. */
  reverse?: boolean;
  /** Tighter ratio (image takes more or less). Default 5/7 (image / content). */
  ratio?: 'balanced' | 'image-heavy' | 'content-heavy';
  /** Minimum image height on desktop — gives short copy room without going skinny. */
  minHeight?: string;
  className?: string;
}

const RATIO_CLASS = {
  // image cols / content cols at lg+
  'balanced':       ['lg:col-span-6', 'lg:col-span-6'],
  'image-heavy':    ['lg:col-span-7', 'lg:col-span-5'],
  'content-heavy':  ['lg:col-span-5', 'lg:col-span-7'],
};

export function EditorialSplit({
  imageUrl,
  alt,
  eyebrow,
  eyebrowColor = '#0A6B3C',
  headline,
  body,
  children,
  reverse = false,
  ratio = 'content-heavy',
  minHeight = '380px',
  className = '',
}: EditorialSplitProps) {
  const [imgCols, contentCols] = RATIO_CLASS[ratio];

  const imageBlock = (
    <div
      className={`relative col-span-12 overflow-hidden rounded-3xl ${imgCols}`}
      style={{ minHeight }}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
    </div>
  );

  const contentBlock = (
    <div className={`col-span-12 flex flex-col justify-center ${contentCols}`}>
      <div className="max-w-[520px]">
        {eyebrow && (
          <div
            className="mb-3 text-[11.5px] font-bold uppercase"
            style={{ color: eyebrowColor, letterSpacing: '0.18em', lineHeight: 1 }}
          >
            {eyebrow}
          </div>
        )}
        {headline && (
          <h3
            className="text-[26px] md:text-[32px] lg:text-[36px] font-bold text-[#1A1A1A]"
            style={{ letterSpacing: '-0.018em', lineHeight: 1.1 }}
          >
            {headline}
          </h3>
        )}
        {body && (
          <div
            className="mt-4 text-[15.5px] text-[#555]"
            style={{ lineHeight: 1.65 }}
          >
            {body}
          </div>
        )}
        {children && <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div>}
      </div>
    </div>
  );

  return (
    <div className={`grid grid-cols-12 items-stretch gap-6 lg:gap-10 ${className}`}>
      {reverse ? (
        <>
          {contentBlock}
          {imageBlock}
        </>
      ) : (
        <>
          {imageBlock}
          {contentBlock}
        </>
      )}
    </div>
  );
}
