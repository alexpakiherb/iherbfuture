'use client';

// TrustBadgeStrip — horizontal row of certification / quality badges.
// Renders as small icon + label pills. Used on Subscriptions, PDP, and
// anywhere users are evaluating quality.

import { ShieldCheck, Award, Beaker, Leaf, BadgeCheck } from 'lucide-react';

const BADGE_LIBRARY = {
  'nsf':            { Icon: ShieldCheck, label: 'NSF Certified',          color: '#0A6B3C' },
  'informed-sport': { Icon: Award,       label: 'Informed Sport',         color: '#1558A6' },
  'third-party':    { Icon: Beaker,      label: '3rd-Party Tested',       color: '#6B4FBC' },
  'non-gmo':        { Icon: Leaf,        label: 'Non-GMO Verified',       color: '#0E9594' },
  'gmp':            { Icon: BadgeCheck,  label: 'GMP Certified Facility', color: '#B38900' },
  'usp':            { Icon: ShieldCheck, label: 'USP Verified',           color: '#0A6B3C' },
} as const;

export type TrustBadgeKey = keyof typeof BADGE_LIBRARY;

interface TrustBadgeStripProps {
  /** Which badges to show. Defaults to a sensible 4 if not provided. */
  badges?: TrustBadgeKey[];
  /** Layout density. 'tight' for inline rows; 'loose' for hero strips. */
  density?: 'tight' | 'loose';
  /** Subtle neutral or branded background. */
  background?: 'white' | 'tinted';
  className?: string;
}

const DEFAULT_BADGES: TrustBadgeKey[] = ['nsf', 'informed-sport', 'third-party', 'non-gmo'];

export function TrustBadgeStrip({
  badges = DEFAULT_BADGES,
  density = 'loose',
  background = 'white',
  className = '',
}: TrustBadgeStripProps) {
  const padding = density === 'tight' ? 'px-2.5 py-1' : 'px-3 py-1.5';
  const fontSize = density === 'tight' ? 'text-[10.5px]' : 'text-[11.5px]';

  const wrapperBg = background === 'tinted'
    ? 'bg-gradient-to-r from-[#F1FAF3] via-white to-[#F1FAF3] border-[#D9EADF]'
    : 'bg-white border-[#EBEBEB]';

  return (
    <div
      className={`flex flex-wrap items-center gap-1.5 rounded-full border ${wrapperBg} ${density === 'loose' ? 'p-2' : 'p-1'} ${className}`}
    >
      {badges.map((key) => {
        const { Icon, label, color } = BADGE_LIBRARY[key];
        return (
          <span
            key={key}
            className={`inline-flex items-center gap-1.5 rounded-full ${padding} ${fontSize} font-semibold`}
            style={{ color, backgroundColor: `${color}11` }}
          >
            <Icon size={density === 'tight' ? 11 : 13} strokeWidth={2.3} />
            {label}
          </span>
        );
      })}
    </div>
  );
}
