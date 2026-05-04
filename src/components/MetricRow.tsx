'use client';

// MetricRow — clean horizontal row of 2-5 hero stats. Replaces the
// previous habit of wrapping each stat in its own gradient pastel card,
// which collectively read as "every dashboard ever."
//
// Recipe (Apple-inspired stat strip):
//   - No card chrome (no border, no fill, no shadow). Just hairline dividers.
//   - Generous vertical spacing (py-8).
//   - Number is the loudest element (~44px). Label is small caps above.
//   - Optional sparkline / heatmap below the number for trend.
//   - Optional accent color per cell — lean into it for ONE cell, default
//     the rest to neutral so the eye has somewhere to land.

import { ReactNode } from 'react';
import { Sparkline } from './Sparkline';

export interface Metric {
  /** Small-caps label above the value. */
  label: string;
  /** The big number / value. Pass a string so you control formatting ("$184", "92%"). */
  value: ReactNode;
  /** Optional unit/suffix appended to the value in smaller weight. */
  unit?: string;
  /** Optional one-line caption below the trend. */
  caption?: string;
  /** 30-day trend for sparkline. Optional. */
  trend?: number[];
  /** Hex color for the value, sparkline, label tint. Default neutral. */
  accent?: string;
  /** Whether this metric is the "hero" — gets serif display + larger size. Default false. */
  hero?: boolean;
}

interface MetricRowProps {
  metrics: Metric[];
  /** Stack vertically below this breakpoint. Default md. */
  className?: string;
}

export function MetricRow({ metrics, className = '' }: MetricRowProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        metrics.length === 3 ? 'lg:grid-cols-3' :
        metrics.length === 4 ? 'lg:grid-cols-4' :
        metrics.length === 5 ? 'lg:grid-cols-5' :
        'lg:grid-cols-2'
      } divide-x divide-y divide-[#EAEAEA] sm:divide-y-0 ${className}`}
    >
      {metrics.map((m, i) => {
        const accent = m.accent || '#1A1A1A';
        return (
          <div key={i} className="flex flex-col justify-between gap-5 px-6 py-7 first:pl-0 last:pr-0 sm:px-8">
            <div>
              <div
                className="mb-3 text-[11px] font-bold uppercase"
                style={{ color: accent, letterSpacing: '0.18em', lineHeight: 1, opacity: 0.75 }}
              >
                {m.label}
              </div>
              <div className="flex items-baseline gap-1.5">
                <span
                  className={`${m.hero ? 'text-[56px] font-serif-display' : 'text-[44px]'} font-bold leading-[0.95] tabular-nums text-[#1A1A1A]`}
                  style={{ letterSpacing: '-0.025em' }}
                >
                  {m.value}
                </span>
                {m.unit && (
                  <span className="text-[14px] font-semibold" style={{ color: accent }}>
                    {m.unit}
                  </span>
                )}
              </div>
              {m.caption && (
                <p className="mt-2 text-[12.5px] text-[#666]" style={{ lineHeight: 1.45 }}>
                  {m.caption}
                </p>
              )}
            </div>
            {m.trend && (
              <Sparkline values={m.trend} color={accent} width={120} height={22} />
            )}
          </div>
        );
      })}
    </div>
  );
}
