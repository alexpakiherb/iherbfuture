'use client';

// StreakHeatmap — 30-day calendar grid showing dosing intensity.
// Compact GitHub-style heatmap. 5 columns x 6 rows = 30 cells.
// Designed to drop into stat tiles or streak cards alongside a streak counter.

interface StreakHeatmapProps {
  /** 30 numeric values (0..1) representing % of doses taken each day. */
  values?: number[];
  /** Cell size in px. Default 9. */
  size?: number;
  /** Gap between cells. Default 2. */
  gap?: number;
  /** Base color used for the highest intensity. Default brand evergreen. */
  color?: string;
  /** Color of empty (zero-dose) cells. Default soft border. */
  emptyColor?: string;
  className?: string;
}

// Generate a stable mock 30-day pattern that "looks" like a real adherence record.
function defaultValues(): number[] {
  // Mostly perfect, with a few weak days (the kind a real user looks like).
  const seed = [
    1, 1, 1, 0.5, 1, 1, 1,
    1, 1, 0, 0.5, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 0.5,
    1, 1, 1, 1, 0.7, 1, 1, 1, 1,
  ];
  return seed.slice(0, 30);
}

function intensity(color: string, alpha: number): string {
  // Convert hex to rgba; assumes 6-char hex like #0A6B3C
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
}

export function StreakHeatmap({
  values = defaultValues(),
  size = 9,
  gap = 2,
  color = '#0A6B3C',
  emptyColor = '#F0F0F0',
  className = '',
}: StreakHeatmapProps) {
  const cols = 6;
  const rows = 5;
  const slice = values.slice(0, cols * rows);

  return (
    <div
      role="img"
      aria-label="30-day dosing heatmap"
      className={`inline-grid ${className}`}
      style={{
        gridTemplateColumns: `repeat(${cols}, ${size}px)`,
        gridTemplateRows: `repeat(${rows}, ${size}px)`,
        gap: `${gap}px`,
      }}
    >
      {slice.map((v, i) => {
        // Map 0..1 → opacity. 0 → empty color. >0 → tinted at 0.35 + v * 0.65.
        const bg = v === 0 ? emptyColor : intensity(color, 0.35 + v * 0.65);
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              backgroundColor: bg,
              borderRadius: 2,
            }}
            title={`Day ${i + 1}: ${Math.round(v * 100)}%`}
          />
        );
      })}
    </div>
  );
}
